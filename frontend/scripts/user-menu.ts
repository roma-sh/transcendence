import { initProfilePage } from "./profile-page.js";
import { initSettingsPage } from "./settings-page.js";

export function updateUIforUserMenu(isLoggedIn: boolean) {
	const buttonCont = document.querySelector(
		'.js-user-menu-button-container'
	);

	if (!buttonCont) return;

	if (isLoggedIn) {
		buttonCont.classList.remove("user-menu-button-container-hidden");
	} else {
		buttonCont.classList.add("user-menu-button-container-hidden");
	}
}

export function setUserMenuName() {
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
	initProfilePage();
	location.hash = '#profile-page';
}

export function handleOpenSettings() {
	initSettingsPage();
	location.hash = '#settings-page';
}

/** Toggles auth buttons and game buttons (play and connect wallet)
 * depending on whether the user is logged in. */
export function updateUIForAuthState(isLoggedIn: boolean): void {

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
