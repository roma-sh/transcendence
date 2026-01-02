import {
  toggleOpacity,
  showMessage
} from "./settings-page.js";
import {
  updatePassMsgDot
} from "./profile-page.js";

export function handleGoBackSignUp() {
  location.hash = '#welcome-page';
}

export function handleGoBackLogIn() {
  location.hash = '#welcome-page';
}

export async function handleSubmitSignUp(event?: MouseEvent): Promise<void> {

  const signUpSection = document.querySelector(
    '#sign-up-page') as HTMLElement | null;
  if (!signUpSection) return;

  const signupTextDotEl = document.querySelector(
    '.js-signup-text-dot') as HTMLElement | null;
  const signupStatusText = document.querySelector(
    '.js-signup-status-text') as HTMLElement | null;
  const signupStatus = document.querySelector(
    '.js-signup-status') as HTMLElement | null;

  const usernameInput = signUpSection.querySelector('input[placeholder="Username"]') as HTMLInputElement;
  const emailInput = signUpSection.querySelector('input[placeholder="Email"]') as HTMLInputElement;
  const passwordInput = signUpSection.querySelector('input[placeholder="Password"]') as HTMLInputElement;

  if (!usernameInput || !emailInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!username || !email || !password) {
    updatePassMsgDot('red', signupTextDotEl);
    showMessage(signupStatusText, "Please fill in all fields!");
    toggleOpacity(signupStatus);
    return;
  }

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }),
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

  const logInSection = document.querySelector('#log-in-page') as HTMLElement;
  if (!logInSection) return;

  const usernameInput = logInSection.querySelector('input[placeholder="Username or Email"]') as HTMLInputElement;
  const passwordInput = logInSection.querySelector('input[placeholder="Password"]') as HTMLInputElement;

  if (!usernameInput || !passwordInput) return;

  const identifier = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!identifier || !password) {
    alert('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      credentials: 'include',
      body: JSON.stringify({ username: identifier, password }),
    });

    console.log('Response status:', response.status);

    let result: any;
    try {
      result = await response.json();
    } catch (e) {
      const text = await response.text();
      console.error('Failed to parse JSON:', text);
      alert('Server returned invalid response');
      return;
    }

    if (response.ok) {
      localStorage.setItem('userName', result.user.username);
      location.hash = '#welcome-page';
    } else {
      alert(result.error || 'Invalid username/email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Error while logging in. Please try again.');
  }
}
