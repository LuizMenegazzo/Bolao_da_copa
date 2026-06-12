const homeScreen = document.querySelector("#home-screen");
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

const ADMIN_PASSWORD_KEY = "bolaoAdminPassword";

const SCORE_LABELS = {
  complete: "Acerto completo",
  intermediate: "Acerto intermediário",
  basic: "Acerto básico",
  inverted: "Acerto invertido",
  none: "Nenhum acerto"
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
  "ALEMANHA": "de",
  "ARGENTINA": "ar",
  "ARGELIA": "dz",
  "ARABIA SAUDITA": "sa",
  "AUSTRALIA": "au",
  "AUSTRIA": "at",
  "BELGICA": "be",
  "BOSNIA": "ba",
  "BRASIL": "br",
  "CABO VERDE": "cv",
  "CANADA": "ca",
  "CATAR": "qa",
  "COLOMBIA": "co",
  "COREIA DO SUL": "kr",
  "COSTA DO MARFIM": "ci",
  "CROACIA": "hr",
  "CURACAO": "cw",
  "EGITO": "eg",
  "EQUADOR": "ec",
  "ESCOCIA": "gb-sct",
  "ESPANHA": "es",
  "ESTADOS UNIDOS": "us",
  "FRANCA": "fr",
  "GANA": "gh",
  "HAITI": "ht",
  "HOLANDA": "nl",
  "INGLATERRA": "gb-eng",
  "IRA": "ir",
  "IRAQUE": "iq",
  "JAPAO": "jp",
  "JORDANIA": "jo",
  "MARROCOS": "ma",
  "MEXICO": "mx",
  "NORUEGA": "no",
  "NOVA ZELANDIA": "nz",
  "PANAMA": "pa",
  "PARAGUAI": "py",
  "PORTUGAL": "pt",
  "RD CONGO": "cd",
  "REPUBLICA TCHECA": "cz",
  "SENEGAL": "sn",
  "SUECIA": "se",
  "SUICA": "ch",
  "TUNISIA": "tn",
  "TURQUIA": "tr",
  "URUGUAI": "uy",
  "UZBEQUISTAO": "uz"
};

const PLAYER_CHIBIS = {
  "CELSO": "celso.png",
  "CRICIELE": "criciele.png",
  "CRIS": "cris.png",
  "GUSTAVO": "gustavo.png",
  "GABRIEL": "gabriel.png",
  "JEFF": "jeff.png",
  "VANDREI": "vandrei.png",
  "JOAO LAURO": "joao-lauro.png",
  "LAURA": "laura.png",
  "THIELI": "thieli.png",
  "ANDERSON": "anderson.png",
  "AMANDINHA": "amandinha.png",
  "LUIZ": "luiz.png",
  "DANIEL": "daniel.png",
  "CARLA": "carla.png",
  "PC": "pc.png",
  "NELSON": "nelson.png",
  "DION": "dion.png",
  "LUCAS": "lucas.png",
  "VINICIUS": "vinicius.png"
};

let groups = [];
let cartelas = [];
let results = {};
let editingCartelaId = null;
let rankingEntries = [];
let personalEntries = [];

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

personalCardsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-personal-cartela-id]");

  if (!button) {
    return;
  }

  renderPersonalCardDetails(button.dataset.personalCartelaId);
});

document.querySelectorAll("[data-follow-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setFollowTab(button.dataset.followTab);
  });
});

cartelaSelect.addEventListener("change", () => {
  renderIndividualCartela(cartelaSelect.value);
});

generateRankingImageButton.addEventListener("click", () => {
  generateRankingImage();
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
  rankingEntries = calculateRanking(scoredMatches);
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

  rankingList.innerHTML = rankingEntries.map((entry, index) => {
    const rankBadge = getRankBadge(entry, index, rankingEntries.length);
    const accuracy = entry.played ? Math.round((entry.counts.complete / entry.played) * 100) : 0;

    return `
      <article class="ranking-card ${index < 3 ? "podium" : ""}">
        <div class="ranking-rank-area">
          <div class="rank-position">${rankBadge}</div>
          ${renderChibiAvatar(entry.playerName, "ranking-chibi")}
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

  personalCardsGrid.innerHTML = personalEntries.map((entry, index) => `
    <button class="personal-card-button ${index === 0 ? "active" : ""}" type="button" data-personal-cartela-id="${entry.id}">
      ${renderChibiAvatar(entry.playerName, "personal-card-chibi")}
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

  personalCardDetails.innerHTML = `
    <section class="personal-hero-card">
      <div class="personal-hero-player">
        ${renderChibiAvatar(entry.playerName, "personal-hero-chibi")}
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
  entries.sort((firstEntry, secondEntry) => {
    if (secondEntry.total !== firstEntry.total) {
      return secondEntry.total - firstEntry.total;
    }

    if (secondEntry.counts.complete !== firstEntry.counts.complete) {
      return secondEntry.counts.complete - firstEntry.counts.complete;
    }

    if (secondEntry.counts.intermediate !== firstEntry.counts.intermediate) {
      return secondEntry.counts.intermediate - firstEntry.counts.intermediate;
    }

    return firstEntry.playerName.localeCompare(secondEntry.playerName, "pt-BR");
  });

  return entries.map((entry, index, sortedEntries) => ({
    ...entry,
    rank: getCompetitionRank(sortedEntries, index)
  }));
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

  if (currentEntry.total === previousEntry.total) {
    return previousEntry.rank || getCompetitionRank(sortedEntries, index - 1);
  }

  return index + 1;
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

function generateRankingImage() {
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

  drawRankingImageBackground(context, width, height);
  drawRankingImageHeader(context, width, scoredMatches);

  let y = 360;
  rankingEntries.forEach((entry, index) => {
    drawRankingImageRow(context, entry, index, rankingEntries.length, 70, y, width - 140, 96);
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

function drawRankingImageRow(context, entry, index, totalEntries, x, y, width, height) {
  const isPodium = index < 3;
  drawRoundRect(context, x, y, width, height, 28, isPodium ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.82)");

  context.textAlign = "left";
  context.fillStyle = "#17152d";
  context.font = "900 34px Arial";
  context.fillText(getRankBadge(entry, index, totalEntries), x + 30, y + 58);

  context.font = "900 38px Arial";
  context.fillText(truncateText(context, entry.playerName, 410), x + 190, y + 48);

  context.fillStyle = "#6f6a86";
  context.font = "700 24px Arial";
  context.fillText(`🎯 ${entry.counts.complete}   ✨ ${entry.counts.intermediate}   ✅ ${entry.counts.basic}   🔄 ${entry.counts.inverted}`, x + 190, y + 80);

  const pointsBoxWidth = 150;
  drawRoundRect(context, x + width - pointsBoxWidth - 24, y + 18, pointsBoxWidth, 60, 18, "#19c37d");
  context.textAlign = "center";
  context.fillStyle = "#ffffff";
  context.font = "900 34px Arial";
  context.fillText(`${entry.total} pts`, x + width - pointsBoxWidth / 2 - 24, y + 58);
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
  homeScreen.classList.toggle("hidden", screen !== homeScreen);
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

function renderChibiAvatar(playerName, className = "") {
  const safePlayerName = escapeHtml(playerName);
  const chibiFile = PLAYER_CHIBIS[getPersonKey(playerName)];

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
      src="/chibis/${chibiFile}"
      alt="Chibi de ${safePlayerName}"
      loading="lazy"
      decoding="async"
    />
  `;
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
