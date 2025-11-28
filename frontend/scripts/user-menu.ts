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

export function setupDropdown() {
	const btn = document.querySelector('.js-user-menu-button') as HTMLButtonElement | null;
	const menu = document.querySelector('.js-user-dropdown') as HTMLElement | null;
	if (!btn || !menu) {
		console.log("in setupDropdownMenu btn or menu are null!!!");
		return;
	}

	btn.addEventListener('click', () => {
		menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
	});

	document.addEventListener('click', (e) => {
		const target = e.target as Node;
		if (!btn.contains(target) && !menu.contains(target)) {
			menu.style.display = 'none';
		}
	});

	const profileLink = document.querySelector('.js-profile-link') as HTMLElement | null;

	profileLink?.addEventListener('click', () => {
		location.hash = '#profile-page';
		initProfilePage();
	});

	const settingsLink = document.querySelector('.js-settings-link') as HTMLElement | null;

	settingsLink?.addEventListener('click', () => {
		location.hash = '#settings-page';
		initSettingsPage();
	});
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
