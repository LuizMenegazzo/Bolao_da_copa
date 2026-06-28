const fs = require("fs");
const http = require("http");
const path = require("path");
const { pbkdf2Sync, randomBytes, randomUUID, timingSafeEqual } = require("crypto");
const storage = require("./storage");
const { createScoreSync } = require("./score-sync");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const MATCHES_FILE = path.join(__dirname, "data", "matches.js");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ESPN_SCOREBOARD_BASE_URL =
  process.env.ESPN_SCOREBOARD_URL ||
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const ESPN_SUMMARY_BASE_URL =
  process.env.ESPN_SUMMARY_URL ||
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary";
const KNOCKOUT_FETCH_DAYS = Number(process.env.KNOCKOUT_FETCH_DAYS || 30);

const KNOCKOUT_PLAYERS = [
  "Celso", "Criciele", "Cris", "Gustavo", "Gabriel",
  "Jeff", "Vandrei", "João Lauro", "Laura", "Thieli",
  "Anderson", "Amandinha", "Luiz", "Daniel", "Carla",
  "PC", "Nelson", "Dion", "Lucas", "Vinicius"
];

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function sendBackupJson(response, data) {
  const filename = `backup-bolao-${new Date().toISOString().slice(0, 10)}.json`;

  response.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data, null, 2));
}

function isAdminRequest(request) {
  return Boolean(ADMIN_PASSWORD) && request.headers["x-admin-password"] === ADMIN_PASSWORD;
}

function requireAdmin(request, response) {
  if (isAdminRequest(request)) {
    return true;
  }

  sendJson(response, 401, { error: "Senha de administrador inválida." });
  return false;
}

function loadGroups() {
  delete require.cache[require.resolve(MATCHES_FILE)];
  return require(MATCHES_FILE);
}

function getAllMatches() {
  return loadGroups().flatMap((group) => group.matches.map((match) => ({ ...match, group: group.group })));
}

const scoreSync = createScoreSync({ storage, getAllMatches });

function getPlayerKey(playerName) {
  return String(playerName || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function getPublicKnockoutPlayers(playersByKey = {}) {
  return KNOCKOUT_PLAYERS.map((playerName) => {
    const playerKey = getPlayerKey(playerName);
    const savedPlayer = playersByKey[playerKey];

    return {
      playerKey,
      playerName,
      hasPassword: Boolean(savedPlayer?.passwordHash)
    };
  });
}

function hashPassword(password, salt = randomBytes(16).toString("hex")) {
  const hash = pbkdf2Sync(String(password), salt, 120000, 32, "sha256").toString("hex");
  return { hash, salt };
}

function verifyPassword(password, savedPlayer) {
  if (!savedPlayer?.passwordHash || !savedPlayer?.passwordSalt) {
    return false;
  }

  const { hash } = hashPassword(password, savedPlayer.passwordSalt);
  const providedHash = Buffer.from(hash, "hex");
  const expectedHash = Buffer.from(savedPlayer.passwordHash, "hex");

  return providedHash.length === expectedHash.length && timingSafeEqual(providedHash, expectedHash);
}

function getKnockoutFetchDates() {
  const dates = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset <= KNOCKOUT_FETCH_DAYS; dayOffset += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayOffset);
    dates.push(date.toISOString().slice(0, 10).replace(/-/g, ""));
  }

  return dates;
}

