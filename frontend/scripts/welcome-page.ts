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
    const res = await fetch('/api/useronline', { 
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

	if (res.status === 401) {
		console.warn("User session expired or not logged in.");
		return false;
	}

	if (!res.ok)
    return false;
    
    const data = await res.json();

    if (data.online && data.username) {
        localStorage.setItem('userName', data.username);
    }

    return data.online; 
  } catch (err) {
    console.error('Connection error(isUserOnline function):', err);
    return false;
  }
}

