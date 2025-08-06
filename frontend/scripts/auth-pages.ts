export function initSignUpPage(): void {
	const signUpSection = document.querySelector('#sign-up-page') as HTMLElement;
	if (!signUpSection) return;

	const signUpButton = signUpSection.querySelector('.auth-submit-button') as HTMLButtonElement;
	const usernameInput = signUpSection.querySelector('input[placeholder="Username"]') as HTMLInputElement;
	const emailInput = signUpSection.querySelector('input[placeholder="Email"]') as HTMLInputElement;
	const passwordInput = signUpSection.querySelector('input[placeholder="Password"]') as HTMLInputElement;

	signUpButton?.addEventListener('click', () => {
	  const username = usernameInput.value.trim();
	  const email = emailInput.value.trim();
	  const password = passwordInput.value;

	  if (!username || !email || !password) {
		alert('Please fill in all fields');
		return;
	  }

	  // Placeholder: log or send to server
	  console.log('Signing up:', { username, email, password });

	  // TODO: replace with real backend logic
	  alert('Signed up successfully!');
	});
  }

  export function initLogInPage(): void {
	const logInSection = document.querySelector('#log-in-page') as HTMLElement;
	if (!logInSection) return;

	const logInButton = logInSection.querySelector('.auth-submit-button') as HTMLButtonElement;
	const usernameInput = logInSection.querySelector('input[placeholder="Username or Email"]') as HTMLInputElement;
	const passwordInput = logInSection.querySelector('input[placeholder="Password"]') as HTMLInputElement;

	logInButton?.addEventListener('click', () => {
	  const usernameOrEmail = usernameInput.value.trim();
	  const password = passwordInput.value;

	  if (!usernameOrEmail || !password) {
		alert('Please fill in all fields');
		return;
	  }

	  // Placeholder: log or send to server
	  console.log('Logging in:', { usernameOrEmail, password });

	  // TODO: replace with real backend logic
	  alert('Logged in successfully!');
	});
  }
