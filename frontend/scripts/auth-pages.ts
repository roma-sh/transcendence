import { setUserMenu } from "./user-menu.js";
import { storeToken, storeUserData, removeToken } from "./jwt-utils.js";

export function initSignUpPage(): void {
  const signUpSection = document.querySelector('#sign-up-page') as HTMLElement;
  if (!signUpSection) return;

  const signUpButton = signUpSection.querySelector('.auth-submit-button') as HTMLButtonElement;
  const usernameInput = signUpSection.querySelector('input[placeholder="Username"]') as HTMLInputElement;
  const emailInput = signUpSection.querySelector('input[placeholder="Email"]') as HTMLInputElement;
  const passwordInput = signUpSection.querySelector('input[placeholder="Password"]') as HTMLInputElement;

  signUpButton?.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!username || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Signed up successfully!');
        // Optionally redirect to login page or clear form
        location.hash = '#log-in-page';
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Error while signing up. Please try again.');
    }
  });
}


export function initLogInPage(): void {
  const logInSection = document.querySelector('#log-in-page') as HTMLElement;
  if (!logInSection) return;

  const logInButton = logInSection.querySelector('.auth-submit-button') as HTMLButtonElement;
  const usernameInput = logInSection.querySelector('input[placeholder="Username or Email"]') as HTMLInputElement;
  const passwordInput = logInSection.querySelector('input[placeholder="Password"]') as HTMLInputElement;
  const twoFactorContainer = document.getElementById('2fa-input-container') as HTMLElement;
  const twoFactorInput = document.getElementById('login-2fa-code') as HTMLInputElement;

  let requires2FA = false;

  // Reset form when page is shown
  const resetForm = () => {
    requires2FA = false;
    if (twoFactorContainer) twoFactorContainer.style.display = 'none';
    if (twoFactorInput) twoFactorInput.value = '';
    if (usernameInput) usernameInput.disabled = false;
    if (passwordInput) passwordInput.disabled = false;
  };

  // Show 2FA input
  const show2FAInput = () => {
    requires2FA = true;
    if (twoFactorContainer) twoFactorContainer.style.display = 'block';
    if (twoFactorInput) {
      twoFactorInput.focus();
      twoFactorInput.value = '';
    }
    if (usernameInput) usernameInput.disabled = true;
    if (passwordInput) passwordInput.disabled = true;
  };

  logInButton?.addEventListener('click', async () => {
    const identifier = usernameInput.value.trim();
    const password = passwordInput.value;
    const twoFactorCode = twoFactorInput?.value.trim();

    if (!identifier || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (requires2FA && (!twoFactorCode || twoFactorCode.length !== 6)) {
      alert('Please enter a valid 6-digit 2FA code');
      return;
    }

    try {
      const requestBody: any = { username: identifier, password };
      if (requires2FA && twoFactorCode) {
        requestBody.twoFactorCode = twoFactorCode;
      }

      const response = await fetch('http://127.0.0.1:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      let result;
      try {
        result = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Failed to parse JSON:', text);
        alert('Server returned invalid response');
        return;
      }

      if (response.ok) {
        // Check if 2FA is required
        if (result.requires2FA) {
          show2FAInput();
          return;
        }

        // Login successful - store token and user data
        if (result.token) {
          storeToken(result.token);
        }
        if (result.user) {
          storeUserData(result.user);
          localStorage.setItem('userName', result.user.username);
        }

        updateUIForAuthState(true);
        setUserMenu();
        alert('Logged in successfully!');
        resetForm();
        location.hash = '#welcome-page';
      } else {
        alert(result.error || result.message || 'Invalid username/email or password');
        if (requires2FA) {
          // Reset 2FA input on error
          if (twoFactorInput) twoFactorInput.value = '';
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error while logging in. Please try again.');
    }
  });

  // Reset form when hash changes to login page
  const handleHashChange = () => {
    if (location.hash === '#log-in-page') {
      resetForm();
    }
  };
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

/** Toggles auth buttons and game buttons depending
 * on whether the user is logged in. */
function updateUIForAuthState(isLoggedIn: boolean): void {
  const initButtons = document.querySelector(".js-init-buttons");
  const mainButtons = document.querySelector(".js-main-buttons");

  if (!mainButtons || !initButtons) return;

  if (isLoggedIn) {
    initButtons.classList.add("init-buttons-hidden");
    mainButtons.classList.remove("main-buttons-hidden");
  } else {
    initButtons.classList.remove("init-buttons-hidden");
    mainButtons.classList.add("main-buttons-hidden");
  }
}
