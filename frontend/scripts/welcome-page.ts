export function setInitialWelcomePage() {
  if (!location.hash)
    location.hash = 'welcome-page';
}

export function addHashForChooseModePage() {
  const playButtonEl = document.querySelector('.js-play-button');
  const signUpButtonEl = document.querySelector('.js-sign-up-button');
  const logInButtonEl = document.querySelector('.js-log-in-button');

  playButtonEl?.addEventListener('click', () => {
    setupBackButton('js-choose-mode-back-btn', 'welcome-page');
    location.hash = 'choose-mode-page';
  });

  signUpButtonEl?.addEventListener('click', () => {
    location.hash = 'sign-up-page';
  });

  logInButtonEl?.addEventListener('click', () => {
    location.hash = 'log-in-page';
  });
}

export function setupBackButton(btn_name: string, targetHash: string) {
  const btn = document.querySelector(`.${btn_name}`) as HTMLButtonElement | null;

  if (btn) {
    btn.onclick = () => {
      location.hash = targetHash;
    };
  }
}
