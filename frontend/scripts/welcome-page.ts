import {
  updateUIForAuthState,
  updateUIforUserMenu,
} from "./user-menu.js";

export async function setInitHash() {
  if (!location.hash) {
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
    const res = await fetch('http://localhost:3000/api/useronline', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok)
      return false;

    const data = await res.json();

    return data.online;
  } catch (err) {
    console.error('Connection error(isUserOnline function):', err);
    return false;
  }
}
