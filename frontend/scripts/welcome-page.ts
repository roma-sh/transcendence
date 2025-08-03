export function setInitialWelcomePage() {
  if (!location.hash)
    location.hash = 'welcome-page';
}

export function addHashForChooseModePage() {
  const playButtonEl = document.querySelector('.js-play-button');

  playButtonEl?.addEventListener('click', () => {
    location.hash = 'choose-mode-page';
  });
}
