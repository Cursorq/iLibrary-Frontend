// Base API URL
const API_BASE = 'http://localhost:8080/public/signup';

// ------------------ Utility Functions ------------------

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(inputId, errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);

    if (errorElement) errorElement.textContent = message;
    if (inputElement) inputElement.style.borderColor = 'hsl(0, 84%, 60%)';
}

// Clear error message
function clearError(inputId, errorId) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);

    if (errorElement) errorElement.textContent = '';
    if (inputElement) inputElement.style.borderColor = '';
}

// ------------------ Signup Form ------------------
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const signupUsername = document.getElementById('signupUsername');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupRole = document.getElementById('signupRole');

    // Email validation
    if (signupEmail) {
        signupEmail.addEventListener('blur', () => {
            const email = signupEmail.value.trim();
            if (!email) {
                showError('signupEmail', 'signupEmailError', 'Email is required');
            } else if (!validateEmail(email)) {
                showError('signupEmail', 'signupEmailError', 'Please enter a valid email address');
            } else {
                clearError('signupEmail', 'signupEmailError');
            }
        });
        signupEmail.addEventListener('input', () => clearError('signupEmail', 'signupEmailError'));
    }

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = signupUsername.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const roleValue = signupRole.value;

        // Validate fields
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
            role: [roleValue] // sending role as array of strings
        };

        try {
            const res = await fetch('http://localhost:8080/public/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Signup failed');
            }

            const data = await res.json();
            alert(`Signup successful! ${data.message || 'You can now log in.'}`);
            closeSignupModal();
            showLoginModal();

        } catch (err) {
            console.error(err);
            alert(`Signup error: ${err.message}`);
        }
    });
}

// ------------------ Login Form ------------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginRole = document.getElementById('loginRole');

    if (loginEmail) {
        loginEmail.addEventListener('blur', () => {
            const email = loginEmail.value.trim();
            if (!email) {
                showError('loginEmail', 'loginEmailError', 'Email is required');
            } else if (!validateEmail(email)) {
                showError('loginEmail', 'loginEmailError', 'Please enter a valid email address');
            } else {
                clearError('loginEmail', 'loginEmailError');
            }
        });
        loginEmail.addEventListener('input', () => clearError('loginEmail', 'loginEmailError'));
    }

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
            role: [roleValue] // sending as array for backend
        };

        try {
            const res = await fetch('http://localhost:8080/public/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Invalid credentials');
            }

            const data = await res.json();
            alert(`Login successful! Welcome ${data.username || 'user'}.`);
            window.location.href = '/dashboard.html'; // redirect after login

        } catch (err) {
            console.error(err);
            alert(`Login error: ${err.message}`);
        }
    });
}

// ------------------ Modal Helpers ------------------
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

// Modal switch links
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
