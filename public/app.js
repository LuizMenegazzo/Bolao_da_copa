const seasonMenuScreen = document.querySelector("#season-menu-screen");
const homeScreen = document.querySelector("#home-screen");
const knockoutFollowScreen = document.querySelector("#knockout-follow-screen");
const knockoutPredictionsScreen = document.querySelector("#knockout-predictions-screen");
const knockoutAdminScreen = document.querySelector("#knockout-admin-screen");
const currentGameScreen = document.querySelector("#current-game-screen");
const addCardScreen = document.querySelector("#add-card-screen");
const updateScoresScreen = document.querySelector("#update-scores-screen");
const followPoolScreen = document.querySelector("#follow-pool-screen");
const myCardScreen = document.querySelector("#my-card-screen");
const matchesContainer = document.querySelector("#matches-container");
const resultsContainer = document.querySelector("#results-container");
const cartelaForm = document.querySelector("#cartela-form");
const resultsForm = document.querySelector("#results-form");
const formMessage = document.querySelector("#form-message");
const resultsMessage = document.querySelector("#results-message");
const playerNameInput = document.querySelector("#player-name");
const toast = document.querySelector("#toast");
const savedCardsList = document.querySelector("#saved-cards-list");
const formTitle = document.querySelector("#form-title");
const newCardButton = document.querySelector("#new-card-button");
const saveButton = document.querySelector(".save-button");
const rankingSummary = document.querySelector("#ranking-summary");
const rankingList = document.querySelector("#ranking-list");
const cartelaSelect = document.querySelector("#cartela-select");
const individualSummary = document.querySelector("#individual-summary");
const individualDetails = document.querySelector("#individual-details");
const rankingTab = document.querySelector("#ranking-tab");
const individualTab = document.querySelector("#individual-tab");
const generateRankingImageButton = document.querySelector("#generate-ranking-image");
const rankingImageOutput = document.querySelector("#ranking-image-output");
const personalCardsGrid = document.querySelector("#personal-cards-grid");
const personalCardDetails = document.querySelector("#personal-card-details");
const syncResultsButton = document.querySelector("#sync-results-button");
const backupDataButton = document.querySelector("#backup-data-button");
const currentGameContent = document.querySelector("#current-game-content");
const seasonMissingAlert = document.querySelector("#season-missing-alert");
const scoreSyncStatusElements = document.querySelectorAll(".score-sync-status");
const knockoutCurrentContent = document.querySelector("#knockout-current-content");
const knockoutRankingSummary = document.querySelector("#knockout-ranking-summary");
const knockoutRankingList = document.querySelector("#knockout-ranking-list");
const knockoutCurrentTab = document.querySelector("#knockout-current-tab");
const knockoutRankingTab = document.querySelector("#knockout-ranking-tab");
const knockoutPredictionContent = document.querySelector("#knockout-prediction-content");
const knockoutAdminContent = document.querySelector("#knockout-admin-content");

const ADMIN_PASSWORD_KEY = "bolaoAdminPassword";

const SCORE_LABELS = {
  complete: "Acerto completo",
  intermediate: "Acerto intermediário",
  basic: "Acerto básico",
  inverted: "Acerto invertido",
  none: "Nenhum acerto",
  missing: "Sem palpite para esse jogo",
  pending: "Aguardando placar"
};

const TEAM_FLAGS = {
  "África do Sul": "🇿🇦",
  "Alemanha": "🇩🇪",
  "Argentina": "🇦🇷",
  "Argélia": "🇩🇿",
  "Arábia Saudita": "🇸🇦",
  "Austrália": "🇦🇺",
  "Áustria": "🇦🇹",
  "Bélgica": "🇧🇪",
  "Bósnia": "🇧🇦",
  "BRASIL": "🇧🇷",
  "Cabo Verde": "🇨🇻",
  "Canadá": "🇨🇦",
  "Catar": "🇶🇦",
  "Colômbia": "🇨🇴",
  "Coreia do Sul": "🇰🇷",
  "Costa do Marfim": "🇨🇮",
  "Croácia": "🇭🇷",
  "Curaçao": "🇨🇼",
  "Egito": "🇪🇬",
  "Equador": "🇪🇨",
  "Escócia": String.fromCodePoint(0x1F3F4, 0xE0067, 0xE0062, 0xE0073, 0xE0063, 0xE0074, 0xE007F),
  "Espanha": "🇪🇸",
  "Estados Unidos": "🇺🇸",
  "França": "🇫🇷",
  "Gana": "🇬🇭",
  "Haiti": "🇭🇹",
  "Holanda": "🇳🇱",
  "Inglaterra": String.fromCodePoint(0x1F3F4, 0xE0067, 0xE0062, 0xE0065, 0xE006E, 0xE0067, 0xE007F),
  "Irã": "🇮🇷",
  "Iraque": "🇮🇶",
  "Japão": "🇯🇵",
  "Jordânia": "🇯🇴",
  "Marrocos": "🇲🇦",
  "México": "🇲🇽",
  "Noruega": "🇳🇴",
  "Nova Zelândia": "🇳🇿",
  "Panamá": "🇵🇦",
  "Paraguai": "🇵🇾",
  "Portugal": "🇵🇹",
  "RD Congo": "🇨🇩",
  "República Tcheca": "🇨🇿",
  "Senegal": "🇸🇳",
  "Suécia": "🇸🇪",
  "Suíça": "🇨🇭",
  "Tunísia": "🇹🇳",
  "Turquia": "🇹🇷",
  "Uruguai": "🇺🇾",
  "Uzbequistão": "🇺🇿"
};

const TEAM_FLAG_CODES = {
  "AFRICA DO SUL": "za",
  "SOUTH AFRICA": "za",
  "ALEMANHA": "de",
  "GERMANY": "de",
  "ARGENTINA": "ar",
  "ARGELIA": "dz",
  "ALGERIA": "dz",
  "ARABIA SAUDITA": "sa",
  "SAUDI ARABIA": "sa",
  "AUSTRALIA": "au",
  "AUSTRIA": "at",
  "BELGICA": "be",
  "BELGIUM": "be",
  "BOSNIA": "ba",
  "BOSNIA AND HERZEGOVINA": "ba",
  "BRASIL": "br",
  "BRAZIL": "br",
  "CABO VERDE": "cv",
  "CAPE VERDE": "cv",
  "CANADA": "ca",
  "CATAR": "qa",
  "QATAR": "qa",
  "COLOMBIA": "co",
  "COREIA DO SUL": "kr",
  "SOUTH KOREA": "kr",
  "KOREA REPUBLIC": "kr",
  "COSTA DO MARFIM": "ci",
  "IVORY COAST": "ci",
  "COTE D IVOIRE": "ci",
  "CROACIA": "hr",
  "CROATIA": "hr",
  "CURACAO": "cw",
  "EGITO": "eg",
  "EGYPT": "eg",
  "EQUADOR": "ec",
  "ECUADOR": "ec",
  "ESCOCIA": "gb-sct",
  "SCOTLAND": "gb-sct",
  "ESPANHA": "es",
  "SPAIN": "es",
  "ESTADOS UNIDOS": "us",
  "UNITED STATES": "us",
  "USA": "us",
  "FRANCA": "fr",
  "FRANCE": "fr",
  "GANA": "gh",
  "GHANA": "gh",
  "HAITI": "ht",
  "HOLANDA": "nl",
  "NETHERLANDS": "nl",
  "INGLATERRA": "gb-eng",
  "ENGLAND": "gb-eng",
  "IRA": "ir",
  "IRAN": "ir",
  "IRAQUE": "iq",
  "IRAQ": "iq",
  "JAPAO": "jp",
  "JAPAN": "jp",
  "JORDANIA": "jo",
  "JORDAN": "jo",
  "MARROCOS": "ma",
  "MOROCCO": "ma",
  "MEXICO": "mx",
  "NORUEGA": "no",
  "NORWAY": "no",
  "NOVA ZELANDIA": "nz",
  "NEW ZEALAND": "nz",
  "PANAMA": "pa",
  "PARAGUAI": "py",
  "PARAGUAY": "py",
  "PORTUGAL": "pt",
  "RD CONGO": "cd",
  "DR CONGO": "cd",
  "CONGO DR": "cd",
  "REPUBLICA TCHECA": "cz",
  "CZECH REPUBLIC": "cz",
  "CZECHIA": "cz",
  "SENEGAL": "sn",
  "SUECIA": "se",
  "SWEDEN": "se",
  "SUICA": "ch",
  "SWITZERLAND": "ch",
  "TUNISIA": "tn",
  "TURQUIA": "tr",
  "TURKEY": "tr",
  "URUGUAI": "uy",
  "URUGUAY": "uy",
  "UZBEQUISTAO": "uz",
  "UZBEKISTAN": "uz"
};

const PLAYER_CHIBIS = {
  "CELSO": "celso.webp",
  "CRICIELE": "criciele.webp",
  "CRIS": "cris.webp",
  "GUSTAVO": "gustavo.webp",
  "GABRIEL": "gabriel.webp",
  "JEFF": "jeff.webp",
  "VANDREI": "vandrei.webp",
  "JOAO LAURO": "joao-lauro.webp",
  "LAURA": "laura.webp",
  "THIELI": "thieli.webp",
  "ANDERSON": "anderson.webp",
  "AMANDINHA": "amandinha.webp",
  "LUIZ": "luiz.webp",
  "DANIEL": "daniel.webp",
  "CARLA": "carla.webp",
  "PC": "pc.webp",
  "NELSON": "nelson.webp",
  "DION": "dion.webp",
  "LUCAS": "lucas.webp",
  "VINICIUS": "vinicius.webp",
  "DIOGO": "diogo.webp"
};

const CHIBI_ASSET_VERSION = "2026-07-02-2";
const MATE_CHIBI_KEYS = new Set(["AMANDINHA", "CARLA", "CRICIELE", "CRIS", "LAURA", "THIELI"]);
const COUPLE_CHIBIS = [
  { keys: ["LUIZ", "AMANDINHA"], file: "luiz_amandinha.webp" },
  { keys: ["GUSTAVO", "THIELI"], file: "gustavo_thieli.webp" },
  { keys: ["ANDERSON", "CELSO"], file: "celso_anderson.webp" },
  { keys: ["CARLA", "LUCAS"], file: "carla_lucas.webp" },
  { keys: ["CRICIELE", "VINICIUS"], file: "criciele_vinicius.webp" },
  { keys: ["LAURA", "DANIEL"], file: "laura_daniel.webp" },
  { keys: ["GABRIEL", "JOAO LAURO"], file: "gabriel_joao-lauro.webp" },
  { keys: ["JEFF", "JOAO LAURO"], file: "jeff_joao-lauro.webp" },
  { keys: ["CRIS", "PC"], file: "cris_pc.webp" },
  { keys: ["LUCAS", "VINICIUS"], file: "lucas_vinicius.webp" }
];

let groups = [];
let cartelas = [];
let results = {};
let editingCartelaId = null;
let rankingEntries = [];
let personalEntries = [];
let scoreSyncStatus = null;
let knockoutPlayers = [];
let knockoutMatches = [];
let knockoutResults = {};
let knockoutPredictions = {};
let selectedKnockoutPlayer = null;
let activeKnockoutPlayer = null;
let activeKnockoutPassword = "";
let knockoutRankingEntries = [];

document.querySelector('[data-screen="group-history"]').addEventListener("click", () => {
  showScreen(homeScreen);
});

loadSeasonMissingAlert();

document.querySelector('[data-screen="knockout-follow"]').addEventListener("click", async () => {
  showScreen(knockoutFollowScreen);
  await loadKnockoutFollowData();
});

document.querySelector('[data-screen="knockout-predictions"]').addEventListener("click", async () => {
  showScreen(knockoutPredictionsScreen);
  await loadKnockoutPredictionData();
});

document.querySelector('[data-screen="knockout-admin"]').addEventListener("click", async () => {
  if (!(await requireAdminPassword())) {
    return;
  }

  showScreen(knockoutAdminScreen);
  await loadKnockoutAdminData();
});

document.querySelector('[data-screen="current-game"]').addEventListener("click", async () => {
  showScreen(currentGameScreen);
  await loadCurrentGameData();
});

document.querySelector('[data-screen="add-card"]').addEventListener("click", async () => {
  showScreen(addCardScreen);

  if (!groups.length) {
    await loadMatches();
  }

  await loadCartelas();
  playerNameInput.focus();
});

document.querySelector('[data-screen="update-scores"]').addEventListener("click", async () => {
  if (!(await requireAdminPassword())) {
    return;
  }

  showScreen(updateScoresScreen);

  if (!groups.length) {
    await loadMatches();
  }

  await loadResults();
});

