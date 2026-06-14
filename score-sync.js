const ESPN_SCOREBOARD_BASE_URL =
  process.env.ESPN_SCOREBOARD_URL ||
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

const TEAM_ALIASES = {
  "África do Sul": ["south africa", "rsa", "zaf", "sa"],
  "Alemanha": ["germany", "deutschland", "ger", "deu"],
  "Argentina": ["arg"],
  "Argélia": ["algeria", "alg", "dza"],
  "Arábia Saudita": ["saudi arabia", "ksa", "sau"],
  "Austrália": ["australia", "aus"],
  "Áustria": ["austria", "aut"],
  "Bélgica": ["belgium", "bel", "belgien"],
  "Bósnia": ["bosnia", "bosnia and herzegovina", "bosnia-herzegovina", "bih", "bos"],
  "Brasil": ["brazil", "bra"],
  "BRASIL": ["brazil", "bra"],
  "Cabo Verde": ["cape verde", "cape verde islands", "cpv"],
  "Canadá": ["canada", "can"],
  "Catar": ["qatar", "qat"],
  "Colômbia": ["colombia", "col"],
  "Coreia do Sul": ["south korea", "korea republic", "korea", "kor"],
  "Costa do Marfim": ["ivory coast", "cote d ivoire", "côte d'ivoire", "civ"],
  "Croácia": ["croatia", "cro"],
  "Curaçao": ["curacao", "curaçao", "cuw"],
  "Egito": ["egypt", "egy"],
  "Equador": ["ecuador", "ecu"],
  "Escócia": ["scotland", "sco"],
  "Espanha": ["spain", "esp"],
  "Estados Unidos": ["usa", "united states", "united states of america", "usmnt"],
  "França": ["france", "fra"],
  "Gana": ["ghana", "gha"],
  "Haiti": ["hai"],
  "Holanda": ["netherlands", "holland", "ned", "nld"],
  "Inglaterra": ["england", "eng"],
  "Irã": ["iran", "irn"],
  "Iraque": ["iraq", "irq"],
  "Japão": ["japan", "jpn"],
  "Jordânia": ["jordan", "jor"],
  "Marrocos": ["morocco", "mar"],
  "México": ["mexico", "mex"],
  "Noruega": ["norway", "nor"],
  "Nova Zelândia": ["new zealand", "nzl"],
  "Panamá": ["panama", "pan"],
  "Paraguai": ["paraguay", "par"],
  "Portugal": ["por"],
  "RD Congo": ["dr congo", "congo dr", "democratic republic of congo", "d r congo", "cod"],
  "República Tcheca": ["czech republic", "czechia", "cze"],
  "Senegal": ["sen"],
  "Suécia": ["sweden", "swe"],
  "Suíça": ["switzerland", "sui", "che"],
  "Tunísia": ["tunisia", "tun"],
  "Turquia": ["turkey", "tur", "türkiye"],
  "Uruguai": ["uruguay", "uru"],
  "Uzbequistão": ["uzbekistan", "uzb"]
};

function createScoreSync({ storage, getAllMatches }) {
  const enabled = process.env.AUTO_SCORE_SYNC !== "false";
  const syncLiveScores = process.env.AUTO_SYNC_LIVE_SCORES !== "false";

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
      source: "ESPN",
      sourceUrl: ESPN_SCOREBOARD_BASE_URL,
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

  async function syncOnDemand(reason = "api") {
    if (!enabled) {
      return getStatus();
    }

    if (currentSync) {
      await currentSync;
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

    const localMatches = getAllMatches();
    const sourceMatches = await fetchEspnMatches(localMatches);
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
      `Sincronização ${reason} via ESPN: ${lastUpdatedCount} placares atualizados, ${lastMatchedCount} jogos encontrados.`
    );

    return getStatus();
  }

  function extractScore(sourceMatch) {
    const status = sourceMatch.status?.type || {};
    const state = normalizeName(status.state);
    const isCompleted = Boolean(status.completed) || state === "post";
    const isLive = state === "in" || state === "live";

    if (!isCompleted && !isLive) {
      return null;
    }

    if (!syncLiveScores && !isCompleted) {
      return null;
    }

    const homeTeam = getEspnCompetitor(sourceMatch, "home");
    const awayTeam = getEspnCompetitor(sourceMatch, "away");
    const homeScore = Number(homeTeam?.score);
    const awayScore = Number(awayTeam?.score);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      return null;
    }

    return { homeScore, awayScore };
  }

  function findLocalMatch(sourceMatch, localMatches) {
    const sourceHome = resolveTeamName(getEspnCompetitor(sourceMatch, "home")?.team);
    const sourceAway = resolveTeamName(getEspnCompetitor(sourceMatch, "away")?.team);

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

  async function fetchEspnMatches(localMatches) {
    if (typeof fetch !== "function") {
      throw new Error("Fetch não está disponível nesta versão do Node.");
    }

    const dates = [...new Set(localMatches.map((match) => match.date).filter(Boolean))]
      .sort()
      .map((date) => date.replace(/-/g, ""));
    const matchLists = await Promise.all(dates.map(fetchEspnDate));
    const matchesById = new Map();

    for (const matches of matchLists) {
      for (const match of matches) {
        matchesById.set(String(match.id || match.uid || `${match.name}-${match.date}`), match);
      }
    }

    return [...matchesById.values()];
  }

  async function fetchEspnDate(dateKey) {
    const url = `${ESPN_SCOREBOARD_BASE_URL}?dates=${encodeURIComponent(dateKey)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        headers: { "Accept": "application/json" },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`ESPN respondeu com HTTP ${response.status}.`);
      }

      const data = await response.json();

      if (!Array.isArray(data.events)) {
        throw new Error("ESPN retornou um formato inesperado.");
      }

      return data.events;
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    getStatus,
    syncOnDemand,
    syncNow
  };
}

function getEspnCompetitor(sourceMatch, homeAway) {
  const competitors = sourceMatch.competitions?.[0]?.competitors;

  if (!Array.isArray(competitors)) {
    return null;
  }

  return competitors.find((competitor) => competitor.homeAway === homeAway) || null;
}

function resolveTeamName(team) {
  const candidates = [
    team?.displayName,
    team?.shortDisplayName,
    team?.name,
    team?.location,
    team?.abbreviation,
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

module.exports = {
  createScoreSync,
  normalizeName,
  resolveTeamName
};