async function fetchEspnKnockoutMatches() {
  if (typeof fetch !== "function") {
    throw new Error("Fetch não está disponível nesta versão do Node.");
  }

  const eventLists = await Promise.all(getKnockoutFetchDates().map(async (dateKey) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${ESPN_SCOREBOARD_BASE_URL}?dates=${dateKey}`, {
        headers: { "Accept": "application/json" },
        signal: controller.signal
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      if (Array.isArray(data.events)) {
        return data.events;
      }

      return [];
    } catch (error) {
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }));

  const events = eventLists.flat();
  const matches = events.map(mapEspnKnockoutMatch).filter(Boolean);
  const enrichedMatches = await Promise.all(matches.map(enrichKnockoutMatchFromSummary));

  return enrichedMatches;
}

function mapEspnKnockoutMatch(event) {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors;

  if (!Array.isArray(competitors) || competitors.length < 2) {
    return null;
  }

  const homeCompetitor = competitors.find((competitor) => competitor.homeAway === "home") || competitors[0];
  const awayCompetitor = competitors.find((competitor) => competitor.homeAway === "away") || competitors[1];
  const home = getEspnTeamName(homeCompetitor?.team);
  const away = getEspnTeamName(awayCompetitor?.team);

  if (!home || !away) {
    return null;
  }

  const status = event.status?.type || competition.status?.type || {};
  const homeScore = Number(homeCompetitor.score);
  const awayScore = Number(awayCompetitor.score);
  const homeShootoutScore = Number(homeCompetitor.shootoutScore);
  const awayShootoutScore = Number(awayCompetitor.shootoutScore);

  return {
    id: `espn-${event.id}`,
    espnId: String(event.id || ""),
    home,
    away,
    date: event.date || competition.date,
    round: event.season?.slug || event.season?.type || event.shortName || "Mata-mata",
    status: status.description || status.detail || "",
    state: status.state || "",
    completed: Boolean(status.completed),
    winnerSide: homeCompetitor.winner ? "home" : awayCompetitor.winner ? "away" : null,
    finalHomeScore: Number.isInteger(homeScore) ? homeScore : null,
    finalAwayScore: Number.isInteger(awayScore) ? awayScore : null,
    homeShootoutScore: Number.isInteger(homeShootoutScore) ? homeShootoutScore : null,
    awayShootoutScore: Number.isInteger(awayShootoutScore) ? awayShootoutScore : null,
    homeScore: Number.isInteger(homeScore) ? homeScore : null,
    awayScore: Number.isInteger(awayScore) ? awayScore : null
  };
}

async function enrichKnockoutMatchFromSummary(match) {
  if (!match.espnId || !isKnockoutResultReady(match)) {
    return match;
  }

  try {
    const summary = await fetchEspnEventSummary(match.espnId);
    const summaryCompetition = summary?.header?.competitions?.[0];
    const summaryCompetitors = summaryCompetition?.competitors;

    if (!Array.isArray(summaryCompetitors)) {
      return match;
    }

    const homeCompetitor = summaryCompetitors.find((competitor) => competitor.homeAway === "home");
    const awayCompetitor = summaryCompetitors.find((competitor) => competitor.homeAway === "away");
    const homeShootoutScore = Number(homeCompetitor?.shootoutScore);
    const awayShootoutScore = Number(awayCompetitor?.shootoutScore);

    return {
      ...match,
      winnerSide: homeCompetitor?.winner ? "home" : awayCompetitor?.winner ? "away" : match.winnerSide,
      homeShootoutScore: Number.isInteger(homeShootoutScore) ? homeShootoutScore : match.homeShootoutScore,
      awayShootoutScore: Number.isInteger(awayShootoutScore) ? awayShootoutScore : match.awayShootoutScore
    };
  } catch (error) {
    return match;
  }
}

async function fetchEspnEventSummary(eventId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${ESPN_SUMMARY_BASE_URL}?event=${encodeURIComponent(eventId)}`, {
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function getEspnTeamName(team) {
  return team?.displayName || team?.shortDisplayName || team?.name || team?.location || "";
}

async function syncKnockoutFromEspn() {
  const fetchedMatches = await fetchEspnKnockoutMatches();

  if (fetchedMatches.length) {
    await storage.upsertKnockoutMatches(fetchedMatches);

    const resultsPatch = {};

    for (const match of fetchedMatches) {
      if (isKnockoutResultReady(match)) {
        resultsPatch[match.id] = {
          homeScore: match.homeScore,
          awayScore: match.awayScore
        };
      }
    }

    if (Object.keys(resultsPatch).length) {
      await storage.updateKnockoutResults(resultsPatch);
    }
  }

  return {
    matches: await storage.getKnockoutMatches(),
    results: await storage.getKnockoutResults(),
    syncedAt: new Date().toISOString()
  };
}

function isKnockoutResultReady(match) {
  const state = String(match.state || "").toLowerCase();

  return (
    (match.completed || state === "in" || state === "live" || state === "post") &&
    Number.isInteger(match.homeScore) &&
    Number.isInteger(match.awayScore)
  );
}

function getPredictionLockInfo(match) {
  const kickoff = Date.parse(match.date || "");

  if (!Number.isFinite(kickoff)) {
    return { locked: false, deadline: null };
  }

  const deadline = kickoff - 10 * 60 * 1000;

  return {
    locked: Date.now() >= deadline,
    deadline: new Date(deadline).toISOString()
  };
}

function validateKnockoutPredictionPatch(payload, matches) {
  const predictions = payload.predictions;

  if (!predictions || typeof predictions !== "object") {
    return { error: "Envie os palpites do mata-mata." };
  }

  const matchesById = new Map(matches.map((match) => [match.id, match]));
  const validPredictions = {};

  for (const [matchId, prediction] of Object.entries(predictions)) {
    const match = matchesById.get(matchId);

    if (!match) {
      return { error: `Jogo inválido: ${matchId}.` };
    }

    const lockInfo = getPredictionLockInfo(match);

    if (lockInfo.locked) {
      return { error: `Palpites encerrados para ${match.home} x ${match.away}.` };
    }

    const homeScore = Number(prediction?.homeScore);
    const awayScore = Number(prediction?.awayScore);
    const advanceSide = String(prediction?.advanceSide || "");

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      return { error: `Informe um placar válido para ${match.home} x ${match.away}.` };
    }

    if (!["home", "away"].includes(advanceSide)) {
      return { error: `Escolha quem passa se der pênalti em ${match.home} x ${match.away}.` };
    }

    validPredictions[matchId] = { homeScore, awayScore, advanceSide };
  }

  return { predictions: validPredictions };
}

function readRequestBody(request) {
  if (request.body && typeof request.body === "object") {
    return Promise.resolve(request.body);
  }

  if (typeof request.body === "string") {
    try {
      return Promise.resolve(request.body ? JSON.parse(request.body) : {});
    } catch (error) {
      return Promise.reject(new Error("JSON inválido."));
    }
  }

  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 2_000_000) {
        reject(new Error("Payload muito grande."));
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("JSON inválido."));
      }
    });
  });
}

