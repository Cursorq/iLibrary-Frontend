// ========================
// Navbar and UI Interactions
// ========================

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 100) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
}

window.addEventListener('scroll', updateActiveNav);

// ========================
// Hero and Modal Management
// ========================

const heroBookBtn = document.getElementById('heroBookBtn');
const heroLearnBtn = document.getElementById('heroLearnBtn');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileSignupBtn = document.getElementById('mobileSignupBtn');

function checkAuth() {
    // Always show login modal since backend handles sessions
    showLoginModal();
}

if (heroBookBtn) heroBookBtn.addEventListener('click', checkAuth);
if (heroLearnBtn) heroLearnBtn.addEventListener('click', () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});
if (mobileLoginBtn) {
    mobileLoginBtn.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        showLoginModal();
    });
}
if (mobileSignupBtn) {
    mobileSignupBtn.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        showSignupModal();
    });
};

// ========================
// Modal Functions
// ========================

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modals
document.getElementById('closeLogin')?.addEventListener('click', closeLoginModal);
document.getElementById('closeSignup')?.addEventListener('click', closeSignupModal);
document.getElementById('loginOverlay')?.addEventListener('click', closeLoginModal);
document.getElementById('signupOverlay')?.addEventListener('click', closeSignupModal);

// Switch Modals
document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeLoginModal();
    showSignupModal();
});

document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeSignupModal();
    showLoginModal();
});

// Escape closes modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
    }
});

// ========================
// AUTH: Async Backend Integration
// ========================

const API_BASE = 'http://localhost:8080/public/signup'; // Adjust base URL if needed

const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

async function handleSignup(e) {
    e.preventDefault();

    const userData = {
        username: document.getElementById('signupUsername').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        password: document.getElementById('signupPassword').value.trim(),
        role: document.getElementById('signupRole').value
    };

    const messageBox = document.getElementById('signupMessage');
    messageBox.textContent = 'Creating your account...';

    try {
        const res = await fetch(`${API_BASE}/public/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');

        messageBox.textContent = 'Signup successful! Please login.';
        setTimeout(() => {
            closeSignupModal();
            showLoginModal();
        }, 1000);
    } catch (err) {
        messageBox.textContent = `❌ ${err.message}`;
        console.error(err);
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const loginData = {
        email: document.getElementById('loginEmail').value.trim(),
        password: document.getElementById('loginPassword').value.trim(),
        role: document.getElementById('loginRole').value
    };

    const messageBox = document.getElementById('loginMessage');
    messageBox.textContent = 'Logging in...';

    try {
        const res = await fetch(`${API_BASE}/public/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Invalid credentials');

        messageBox.textContent = `✅ Welcome, ${data.user?.username || 'User'}! Redirecting...`;

        // Redirect to dashboard (backend maintains session via cookie or token)
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    } catch (err) {
        messageBox.textContent = `❌ ${err.message}`;
        console.error(err);
    }
}

if (signupForm) signupForm.addEventListener('submit', handleSignup);
if (loginForm) loginForm.addEventListener('submit', handleLogin);
