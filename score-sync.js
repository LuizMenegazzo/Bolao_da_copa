const DEFAULT_INTERVAL_MS = 10 * 60 * 1000;
const MIN_INTERVAL_MS = 60 * 1000;
const OPENLIGADB_URL = process.env.OPENLIGADB_URL || "https://api.openligadb.de/getmatchdata/wm26/2026";

const TEAM_ALIASES = {
  "África do Sul": ["south africa", "südafrika", "suedafrika"],
  "Alemanha": ["germany", "deutschland"],
  "Argentina": [],
  "Argélia": ["algeria", "algerien"],
  "Arábia Saudita": ["saudi arabia", "saudi-arabien", "saudi arabien"],
  "Austrália": ["australia", "australien"],
  "Áustria": ["austria", "österreich", "oesterreich"],
  "Bélgica": ["belgium", "belgien"],
  "Bósnia": ["bosnia", "bosnia and herzegovina", "bosnien", "bosnien-herzegowina"],
  "Brasil": ["brazil", "brasilien"],
  "BRASIL": ["brazil", "brasilien"],
  "Cabo Verde": ["cape verde", "kap verde"],
  "Canadá": ["canada", "kanada"],
  "Catar": ["qatar", "katar"],
  "Colômbia": ["colombia", "kolumbien"],
  "Coreia do Sul": ["south korea", "korea republic", "republik korea", "südkorea", "suedkorea"],
  "Costa do Marfim": ["ivory coast", "cote d'ivoire", "côte d’ivoire", "elfenbeinküste", "elfenbeinkueste"],
  "Croácia": ["croatia", "kroatien"],
  "Curaçao": ["curacao"],
  "Egito": ["egypt", "ägypten", "aegypten"],
  "Equador": ["ecuador"],
  "Escócia": ["scotland", "schottland"],
  "Espanha": ["spain", "spanien"],
  "Estados Unidos": ["usa", "united states", "united states of america", "vereinigte staaten"],
  "França": ["france", "frankreich"],
  "Gana": ["ghana"],
  "Haiti": [],
  "Holanda": ["netherlands", "niederlande", "holland"],
  "Inglaterra": ["england"],
  "Irã": ["iran"],
  "Iraque": ["iraq", "irak"],
  "Japão": ["japan"],
  "Jordânia": ["jordan", "jordanien"],
  "Marrocos": ["morocco", "marokko"],
  "México": ["mexico", "mexiko"],
  "Noruega": ["norway", "norwegen"],
  "Nova Zelândia": ["new zealand", "neuseeland"],
  "Panamá": ["panama"],
  "Paraguai": ["paraguay"],
  "Portugal": [],
  "RD Congo": ["dr congo", "congo dr", "democratic republic of congo", "kongo dr", "dr kongo", "d.r. congo"],
  "República Tcheca": ["czech republic", "czechia", "tschechien", "tschechische republik"],
  "Senegal": [],
  "Suécia": ["sweden", "schweden"],
  "Suíça": ["switzerland", "schweiz"],
  "Tunísia": ["tunisia", "tunesien"],
  "Turquia": ["turkey", "türkei", "tuerkei"],
  "Uruguai": ["uruguay"],
  "Uzbequistão": ["uzbekistan", "usbekistan"]
};

