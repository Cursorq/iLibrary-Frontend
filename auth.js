const SIGNUP_URL = 'http://localhost:8080/public/signup';
const LOGIN_URL = 'http://localhost:8080/public/login';

// ---- Utility Functions ----
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    if (errorElement) errorElement.textContent = message;
    if (inputElement) inputElement.style.borderColor = 'hsl(0, 84%, 60%)';
}

function clearError(inputId, errorId) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    if (errorElement) errorElement.textContent = '';
    if (inputElement) inputElement.style.borderColor = '';
}

// ---- Signup ----
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const signupUsername = document.getElementById('signupUsername');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupRole = document.getElementById('signupRole');

    signupEmail?.addEventListener('blur', () => {
        const email = signupEmail.value.trim();
        if (!email) {
            showError('signupEmail', 'signupEmailError', 'Email is required');
        } else if (!validateEmail(email)) {
            showError('signupEmail', 'signupEmailError', 'Please enter a valid email address');
        } else {
            clearError('signupEmail', 'signupEmailError');
        }
    });
    signupEmail?.addEventListener('input', () =>
        clearError('signupEmail', 'signupEmailError')
    );

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = signupUsername.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const roleValue = signupRole.value;

        if (!username || !email || !password || !roleValue) {
            alert('Please fill in all fields.');
            return;
        }
        if (!validateEmail(email)) {
            showError('signupEmail', 'signupEmailError', 'Please enter a valid email address');
            return;
        }

        const userData = {
            username,
            email,
            password,
            roles: [roleValue] // MUST be array string: e.g. ["STUDENT"]
        };

        try {
            const res = await fetch(SIGNUP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            let msg = 'Signup successful! You can now log in.';
            if (!res.ok) {
                try {
                    const errData = await res.json();
                    msg = errData.message || msg;
                } catch {
                    msg = await res.text();
                }
                throw new Error(msg);
            } else {
                try {
                    const data = await res.json();
                    if (data.message) msg = data.message;
                } catch {
                    msg = await res.text();
                }
            }
            alert(`${msg}`);
            closeSignupModal();
            showLoginModal();
        } catch (err) {
            console.error(err);
            alert(`Signup error: ${err.message}`);
        }
    });
}

// ---- Login ----
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginRole = document.getElementById('loginRole');

    loginEmail?.addEventListener('blur', () => {
        const email = loginEmail.value.trim();
        if (!email) {
            showError('loginEmail', 'loginEmailError', 'Email is required');
        } else if (!validateEmail(email)) {
            showError('loginEmail', 'loginEmailError', 'Please enter a valid email address');
        } else {
            clearError('loginEmail', 'loginEmailError');
        }
    });
    loginEmail?.addEventListener('input', () =>
        clearError('loginEmail', 'loginEmailError')
    );

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        const roleValue = loginRole.value;

        if (!email || !password || !roleValue) {
            alert('Please fill in all fields.');
            return;
        }
        if (!validateEmail(email)) {
            showError('loginEmail', 'loginEmailError', 'Please enter a valid email address');
            return;
        }

        const loginData = {
            email,
            password,
            role: roleValue
        };

        try {
            const res = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            let msg = 'Login successful! Welcome.';
            let username = '';
            if (!res.ok) {
                try {
                    const errData = await res.json();
                    msg = errData.message || msg;
                } catch {
                    msg = await res.text();
                }
                throw new Error(msg);
            } else {
                try {
                    const data = await res.json();
                    username = data.username || '';
                } catch {}
            }
            alert(`${msg} ${username ? ('Welcome ' + username + '.') : ''}`);
            window.location.href = 'dashboard.html';
        } catch (err) {
            console.error(err);
            alert(`Login error: ${err.message}`);
        }
    });
}

// ---- Modal Helpers ----
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showSignupModal() {
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeSignupModal() {
    const signupModal = document.getElementById('signupModal');
    if (signupModal) {
        signupModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeLoginModal();
        showSignupModal();
    });
}
if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeSignupModal();
        showLoginModal();
    });
}
