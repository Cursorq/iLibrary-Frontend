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
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
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
    // Check if user is authenticated
    const token = localStorage.getItem('jwtToken');
    if (token) {
        // User is logged in, go to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show login modal
        showLoginModal();
    }
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
}

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
// Contact Form Handler
// ========================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}