document.querySelector('[data-screen="my-card"]').addEventListener("click", async () => {
  showScreen(myCardScreen);
  await loadPersonalCardsData();
});

document.querySelector('[data-screen="follow-pool"]').addEventListener("click", async () => {
  showScreen(followPoolScreen);
  await loadFollowData();
});

backupDataButton.addEventListener("click", downloadBackup);

document.querySelector("#back-season-menu").addEventListener("click", () => {
  showScreen(seasonMenuScreen);
});

document.querySelector("#back-season-menu-knockout").addEventListener("click", () => {
  showScreen(seasonMenuScreen);
});

document.querySelector("#back-season-menu-predictions").addEventListener("click", () => {
  showScreen(seasonMenuScreen);
});

document.querySelector("#back-season-menu-admin").addEventListener("click", () => {
  showScreen(seasonMenuScreen);
});

document.querySelector("#back-home").addEventListener("click", () => {
  showScreen(homeScreen);
  setMessage("");
});

document.querySelector("#back-home-scores").addEventListener("click", () => {
  showScreen(homeScreen);
  setResultsMessage("");
});

document.querySelector("#back-home-follow").addEventListener("click", () => {
  showScreen(homeScreen);
});

document.querySelector("#back-home-my-card").addEventListener("click", () => {
  showScreen(homeScreen);
});

document.querySelector("#back-home-current-game").addEventListener("click", () => {
  showScreen(homeScreen);
});

personalCardsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-personal-cartela-id]");

  if (!button) {
    return;
  }

  renderPersonalCardDetails(button.dataset.personalCartelaId);
});

knockoutPredictionContent.addEventListener("click", async (event) => {
  const playerButton = event.target.closest("button[data-knockout-player-key]");
  const authButton = event.target.closest("button[data-knockout-auth]");
  const saveButton = event.target.closest("button[data-knockout-save-match]");

  if (playerButton) {
    selectKnockoutPlayer(playerButton.dataset.knockoutPlayerKey);
    return;
  }

  if (authButton) {
    await authenticateKnockoutPlayer();
    return;
  }

  if (saveButton) {
    await saveKnockoutPrediction(saveButton.dataset.knockoutSaveMatch);
  }
});

knockoutAdminContent.addEventListener("click", async (event) => {
  const resetButton = event.target.closest("button[data-reset-knockout-password]");

  if (!resetButton) {
    return;
  }

  await resetKnockoutPassword(resetButton.dataset.resetKnockoutPassword);
});

document.querySelectorAll("[data-follow-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setFollowTab(button.dataset.followTab);
  });
});

document.querySelectorAll("[data-knockout-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setKnockoutTab(button.dataset.knockoutTab);
  });
});

cartelaSelect.addEventListener("change", () => {
  renderIndividualCartela(cartelaSelect.value);
});

generateRankingImageButton.addEventListener("click", async () => {
  try {
    await generateRankingImage();
  } catch (error) {
    showToast(error.message || "Não foi possível gerar a imagem do ranking.");
  }
});

syncResultsButton?.addEventListener("click", async () => {
  if (!(await requireAdminPassword())) {
    return;
  }

  await syncResultsNow();
});

newCardButton.addEventListener("click", () => {
  resetFormState();
  playerNameInput.focus();
});

savedCardsList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const cartelaId = button.dataset.cartelaId;

  if (button.dataset.action === "edit") {
    if (!(await requireAdminPassword())) {
      return;
    }

    editCartela(cartelaId);
    return;
  }

  if (button.dataset.action === "delete") {
    if (!(await requireAdminPassword())) {
      return;
    }

    await deleteCartela(cartelaId);
  }
});

document.querySelectorAll("[data-soon]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Essa parte fica para o próximo passo. Primeiro vamos deixar as cartelas redondinhas.");
  });
});

cartelaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(editingCartelaId ? "Atualizando cartela..." : "Salvando cartela...");

  const payload = {
    playerName: playerNameInput.value.trim(),
    predictions: collectPredictions()
  };

  const url = editingCartelaId ? `/api/cartelas/${encodeURIComponent(editingCartelaId)}` : "/api/cartelas";
  const method = editingCartelaId ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders()
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAdminPassword();
      }

      throw new Error(data.error || "Não foi possível salvar a cartela.");
    }

    const actionText = editingCartelaId ? "atualizada" : "salva";
    resetFormState();
    await loadCartelas();
    setMessage(`Cartela de ${data.cartela.playerName} ${actionText} com sucesso!`, "success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    setMessage(error.message, "error");
  }
});

resultsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setResultsMessage("Salvando placares...");

  try {
    const response = await fetch("/api/results", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAdminHeaders()
      },
      body: JSON.stringify({ results: collectResults() })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAdminPassword();
      }

      throw new Error(data.error || "Não foi possível salvar os placares.");
    }

    results = data.results;
    renderResultsByDay();
    setResultsMessage("Placares salvos com sucesso!", "success");
  } catch (error) {
    setResultsMessage(error.message, "error");
  }
});

async function loadMatches() {
  matchesContainer.innerHTML = '<div class="group-card"><div class="group-title"><h3>Carregando jogos...</h3></div></div>';
  resultsContainer.innerHTML = '<div class="day-card"><div class="day-title"><h3>Carregando jogos...</h3></div></div>';

  try {
    const response = await fetch("/api/matches");
    const data = await response.json();

    groups = data.groups;
    renderMatches(groups);
    renderResultsByDay();
  } catch (error) {
    matchesContainer.innerHTML = "";
    resultsContainer.innerHTML = "";
    setMessage("Não foi possível carregar os jogos.", "error");
    setResultsMessage("Não foi possível carregar os jogos.", "error");
  }
}

async function loadCartelas() {
  savedCardsList.innerHTML = '<p class="empty-state">Carregando cartelas...</p>';

  try {
    const response = await fetch("/api/cartelas");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível carregar as cartelas.");
    }

    cartelas = data.cartelas;
    renderCartelas(cartelas);
  } catch (error) {
    savedCardsList.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

async function loadResults() {
  resultsContainer.innerHTML = '<div class="day-card"><div class="day-title"><h3>Carregando placares...</h3></div></div>';

  try {
    const response = await fetch("/api/results");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível carregar os placares.");
    }

    results = data.results;
    scoreSyncStatus = data.sync || null;
    renderScoreSyncStatus();
    renderResultsByDay();
  } catch (error) {
    resultsContainer.innerHTML = "";
    setResultsMessage(error.message, "error");
  }
}

async function loadFollowData() {
  rankingSummary.innerHTML = '<p class="empty-state">Calculando ranking...</p>';
  rankingList.innerHTML = "";
  individualSummary.innerHTML = "";
  individualDetails.innerHTML = "";

  if (!groups.length) {
    await loadMatches();
  }

  await Promise.all([fetchCartelas(), fetchResults()]);
  renderFollowDashboard();
}