function createScoreSync({ storage, getAllMatches }) {
  const enabled = process.env.AUTO_SCORE_SYNC !== "false";
  const syncLiveScores = process.env.AUTO_SYNC_LIVE_SCORES !== "false";
  const intervalMs = getIntervalMs();

  let timer = null;
  let currentSync = null;
  let lastAttemptAt = null;
  let lastSuccessAt = null;
  let lastError = null;
  let lastUpdatedCount = 0;
  let lastMatchedCount = 0;
  let lastSourceMatchesCount = 0;
  let lastSkippedCount = 0;

  function getStatus() {
    return {
      enabled,
      source: "OpenLigaDB",
      sourceUrl: OPENLIGADB_URL,
      intervalMs,
      syncLiveScores,
      syncing: Boolean(currentSync),
      lastAttemptAt,
      lastSuccessAt,
      lastError,
      lastUpdatedCount,
      lastMatchedCount,
      lastSourceMatchesCount,
      lastSkippedCount
    };
  }

  function start() {
    if (!enabled || timer) {
      return;
    }

    syncNow("startup").catch((error) => {
      console.warn("Sincronização automática inicial falhou:", error.message);
    });

    timer = setInterval(() => {
      syncNow("interval").catch((error) => {
        console.warn("Sincronização automática falhou:", error.message);
      });
    }, intervalMs);

    if (typeof timer.unref === "function") {
      timer.unref();
    }
  }

  function stop() {
    if (!timer) {
      return;
    }

    clearInterval(timer);
    timer = null;
  }

  async function syncIfStale(reason = "api") {
    if (!enabled) {
      return getStatus();
    }

    if (currentSync) {
      await currentSync;
      return getStatus();
    }

    if (lastAttemptAt && Date.now() - new Date(lastAttemptAt).getTime() < intervalMs) {
      return getStatus();
    }

    await syncNow(reason);
    return getStatus();
  }

  async function syncNow(reason = "manual") {
    if (!enabled) {
      return getStatus();
    }

    if (currentSync) {
      await currentSync;
      return getStatus();
    }

    currentSync = runSync(reason)
      .catch((error) => {
        lastError = error.message;
        throw error;
      })
      .finally(() => {
        currentSync = null;
      });

    await currentSync;
    return getStatus();
  }

  async function runSync(reason) {
    lastAttemptAt = new Date().toISOString();
    lastError = null;

    const sourceMatches = await fetchOpenLigaMatches();
    const localMatches = getAllMatches();
    const currentResults = await storage.getResults();
    const resultsPatch = {};

    lastSourceMatchesCount = sourceMatches.length;
    lastMatchedCount = 0;
    lastSkippedCount = 0;

    for (const sourceMatch of sourceMatches) {
      const score = extractScore(sourceMatch);

      if (!score) {
        lastSkippedCount += 1;
        continue;
      }

      const matchInfo = findLocalMatch(sourceMatch, localMatches);

      if (!matchInfo) {
        lastSkippedCount += 1;
        continue;
      }

      lastMatchedCount += 1;
      const { match, scoreReversed } = matchInfo;

      const normalizedScore = scoreReversed
        ? { homeScore: score.awayScore, awayScore: score.homeScore }
        : { homeScore: score.homeScore, awayScore: score.awayScore };
      const currentResult = currentResults[match.id];

      if (
        currentResult?.homeScore === normalizedScore.homeScore &&
        currentResult?.awayScore === normalizedScore.awayScore
      ) {
        continue;
      }

      resultsPatch[match.id] = normalizedScore;
    }

    lastUpdatedCount = Object.keys(resultsPatch).length;

    if (lastUpdatedCount > 0) {
      await storage.updateResults(resultsPatch);
    }

    lastSuccessAt = new Date().toISOString();
    console.log(
      `Sincronização ${reason}: ${lastUpdatedCount} placares atualizados, ${lastMatchedCount} jogos encontrados.`
    );

    return getStatus();
  }

  function extractScore(sourceMatch) {
    const results = Array.isArray(sourceMatch.matchResults) ? sourceMatch.matchResults : [];

    if (!results.length) {
      return null;
    }

    if (!syncLiveScores && !sourceMatch.matchIsFinished) {
      return null;
    }

    const finalResult = results.find((result) => Number(result.resultTypeID) === 2);
    const selectedResult = finalResult || [...results].sort((firstResult, secondResult) => {
      return Number(secondResult.resultOrder || 0) - Number(firstResult.resultOrder || 0);
    })[0];

    const homeScore = Number(selectedResult?.pointsTeam1);
    const awayScore = Number(selectedResult?.pointsTeam2);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      return null;
    }

    return { homeScore, awayScore, reversed: false };
  }

  function findLocalMatch(sourceMatch, localMatches) {
    const sourceHome = resolveTeamName(sourceMatch.team1);
    const sourceAway = resolveTeamName(sourceMatch.team2);

    if (!sourceHome || !sourceAway) {
      return null;
    }

    const sameOrderMatch = localMatches.find((match) => {
      const localHome = getTeamIdentity(match.home);
      const localAway = getTeamIdentity(match.away);
      return localHome === sourceHome && localAway === sourceAway;
    });

    if (sameOrderMatch) {
      return { match: sameOrderMatch, scoreReversed: false };
    }

    const reversedOrderMatch = localMatches.find((match) => {
      const localHome = getTeamIdentity(match.home);
      const localAway = getTeamIdentity(match.away);
      return localHome === sourceAway && localAway === sourceHome;
    });

    return reversedOrderMatch ? { match: reversedOrderMatch, scoreReversed: true } : null;
  }

  async function fetchOpenLigaMatches() {
    if (typeof fetch !== "function") {
      throw new Error("Fetch não está disponível nesta versão do Node.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(OPENLIGADB_URL, {
        headers: { "Accept": "application/json" },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`OpenLigaDB respondeu com HTTP ${response.status}.`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("OpenLigaDB retornou um formato inesperado.");
      }

      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    getStatus,
    start,
    stop,
    syncIfStale,
    syncNow
  };
}

function resolveTeamName(team) {
  const candidates = [
    team?.teamName,
    team?.shortName,
    team?.teamGroupName,
    team?.teamId ? String(team.teamId) : ""
  ]
    .filter(Boolean)
    .map(normalizeName);

  for (const [localTeam, aliases] of Object.entries(TEAM_ALIASES)) {
    const localIdentity = getTeamIdentity(localTeam);
    const normalizedAliases = [localTeam, ...aliases].map(normalizeName);

    if (candidates.some((candidate) => normalizedAliases.includes(candidate))) {
      return localIdentity;
    }
  }

  return null;
}

function getTeamIdentity(teamName) {
  return normalizeName(teamName);
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getIntervalMs() {
  const minutes = Number(process.env.AUTO_SCORE_SYNC_MINUTES);
  const milliseconds = Number(process.env.AUTO_SCORE_SYNC_INTERVAL_MS);
  const configuredInterval = Number.isFinite(milliseconds) && milliseconds > 0
    ? milliseconds
    : Number.isFinite(minutes) && minutes > 0
      ? minutes * 60 * 1000
      : DEFAULT_INTERVAL_MS;

  return Math.max(configuredInterval, MIN_INTERVAL_MS);
}

module.exports = {
  createScoreSync,
  normalizeName,
  resolveTeamName
};
