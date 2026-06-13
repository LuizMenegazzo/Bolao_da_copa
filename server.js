const fs = require("fs");
const http = require("http");
const path = require("path");
const { randomUUID } = require("crypto");
const storage = require("./storage");
const { createScoreSync } = require("./score-sync");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const MATCHES_FILE = path.join(__dirname, "data", "matches.js");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
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

function readRequestBody(request) {
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
    response.writeHead(200, { "Content-Type": contentTypes[extension] || "application/octet-stream" });
    response.end(content);
  });
}

async function handleApiRequest(request, response, pathname) {
  const cartelaIdMatch = pathname.match(/^\/api\/cartelas\/([^/]+)$/);

  try {
    if (request.method === "GET" && pathname === "/api/matches") {
      sendJson(response, 200, { groups: loadGroups() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/cartelas") {
      sendJson(response, 200, { cartelas: await storage.getCartelas() });
      return;
    }

    if (request.method === "GET" && pathname === "/api/results") {
      try {
        await scoreSync.syncIfStale("api-results");
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

const server = http.createServer((request, response) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname.startsWith("/api/")) {
    handleApiRequest(request, response, pathname);
    return;
  }

  serveStaticFile(response, pathname);
});

storage.initStorage().then(() => {
  scoreSync.start();

  server.listen(PORT, () => {
    console.log(`Bolão UFSM-CS rodando em http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Não foi possível inicializar o armazenamento.", error);
  process.exit(1);
});