async function loadPersonalCardsData() {
  personalCardsGrid.innerHTML = '<p class="empty-state">Carregando cartelas...</p>';
  personalCardDetails.innerHTML = "";

  if (!groups.length) {
    await loadMatches();
  }

  try {
    await Promise.all([fetchCartelas(), fetchResults()]);
    personalEntries = calculateRanking(getScoredMatches());
    renderPersonalCardsGrid();

    if (personalEntries.length) {
      renderPersonalCardDetails(personalEntries[0].id);
    }
  } catch (error) {
    personalCardsGrid.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

async function loadCurrentGameData() {
  currentGameContent.innerHTML = '<p class="empty-state">Atualizando o placar mais recente...</p>';

  if (!groups.length) {
    await loadMatches();
  }

  try {
    await Promise.all([fetchCartelas(), fetchResults()]);
    renderCurrentGame();
  } catch (error) {
    currentGameContent.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

async function loadKnockoutState() {
  const response = await fetch("/api/knockout/state");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível carregar o mata-mata.");
  }

  knockoutPlayers = data.players || [];
  knockoutMatches = (data.matches || []).sort(compareKnockoutMatches);
  knockoutResults = data.results || {};
  knockoutPredictions = data.predictions || {};
}

async function loadSeasonMissingAlert() {
  if (!seasonMissingAlert) {
    return;
  }

  seasonMissingAlert.classList.remove("hidden");
  seasonMissingAlert.innerHTML = '<p>Conferindo palpites do próximo jogo...</p>';

  try {
    await loadKnockoutState();
    renderSeasonMissingAlert();
  } catch (error) {
    seasonMissingAlert.innerHTML = '<p>Não consegui conferir os palpites agora.</p>';
  }
}

function renderSeasonMissingAlert() {
  if (!seasonMissingAlert) {
    return;
  }

  const nextMatch = getNextKnockoutCalendarMatch();

  if (!nextMatch) {
    seasonMissingAlert.innerHTML = '<p>Nenhum próximo jogo encontrado no calendário do mata-mata.</p>';
    return;
  }

  const missingPlayers = getPlayersMissingPredictionForMatch(nextMatch);
  const missingText = missingPlayers.length
    ? `${formatNameList(missingPlayers)} ${missingPlayers.length === 1 ? "não palpitou" : "não palpitaram"} para o próximo jogo.`
    : "Todo mundo já palpitou para o próximo jogo.";

  seasonMissingAlert.innerHTML = `
    <div>
      <span class="season-alert-label">Próximo jogo</span>
      <strong>${formatTeamNameImage(nextMatch.home)} <span>x</span> ${formatTeamNameImage(nextMatch.away)}</strong>
      <small>${formatKnockoutDate(nextMatch)} • ${formatKnockoutTime(nextMatch)}</small>
    </div>
    <p>${escapeHtml(missingText)}</p>
  `;
}

function getNextKnockoutCalendarMatch() {
  const now = Date.now();

  return knockoutMatches
    .filter((match) => {
      const kickoff = Date.parse(match.date || "");
      return Number.isFinite(kickoff) && kickoff >= now;
    })
    .sort(compareKnockoutMatches)[0] || null;
}

function getPlayersMissingPredictionForMatch(match) {
  return knockoutPlayers
    .filter((player) => !hasCompleteKnockoutPrediction(knockoutPredictions[player.playerKey]?.predictions?.[match.id]))
    .map((player) => player.playerName);
}

function hasCompleteKnockoutPrediction(prediction) {
  return hasKnockoutScorePrediction(prediction) && ["home", "away"].includes(prediction?.advanceSide);
}

function formatNameList(names) {
  if (names.length <= 3) {
    return names.join(", ");
  }

  return `${names.slice(0, 3).join(", ")} e mais ${names.length - 3}`;
}

async function loadKnockoutFollowData() {
  knockoutCurrentContent.innerHTML = '<p class="empty-state">Atualizando mata-mata...</p>';
  knockoutRankingSummary.innerHTML = "";
  knockoutRankingList.innerHTML = "";

  try {
    await loadKnockoutState();
    renderSeasonMissingAlert();
    renderKnockoutFollowDashboard();
  } catch (error) {
    knockoutCurrentContent.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

async function loadKnockoutPredictionData() {
  knockoutPredictionContent.innerHTML = '<p class="empty-state">Carregando participantes e jogos do mata-mata...</p>';

  try {
    await loadKnockoutState();
    renderSeasonMissingAlert();
    renderKnockoutPredictionScreen();
  } catch (error) {
    knockoutPredictionContent.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

async function loadKnockoutAdminData() {
  knockoutAdminContent.innerHTML = '<p class="empty-state">Carregando status das senhas...</p>';

  try {
    const response = await fetch("/api/knockout/admin/passwords", {
      headers: getAdminHeaders()
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAdminPassword();
      }

      throw new Error(data.error || "Não foi possível carregar o admin.");
    }

    renderKnockoutAdminPasswords(data.players || []);
  } catch (error) {
    knockoutAdminContent.innerHTML = `<p class="empty-state">${escapeHtml(error.message)}</p>`;
  }
}

function renderKnockoutAdminPasswords(players) {
  const createdCount = players.filter((player) => player.hasPassword).length;

  knockoutAdminContent.innerHTML = `
    <div class="ranking-summary">
      <article class="summary-card">
        <span>🔐 Senhas criadas</span>
        <strong>${createdCount}</strong>
      </article>
      <article class="summary-card">
        <span>📝 Pendentes</span>
        <strong>${players.length - createdCount}</strong>
      </article>
    </div>

    <p class="admin-note">
      As senhas não aparecem em texto puro porque são salvas protegidas por hash. Se alguém esquecer, o caminho seguro é redefinir a senha.
    </p>

    <div class="admin-password-list">
      ${players.map((player) => `
        <article class="admin-password-card ${player.hasPassword ? "ready" : "pending"}">
          ${renderChibiAvatar(player.playerName, "admin-password-chibi")}
          <div>
            <strong>${escapeHtml(player.playerName)}</strong>
            <span>${player.hasPassword ? "Senha criada" : "Ainda sem senha"}</span>
            <small>${escapeHtml(player.password || "Aguardando primeiro acesso")}</small>
            <button
              class="ghost-button admin-reset-button"
              type="button"
              data-reset-knockout-password="${escapeHtml(player.playerKey)}"
              ${player.hasPassword ? "" : "disabled"}
            >
              Redefinir senha
            </button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

async function resetKnockoutPassword(playerKey) {
  const resetButton = knockoutAdminContent.querySelector(`[data-reset-knockout-password="${CSS.escape(playerKey)}"]`);
  const playerCard = resetButton?.closest(".admin-password-card");
  const playerName = playerCard?.querySelector("strong")?.textContent || "participante";
  const confirmed = window.confirm(`Deixar ${playerName} sem senha para criar uma nova no próximo acesso?`);

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`/api/knockout/admin/passwords/${encodeURIComponent(playerKey)}`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAdminPassword();
      }

      throw new Error(data.error || "Não foi possível redefinir a senha.");
    }

    showToast(`Senha de ${data.player.playerName} redefinida.`);
    await loadKnockoutAdminData();
  } catch (error) {
    showToast(error.message);
  }
}

function renderKnockoutFollowDashboard() {
  knockoutRankingEntries = calculateKnockoutRankingWithMovement();
  renderKnockoutCurrentGame();
  renderKnockoutRanking();
}

function renderKnockoutCurrentGame() {
  const currentBlock = getCurrentKnockoutDisplayBlock();
  const currentMatches = currentBlock.matches;

  if (!currentMatches.length) {
    knockoutCurrentContent.innerHTML = '<p class="empty-state">Ainda não há jogo com palpites encerrados no mata-mata.</p>';
    return;
  }

  const participants = knockoutRankingEntries.map((entry) => {
    const currentDetails = currentMatches
      .map((match) => getKnockoutCurrentDetail(entry, match))
      .filter(Boolean);

    return {
      ...entry,
      currentDetails,
      currentDetail: currentDetails[0]
    };
  });
  const chibiContext = createChibiContext(participants, currentMatches);
  const statusLabel = currentBlock.hasResult ? "Bloco atualizado" : "Palpites encerrados";
  const statusTime = currentBlock.hasResult
    ? `Atualizado em ${escapeHtml(formatDate(currentBlock.updatedAt))}`
    : `Palpites encerrados em ${escapeHtml(formatDate(currentBlock.lockedAt))}`;
  const blockLabel = currentMatches.length > 1
    ? `${formatKnockoutDate(currentMatches[0])} • ${formatKnockoutTime(currentMatches[0])} • ${currentMatches.length} jogos simultâneos`
    : `${formatKnockoutDate(currentMatches[0])} • ${formatKnockoutTime(currentMatches[0])} • Mata-mata`;

  knockoutCurrentContent.innerHTML = `
    <section class="current-match-hero">
      <div class="current-match-meta">
        <span class="live-pill">${statusLabel}</span>
        <span>${blockLabel}</span>
      </div>
      <div class="current-match-scoreboards">
        ${currentMatches.map((match) => renderKnockoutMatchScoreboard(match)).join("")}
      </div>
      <small>${statusTime}</small>
    </section>

    <section class="current-participants-section">
      <div class="current-participants-title">
        <div>
          <p class="eyebrow">Impacto no mata-mata</p>
          <h3>Palpites e pontuação</h3>
        </div>
        <span>${participants.length} cartelas</span>
      </div>
      <div class="current-participants-list">
        ${participants.map((entry) => renderCurrentParticipant(entry, chibiContext)).join("")}
      </div>
    </section>
  `;
}

function renderKnockoutMatchScoreboard(match) {
  const result = knockoutResults[match.id];
  const hasResult = hasKnockoutResult(match);

  return `
    <article class="current-match-scoreboard">
      <div class="current-match-team current-match-flag-team home">${formatTeamFlagOnly(match.home)}</div>
      <div class="current-match-score ${hasResult ? "" : "pending"}">
        <strong>${hasResult ? result.homeScore : "—"}</strong>
        <span>x</span>
        <strong>${hasResult ? result.awayScore : "—"}</strong>
      </div>
      <div class="current-match-team current-match-flag-team away">${formatTeamFlagOnly(match.away)}</div>
      <small>${formatKnockoutDate(match)} • ${formatKnockoutTime(match)} • ${hasResult ? getKnockoutResultLabel(match) : "Aguardando placar"}</small>
    </article>
  `;
}

function getKnockoutResultLabel(match) {
  const result = knockoutResults[match.id];

  if (!result || !isKnockoutDecidedOnPenalties(match, result)) {
    return "Mata-mata";
  }

  const winnerName = escapeHtml(match.winnerSide === "home" ? match.home : match.away);
  return `Passou ${winnerName} nos pênaltis (${match.homeShootoutScore}x${match.awayShootoutScore})`;
}

function renderKnockoutRanking() {
  knockoutRankingSummary.innerHTML = `
    <article class="summary-card">
      <span>🏆 Jogos com resultado</span>
      <strong>${getScoredKnockoutMatches().length}</strong>
    </article>
    <article class="summary-card">
      <span>🎟️ Cartelas no mata-mata</span>
      <strong>${knockoutPlayers.length}</strong>
    </article>
  `;

  if (!knockoutRankingEntries.length) {
    knockoutRankingList.innerHTML = '<p class="empty-state">Ainda não há participantes no mata-mata.</p>';
    return;
  }

  const chibiContext = createChibiContext(knockoutRankingEntries, getLatestKnockoutUpdatedBlock().matches);

  knockoutRankingList.innerHTML = knockoutRankingEntries.map((entry, index) => {
    const rankBadge = getRankBadge(entry, index, knockoutRankingEntries.length);
    const accuracy = entry.played ? Math.round((entry.counts.complete / entry.played) * 100) : 0;

    return `
      <article class="ranking-card ${index < 3 ? "podium" : ""}">
        <div class="ranking-rank-area">
          <div class="rank-position-stack">
            <div class="rank-position">${rankBadge}</div>
            ${renderRankMovement(entry.movement)}
          </div>
          ${renderChibiAvatar(entry.playerName, "ranking-chibi", entry, chibiContext)}
        </div>
        <div class="ranking-player">
          <strong>${escapeHtml(entry.playerName)}</strong>
          <span>${entry.played} jogos pontuados • ${accuracy}% de placares exatos</span>
        </div>
        <div class="ranking-stats">
          <span title="Acertos completos">🎯 ${entry.counts.complete}</span>
          <span title="Acertos intermediários">✨ ${entry.counts.intermediate}</span>
          <span title="Acertos básicos">✅ ${entry.counts.basic}</span>
          <span title="Acertos invertidos">🔄 ${entry.counts.inverted}</span>
        </div>
        <div class="ranking-points">${entry.total}<small>pts</small></div>
      </article>
    `;
  }).join("");
}

function renderKnockoutPredictionScreen() {
  knockoutPredictionContent.innerHTML = `
    <section class="knockout-player-picker">
      <div class="current-participants-title">
        <div>
          <p class="eyebrow">Participante</p>
          <h3>Escolha seu chibi</h3>
        </div>
      </div>
      <div class="personal-cards-grid">
        ${knockoutPlayers.map((player) => `
          <button class="personal-card-button ${selectedKnockoutPlayer?.playerKey === player.playerKey ? "active" : ""}" type="button" data-knockout-player-key="${player.playerKey}">
            ${renderChibiAvatar(player.playerName, "personal-card-chibi")}
            <strong>${escapeHtml(player.playerName)}</strong>
            <small>${player.hasPassword ? "Senha criada" : "Primeiro acesso"}</small>
          </button>
        `).join("")}
      </div>
    </section>

    <section id="knockout-prediction-editor" class="knockout-prediction-editor">
      ${renderKnockoutSelectedPanel()}
    </section>
  `;
}

function renderKnockoutSelectedPanel() {
  if (activeKnockoutPlayer) {
    return renderKnockoutPredictionEditor();
  }

  if (selectedKnockoutPlayer) {
    return renderKnockoutPasswordPanel(selectedKnockoutPlayer);
  }

  return '<p class="empty-state">Escolha seu chibi para criar/abrir sua cartela do mata-mata.</p>';
}

function renderKnockoutPasswordPanel(player) {
  return `
    <section class="knockout-password-card">
      <div class="personal-hero-player">
        ${renderChibiAvatar(player.playerName, "personal-hero-chibi")}
        <div>
          <p class="eyebrow">${player.hasPassword ? "Abrir cartela" : "Primeiro acesso"}</p>
          <h3>${escapeHtml(player.playerName)}</h3>
          <p>${player.hasPassword ? "Digite sua senha para alterar os palpites." : "Crie uma senha para proteger seus palpites."}</p>
        </div>
      </div>
      <label class="player-field knockout-password-field">
        <span>Senha da cartela</span>
        <input id="knockout-password-input" type="password" autocomplete="current-password" minlength="3" />
      </label>
      <button class="save-button" type="button" data-knockout-auth>
        ${player.hasPassword ? "Abrir cartela" : "Criar senha e abrir"}
      </button>
    </section>
  `;
}

function renderKnockoutPredictionEditor() {
  if (!knockoutMatches.length) {
    return '<p class="empty-state">Ainda não encontrei jogos definidos do mata-mata na ESPN.</p>';
  }

  const savedPredictions = knockoutPredictions[activeKnockoutPlayer.playerKey]?.predictions || {};

  return `
    <div class="section-header compact-section-header">
      <div>
        <p class="eyebrow">Cartela aberta</p>
        <h3>${escapeHtml(activeKnockoutPlayer.playerName)}</h3>
        <p>Palpites liberados até 10 minutos antes de cada jogo.</p>
      </div>
    </div>

    <div class="knockout-match-list">
      ${knockoutMatches.map((match) => renderKnockoutPredictionMatch(match, savedPredictions[match.id])).join("")}
    </div>
  `;
}

function renderKnockoutPredictionMatch(match, prediction) {
  const lockInfo = match.lock || getKnockoutLockInfo(match);
  const hasPrediction = Number.isInteger(prediction?.homeScore) && Number.isInteger(prediction?.awayScore);
  const selectedAdvanceSide = prediction?.advanceSide || "";

  return `
    <article class="upcoming-prediction-card knockout-prediction-match ${lockInfo.locked ? "locked" : ""}" data-knockout-match-row="${match.id}">
      <div class="upcoming-match-meta">
        <strong>${formatKnockoutDate(match)}</strong>
        <span>${formatKnockoutTime(match)} • Mata-mata</span>
      </div>
      <div class="upcoming-match-teams">
        <span>${formatTeamNameImage(match.home)}</span>
        <strong>x</strong>
        <span>${formatTeamNameImage(match.away)}</span>
      </div>
      <div class="score-box knockout-score-box">
        <input class="score-input knockout-score-input" type="number" inputmode="numeric" min="0" max="99" data-knockout-match-id="${match.id}" data-side="homeScore" value="${hasPrediction ? prediction.homeScore : ""}" ${lockInfo.locked ? "disabled" : ""} />
        <span>x</span>
        <input class="score-input knockout-score-input" type="number" inputmode="numeric" min="0" max="99" data-knockout-match-id="${match.id}" data-side="awayScore" value="${hasPrediction ? prediction.awayScore : ""}" ${lockInfo.locked ? "disabled" : ""} />
      </div>
      <div class="knockout-advance-picker">
        <span>Se der pênalti, quem passa?</span>
        <label>
          <input type="radio" name="advance-${escapeHtml(match.id)}" value="home" data-side="advanceSide" ${selectedAdvanceSide === "home" ? "checked" : ""} ${lockInfo.locked ? "disabled" : ""} />
          ${formatTeamFlagTiny(match.home)}
          <strong>${escapeHtml(match.home)}</strong>
        </label>
        <label>
          <input type="radio" name="advance-${escapeHtml(match.id)}" value="away" data-side="advanceSide" ${selectedAdvanceSide === "away" ? "checked" : ""} ${lockInfo.locked ? "disabled" : ""} />
          ${formatTeamFlagTiny(match.away)}
          <strong>${escapeHtml(match.away)}</strong>
        </label>
      </div>
      <button class="save-button knockout-save-button" type="button" data-knockout-save-match="${match.id}" ${lockInfo.locked ? "disabled" : ""}>
        ${hasPrediction ? "Modificar palpite" : "Confirmar palpite"}
      </button>
      <small class="knockout-deadline">${lockInfo.locked ? "Palpite encerrado" : `Liberado até ${formatDate(lockInfo.deadline)}`}</small>
    </article>
  `;
}

function selectKnockoutPlayer(playerKey) {
  const player = knockoutPlayers.find((candidate) => candidate.playerKey === playerKey);

  if (!player) {
    showToast("Participante não encontrado.");
    return;
  }

  selectedKnockoutPlayer = player;
  activeKnockoutPlayer = null;
  activeKnockoutPassword = "";
  renderKnockoutPredictionScreen();
  document.querySelector("#knockout-password-input")?.focus();
}

async function authenticateKnockoutPlayer() {
  if (!selectedKnockoutPlayer) {
    return;
  }

  const password = document.querySelector("#knockout-password-input")?.value || "";

  if (password.length < 3) {
    showToast("Informe uma senha com pelo menos 3 caracteres.");
    return;
  }

  const passwordField = selectedKnockoutPlayer.hasPassword ? "password" : "newPassword";

  try {
    const response = await fetch("/api/knockout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: selectedKnockoutPlayer.playerName,
        [passwordField]: password
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível abrir a cartela.");
    }

    activeKnockoutPlayer = data.player;
    activeKnockoutPassword = password;
    knockoutPredictions[activeKnockoutPlayer.playerKey] = {
      predictions: data.predictions || {},
      updatedAt: new Date().toISOString()
    };
    knockoutPlayers = knockoutPlayers.map((savedPlayer) => (
      savedPlayer.playerKey === activeKnockoutPlayer.playerKey
        ? { ...savedPlayer, hasPassword: true }
        : savedPlayer
    ));
    selectedKnockoutPlayer = {
      ...activeKnockoutPlayer,
      hasPassword: true
    };
    renderKnockoutPredictionScreen();
  } catch (error) {
    showToast(error.message);
  }
}

async function saveKnockoutPrediction(matchId) {
  if (!activeKnockoutPlayer) {
    showToast("Escolha seu chibi primeiro.");
    return;
  }

  const row = knockoutPredictionContent.querySelector(`[data-knockout-match-row="${CSS.escape(matchId)}"]`);
  const homeInput = row?.querySelector('[data-side="homeScore"]');
  const awayInput = row?.querySelector('[data-side="awayScore"]');
  const advanceInput = row?.querySelector('[data-side="advanceSide"]:checked');
  const homeScore = Number(homeInput?.value);
  const awayScore = Number(awayInput?.value);
  const advanceSide = advanceInput?.value || "";

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
    showToast("Preencha um placar válido.");
    return;
  }

  if (!["home", "away"].includes(advanceSide)) {
    showToast("Escolha quem passa se o jogo for para os pênaltis.");
    return;
  }

  try {
    const response = await fetch("/api/knockout/predictions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerName: activeKnockoutPlayer.playerName,
        password: activeKnockoutPassword,
        predictions: {
          [matchId]: { homeScore, awayScore, advanceSide }
        }
      })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível salvar o palpite.");
    }

    knockoutPredictions[activeKnockoutPlayer.playerKey] = {
      predictions: data.predictions || {},
      updatedAt: new Date().toISOString()
    };
    renderSeasonMissingAlert();
    renderKnockoutPredictionScreen();
    showToast("Palpite salvo com sucesso.");
  } catch (error) {
    showToast(error.message);
  }
}

function calculateKnockoutRanking(scoredMatches = getScoredKnockoutMatches()) {
  const entries = knockoutPlayers.map((player) => scoreKnockoutPlayer(player, scoredMatches));
  entries.sort(compareRankingEntries);

  return entries.map((entry, index, sortedEntries) => ({
    ...entry,
    rank: getCompetitionRank(sortedEntries, index)
  }));
}

function calculateKnockoutRankingWithMovement(scoredMatches = getScoredKnockoutMatches()) {
  const currentRanking = calculateKnockoutRanking(scoredMatches);
  const latestBlock = getLatestKnockoutUpdatedBlock(scoredMatches);

  if (!latestBlock.matches.length || scoredMatches.length <= latestBlock.matches.length) {
    return currentRanking.map((entry) => ({ ...entry, movement: 0 }));
  }

  const latestBlockIds = new Set(latestBlock.matches.map((match) => match.id));
  const previousRanking = calculateKnockoutRanking(
    scoredMatches.filter((match) => !latestBlockIds.has(match.id))
  );
  const previousRanks = new Map(previousRanking.map((entry) => [entry.id, entry.rank]));

  return currentRanking.map((entry) => ({
    ...entry,
    movement: (previousRanks.get(entry.id) || entry.rank) - entry.rank
  }));
}

function scoreKnockoutPlayer(player, scoredMatches) {
  const playerPredictionData = knockoutPredictions[player.playerKey]?.predictions || {};
  const details = scoredMatches.map((match) => {
    const prediction = playerPredictionData[match.id] || null;
    const result = knockoutResults[match.id];

    if (!hasKnockoutScorePrediction(prediction)) {
      return {
        match,
        prediction: null,
        result,
        type: "missing",
        basePoints: 0,
        advancePoints: 0,
        points: 0,
        missing: true
      };
    }

    const score = scorePrediction(prediction, result);
    const advancePoints = scoreAdvancePrediction(prediction, match, result);

    return {
      match,
      prediction,
      result,
      ...score,
      basePoints: score.points,
      advancePoints,
      points: score.points + advancePoints
    };
  });

  return {
    id: player.playerKey,
    playerName: player.playerName,
    played: details.length,
    total: details.reduce((sum, detail) => sum + detail.points, 0),
    counts: {
      complete: details.filter((detail) => detail.type === "complete").length,
      intermediate: details.filter((detail) => detail.type === "intermediate").length,
      basic: details.filter((detail) => detail.type === "basic").length,
      inverted: details.filter((detail) => detail.type === "inverted").length,
      missing: details.filter((detail) => detail.type === "missing").length,
      none: details.filter((detail) => detail.type === "none").length
    },
    details
  };
}

function scoreAdvancePrediction(prediction, match, result) {
  if (!isKnockoutDecidedOnPenalties(match, result)) {
    return 0;
  }

  return prediction?.advanceSide === match.winnerSide ? 3 : 0;
}

function isKnockoutDecidedOnPenalties(match, result) {
  return (
    getOutcome(Number(result.homeScore), Number(result.awayScore)) === "draw" &&
    ["home", "away"].includes(match.winnerSide) &&
    Number.isInteger(match.homeShootoutScore) &&
    Number.isInteger(match.awayShootoutScore)
  );
}

function hasKnockoutScorePrediction(prediction) {
  const hasHomeScore = prediction?.homeScore !== "" && prediction?.homeScore !== null && prediction?.homeScore !== undefined;
  const hasAwayScore = prediction?.awayScore !== "" && prediction?.awayScore !== null && prediction?.awayScore !== undefined;

  return hasHomeScore && hasAwayScore && Number.isInteger(Number(prediction.homeScore)) && Number.isInteger(Number(prediction.awayScore));
}

function getScoredKnockoutMatches() {
  return knockoutMatches.filter((match) => hasKnockoutResult(match));
}

function hasKnockoutResult(match) {
  const result = knockoutResults[match.id];
  return Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore);
}

function getLatestKnockoutUpdatedBlock(scoredMatches = getScoredKnockoutMatches()) {
  const latestMatch = scoredMatches.reduce((currentLatestMatch, match) => {
    if (!currentLatestMatch) {
      return match;
    }

    const currentUpdatedAt = Date.parse(knockoutResults[match.id]?.updatedAt || "") || 0;
    const latestUpdatedAt = Date.parse(knockoutResults[currentLatestMatch.id]?.updatedAt || "") || 0;

    return currentUpdatedAt >= latestUpdatedAt ? match : currentLatestMatch;
  }, null);

  if (!latestMatch) {
    return { latestMatch: null, matches: [], updatedAt: null };
  }

  const latestBlockKey = getKnockoutBlockKey(latestMatch);
  const matches = scoredMatches.filter((match) => getKnockoutBlockKey(match) === latestBlockKey);
  const updatedAt = matches.reduce((latestUpdatedAt, match) => {
    const matchUpdatedAt = Date.parse(knockoutResults[match.id]?.updatedAt || "") || 0;

    return matchUpdatedAt > latestUpdatedAt ? matchUpdatedAt : latestUpdatedAt;
  }, 0);

  return {
    latestMatch,
    matches,
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : knockoutResults[latestMatch.id]?.updatedAt || null
  };
}

function getCurrentKnockoutDisplayBlock() {
  const lockedBlock = getLatestKnockoutLockedBlock();

  if (lockedBlock.matches.length) {
    return lockedBlock;
  }

  const updatedBlock = getLatestKnockoutUpdatedBlock();

  return {
    ...updatedBlock,
    hasResult: Boolean(updatedBlock.matches.length),
    lockedAt: null
  };
}

function getLatestKnockoutLockedBlock() {
  const lockedMatches = knockoutMatches.filter((match) => getKnockoutLockInfo(match).locked);
  const latestMatch = lockedMatches.reduce((currentLatestMatch, match) => {
    if (!currentLatestMatch) {
      return match;
    }

    return Date.parse(match.date || "") >= Date.parse(currentLatestMatch.date || "") ? match : currentLatestMatch;
  }, null);

  if (!latestMatch) {
    return { latestMatch: null, matches: [], updatedAt: null, lockedAt: null, hasResult: false };
  }

  const latestBlockKey = getKnockoutBlockKey(latestMatch);
  const matches = knockoutMatches.filter((match) => getKnockoutBlockKey(match) === latestBlockKey);
  const updatedAt = matches.reduce((latestUpdatedAt, match) => {
    const matchUpdatedAt = Date.parse(knockoutResults[match.id]?.updatedAt || "") || 0;

    return matchUpdatedAt > latestUpdatedAt ? matchUpdatedAt : latestUpdatedAt;
  }, 0);
  const lockedAt = matches.reduce((latestDeadline, match) => {
    const deadline = Date.parse(getKnockoutLockInfo(match).deadline || "") || 0;

    return deadline > latestDeadline ? deadline : latestDeadline;
  }, 0);

  return {
    latestMatch,
    matches,
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : null,
    lockedAt: lockedAt ? new Date(lockedAt).toISOString() : null,
    hasResult: matches.some((match) => hasKnockoutResult(match))
  };
}

function getKnockoutCurrentDetail(entry, match) {
  const savedDetail = entry.details?.find((detail) => detail.match.id === match.id);

  if (savedDetail) {
    return savedDetail;
  }

  const prediction = knockoutPredictions[entry.id]?.predictions?.[match.id] || null;

  if (!hasKnockoutScorePrediction(prediction)) {
    return {
      match,
      prediction: null,
      result: null,
      type: "missing",
      points: 0,
      pending: false,
      missing: true
    };
  }

  return {
    match,
    prediction,
    result: hasKnockoutResult(match) ? knockoutResults[match.id] : null,
    type: "pending",
    points: 0,
    pending: true
  };
}

function getKnockoutBlockKey(match) {
  const date = new Date(match.date);

  if (Number.isNaN(date.getTime())) {
    return `${match.date || ""}|${match.id}`;
  }

  return date.toISOString().slice(0, 16);
}

function compareKnockoutMatches(firstMatch, secondMatch) {
  return Date.parse(firstMatch.date || "") - Date.parse(secondMatch.date || "");
}

function getKnockoutLockInfo(match) {
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

function formatKnockoutDate(match) {
  const date = new Date(match.date || "");

  if (Number.isNaN(date.getTime())) {
    return "Data a definir";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long"
  }).format(date);
}

function formatKnockoutTime(match) {
  const date = new Date(match.date || "");

  if (Number.isNaN(date.getTime())) {
    return "Horário a definir";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function renderCurrentGame() {
  const currentBlock = getLatestUpdatedMatchBlock();
  const currentMatches = currentBlock.matches;

  if (!currentMatches.length) {
    currentGameContent.innerHTML = '<p class="empty-state">Ainda não há nenhum placar oficial atualizado.</p>';
    return;
  }

  const ranking = calculateRankingWithMovement(getScoredMatches());
  const participants = ranking.map((entry) => {
    const currentDetails = currentMatches
      .map((match) => entry.details.find((scoreDetail) => scoreDetail.match.id === match.id))
      .filter(Boolean);

    return {
      ...entry,
      currentDetails,
      currentDetail: currentDetails[0]
    };
  });
  const chibiContext = createChibiContext(participants);
  const updatedAt = currentBlock.updatedAt ? formatDate(currentBlock.updatedAt) : "Horário não informado";
  const blockLabel = currentMatches.length > 1
    ? `${currentMatches[0].dateLabel} • ${currentMatches[0].time} • ${currentMatches.length} jogos simultâneos`
    : `${currentMatches[0].dateLabel} • ${currentMatches[0].time} • Grupo ${currentMatches[0].group}`;

  currentGameContent.innerHTML = `
    <section class="current-match-hero">
      <div class="current-match-meta">
        <span class="live-pill">⚽ Último bloco atualizado</span>
        <span>${blockLabel}</span>
      </div>
      <div class="current-match-scoreboards">
        ${currentMatches.map((match) => renderCurrentMatchScoreboard(match)).join("")}
      </div>
      <small>Atualizado em ${escapeHtml(updatedAt)}</small>
    </section>

    <section class="current-participants-section">
      <div class="current-participants-title">
        <div>
          <p class="eyebrow">Impacto no bolão</p>
          <h3>Palpites e pontuação</h3>
        </div>
        <span>${participants.length} cartelas</span>
      </div>
      <div class="current-participants-list">
        ${participants.map((entry) => renderCurrentParticipant(entry, chibiContext)).join("")}
      </div>
    </section>
  `;
}

function renderCurrentMatchScoreboard(match) {
  const result = results[match.id];

  return `
    <article class="current-match-scoreboard">
      <div class="current-match-team current-match-flag-team home">${formatTeamFlagOnly(match.home)}</div>
      <div class="current-match-score">
        <strong>${result.homeScore}</strong>
        <span>x</span>
        <strong>${result.awayScore}</strong>
      </div>
      <div class="current-match-team current-match-flag-team away">${formatTeamFlagOnly(match.away)}</div>
      <small>${match.dateLabel} • ${match.time} • Grupo ${match.group}</small>
    </article>
  `;
}

function renderCurrentParticipant(entry, chibiContext) {
  const details = entry.currentDetails?.length ? entry.currentDetails : [entry.currentDetail].filter(Boolean);
  const points = details.reduce((sum, detail) => sum + detail.points, 0);
  const type = getCurrentBlockScoreType(details);

  return `
    <article class="current-participant-card ${type}">
      <div class="current-participant-player">
        <div class="current-rank-stack">
          <span class="current-rank">${entry.rank}º</span>
          ${renderRankMovement(entry.movement)}
        </div>
        ${renderChibiAvatar(entry.playerName, "current-game-chibi", entry, chibiContext)}
        <div>
          <strong>${escapeHtml(entry.playerName)}</strong>
          <span>${getCurrentBlockScoreLabel(details, type)}</span>
        </div>
      </div>
      <div class="current-prediction">
        <span>${details.length > 1 ? "Palpites" : "Palpite"}</span>
        <strong>${formatCurrentBlockPredictions(details)}</strong>
      </div>
      <div class="current-game-points ${points < 0 ? "negative" : ""}">
        <span>${details.length > 1 ? "Neste bloco" : "Neste jogo"}</span>
        <strong>${points > 0 ? "+" : ""}${points} pts</strong>
      </div>
      <div class="current-total-points">
        <span>Total agora</span>
        <strong>${entry.total} pts</strong>
      </div>
    </article>
  `;
}

function getCurrentBlockScoreType(details) {
  if (!details.length) {
    return "none";
  }

  if (details.every((detail) => ["pending", "missing"].includes(detail.type))) {
    return details.some((detail) => detail.type === "missing") ? "missing" : "pending";
  }

  if (details.every((detail) => detail.type === "pending")) {
    return "pending";
  }

  if (details.every((detail) => detail.type === "missing")) {
    return "missing";
  }

  if (details.some((detail) => detail.type === "inverted")) {
    return "inverted";
  }

  if (details.some((detail) => detail.type === "complete")) {
    return "complete";
  }

  if (details.every((detail) => detail.type === "none")) {
    return "none";
  }

  if (details.some((detail) => detail.type === "intermediate")) {
    return "intermediate";
  }

  return "basic";
}

function getCurrentBlockScoreLabel(details, type) {
  if (details.length <= 1) {
    const bonus = details[0]?.advancePoints || 0;
    return bonus ? `${SCORE_LABELS[type]} + bônus` : SCORE_LABELS[type];
  }

  const bonus = details.reduce((sum, detail) => sum + (detail.advancePoints || 0), 0);
  return bonus ? `${details.length} jogos no bloco • +${bonus} bônus` : `${details.length} jogos no bloco`;
}

function formatCurrentBlockPredictions(details) {
  if (!details.length) {
    return "Sem palpite";
  }

  return `
    <span class="current-block-predictions">
      ${details.map((detail) => `
        <span class="current-prediction-match">
          <span class="current-prediction-score-line">
            ${formatTeamFlagTiny(detail.match.home)}
            <span>${formatPrediction(detail.prediction)}</span>
            ${formatTeamFlagTiny(detail.match.away)}
          </span>
          ${formatAdvancePrediction(detail.prediction, detail.match)}
        </span>
      `).join("")}
    </span>
  `;
}

function formatAdvancePrediction(prediction, match) {
  if (!["home", "away"].includes(prediction?.advanceSide)) {
    return "";
  }

  const teamName = prediction.advanceSide === "home" ? match.home : match.away;
  return `<small class="current-penalty-pick">Pênaltis: ${formatTeamFlagTiny(teamName)}</small>`;
}

async function fetchCartelas() {
  const response = await fetch("/api/cartelas");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível carregar as cartelas.");
  }

  cartelas = data.cartelas;
}

async function fetchResults() {
  const response = await fetch("/api/results");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Não foi possível carregar os resultados.");
  }

  results = data.results;
  scoreSyncStatus = data.sync || null;
  renderScoreSyncStatus();
}

async function syncResultsNow() {
  setResultsMessage("Sincronizando placares automáticos...");
  syncResultsButton.disabled = true;
  syncResultsButton.textContent = "Sincronizando...";

  try {
    const response = await fetch("/api/results/sync", {
      method: "POST",
      headers: getAdminHeaders()
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAdminPassword();
      }

      throw new Error(data.error || "Não foi possível sincronizar os placares.");
    }

    results = data.results;
    scoreSyncStatus = data.sync || null;
    renderScoreSyncStatus();
    renderResultsByDay();
    setResultsMessage("Sincronização concluída!", "success");
  } catch (error) {
    setResultsMessage(error.message, "error");
  } finally {
    syncResultsButton.disabled = false;
    syncResultsButton.textContent = "Sincronizar agora";
  }
}

function renderMatches(groupList) {
  matchesContainer.innerHTML = groupList.map(renderGroup).join("");
}

function renderGroup(groupData) {
  return `
    <article class="group-card">
      <header class="group-title">
        <h3>Grupo ${groupData.group}</h3>
        <span>${groupData.matches.length} jogos</span>
      </header>
      ${groupData.matches.map(renderMatch).join("")}
    </article>
  `;
}

function renderMatch(match) {
  return `
    <div class="match-row">
      <div class="match-meta">
        <strong>${match.time}</strong><br />
        ${match.dateLabel}<br />
        ${match.dayName}
      </div>
      <div class="team-name home-team">${formatTeamNameImage(match.home)}</div>
      <div class="score-box">
        <input class="score-input" type="number" inputmode="numeric" min="0" max="99" required aria-label="Gols de ${match.home}" data-match-id="${match.id}" data-side="homeScore" />
        <span class="versus">x</span>
        <input class="score-input" type="number" inputmode="numeric" min="0" max="99" required aria-label="Gols de ${match.away}" data-match-id="${match.id}" data-side="awayScore" />
      </div>
      <div class="team-name">${formatTeamNameImage(match.away)}</div>
    </div>
  `;
}

function renderResultsByDay() {
  const matchesByDay = groupMatchesByDay(getChronologicalMatches());

  if (!matchesByDay.length) {
    resultsContainer.innerHTML = '<p class="empty-state">Nenhum jogo encontrado.</p>';
    return;
  }

  resultsContainer.innerHTML = matchesByDay.map(renderDay).join("");
}

function renderDay(day) {
  return `
    <article class="day-card">
      <header class="day-title">
        <h3>${day.dateLabel} (${day.dayName})</h3>
        <span>${day.matches.length} jogos</span>
      </header>
      ${day.matches.map(renderResultMatch).join("")}
    </article>
  `;
}

function renderResultMatch(match) {
  const result = results[match.id];
  const hasResult = Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore);

  return `
    <div class="result-row">
      <div class="match-meta">
        <strong>${match.time}</strong><br />
        Grupo ${match.group}
      </div>
      <div class="team-name home-team">${formatTeamNameImage(match.home)}</div>
      <div class="score-box">
        <input class="score-input result-input" type="number" inputmode="numeric" min="0" max="99" aria-label="Gols de ${match.home}" data-match-id="${match.id}" data-side="homeScore" value="${hasResult ? result.homeScore : ""}" />
        <span class="versus">x</span>
        <input class="score-input result-input" type="number" inputmode="numeric" min="0" max="99" aria-label="Gols de ${match.away}" data-match-id="${match.id}" data-side="awayScore" value="${hasResult ? result.awayScore : ""}" />
      </div>
      <div class="team-name">${formatTeamNameImage(match.away)}</div>
      <div class="result-status ${hasResult ? "saved" : ""}">${hasResult ? "Salvo" : "Pendente"}</div>
    </div>
  `;
}

