import {
  updateUIForAuthState,
  updateUIforUserMenu,
  setUserMenuName,
} from "./user-menu.js";

export async function setInitHash() {
  if (!location.hash) {
    location.hash = '#welcome-page';
  }
}

export async function initWelcomePage() {

	const isLoggedIn = await isUserOnline();

	updateUIForAuthState(isLoggedIn);
	updateUIforUserMenu(isLoggedIn);
	setUserMenuName();
}

export function handleGoBackChooseMode() {
  location.hash = '#welcome-page';
}

export function handleOpenChooseMode() {
  location.hash = '#choose-mode-page';
}

export function handleOpenSignUp() {
  location.hash = '#sign-up-page';
}

export function handleOpenLogIn() {
  location.hash = '#log-in-page';
}

async function isUserOnline(): Promise<true | false> {
  return true; // temp
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
