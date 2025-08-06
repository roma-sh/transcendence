export function setInitialWelcomePage() {
  if (!location.hash)
    location.hash = 'welcome-page';
}

export function addHashForChooseModePage() {
  const playButtonEl = document.querySelector('.js-play-button');
  const signUpButtonEl = document.querySelector('.js-sign-up-button');
  const logInButtonEl = document.querySelector('.js-log-in-button');

  playButtonEl?.addEventListener('click', () => {
    location.hash = 'choose-mode-page';
  });

  signUpButtonEl?.addEventListener('click', () => {
    location.hash = 'sign-up-page';
  });

  logInButtonEl?.addEventListener('click', () => {
    location.hash = 'log-in-page';
  });
}
