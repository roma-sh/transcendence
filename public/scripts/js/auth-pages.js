export function initSignUpPage() {
    const signUpSection = document.querySelector('#sign-up-page');
    if (!signUpSection)
        return;
    const signUpButton = signUpSection.querySelector('.auth-submit-button');
    const usernameInput = signUpSection.querySelector('input[placeholder="Username"]');
    const emailInput = signUpSection.querySelector('input[placeholder="Email"]');
    const passwordInput = signUpSection.querySelector('input[placeholder="Password"]');
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
export function initLogInPage() {
    const logInSection = document.querySelector('#log-in-page');
    if (!logInSection)
        return;
    const logInButton = logInSection.querySelector('.auth-submit-button');
    const usernameInput = logInSection.querySelector('input[placeholder="Username or Email"]');
    const passwordInput = logInSection.querySelector('input[placeholder="Password"]');
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