function validateCartela(payload) {
  const playerName = String(payload.playerName || "").trim();

  if (!playerName) {
    return { error: "Informe o nome do jogador." };
  }

  if (!payload.predictions || typeof payload.predictions !== "object") {
    return { error: "Preencha os palpites da cartela." };
  }

  const predictions = {};

  for (const match of getAllMatches()) {
    const prediction = payload.predictions[match.id];
    const homeScore = Number(prediction?.homeScore);
    const awayScore = Number(prediction?.awayScore);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      return { error: `Preencha um placar válido para ${match.home} x ${match.away}.` };
    }

    predictions[match.id] = {
      homeScore,
      awayScore
    };
  }

  return { playerName, predictions };
}

function validateResults(payload) {
  if (!payload.results || typeof payload.results !== "object") {
    return { error: "Envie os placares atualizados." };
  }

  const validMatchIds = new Set(getAllMatches().map((match) => match.id));
  const results = {};

  for (const [matchId, result] of Object.entries(payload.results)) {
    if (!validMatchIds.has(matchId)) {
      return { error: `Jogo inválido: ${matchId}.` };
    }

    const hasHomeScore = result?.homeScore !== "" && result?.homeScore !== null && result?.homeScore !== undefined;
    const hasAwayScore = result?.awayScore !== "" && result?.awayScore !== null && result?.awayScore !== undefined;

    if (!hasHomeScore && !hasAwayScore) {
      results[matchId] = null;
      continue;
    }

    if (hasHomeScore !== hasAwayScore) {
      return { error: `Preencha os dois placares ou deixe ambos vazios para ${matchId}.` };
    }

    const homeScore = Number(result.homeScore);
    const awayScore = Number(result.awayScore);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      return { error: `Placar inválido para ${matchId}.` };
    }

    results[matchId] = {
      homeScore,
      awayScore
    };
  }

  return { results };
}

function serveStaticFile(response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end("Acesso negado.");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Arquivo não encontrado.");
      return;
    }

    const extension = path.extname(filePath);
    const headers = { "Content-Type": contentTypes[extension] || "application/octet-stream" };

    if (requestedPath.startsWith("/chibis/") || requestedPath.startsWith("/chibis-optimized/")) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    } else if ([".png", ".webp", ".svg"].includes(extension)) {
      headers["Cache-Control"] = "public, max-age=604800";
    }

    response.writeHead(200, headers);
    response.end(content);

    if (requestedPath === "/index.html") {
      scoreSync.syncNow("page-load").catch((error) => {
        console.warn("NÃ£o foi possÃ­vel sincronizar placares ao carregar a pÃ¡gina.", error.message);
      });
    }
  });
}

