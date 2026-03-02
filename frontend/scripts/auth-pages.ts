import {
  toggleOpacity,
  showMessage
} from "./settings-page.js";
import {
  updatePassMsgDot
} from "./profile-page.js";
import { apiHeaders } from "./api-config.js";

export function handleGoBackSignUp() {
  location.hash = '#welcome-page';
}

export function handleGoBackLogIn() {
  location.hash = '#welcome-page';
}

export async function handleSubmitSignUp(event?: MouseEvent): Promise<void> {
  const signUpSection = document.querySelector('#sign-up-page') as HTMLElement | null;
  if (!signUpSection) return;

  const signupTextDotEl = document.querySelector('.js-signup-text-dot') as HTMLElement | null;
  const signupStatusText = document.querySelector('.js-signup-status-text') as HTMLElement | null;
  const signupStatus = document.querySelector('.js-signup-status') as HTMLElement | null;

  const usernameInput = signUpSection.querySelector('input[placeholder="Username"]') as HTMLInputElement | null;
  const emailInput = signUpSection.querySelector('input[placeholder="Email"]') as HTMLInputElement | null;
  const passwordInput = signUpSection.querySelector('input[placeholder="Password"]') as HTMLInputElement | null;
  
  const termsCheckbox = signUpSection.querySelector('#terms-checkbox') as HTMLInputElement | null;

  if (!usernameInput || !emailInput || !passwordInput || !termsCheckbox) return;

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const acceptedTerms = termsCheckbox.checked; 

  if (!username || !email || !password) {
    updatePassMsgDot('red', signupTextDotEl);
    showMessage(signupStatusText, "Please fill in all fields!");
    toggleOpacity(signupStatus);
    return;
  }

  if (!acceptedTerms) {
    updatePassMsgDot('red', signupTextDotEl);
    showMessage(signupStatusText, "Please accept the Terms & Conditions!");
    toggleOpacity(signupStatus);
    return; 
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: apiHeaders({ 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }),
      credentials: 'include',
      body: JSON.stringify({ username, email, password, acceptedTerms }),
    });

    const result = await response.json();

    if (response.ok) {
      updatePassMsgDot('green', signupTextDotEl);
      showMessage(signupStatusText, "Signed up successfully!");
      toggleOpacity(signupStatus);
      window.setTimeout(() => {
        location.hash = '#log-in-page';
      }, 1800);
    } else {
      const errText = String(result?.error ?? "Sign up failed");
      let msg = errText.split(".")[0];
      updatePassMsgDot('red', signupTextDotEl);
      showMessage(signupStatusText, msg);
      toggleOpacity(signupStatus);
    }
  } catch (err) {
    updatePassMsgDot('red', signupTextDotEl);
    showMessage(signupStatusText, "Error while signing up!");
    toggleOpacity(signupStatus);
  }
}

export async function handleSubmitLogIn(event?: MouseEvent): Promise<void> {

  const logInSection = document.querySelector(
    '#log-in-page') as HTMLElement | null;
  if (!logInSection) return;

  const loginTextDotEl = document.querySelector(
    '.js-login-text-dot') as HTMLElement | null;
  const loginStatusText = document.querySelector(
    '.js-login-status-text') as HTMLElement | null;
  const loginStatus = document.querySelector(
    '.js-login-status') as HTMLElement | null;

  const usernameInput = logInSection.querySelector(
    'input[placeholder="Username or Email"]') as HTMLInputElement | null;
  const passwordInput = logInSection.querySelector(
    'input[placeholder="Password"]') as HTMLInputElement | null;

  if (!usernameInput || !passwordInput) return;

  const identifier = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!identifier || !password) {
    updatePassMsgDot('red', loginTextDotEl);
    showMessage(loginStatusText, "Please fill in all fields!");
    toggleOpacity(loginStatus);
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: apiHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      }),
      credentials: 'include',
      body: JSON.stringify({ username: identifier, password }),
    });

    let result = await response.json();

    if (response.ok) {
      // Check if 2FA is required
      if (result.requires2FA && result.userId) {
        const { show2FALoginModal } = await import('./two-factor.js');
        show2FALoginModal(result.userId);
        return;
      }

      if (result.token) {
        localStorage.setItem('jwt_token', result.token);
      }
      localStorage.setItem('userName', result.user.username);
      location.hash = '#welcome-page';
    } else {
      let msg = result.message || 'Error while logging in!';
      updatePassMsgDot('red', loginTextDotEl);
      showMessage(loginStatusText, msg);
      toggleOpacity(loginStatus);
    }
  } catch (error) {
    updatePassMsgDot('red', loginTextDotEl);
    showMessage(loginStatusText, "Error while logging in!");
    toggleOpacity(loginStatus);
  }
}

export function initTermsModal(): void {
  const openBtn = document.getElementById('open-terms');
  const closeBtn = document.getElementById('close-terms');
  const modal = document.getElementById('terms-modal');
  const contentContainer = modal?.querySelector('.js-modal-content');

  if (!openBtn || !closeBtn || !modal || !contentContainer) return;

  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEsc);
  };

  const openModal = async (e: MouseEvent) => {
    e.preventDefault();
    
    if (contentContainer.innerHTML.trim() === "") {
      contentContainer.innerHTML = '<p class="text-center py-4">Loading terms...</p>';
      try {
        const response = await fetch('../assets/terms.html'); 
        if (!response.ok) throw new Error('Failed to load');
        const html = await response.text();
        contentContainer.innerHTML = html;
      } catch (err) {
        contentContainer.innerHTML = '<p class="text-red-500">Could not load terms. Please try again later.</p>';
      }
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEsc);
  };

  openBtn.addEventListener('click', openModal as EventListener);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}