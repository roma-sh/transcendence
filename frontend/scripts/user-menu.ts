import { isUserOnline } from "./welcome-page.js";
import { apiHeaders } from "./api-config.js";

const USER_MENU_RETURN_KEY = "userMenuReturnHash";

export async function updateUIforUserMenu() {

  const isLoggedIn = await isUserOnline();

	const buttonCont = document.querySelector(
		'.js-user-menu-button-container'
	) as HTMLElement | null;

	if (!buttonCont) return;

	if (isLoggedIn) {
    buttonCont.style.display = 'flex';
	} else {
    buttonCont.style.display = 'none';
	}

  setUserMenuName();
}

function setUserMenuName() {
  const userName = localStorage.getItem('userName');
  console.log("Current userName in localStorage:", userName);

  const navLabel = document.querySelector('.nav-user-id') as HTMLElement | null;

  if (navLabel && userName) {
    navLabel.textContent = userName;
  }
}

export function handleToggleUserMenu(e: MouseEvent) {
	const menu = document.querySelector('.js-user-dropdown') as HTMLElement | null;
	if (!menu) return;

	menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

export function handleGoogleLogin() {
  window.location.href = 'https://localhost:8443/api/google';
}

export function handleOpenProfile() {
  storeUserMenuReturnHash();
	location.hash = '#profile-page';
}

export function handleOpenSettings() {
  storeUserMenuReturnHash();
	location.hash = '#settings-page';
}

export function handleOpenWelcomePage() {
  location.hash = '#welcome-page';
}

export function getUserMenuReturnHash(): string | null {
  return sessionStorage.getItem(USER_MENU_RETURN_KEY);
}

export function clearUserMenuReturnHash(): void {
  sessionStorage.removeItem(USER_MENU_RETURN_KEY);
}

function storeUserMenuReturnHash(): void {
  const currentHash = location.hash || '#welcome-page';
  sessionStorage.setItem(USER_MENU_RETURN_KEY, currentHash);
}

export async function updateUIForAuthState() {

  const isLoggedIn = await isUserOnline();

  const authBtns = document.querySelector(
    ".js-signup-login-btns") as HTMLElement | null;
  const playConnectWalletBtns = document.querySelector(
    ".js-play-connect-wallet-btns") as HTMLElement | null;

  if (!playConnectWalletBtns || !authBtns) return;

  if (isLoggedIn) {
    authBtns.style.display = "none";
    playConnectWalletBtns.style.display = "block";
  } else {
    authBtns.style.display = "flex";
    playConnectWalletBtns.style.display = "none";
  }
}

export async function handleLogOut(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: apiHeaders(),
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
    }

    if (!data || !data.success) {
      console.error('Logout failed');
      return false;
    }

    localStorage.removeItem('userName');
    location.hash = '';
    location.hash = '#welcome-page';
	location.reload();

    return true;
  } catch (error) {
    console.error('Logout ERROR:', error);
    return false;
  }
}
