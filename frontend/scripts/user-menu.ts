import { isUserOnline } from "./welcome-page.js";

const USER_MENU_RETURN_KEY = "userMenuReturnHash";

export async function updateUIforUserMenu() {

  const isLoggedIn = await isUserOnline();

  console.log("isLoggedIn: ", isLoggedIn);

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

	const userMenuBtn = document.querySelector(
			'.js-user-menu-button'
		) as HTMLButtonElement;
	
	userMenuBtn.textContent = userName;
}

export function handleToggleUserMenu(e: MouseEvent) {
	const menu = document.querySelector('.js-user-dropdown') as HTMLElement | null;
	if (!menu) return;

	menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

export function handleOpenProfile() {
  storeUserMenuReturnHash();
	location.hash = '#profile-page';
}

export function handleOpenSettings() {
  storeUserMenuReturnHash();
	location.hash = '#settings-page';
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

/** Toggles auth buttons and game buttons (play and connect wallet)
 * depending on whether the user is logged in. */
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
    const res = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      console.error(' failed:', res.status);
      return false;
    }

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // backend might return empty response
    }

    localStorage.removeItem('userName');

    /** Reset hash first so hashchange fires
     * even when navigating to the same page */
    location.hash = '';
    location.hash = '#welcome-page';

    return true;
  } catch (error) {
    console.error('Logout ERROR:', error);
    return false;
  }
}
