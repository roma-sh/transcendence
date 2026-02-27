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

// export function updateUIforUserMenu(isLoggedIn: boolean | undefined) {
//     const userMenu = document.querySelector('.js-user-menu');
//     const loginBtn = document.querySelector('.js-login-nav-btn');

//     if (!userMenu || !loginBtn) return;

//     if (isLoggedIn) {
//         // Αν ο χρήστης είναι συνδεδεμένος, δείξε το μενού και κρύψε το Login
//         userMenu.classList.remove('hidden');
//         loginBtn.classList.add('hidden');
        
//         // Μπορείς να προσθέσεις εδώ και το όνομα του χρήστη αν υπάρχει στο localStorage
//         const userName = localStorage.getItem('userName');
//         const nameEl = document.querySelector('.js-user-menu-name');
//         if (nameEl && userName) nameEl.textContent = userName;
//     } else {
//         // Αν δεν είναι συνδεδεμένος, κρύψε το μενού και δείξε το Login
//         userMenu.classList.add('hidden');
//         loginBtn.classList.remove('hidden');
//     }
// }

function setUserMenuName() {
	const userName = localStorage.getItem('userName');

	const userMenuBtn = document.querySelector(
			'.js-user-menu-button'
		) as HTMLButtonElement | null;

	if (userMenuBtn) userMenuBtn.textContent = userName;
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
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: apiHeaders(),
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
