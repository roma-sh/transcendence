import {
  updateUIForAuthState,
  updateUIforUserMenu,
  setUserMenuName,
  setupDropdown
} from "./user-menu.js";

export async function setInitHash() {
  if (!location.hash) {
    await initWelcomePage();
    location.hash = '#welcome-page';
  }
}

export async function initWelcomePage() {
  await updateWelcomePageUI();
  setupDropdown();
}

export async function updateWelcomePageUI() {

	const isLoggedIn = await isUserOnline();

	updateUIForAuthState(isLoggedIn);
	updateUIforUserMenu(isLoggedIn);
	setUserMenuName();
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

async function isUserOnline(): Promise<true | false> {
  // return true; // temp
  try {
    const res = await fetch('http://localhost:3000/api/useronline');

    if (!res.ok) {
      console.log("in userOnline function response is not ok");
      return false;
    }

    const data = await res.json();
    console.log('data: ', data);


    if (data.online === 1) {
      console.log("in userOnline function data.online === 1");
      return true;
    }
    if (data.online === 0) {
      console.log("in userOnline function data.online === 0");
      return false;
    }

    console.log("in userOnline function fallback");
    return false; // fallback
  } catch (err) {
    console.error('Connection error:', err);
    return false;
  }
}
