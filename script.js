// Main JavaScript for Homepage

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

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        alert(`Thank you for contacting us, ${data.name}! We'll get back to you soon.`);
        contactForm.reset();
    });
}

// Hero Button Actions
const heroBookBtn = document.getElementById('heroBookBtn');
const heroLearnBtn = document.getElementById('heroLearnBtn');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileSignupBtn = document.getElementById('mobileSignupBtn');

// Check if user is logged in
// function checkAuth() {
//     const user = JSON.parse(localStorage.getItem('currentUser'));
//     if (user) {
//         // Redirect to dashboard if logged in
//         window.location.href = 'dashboard.html';
//     } else {
//         // Show login modal if not logged in
//         showLoginModal();
//     }
// }
function checkAuth() {
 //Temp
 showLoginModal();

 //window.location.href = 'dashboard.html';
}


if (heroBookBtn) {
    heroBookBtn.addEventListener('click', checkAuth);
}

if (heroLearnBtn) {
    heroLearnBtn.addEventListener('click', () => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    });
}

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

// Modal Functions
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

// Modal Close Buttons
const closeLogin = document.getElementById('closeLogin');
const closeSignup = document.getElementById('closeSignup');
const loginOverlay = document.getElementById('loginOverlay');
const signupOverlay = document.getElementById('signupOverlay');

if (closeLogin) {
    closeLogin.addEventListener('click', closeLoginModal);
}

if (closeSignup) {
    closeSignup.addEventListener('click', closeSignupModal);
}

if (loginOverlay) {
    loginOverlay.addEventListener('click', closeLoginModal);
}

if (signupOverlay) {
    signupOverlay.addEventListener('click', closeSignupModal);
}

// Switch between Login and Signup
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

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLoginModal();
        closeSignupModal();
    }
});
