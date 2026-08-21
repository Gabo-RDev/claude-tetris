'use strict';

// Local high-score table: localStorage-backed top-5, start screen, and
// game-over name entry. Owns the `tetrisScores` key and the start-screen
// overlay. game.js's endGame() calls recordRunScore() (defined below) after
// a run ends; scores.js's JUGAR button is what calls game.js's init().

const SCORES_KEY = 'tetrisScores';
const MAX_SCORES = 5;

function loadScores() {
  try {
    const raw = JSON.parse(localStorage.getItem(SCORES_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveScores(list) {
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable/full: nothing we can do, don't crash the page
  }
}

function qualifiesForTop5(scoreValue, list) {
  return list.length < MAX_SCORES || scoreValue > list[list.length - 1].score;
}

function insertScore(entry, list) {
  const updated = [...list, entry].sort((a, b) => b.score - a.score).slice(0, MAX_SCORES);
  saveScores(updated);
  return updated;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderTable(container, list, highlightIdx) {
  if (!container) return;
  if (!list.length) {
    container.innerHTML = '<p class="records-empty">Sin récords todavía</p>';
    return;
  }
  const rows = list.map((e, i) => `
    <tr class="${i === highlightIdx ? 'highlight' : ''}">
      <td>${i + 1}</td>
      <td>${escapeHtml(e.name)}</td>
      <td>${e.score.toLocaleString()}</td>
      <td>${e.lines}</td>
      <td>${e.level}</td>
      <td>${e.maxCombo}</td>
    </tr>`).join('');
  container.innerHTML = `
    <table class="records-table">
      <thead><tr><th>#</th><th>Nombre</th><th>Score</th><th>Líneas</th><th>Nivel</th><th>Combo</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function refreshPanels() {
  const list = loadScores();
  renderTable(document.getElementById('start-records'), list, -1);
  renderTable(document.getElementById('side-records'), list, -1);
  document.getElementById('start-best-combo').textContent =
    list.reduce((m, e) => Math.max(m, e.maxCombo || 0), 0);
  document.getElementById('start-max-lines').textContent =
    list.reduce((m, e) => Math.max(m, e.lines || 0), 0);
}

// ---- Start screen ----
const startScreen = document.getElementById('start-screen');
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-scores-btn');
const resetConfirm = document.getElementById('reset-confirm');

playBtn.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  init(); // defined in game.js, loaded before this script
});

resetBtn.addEventListener('click', () => {
  resetConfirm.classList.remove('hidden');
});

document.getElementById('reset-no-btn').addEventListener('click', () => {
  resetConfirm.classList.add('hidden');
});

document.getElementById('reset-yes-btn').addEventListener('click', () => {
  saveScores([]);
  resetConfirm.classList.add('hidden');
  refreshPanels();
});

// ---- Game-over integration ----
// Called from game.js's endGame() with the just-finished run's stats.
function recordRunScore({ score, lines, level, maxCombo }) {
  const list = loadScores();
  const overlayRecords = document.getElementById('overlay-records');
  const scoreEntry = document.getElementById('score-entry');
  scoreEntry.classList.add('hidden');
  scoreEntry.innerHTML = '';

  if (!qualifiesForTop5(score, list)) {
    renderTable(overlayRecords, list, -1);
    return;
  }

  renderTable(overlayRecords, list, -1);
  scoreEntry.classList.remove('hidden');
  scoreEntry.innerHTML = `
    <input type="text" id="score-name-input" maxlength="12" placeholder="Tu nombre (máx. 12)" />
    <button id="score-save-btn">Guardar</button>`;

  document.getElementById('score-save-btn').addEventListener('click', () => {
    const input = document.getElementById('score-name-input');
    const name = input.value.trim().slice(0, 12) || 'ANÓNIMO';
    const entry = { name, score, lines, level, maxCombo, date: new Date().toISOString() };
    const updated = insertScore(entry, list);
    const idx = updated.indexOf(entry);
    scoreEntry.classList.add('hidden');
    scoreEntry.innerHTML = '';
    renderTable(overlayRecords, updated, idx);
    refreshPanels();
  });
}

refreshPanels();
