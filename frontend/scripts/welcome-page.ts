import {
  updateUIForAuthState,
  updateUIforUserMenu,
} from "./user-menu.js";

export async function setInitHash() {
  const isLoggedIn = await isUserOnline();
  if (!location.hash || !isLoggedIn) {
    location.hash = '#welcome-page';
  }
}

export function initWelcomePage() {
	updateUIForAuthState();
	updateUIforUserMenu();
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

export async function isUserOnline(): Promise<true | false> {
  try {
    //check for oauth
    const res = await fetch('/api/me', { 
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) return false;

    const data = await res.json();

    return data.loggedIn === true; 
  } catch (err) {
    console.error('Connection error(isUserOnline function):', err);
    return false;
  }
}
