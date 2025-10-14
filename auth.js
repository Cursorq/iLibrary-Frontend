// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(inputId, errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.style.borderColor = 'hsl(0, 84%, 60%)';
    }
}

// Clear error message
function clearError(inputId, errorId) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    if (inputElement) {
        inputElement.style.borderColor = '';
    }
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginRole = document.getElementById('loginRole');
    
    // Email validation on blur
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
        
        loginEmail.addEventListener('input', () => {
            clearError('loginEmail', 'loginEmailError');
        });
    }
    
    // Form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        const role = loginRole.value;
        
        // Validate email
        if (!validateEmail(email)) {
            showError('loginEmail', 'loginEmailError', 'Please enter a valid email address');
            return;
        }
        
        // Validate all fields
        if (!email || !password || !role) {
            alert('Please fill in all fields');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user exists
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        
        if (user) {
            // Save current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Show success message
            alert(`Welcome back, ${user.username}!`);
            
            // Redirect based on role
            if (role === 'user') {
                window.location.href = 'dashboard.html';
            } else {
                alert(`${role.charAt(0).toUpperCase() + role.slice(1)} dashboard coming soon!`);
                window.location.href = 'dashboard.html';
            }
        } else {
            alert('Invalid credentials. Please check your email, password, and role.');
        }
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    const signupUsername = document.getElementById('signupUsername');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupRole = document.getElementById('signupRole');
    
    // Email validation on blur
    if (signupEmail) {
        signupEmail.addEventListener('blur', () => {
            const email = signupEmail.value.trim();
            
            if (!email) {
                showError('signupEmail', 'signupEmailError', 'Email is required');
            } else if (!validateEmail(email)) {
                showError('signupEmail', 'signupEmailError', 'Please enter a valid email address');
            } else {
                // Check if email already exists
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const emailExists = users.some(u => u.email === email);
                
                if (emailExists) {
                    showError('signupEmail', 'signupEmailError', 'This email is already registered');
                } else {
                    clearError('signupEmail', 'signupEmailError');
                }
            }
        });
        
        signupEmail.addEventListener('input', () => {
            clearError('signupEmail', 'signupEmailError');
        });
    }
    
    // Form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = signupUsername.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const role = signupRole.value;
        
        // Validate email
        if (!validateEmail(email)) {
            showError('signupEmail', 'signupEmailError', 'Please enter a valid email address');
            return;
        }
        
        // Validate all fields
        if (!username || !email || !password || !role) {
            alert('Please fill in all fields');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        const emailExists = users.some(u => u.email === email);
        
        if (emailExists) {
            showError('signupEmail', 'signupEmailError', 'This email is already registered');
            return;
        }
        
        // Check if username already exists
        const usernameExists = users.some(u => u.username === username);
        
        if (usernameExists) {
            alert('Username already taken. Please choose a different username.');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            role
        };
        
        // Add user to localStorage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Show success message
        alert(`Account created successfully! Welcome, ${username}!`);
        
        // Redirect based on role
        if (role === 'user') {
            window.location.href = 'dashboard.html';
        } else {
            alert(`${role.charAt(0).toUpperCase() + role.slice(1)} dashboard coming soon!`);
            window.location.href = 'dashboard.html';
        }
    });
}