function renderCartelas(cartelasList) {
  if (!cartelasList.length) {
    savedCardsList.innerHTML = '<p class="empty-state">Nenhuma cartela salva ainda. A primeira pode ser a campeã moral.</p>';
    return;
  }

  savedCardsList.innerHTML = cartelasList.map((cartela) => {
    const predictionsCount = Object.keys(cartela.predictions || {}).length;
    const date = formatDate(cartela.updatedAt || cartela.createdAt);

    return `
      <article class="saved-card">
        <div>
          <strong>${escapeHtml(cartela.playerName)}</strong>
          <span>${predictionsCount} palpites preenchidos${date ? ` • ${date}` : ""}</span>
        </div>
        <div class="saved-card-actions">
          <button class="small-button" type="button" data-action="edit" data-cartela-id="${cartela.id}">Editar</button>
          <button class="danger-button" type="button" data-action="delete" data-cartela-id="${cartela.id}">Excluir</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderFollowDashboard() {
  const scoredMatches = getScoredMatches();
  rankingEntries = calculateRankingWithMovement(scoredMatches);
  renderRanking(scoredMatches);
  renderCartelaOptions();
  renderIndividualCartela(cartelaSelect.value);
}

function renderRanking(scoredMatches) {
  if (!cartelas.length) {
    rankingSummary.innerHTML = '<p class="empty-state">Ainda não há cartelas cadastradas.</p>';
    rankingList.innerHTML = "";
    return;
  }

  rankingSummary.innerHTML = `
    <article class="summary-card">
      <span>🏟️ Jogos com resultado</span>
      <strong>${scoredMatches.length}</strong>
    </article>
    <article class="summary-card">
      <span>🎟️ Cartelas no bolão</span>
      <strong>${cartelas.length}</strong>
    </article>
  `;

  if (!scoredMatches.length) {
    rankingList.innerHTML = '<p class="empty-state">Nenhum placar oficial foi informado ainda. O ranking acorda assim que sair o primeiro resultado.</p>';
    return;
  }

  const chibiContext = createChibiContext(rankingEntries);

  rankingList.innerHTML = rankingEntries.map((entry, index) => {
    const rankBadge = getRankBadge(entry, index, rankingEntries.length);
    const accuracy = entry.played ? Math.round((entry.counts.complete / entry.played) * 100) : 0;

    return `
      <article class="ranking-card ${index < 3 ? "podium" : ""}">
        <div class="ranking-rank-area">
          <div class="rank-position-stack">
            <div class="rank-position">${rankBadge}</div>
            ${renderRankMovement(entry.movement)}
          </div>
          ${renderChibiAvatar(entry.playerName, "ranking-chibi", entry, chibiContext)}
        </div>
        <div class="ranking-player">
          <strong>${escapeHtml(entry.playerName)}</strong>
          <span>${entry.played} jogos pontuados • ${accuracy}% de placares exatos</span>
        </div>
        <div class="ranking-stats">
          <span title="Acertos completos">🎯 ${entry.counts.complete}</span>
          <span title="Acertos intermediários">✨ ${entry.counts.intermediate}</span>
          <span title="Acertos básicos">✅ ${entry.counts.basic}</span>
          <span title="Acertos invertidos">🔄 ${entry.counts.inverted}</span>
        </div>
        <div class="ranking-points">${entry.total}<small>pts</small></div>
      </article>
    `;
  }).join("");
}

function renderCartelaOptions() {
  if (!rankingEntries.length) {
    cartelaSelect.innerHTML = '<option value="">Nenhuma cartela cadastrada</option>';
    return;
  }

  cartelaSelect.innerHTML = rankingEntries.map((entry, index) => `
    <option value="${entry.id}">${index + 1}º - ${escapeHtml(entry.playerName)} (${entry.total} pts)</option>
  `).join("");
}

function renderIndividualCartela(cartelaId) {
  const entry = rankingEntries.find((rankingEntry) => rankingEntry.id === cartelaId) || rankingEntries[0];

  if (!entry) {
    individualSummary.innerHTML = '<p class="empty-state">Nenhuma cartela para detalhar ainda.</p>';
    individualDetails.innerHTML = "";
    return;
  }

  cartelaSelect.value = entry.id;
  individualSummary.innerHTML = `
    <article class="individual-score-card">
      <span>Cartela</span>
      <strong>${escapeHtml(entry.playerName)}</strong>
    </article>
    <article class="individual-score-card highlight">
      <span>Total</span>
      <strong>${entry.total} pts</strong>
    </article>
    <article class="individual-score-card">
      <span>Jogos avaliados</span>
      <strong>${entry.played}</strong>
    </article>
  `;

  if (!entry.details.length) {
    individualDetails.innerHTML = '<p class="empty-state">Ainda não há resultados oficiais para pontuar esta cartela.</p>';
    return;
  }

  individualDetails.innerHTML = entry.details.map((detail) => `
    <article class="score-detail-card ${detail.type}">
      <div class="score-detail-main">
        <strong>${formatMatchTitle(detail.match)}</strong>
        <span>${detail.match.dateLabel} • ${detail.match.time} • Grupo ${detail.match.group}</span>
      </div>
      <div class="score-comparison">
        <span>Palpite: ${detail.prediction.homeScore}x${detail.prediction.awayScore}</span>
        <span>Resultado: ${detail.result.homeScore}x${detail.result.awayScore}</span>
      </div>
      <div class="score-type">
        <span>${SCORE_LABELS[detail.type]}</span>
        <strong>${detail.points > 0 ? "+" : ""}${detail.points}</strong>
      </div>
    </article>
  `).join("");
}

function renderPersonalCardsGrid() {
  if (!personalEntries.length) {
    personalCardsGrid.innerHTML = '<p class="empty-state">Ainda não há cartelas cadastradas para acompanhar.</p>';
    personalCardDetails.innerHTML = "";
    return;
  }

  const chibiContext = createChibiContext(personalEntries);

  personalCardsGrid.innerHTML = personalEntries.map((entry, index) => `
    <button class="personal-card-button ${index === 0 ? "active" : ""}" type="button" data-personal-cartela-id="${entry.id}">
      ${renderChibiAvatar(entry.playerName, "personal-card-chibi", entry, chibiContext)}
      <span class="personal-card-rank">${entry.rank}º</span>
      <strong>${escapeHtml(entry.playerName)}</strong>
      <small>${entry.total} pts • ${entry.played} jogos avaliados</small>
    </button>
  `).join("");
}

function renderPersonalCardDetails(cartelaId) {
  const entry = personalEntries.find((personalEntry) => personalEntry.id === cartelaId) || personalEntries[0];

  if (!entry) {
    personalCardDetails.innerHTML = '<p class="empty-state">Escolha uma cartela para ver os detalhes.</p>';
    return;
  }

  const cartela = cartelas.find((savedCartela) => savedCartela.id === entry.id);
  const upcomingMatches = getUpcomingMatches();
  const upcomingPredictions = upcomingMatches.map((match) => ({
    match,
    prediction: cartela?.predictions?.[match.id]
  }));

  personalCardsGrid.querySelectorAll(".personal-card-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.personalCartelaId === entry.id);
  });

  const chibiContext = createChibiContext(personalEntries);

  personalCardDetails.innerHTML = `
    <section class="personal-hero-card">
      <div class="personal-hero-player">
        ${renderChibiAvatar(entry.playerName, "personal-hero-chibi", entry, chibiContext)}
        <div>
        <p class="eyebrow">Cartela selecionada</p>
        <h3>${escapeHtml(entry.playerName)}</h3>
        <p>${entry.rank}º lugar na classificação geral</p>
        </div>
      </div>
      <div class="personal-total">${entry.total}<small>pts</small></div>
    </section>

    <div class="individual-summary personal-summary">
      <article class="individual-score-card highlight">
        <span>Pontos feitos</span>
        <strong>${entry.total} pts</strong>
      </article>
      <article class="individual-score-card">
        <span>Jogos avaliados</span>
        <strong>${entry.played}</strong>
      </article>
      <article class="individual-score-card">
        <span>Próximos palpites</span>
        <strong>${upcomingPredictions.length}</strong>
      </article>
    </div>

    <section class="personal-section">
      <div class="personal-section-title">
        <h3>Jogos que já pontuaram</h3>
        <span>${entry.details.length} jogos</span>
      </div>
      ${renderPersonalScoredMatches(entry)}
    </section>

    <section class="personal-section">
      <div class="personal-section-title">
        <h3>Próximos jogos e palpites</h3>
        <span>${upcomingPredictions.length} jogos</span>
      </div>
      ${renderUpcomingPredictions(upcomingPredictions)}
    </section>
  `;
}

function renderPersonalScoredMatches(entry) {
  if (!entry.details.length) {
    return '<p class="empty-state">Ainda não há resultados oficiais para pontuar esta cartela.</p>';
  }

  return `
    <div class="individual-details">
      ${entry.details.map((detail) => `
        <article class="score-detail-card ${detail.type}">
          <div class="score-detail-main">
            <strong>${formatMatchTitle(detail.match)}</strong>
            <span>${detail.match.dateLabel} • ${detail.match.time} • Grupo ${detail.match.group}</span>
          </div>
          <div class="score-comparison">
            <span>Palpite: ${detail.prediction.homeScore}x${detail.prediction.awayScore}</span>
            <span>Resultado: ${detail.result.homeScore}x${detail.result.awayScore}</span>
          </div>
          <div class="score-type">
            <span>${SCORE_LABELS[detail.type]}</span>
            <strong>${detail.points > 0 ? "+" : ""}${detail.points}</strong>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderUpcomingPredictions(upcomingPredictions) {
  if (!upcomingPredictions.length) {
    return '<p class="empty-state">Todos os jogos já têm resultado informado.</p>';
  }

  return `
    <div class="upcoming-predictions">
      ${upcomingPredictions.map(({ match, prediction }) => `
        <article class="upcoming-prediction-card">
          <div class="upcoming-match-meta">
            <strong>${match.dateLabel}</strong>
            <span>${match.dayName} • ${match.time} • Grupo ${match.group}</span>
          </div>
          <div class="upcoming-match-teams">
            <span>${formatTeamNameImage(match.home)}</span>
            <strong>x</strong>
            <span>${formatTeamNameImage(match.away)}</span>
          </div>
          <div class="upcoming-prediction-score">
            <span>Palpite</span>
            <strong>${formatPrediction(prediction)}</strong>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function calculateRanking(scoredMatches) {
  const entries = cartelas.map((cartela) => scoreCartela(cartela, scoredMatches));
  entries.sort(compareRankingEntries);

  return entries.map((entry, index, sortedEntries) => ({
    ...entry,
    rank: getCompetitionRank(sortedEntries, index)
  }));
}

function calculateRankingWithMovement(scoredMatches) {
  const currentRanking = calculateRanking(scoredMatches);
  const latestBlock = getLatestUpdatedMatchBlock(scoredMatches);

  if (!latestBlock.matches.length || scoredMatches.length <= latestBlock.matches.length) {
    return currentRanking.map((entry) => ({ ...entry, movement: 0 }));
  }

  const latestBlockIds = new Set(latestBlock.matches.map((match) => match.id));
  const previousRanking = calculateRanking(
    scoredMatches.filter((match) => !latestBlockIds.has(match.id))
  );
  const previousRanks = new Map(previousRanking.map((entry) => [entry.id, entry.rank]));

  return currentRanking.map((entry) => ({
    ...entry,
    movement: (previousRanks.get(entry.id) || entry.rank) - entry.rank
  }));
}

function renderRankMovement(movement) {
  if (movement > 0) {
    return `<span class="rank-movement up" title="Subiu ${movement} ${movement === 1 ? "posição" : "posições"}">▲ ${movement}</span>`;
  }

  if (movement < 0) {
    const positions = Math.abs(movement);
    return `<span class="rank-movement down" title="Desceu ${positions} ${positions === 1 ? "posição" : "posições"}">▼ ${positions}</span>`;
  }

  return '<span class="rank-movement stable" title="Manteve a posição">—</span>';
}

function compareRankingEntries(firstEntry, secondEntry) {
  if (secondEntry.total !== firstEntry.total) {
    return secondEntry.total - firstEntry.total;
  }

  if (secondEntry.counts.complete !== firstEntry.counts.complete) {
    return secondEntry.counts.complete - firstEntry.counts.complete;
  }

  if (secondEntry.counts.intermediate !== firstEntry.counts.intermediate) {
    return secondEntry.counts.intermediate - firstEntry.counts.intermediate;
  }

  if (secondEntry.counts.basic !== firstEntry.counts.basic) {
    return secondEntry.counts.basic - firstEntry.counts.basic;
  }

  if (firstEntry.counts.inverted !== secondEntry.counts.inverted) {
    return firstEntry.counts.inverted - secondEntry.counts.inverted;
  }

  return firstEntry.playerName.localeCompare(secondEntry.playerName, "pt-BR");
}

function scoreCartela(cartela, scoredMatches) {
  const details = scoredMatches.map((match) => {
    const prediction = cartela.predictions?.[match.id] || { homeScore: 0, awayScore: 0 };
    const result = results[match.id];
    const score = scorePrediction(prediction, result);

    return {
      match,
      prediction,
      result,
      ...score
    };
  });

  return {
    id: cartela.id,
    playerName: cartela.playerName,
    played: details.length,
    total: details.reduce((sum, detail) => sum + detail.points, 0),
    counts: {
      complete: details.filter((detail) => detail.type === "complete").length,
      intermediate: details.filter((detail) => detail.type === "intermediate").length,
      basic: details.filter((detail) => detail.type === "basic").length,
      inverted: details.filter((detail) => detail.type === "inverted").length,
      none: details.filter((detail) => detail.type === "none").length
    },
    details
  };
}

function scorePrediction(prediction, result) {
  const predictionHome = Number(prediction.homeScore);
  const predictionAway = Number(prediction.awayScore);
  const resultHome = Number(result.homeScore);
  const resultAway = Number(result.awayScore);

  if (predictionHome === resultHome && predictionAway === resultAway) {
    return { type: "complete", points: 10 };
  }

  if (predictionHome === resultAway && predictionAway === resultHome && resultHome !== resultAway) {
    return { type: "inverted", points: -2 };
  }

  const sameWinnerOrDraw = getOutcome(predictionHome, predictionAway) === getOutcome(resultHome, resultAway);

  if (sameWinnerOrDraw) {
    const sameHomeScore = predictionHome === resultHome;
    const sameAwayScore = predictionAway === resultAway;
    const sameGoalDifference = predictionHome - predictionAway === resultHome - resultAway;

    if (sameHomeScore || sameAwayScore || sameGoalDifference) {
      return { type: "intermediate", points: 6 };
    }

    return { type: "basic", points: 5 };
  }

  return { type: "none", points: 0 };
}

function getOutcome(homeScore, awayScore) {
  if (homeScore > awayScore) {
    return "home";
  }

  if (homeScore < awayScore) {
    return "away";
  }

  return "draw";
}

function getScoredMatches() {
  return getChronologicalMatches().filter((match) => {
    const result = results[match.id];
    return Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore);
  });
}

function getLatestUpdatedMatch() {
  return getLatestUpdatedMatchBlock().latestMatch;
}

function getLatestUpdatedMatchBlock(scoredMatches = getScoredMatches()) {
  const latestMatch = scoredMatches.reduce((currentLatestMatch, match) => {
    if (!currentLatestMatch) {
      return match;
    }

    const currentUpdatedAt = Date.parse(results[match.id]?.updatedAt || "") || 0;
    const latestUpdatedAt = Date.parse(results[currentLatestMatch.id]?.updatedAt || "") || 0;

    return currentUpdatedAt >= latestUpdatedAt ? match : currentLatestMatch;
  }, null);

  if (!latestMatch) {
    return { latestMatch: null, matches: [], updatedAt: null };
  }

  const latestBlockKey = getMatchBlockKey(latestMatch);
  const matches = scoredMatches.filter((match) => getMatchBlockKey(match) === latestBlockKey);
  const updatedAt = matches.reduce((latestUpdatedAt, match) => {
    const matchUpdatedAt = Date.parse(results[match.id]?.updatedAt || "") || 0;

    return matchUpdatedAt > latestUpdatedAt ? matchUpdatedAt : latestUpdatedAt;
  }, 0);

  return {
    latestMatch,
    matches,
    updatedAt: updatedAt ? new Date(updatedAt).toISOString() : results[latestMatch.id]?.updatedAt || null
  };
}

function getMatchBlockKey(match) {
  return `${match.dateLabel || ""}|${match.time || ""}`;
}

function getUpcomingMatches() {
  return getChronologicalMatches().filter((match) => {
    const result = results[match.id];
    return !(Number.isInteger(result?.homeScore) && Number.isInteger(result?.awayScore));
  });
}

function getCompetitionRank(sortedEntries, index) {
  if (index === 0) {
    return 1;
  }

  const currentEntry = sortedEntries[index];
  const previousEntry = sortedEntries[index - 1];

  if (haveSameRankingCriteria(currentEntry, previousEntry)) {
    return previousEntry.rank || getCompetitionRank(sortedEntries, index - 1);
  }

  return index + 1;
}

function haveSameRankingCriteria(firstEntry, secondEntry) {
  return firstEntry.total === secondEntry.total
    && firstEntry.counts.complete === secondEntry.counts.complete
    && firstEntry.counts.intermediate === secondEntry.counts.intermediate
    && firstEntry.counts.basic === secondEntry.counts.basic
    && firstEntry.counts.inverted === secondEntry.counts.inverted;
}

function getRankBadge(entry, index, totalEntries) {
  if (entry.rank === 1) {
    return "🏆 1º";
  }

  if (entry.rank === 2) {
    return "🥈 2º";
  }

  if (entry.rank === 3) {
    return "🥉 3º";
  }

  if (totalEntries > 3 && index === totalEntries - 1) {
    return `🐢 ${entry.rank}º`;
  }

  if (totalEntries > 4 && index === totalEntries - 2) {
    return `🧯 ${entry.rank}º`;
  }

  return `⚽ ${entry.rank}º`;
}

async function requireAdminPassword() {
  const savedPassword = sessionStorage.getItem(ADMIN_PASSWORD_KEY);

  if (savedPassword && await validateAdminPassword(savedPassword)) {
    return true;
  }

  const password = window.prompt("Digite a senha do administrador do bolão:");

  if (password && await validateAdminPassword(password)) {
    sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
    return true;
  }

  if (password !== null) {
    showToast("Senha incorreta.");
  }

  return false;
}

async function validateAdminPassword(password) {
  try {
    const response = await fetch("/api/admin/validate", {
      method: "POST",
      headers: {
        "X-Admin-Password": password
      }
    });

    return response.ok;
  } catch (error) {
    showToast("Não foi possível validar a senha agora.");
    return false;
  }
}

function getAdminHeaders() {
  const password = sessionStorage.getItem(ADMIN_PASSWORD_KEY);

  if (!password) {
    return {};
  }

  return {
    "X-Admin-Password": password
  };
}

function clearAdminPassword() {
  sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
}

async function downloadBackup() {
  if (!(await requireAdminPassword())) {
    return;
  }

  backupDataButton.disabled = true;
  const originalText = backupDataButton.innerHTML;
  backupDataButton.innerHTML = "<span>Gerando backup...</span><small>Aguarde alguns segundos</small>";

  try {
    const response = await fetch("/api/backup", {
      headers: getAdminHeaders()
    });

    if (response.status === 401) {
      clearAdminPassword();
      showToast("Senha incorreta para baixar o backup.");
      return;
    }

    if (!response.ok) {
      throw new Error("Não foi possível gerar o backup.");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-bolao-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Backup baixado com sucesso.");
  } catch (error) {
    showToast(error.message || "Não foi possível baixar o backup.");
  } finally {
    backupDataButton.disabled = false;
    backupDataButton.innerHTML = originalText;
  }
}

async function generateRankingImage() {
  if (!rankingEntries.length) {
    showToast("Ainda não há ranking para gerar.");
    return;
  }

  const width = 1080;
  const rowHeight = 118;
  const height = Math.max(1920, 430 + rankingEntries.length * rowHeight);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const scoredMatches = getScoredMatches();
  const chibiContext = createChibiContext(rankingEntries);
  const chibiImages = await loadRankingChibiImages(rankingEntries, chibiContext);

  drawRankingImageBackground(context, width, height);
  drawRankingImageHeader(context, width, scoredMatches);

  let y = 360;
  rankingEntries.forEach((entry, index) => {
    drawRankingImageRow(context, entry, index, rankingEntries.length, 70, y, width - 140, 96, chibiImages.get(entry.id));
    y += rowHeight;
  });

  context.fillStyle = "rgba(255,255,255,0.78)";
  context.font = "700 28px Arial";
  context.textAlign = "center";
  context.fillText("Bolão da Copa UFSM-CS", width / 2, height - 58);

  const imageUrl = canvas.toDataURL("image/png");
  rankingImageOutput.innerHTML = `
    <div class="ranking-image-card">
      <img src="${imageUrl}" alt="Imagem do ranking geral do bolão" />
      <a class="download-button" href="${imageUrl}" download="ranking-bolao-ufsm-cs.png">Baixar imagem</a>
    </div>
  `;
}

function drawRankingImageBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#4320a8");
  gradient.addColorStop(0.48, "#6638f0");
  gradient.addColorStop(1, "#08a96a");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.globalAlpha = 0.16;
  context.fillStyle = "#ffffff";
  for (let index = 0; index < 18; index++) {
    const x = (index * 173) % width;
    const y = 120 + ((index * 257) % (height - 240));
    context.beginPath();
    context.arc(x, y, 70 + (index % 4) * 18, 0, Math.PI * 2);
    context.fill();
  }
  context.globalAlpha = 1;
}

function drawRankingImageHeader(context, width, scoredMatches) {
  context.textAlign = "center";
  context.fillStyle = "#ffffff";
  context.font = "900 76px Arial";
  context.fillText("Ranking do Bolão", width / 2, 115);

  context.font = "700 34px Arial";
  context.fillStyle = "rgba(255,255,255,0.82)";
  context.fillText("Copa UFSM Cachoeira do Sul", width / 2, 165);

  drawRankingImagePill(context, 220, 220, 285, 80, "🏟️", `${scoredMatches.length} jogos`);
  drawRankingImagePill(context, 575, 220, 285, 80, "🎟️", `${rankingEntries.length} cartelas`);
}

function drawRankingImagePill(context, x, y, width, height, emoji, text) {
  drawRoundRect(context, x, y, width, height, 26, "rgba(255,255,255,0.18)");
  context.textAlign = "left";
  context.font = "900 34px Arial";
  context.fillStyle = "#ffffff";
  context.fillText(emoji, x + 28, y + 52);
  context.font = "800 30px Arial";
  context.fillText(text, x + 82, y + 51);
}

function drawRankingImageRow(context, entry, index, totalEntries, x, y, width, height, chibiImage) {
  const isPodium = index < 3;
  drawRoundRect(context, x, y, width, height, 28, isPodium ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.82)");

  context.textAlign = "left";
  context.fillStyle = "#17152d";
  context.font = "900 30px Arial";
  context.fillText(getRankBadge(entry, index, totalEntries), x + 30, y + 43);

  const movementText = entry.movement > 0
    ? `▲ ${entry.movement}`
    : entry.movement < 0
      ? `▼ ${Math.abs(entry.movement)}`
      : "—";
  context.fillStyle = entry.movement > 0 ? "#078257" : entry.movement < 0 ? "#d6374a" : "#817a98";
  context.font = "900 22px Arial";
  context.fillText(movementText, x + 34, y + 76);

  drawRankingImageChibi(context, chibiImage, x + 128, y + 13, 70, entry.playerName);

  context.fillStyle = "#17152d";
  context.font = "900 38px Arial";
  context.fillText(truncateText(context, entry.playerName, 365), x + 220, y + 48);

  context.fillStyle = "#6f6a86";
  context.font = "700 24px Arial";
  context.fillText(`🎯 ${entry.counts.complete}   ✨ ${entry.counts.intermediate}   ✅ ${entry.counts.basic}   🔄 ${entry.counts.inverted}`, x + 220, y + 80);

  const pointsBoxWidth = 150;
  drawRoundRect(context, x + width - pointsBoxWidth - 24, y + 18, pointsBoxWidth, 60, 18, "#19c37d");
  context.textAlign = "center";
  context.fillStyle = "#ffffff";
  context.font = "900 34px Arial";
  context.fillText(`${entry.total} pts`, x + width - pointsBoxWidth / 2 - 24, y + 58);
}

function drawRankingImageChibi(context, chibiImage, x, y, size, playerName) {
  context.save();
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  context.fillStyle = "#ffffff";
  context.fill();
  context.clip();

  if (chibiImage) {
    context.drawImage(chibiImage, x, y, size, size);
  } else {
    context.fillStyle = "#f2edff";
    context.fillRect(x, y, size, size);
    context.fillStyle = "#4320a8";
    context.font = "900 26px Arial";
    context.textAlign = "center";
    context.fillText(getInitials(playerName), x + size / 2, y + size / 2 + 9);
  }

  context.restore();
  context.strokeStyle = "rgba(67,32,168,0.24)";
  context.lineWidth = 4;
  context.beginPath();
  context.arc(x + size / 2, y + size / 2, size / 2 - 2, 0, Math.PI * 2);
  context.stroke();
}

function loadRankingChibiImages(entries, chibiContext) {
  return Promise.all(entries.map((entry) => {
    const chibiFile = getChibiFile(entry.playerName, entry, chibiContext);

    if (!chibiFile) {
      return [entry.id, null];
    }

    return loadImage(getChibiSource(chibiFile))
      .then((image) => [entry.id, image])
      .catch(() => [entry.id, null]);
  })).then((images) => new Map(images));
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function drawRoundRect(context, x, y, width, height, radius, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fill();
}

function truncateText(context, text, maxWidth) {
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }

  let truncatedText = text;

  while (truncatedText.length > 1 && context.measureText(`${truncatedText}...`).width > maxWidth) {
    truncatedText = truncatedText.slice(0, -1);
  }

  return `${truncatedText}...`;
}

function setFollowTab(tabName) {
  const isRanking = tabName === "ranking";

  rankingTab.classList.toggle("hidden", !isRanking);
  individualTab.classList.toggle("hidden", isRanking);

  document.querySelectorAll("[data-follow-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.followTab === tabName);
  });
}

function setKnockoutTab(tabName) {
  const isCurrent = tabName === "current";

  knockoutCurrentTab.classList.toggle("hidden", !isCurrent);
  knockoutRankingTab.classList.toggle("hidden", isCurrent);

  document.querySelectorAll("[data-knockout-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.knockoutTab === tabName);
  });
}

function editCartela(cartelaId) {
  const cartela = cartelas.find((savedCartela) => savedCartela.id === cartelaId);

  if (!cartela) {
    showToast("Não encontrei essa cartela. Vou recarregar a lista.");
    loadCartelas();
    return;
  }

  editingCartelaId = cartela.id;
  formTitle.textContent = `Editar cartela de ${cartela.playerName}`;
  saveButton.textContent = "Atualizar cartela";
  playerNameInput.value = cartela.playerName;

  document.querySelectorAll("#matches-container .score-input").forEach((input) => {
    const prediction = cartela.predictions?.[input.dataset.matchId];
    input.value = prediction?.[input.dataset.side] ?? "";
  });

  setMessage("Editando cartela salva. Altere os campos e clique em atualizar.", "success");
  cartelaForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteCartela(cartelaId) {
  const cartela = cartelas.find((savedCartela) => savedCartela.id === cartelaId);

  if (!cartela) {
    await loadCartelas();
    return;
  }

  const shouldDelete = window.confirm(`Excluir a cartela de ${cartela.playerName}?`);

  if (!shouldDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/cartelas/${encodeURIComponent(cartelaId)}`, {
      method: "DELETE",
      headers: getAdminHeaders()
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        clearAdminPassword();
      }

      throw new Error(data.error || "Não foi possível excluir a cartela.");
    }

    if (editingCartelaId === cartelaId) {
      resetFormState();
    }

    await loadCartelas();
    setMessage(`Cartela de ${cartela.playerName} excluída.`, "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
}

function collectPredictions() {
  const predictions = {};

  document.querySelectorAll("#matches-container .score-input").forEach((input) => {
    const matchId = input.dataset.matchId;
    const side = input.dataset.side;

    predictions[matchId] ||= {};
    predictions[matchId][side] = Number(input.value);
  });

  return predictions;
}

function collectResults() {
  const updatedResults = {};

  document.querySelectorAll("#results-container .result-input").forEach((input) => {
    const matchId = input.dataset.matchId;
    const side = input.dataset.side;

    updatedResults[matchId] ||= {};
    updatedResults[matchId][side] = input.value;
  });

  return updatedResults;
}

function resetFormState() {
  editingCartelaId = null;
  formTitle.textContent = "Adicionar cartela";
  saveButton.textContent = "Salvar cartela";
  cartelaForm.reset();
  setMessage("");
}

function showScreen(screen) {
  seasonMenuScreen.classList.toggle("hidden", screen !== seasonMenuScreen);
  homeScreen.classList.toggle("hidden", screen !== homeScreen);
  knockoutFollowScreen.classList.toggle("hidden", screen !== knockoutFollowScreen);
  knockoutPredictionsScreen.classList.toggle("hidden", screen !== knockoutPredictionsScreen);
  knockoutAdminScreen.classList.toggle("hidden", screen !== knockoutAdminScreen);
  currentGameScreen.classList.toggle("hidden", screen !== currentGameScreen);
  addCardScreen.classList.toggle("hidden", screen !== addCardScreen);
  updateScoresScreen.classList.toggle("hidden", screen !== updateScoresScreen);
  followPoolScreen.classList.toggle("hidden", screen !== followPoolScreen);
  myCardScreen.classList.toggle("hidden", screen !== myCardScreen);
}

function getChronologicalMatches() {
  return groups
    .flatMap((groupData) => groupData.matches.map((match) => ({ ...match, group: groupData.group })))
    .sort((firstMatch, secondMatch) => {
      const dateComparison = firstMatch.date.localeCompare(secondMatch.date);

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return getTimeOrder(firstMatch.time) - getTimeOrder(secondMatch.time);
    });
}

function groupMatchesByDay(matches) {
  const days = [];

  for (const match of matches) {
    const lastDay = days.at(-1);

    if (!lastDay || lastDay.date !== match.date) {
      days.push({
        date: match.date,
        dateLabel: match.dateLabel,
        dayName: match.dayName,
        matches: [match]
      });
    } else {
      lastDay.matches.push(match);
    }
  }

  return days;
}

function getTimeOrder(time) {
  const match = String(time).match(/^(\d{1,2})(?:h(\d{2}))?/);

  if (!match) {
    return 9999;
  }

  const hour = Number(match[1]);
  const minutes = Number(match[2] || 0);
  const isOvernightGame = hour <= 1 && time.includes("(");

  return (isOvernightGame ? hour + 24 : hour) * 60 + minutes;
}

function setMessage(message, type = "") {
  formMessage.textContent = message;
  formMessage.className = type;
}

function setResultsMessage(message, type = "") {
  resultsMessage.textContent = message;
  resultsMessage.className = type;
}

function renderScoreSyncStatus() {
  if (!scoreSyncStatusElements.length) {
    return;
  }

  const text = getScoreSyncStatusText();

  scoreSyncStatusElements.forEach((element) => {
    element.textContent = text;
    element.classList.toggle("error", Boolean(scoreSyncStatus?.lastError));
  });
}

function getScoreSyncStatusText() {
  const sourceName = scoreSyncStatus?.source || "API";

  if (!scoreSyncStatus) {
    return "Sincronização de placares: status ainda não carregado.";
  }

  if (!scoreSyncStatus.enabled) {
    return "Sincronização de placares: desligada.";
  }

  if (scoreSyncStatus.syncing) {
    return `Sincronização de placares: buscando placares na ${sourceName} agora...`;
  }

  if (scoreSyncStatus.lastError) {
    return `Sincronização de placares: falhou na última tentativa (${scoreSyncStatus.lastError}).`;
  }

  if (scoreSyncStatus.lastSuccessAt) {
    const date = new Date(scoreSyncStatus.lastSuccessAt);
    const formattedDate = Number.isNaN(date.getTime())
      ? scoreSyncStatus.lastSuccessAt
      : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

    return `Sincronização de placares: última busca na ${sourceName} em ${formattedDate}. ${scoreSyncStatus.lastUpdatedCount || 0} placares atualizados.`;
  }

  return "Sincronização de placares: aguardando primeira busca.";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatPrediction(prediction) {
  if (!prediction || !Number.isInteger(Number(prediction.homeScore)) || !Number.isInteger(Number(prediction.awayScore))) {
    return "Sem palpite";
  }

  return `${prediction.homeScore}x${prediction.awayScore}`;
}

function createChibiContext(entries = [], currentMatches = null) {
  const latestMatches = Array.isArray(currentMatches)
    ? currentMatches
    : getLatestUpdatedMatchBlock().matches;
  const latestMatchIds = latestMatches.map((match) => match.id);
  const orderedEntries = [...entries];
  const mateKeysInSequence = new Set();
  const tableIndexByKey = new Map();
  const coupleChibiByKey = new Map();

  orderedEntries.forEach((entry, index) => {
    tableIndexByKey.set(getPersonKey(entry.playerName), index);
  });

  COUPLE_CHIBIS.forEach((couple) => {
    const firstIndex = tableIndexByKey.get(couple.keys[0]);
    const secondIndex = tableIndexByKey.get(couple.keys[1]);

    if (Number.isInteger(firstIndex) && Number.isInteger(secondIndex) && Math.abs(firstIndex - secondIndex) === 1) {
      couple.keys.forEach((key) => coupleChibiByKey.set(key, couple.file));
    }
  });

  let currentMateRun = [];
  const flushMateRun = () => {
    if (currentMateRun.length >= 3) {
      currentMateRun.forEach((key) => mateKeysInSequence.add(key));
    }

    currentMateRun = [];
  };

  orderedEntries.forEach((entry) => {
    const key = getPersonKey(entry.playerName);

    if (MATE_CHIBI_KEYS.has(key)) {
      currentMateRun.push(key);
      return;
    }

    flushMateRun();
  });
  flushMateRun();

  return {
    latestMatchIds,
    coupleChibiByKey,
    mateKeysInSequence,
    tableIndexByKey,
    totalEntries: orderedEntries.length
  };
}

function renderChibiAvatar(playerName, className = "", entry = null, chibiContext = null) {
  const safePlayerName = escapeHtml(playerName);
  const chibiFile = getChibiFile(playerName, entry, chibiContext);

  if (!chibiFile) {
    const initials = getInitials(playerName);

    return `
      <span class="chibi-avatar chibi-fallback ${className}" aria-label="Avatar de ${safePlayerName}">
        ${initials}
      </span>
    `;
  }

  return `
    <img
      class="chibi-avatar ${className}"
      src="${getChibiSource(chibiFile)}"
      alt="Chibi de ${safePlayerName}"
      loading="lazy"
      decoding="async"
    />
  `;
}

function getChibiSource(chibiFile) {
  return `/chibis-optimized/${chibiFile}?v=${CHIBI_ASSET_VERSION}`;
}

function getChibiFile(playerName, entry = null, chibiContext = null) {
  const key = getPersonKey(playerName);
  const defaultChibi = PLAYER_CHIBIS[key];

  if (!defaultChibi) {
    return null;
  }

  const currentBlockPoints = getCurrentBlockPoints(entry, chibiContext);
  const coupleChibi = chibiContext?.coupleChibiByKey?.get(key);

  if (coupleChibi) {
    return coupleChibi;
  }

  if (hasCurrentBlockMissingPrediction(entry, chibiContext)) {
    return getChibiVariant(defaultChibi, "triste");
  }

  if (currentBlockPoints.some((points) => points === 10)) {
    return getChibiVariant(defaultChibi, "especial");
  }

  if (chibiContext?.mateKeysInSequence?.has(key)) {
    return getChibiVariant(defaultChibi, "mate");
  }

  if (key === "GABRIEL" && currentBlockPoints.some((points) => points === -2)) {
    return getChibiVariant(defaultChibi, "triste");
  }

  if (entry?.rank === 1) {
    return getChibiVariant(defaultChibi, "especial");
  }

  if (key === "VINICIUS") {
    const viniciusIndex = chibiContext?.tableIndexByKey?.get("VINICIUS");
    const lucasIndex = chibiContext?.tableIndexByKey?.get("LUCAS");

    if (Number.isInteger(viniciusIndex) && Number.isInteger(lucasIndex)) {
      if (viniciusIndex < lucasIndex) {
        return getChibiVariant(defaultChibi, "feliz");
      }

      if (viniciusIndex > lucasIndex) {
        return getChibiVariant(defaultChibi, "triste");
      }
    }
  }

  if (isBottomThree(entry, chibiContext) || currentBlockPoints.some((points) => points === -2)) {
    return getChibiVariant(defaultChibi, "triste");
  }

  if (currentBlockPoints.length && currentBlockPoints.every((points) => points === 6 || points === 5)) {
    return getChibiVariant(defaultChibi, "feliz");
  }

  if (currentBlockPoints.length) {
    return getChibiVariant(defaultChibi, "neutro");
  }

  return defaultChibi;
}

function getCurrentGamePoints(entry, chibiContext) {
  const blockPoints = getCurrentBlockPoints(entry, chibiContext);

  if (!blockPoints.length) {
    return null;
  }

  return blockPoints.reduce((sum, points) => sum + points, 0);
}

function getCurrentBlockPoints(entry, chibiContext) {
  return getCurrentBlockDetails(entry, chibiContext)
    .map((detail) => Number(detail.basePoints ?? detail.points))
    .filter((points) => Number.isFinite(points));
}

function hasCurrentBlockMissingPrediction(entry, chibiContext) {
  return getCurrentBlockDetails(entry, chibiContext).some((detail) => detail.type === "missing" || detail.missing);
}

function getCurrentBlockDetails(entry, chibiContext) {
  if (!entry || !chibiContext?.latestMatchIds?.length) {
    return [];
  }

  const latestMatchIds = new Set(chibiContext.latestMatchIds);
  const currentDetails = entry.currentDetails?.length
    ? entry.currentDetails
    : entry.details?.filter((detail) => latestMatchIds.has(detail.match.id));

  return currentDetails || [];
}

function isBottomThree(entry, chibiContext) {
  if (!entry || !chibiContext?.tableIndexByKey || chibiContext.totalEntries < 4) {
    return false;
  }

  const index = chibiContext.tableIndexByKey.get(getPersonKey(entry.playerName));

  return Number.isInteger(index) && index >= chibiContext.totalEntries - 3;
}

function getChibiVariant(defaultChibi, variant) {
  return `${defaultChibi.replace(/\.webp$/i, "")}_${variant}.webp`;
}

function getPersonKey(name) {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function getInitials(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase() || "?";
}

function formatMatchTitle(match) {
  return `${formatTeamNameImage(match.home)} <span class="match-title-versus">x</span> ${formatTeamNameImage(match.away)}`;
}

function formatTeamNameImage(teamName) {
  const teamKey = getTeamKey(teamName);
  const flagCode = TEAM_FLAG_CODES[teamKey];
  const safeTeamName = escapeHtml(teamName);
  const flag = flagCode
    ? `<img class="team-flag" src="https://flagcdn.com/w40/${flagCode}.png" srcset="https://flagcdn.com/w80/${flagCode}.png 2x" alt="Bandeira: ${safeTeamName}" loading="lazy" decoding="async" referrerpolicy="no-referrer" />`
    : '<span class="team-flag team-flag-fallback" aria-hidden="true"></span>';

  return `
    <span class="team-with-flag">
      ${flag}
      <span>${safeTeamName}</span>
    </span>
  `;
}

function formatTeamFlagOnly(teamName) {
  const teamKey = getTeamKey(teamName);
  const flagCode = TEAM_FLAG_CODES[teamKey];
  const safeTeamName = escapeHtml(teamName);

  if (!flagCode) {
    return `
      <span class="current-match-flag-only current-match-flag-fallback" title="${safeTeamName}">
        ${getInitials(teamName)}
        <span class="visually-hidden">${safeTeamName}</span>
      </span>
    `;
  }

  return `
    <span class="current-match-flag-only" title="${safeTeamName}">
      <img
        src="https://flagcdn.com/w160/${flagCode}.png"
        srcset="https://flagcdn.com/w320/${flagCode}.png 2x"
        alt="Bandeira: ${safeTeamName}"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
      />
      <span class="visually-hidden">${safeTeamName}</span>
    </span>
  `;
}

function formatTeamFlagTiny(teamName) {
  const teamKey = getTeamKey(teamName);
  const flagCode = TEAM_FLAG_CODES[teamKey];
  const safeTeamName = escapeHtml(teamName);

  if (!flagCode) {
    return `<span class="prediction-flag prediction-flag-fallback" title="${safeTeamName}">${getInitials(teamName)}</span>`;
  }

  return `
    <img
      class="prediction-flag"
      src="https://flagcdn.com/w40/${flagCode}.png"
      srcset="https://flagcdn.com/w80/${flagCode}.png 2x"
      alt="Bandeira: ${safeTeamName}"
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
    />
  `;
}

function getTeamKey(teamName) {
  return String(teamName)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function formatTeamName(teamName) {
  const flag = TEAM_FLAGS[teamName] || "🏳️";

  return `
    <span class="team-with-flag">
      <span class="team-flag" aria-hidden="true">${flag}</span>
      <span>${escapeHtml(teamName)}</span>
    </span>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