async function handleApiRequest(request, response, pathname) {
  const cartelaIdMatch = pathname.match(/^\/api\/cartelas\/([^/]+)$/);
  const knockoutPasswordResetMatch = pathname.match(/^\/api\/knockout\/admin\/passwords\/([^/]+)$/);

  try {
    if (request.method === "GET" && pathname === "/api/matches") {
      sendJson(response, 200, { groups: loadGroups() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/cartelas") {
      sendJson(response, 200, { cartelas: await storage.getCartelas() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/backup") {
      if (!requireAdmin(request, response)) {
        return;
      }

      sendBackupJson(response, {
        generatedAt: new Date().toISOString(),
        app: "Bolão da Copa UFSM Cachoeira do Sul",
        groups: loadGroups(),
        cartelas: await storage.getCartelas(),
        results: await storage.getResults(),
        knockout: {
          players: getPublicKnockoutPlayers(await storage.getKnockoutPlayers()),
          matches: await storage.getKnockoutMatches(),
          predictions: await storage.getKnockoutPredictions(),
          results: await storage.getKnockoutResults()
        },
        sync: scoreSync.getStatus()
      });
      return;
    }

    if (request.method === "GET" && pathname === "/api/results") {
      try {
        await scoreSync.syncOnDemand("api-results");
      } catch (error) {
        console.warn("NÃ£o foi possÃ­vel sincronizar placares automaticamente.", error.message);
      }

      sendJson(response, 200, { results: await storage.getResults(), sync: scoreSync.getStatus() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/sync/status") {
      sendJson(response, 200, { sync: scoreSync.getStatus() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/knockout/state") {
      let knockoutState;

      try {
        knockoutState = await syncKnockoutFromEspn();
      } catch (error) {
        console.warn("Não foi possível sincronizar o mata-mata pela ESPN.", error.message);
        knockoutState = {
          matches: await storage.getKnockoutMatches(),
          results: await storage.getKnockoutResults(),
          syncedAt: null,
          syncError: error.message
        };
      }

      const playersByKey = await storage.getKnockoutPlayers();
      const predictions = await storage.getKnockoutPredictions();

      sendJson(response, 200, {
        players: getPublicKnockoutPlayers(playersByKey),
        matches: knockoutState.matches.map((match) => ({
          ...match,
          lock: getPredictionLockInfo(match)
        })),
        results: knockoutState.results,
        predictions,
        syncedAt: knockoutState.syncedAt,
        syncError: knockoutState.syncError
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/knockout/session") {
      const payload = await readRequestBody(request);
      const playerKey = getPlayerKey(payload.playerName);
      const playerName = KNOCKOUT_PLAYERS.find((name) => getPlayerKey(name) === playerKey);

      if (!playerName) {
        sendJson(response, 400, { error: "Participante inválido." });
        return;
      }

      const playersByKey = await storage.getKnockoutPlayers();
      const savedPlayer = playersByKey[playerKey];

      if (!savedPlayer?.passwordHash) {
        const newPassword = String(payload.newPassword || "");

        if (newPassword.length < 3) {
          sendJson(response, 400, { error: "Crie uma senha com pelo menos 3 caracteres." });
          return;
        }

        const { hash, salt } = hashPassword(newPassword);
        await storage.upsertKnockoutPlayer({
          playerKey,
          playerName,
          passwordHash: hash,
          passwordSalt: salt
        });
      } else if (!verifyPassword(payload.password || "", savedPlayer)) {
        sendJson(response, 401, { error: "Senha inválida para essa cartela." });
        return;
      }

      const allPredictions = await storage.getKnockoutPredictions();

      sendJson(response, 200, {
        player: {
          playerKey,
          playerName,
          hasPassword: true
        },
        predictions: allPredictions[playerKey]?.predictions || {}
      });
      return;
    }

    if (request.method === "PUT" && pathname === "/api/knockout/predictions") {
      const payload = await readRequestBody(request);
      const playerKey = getPlayerKey(payload.playerName);
      const playerName = KNOCKOUT_PLAYERS.find((name) => getPlayerKey(name) === playerKey);

      if (!playerName) {
        sendJson(response, 400, { error: "Participante inválido." });
        return;
      }

      const playersByKey = await storage.getKnockoutPlayers();
      const savedPlayer = playersByKey[playerKey];

      if (!verifyPassword(payload.password || "", savedPlayer)) {
        sendJson(response, 401, { error: "Senha inválida para essa cartela." });
        return;
      }

      const matches = await storage.getKnockoutMatches();
      const validation = validateKnockoutPredictionPatch(payload, matches);

      if (validation.error) {
        sendJson(response, 400, { error: validation.error });
        return;
      }

      const allPredictions = await storage.getKnockoutPredictions();
      const currentPredictions = allPredictions[playerKey]?.predictions || {};
      const nextPredictions = {
        ...currentPredictions,
        ...validation.predictions
      };
      const savedPredictions = await storage.updateKnockoutPredictions(playerKey, nextPredictions);

      sendJson(response, 200, {
        player: {
          playerKey,
          playerName,
          hasPassword: true
        },
        predictions: savedPredictions.predictions
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/results/sync") {
      if (!requireAdmin(request, response)) {
        return;
      }

      try {
        await scoreSync.syncNow("manual");
      } catch (error) {
        sendJson(response, 502, { error: error.message, sync: scoreSync.getStatus() });
        return;
      }

      sendJson(response, 200, { results: await storage.getResults(), sync: scoreSync.getStatus() });
      return;
    }

    if (request.method === "POST" && pathname === "/api/admin/validate") {
      if (!requireAdmin(request, response)) {
        return;
      }

      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "GET" && pathname === "/api/knockout/admin/passwords") {
      if (!requireAdmin(request, response)) {
        return;
      }

      const playersByKey = await storage.getKnockoutPlayers();

      sendJson(response, 200, {
        players: getPublicKnockoutPlayers(playersByKey).map((player) => {
          const savedPlayer = playersByKey[player.playerKey];

          return {
            ...player,
            passwordStatus: player.hasPassword ? "Senha criada e protegida" : "Sem senha",
            password: player.hasPassword ? "Não é possível exibir: senha salva com hash" : "",
            createdAt: savedPlayer?.createdAt,
            updatedAt: savedPlayer?.updatedAt
          };
        })
      });
      return;
    }

    if (request.method === "DELETE" && knockoutPasswordResetMatch) {
      if (!requireAdmin(request, response)) {
        return;
      }

      const playerKey = decodeURIComponent(knockoutPasswordResetMatch[1]);
      const player = KNOCKOUT_PLAYERS.find((currentPlayer) => currentPlayer.key === playerKey);

      if (!player) {
        sendJson(response, 404, { error: "Participante não encontrado." });
        return;
      }

      await storage.resetKnockoutPlayerPassword(player.key, player.name);

      sendJson(response, 200, {
        player: {
          playerKey: player.key,
          playerName: player.name,
          hasPassword: false,
          passwordStatus: "Sem senha"
        }
      });
      return;
    }

    if (request.method === "POST" && pathname === "/api/cartelas") {
      const payload = await readRequestBody(request);
      const validation = validateCartela(payload);

      if (validation.error) {
        sendJson(response, 400, { error: validation.error });
        return;
      }

      const cartela = await storage.createCartela({
        id: randomUUID(),
        playerName: validation.playerName,
        predictions: validation.predictions,
        createdAt: new Date().toISOString()
      });

      sendJson(response, 201, { cartela });
      return;
    }

    if (request.method === "PUT" && pathname === "/api/results") {
      if (!requireAdmin(request, response)) {
        return;
      }

      const payload = await readRequestBody(request);
      const validation = validateResults(payload);

      if (validation.error) {
        sendJson(response, 400, { error: validation.error });
        return;
      }

      sendJson(response, 200, { results: await storage.updateResults(validation.results) });
      return;
    }

    if (cartelaIdMatch && request.method === "PUT") {
      if (!requireAdmin(request, response)) {
        return;
      }

      const cartelaId = decodeURIComponent(cartelaIdMatch[1]);
      const payload = await readRequestBody(request);
      const validation = validateCartela(payload);

      if (validation.error) {
        sendJson(response, 400, { error: validation.error });
        return;
      }

      const cartela = await storage.updateCartela(cartelaId, {
        playerName: validation.playerName,
        predictions: validation.predictions,
        updatedAt: new Date().toISOString()
      });

      if (!cartela) {
        sendJson(response, 404, { error: "Cartela não encontrada." });
        return;
      }

      sendJson(response, 200, { cartela });
      return;
    }

    if (cartelaIdMatch && request.method === "DELETE") {
      if (!requireAdmin(request, response)) {
        return;
      }

      const deleted = await storage.deleteCartela(decodeURIComponent(cartelaIdMatch[1]));

      if (!deleted) {
        sendJson(response, 404, { error: "Cartela não encontrada." });
        return;
      }

      sendJson(response, 200, { ok: true });
      return;
    }

    sendJson(response, 404, { error: "Rota não encontrada." });
  } catch (error) {
    sendJson(response, 500, { error: "Erro interno do servidor." });
  }
}

function handleRequest(request, response) {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname.startsWith("/api/")) {
    handleApiRequest(request, response, pathname);
    return;
  }

  serveStaticFile(response, pathname);
}

function startServer() {
  const server = http.createServer(handleRequest);

  return storage.initStorage().then(() => {
    server.listen(PORT, () => {
      console.log(`Bolão UFSM-CS rodando em http://localhost:${PORT}`);
    });
  });
}

handleRequest.handleApiRequest = handleApiRequest;
handleRequest.handleRequest = handleRequest;
handleRequest.initStorage = storage.initStorage;
handleRequest.startServer = startServer;

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Não foi possível inicializar o armazenamento.", error);
    process.exit(1);
  });
}

module.exports = handleRequest;
