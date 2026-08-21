'use strict';

const pauseMenu = document.getElementById('pause-menu');
const pauseControls = document.getElementById('pause-controls');
const toggleControlsBtn = document.getElementById('toggle-controls-btn');
const resumeBtn = document.getElementById('resume-btn');
const pauseRestartBtn = document.getElementById('pause-restart-btn');
const startLevelSelect = document.getElementById('start-level-select');

startLevelSelect.value = localStorage.getItem('startLevel') || '1';

startLevelSelect.addEventListener('change', () => {
  localStorage.setItem('startLevel', startLevelSelect.value);
  startLevelSelect.blur();
});

toggleControlsBtn.addEventListener('click', () => {
  pauseControls.classList.toggle('hidden');
});

resumeBtn.addEventListener('click', togglePause);

pauseRestartBtn.addEventListener('click', () => {
  init();
  hidePauseMenu();
});

function showPauseMenu() {
  pauseMenu.classList.remove('hidden');
}

function hidePauseMenu() {
  pauseMenu.classList.add('hidden');
  pauseControls.classList.add('hidden');
}
