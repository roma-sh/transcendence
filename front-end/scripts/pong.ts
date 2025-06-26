import { initGameOptionHighlight } from './choose-mode.js';

// for the welcome page:
setInitialWelcomePage();
addHashForChooseModePage();

// for the choose mode page:
initGameOptionHighlight();

function setInitialWelcomePage() {
  if (!location.hash)
    location.hash = 'welcome-page';
}

function addHashForChooseModePage() {
  const playButtonEl = document.querySelector('.js-play-button');

  playButtonEl?.addEventListener('click', () => {
    location.hash = 'choose-mode-page';
  });
}
