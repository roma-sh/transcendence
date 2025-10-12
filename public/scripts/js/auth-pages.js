export function initSignUpPage() {
    const signUpSection = document.querySelector('#sign-up-page');
    if (!signUpSection)
        return;
    const signUpButton = signUpSection.querySelector('.auth-submit-button');
    const usernameInput = signUpSection.querySelector('input[placeholder="Username"]');
    const emailInput = signUpSection.querySelector('input[placeholder="Email"]');
    const passwordInput = signUpSection.querySelector('input[placeholder="Password"]');
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
            }
            else {
                alert(result.error || 'Registration failed');
            }
        }
        catch (err) {
            console.error('Signup error:', err);
            alert('Error while signing up. Please try again.');
        }
    });
}
export function initLogInPage() {
    const logInSection = document.querySelector('#log-in-page');
    if (!logInSection)
        return;
    const logInButton = logInSection.querySelector('.auth-submit-button');
    const usernameInput = logInSection.querySelector('input[placeholder="Username or Email"]');
    const passwordInput = logInSection.querySelector('input[placeholder="Password"]');
    logInButton?.addEventListener('click', async () => {
        const identifier = usernameInput.value.trim();
        const password = passwordInput.value;
        if (!identifier || !password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
                body: JSON.stringify({ username: identifier, password }),
            });
            console.log('Response status:', response.status);
            let result;
            try {
                result = await response.json();
            }
            catch (e) {
                const text = await response.text();
                console.error('Failed to parse JSON:', text);
                alert('Server returned invalid response');
                return;
            }
            if (response.ok) {
                alert('Logged in successfully!');
                localStorage.setItem('userName', result.user.username);
                location.hash = '#user-profile';
            }
            else {
                alert(result.error || 'Invalid username/email or password');
            }
        }
        catch (error) {
            console.error('Login error:', error);
            alert('Error while logging in. Please try again.');
        }
    });
}
