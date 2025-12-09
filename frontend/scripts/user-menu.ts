import { isUserOnline } from "./welcome-page.js";

export async function updateUIforUserMenu() {

  const isLoggedIn = await isUserOnline();

	const buttonCont = document.querySelector(
		'.js-user-menu-button-container'
	);

	if (!buttonCont) return;

	if (isLoggedIn) {
		buttonCont.classList.remove("user-menu-button-container-hidden");
	} else {
		buttonCont.classList.add("user-menu-button-container-hidden");
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
	location.hash = '#profile-page';
}

export function handleOpenSettings() {
	location.hash = '#settings-page';
}

/** Toggles auth buttons and game buttons (play and connect wallet)
 * depending on whether the user is logged in. */
export async function updateUIForAuthState() {

  const isLoggedIn = await isUserOnline();

  const authBtns = document.querySelector(".js-signup-login-btns");
  const playConnectWalletBtns = document.querySelector(".js-play-connect-wallet-btns");

  if (!playConnectWalletBtns || !authBtns) return;

  if (isLoggedIn) {
    authBtns.classList.add("signup-login-btns-hidden");
    playConnectWalletBtns.classList.remove("play-connect-wallet-btns-hidden");
  } else {
    authBtns.classList.remove("signup-login-btns-hidden");
    playConnectWalletBtns.classList.add("play-connect-wallet-btns-hidden");
  }
}

export async function handleLogOut(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    console.log('Logout status:', res.status);

    if (!res.ok) {
      console.error(' failed:', res.status);
      return false;
    }

    let data: any = null;
    try {
      data = await res.json();
      console.log('Logout response:', data);
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
