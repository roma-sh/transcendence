import {
  updateUIForAuthState,
  updateUIforUserMenu,
} from "./user-menu.js";
import { apiHeaders } from "./api-config.js";

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

export async function isUserOnline(): Promise<boolean> {
  try {
    const res = await fetch('/api/useronline', { 
      method: 'GET',
      credentials: 'include',
      headers: apiHeaders({ 'Content-Type': 'application/json' }),
    });

    const data = await res.json();

    if (data.online && data.username) {
        const localName = localStorage.getItem('userName');
        if (!localName) {
            console.log("Setting initial userName from server:", data.username);
            localStorage.setItem('userName', data.username);
        } else {
            console.log("Keeping current localStorage name:", localName);
        }
    } else {
      localStorage.removeItem('userName');
    }

    return data.online; 
  } catch (err) {
    localStorage.removeItem('userName');
    return false;
  }
}