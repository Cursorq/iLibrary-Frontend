// ===== API Configuration =====
const API_BASE_URL = 'http://localhost:8080';

// ===== Helper Functions =====

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(inputId, errorId, message) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    if (errorElement) errorElement.textContent = message;
    if (inputElement) inputElement.style.borderColor = "hsl(0, 84%, 60%)";
}

function clearError(inputId, errorId) {
    const errorElement = document.getElementById(errorId);
    const inputElement = document.getElementById(inputId);
    if (errorElement) errorElement.textContent = "";
    if (inputElement) inputElement.style.borderColor = "";
}

// Show backend response message below form
function showBackendMessage(containerId, message, type = "success") {
    const container = document.getElementById(containerId);
    if (!container) return;

    let messageDiv = container.querySelector(".backend-message");
    if (!messageDiv) {
        messageDiv = document.createElement("div");
        messageDiv.classList.add("backend-message");
        container.appendChild(messageDiv);
    }

    messageDiv.textContent = message;
    messageDiv.style.color = type === "error" ? "hsl(0, 84%, 60%)" : "hsl(142, 71%, 45%)";
    messageDiv.style.marginTop = "10px";
    messageDiv.style.fontWeight = "500";
}

// ===== Token Management =====
function saveToken(token) {
    localStorage.setItem('jwtToken', token);
}

function getToken() {
    return localStorage.getItem('jwtToken');
}

function removeToken() {
    localStorage.removeItem('jwtToken');
}

function saveUserInfo(userInfo) {
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
}

function getUserInfo() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function clearUserInfo() {
    localStorage.removeItem('currentUser');
}

// ===== LOGIN HANDLER =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    // Username validation
    loginUsername?.addEventListener("blur", () => {
        const username = loginUsername.value.trim();
        if (!username) showError("loginUsername", "loginUsernameError", "Username is required");
        else clearError("loginUsername", "loginUsernameError");
    });
    loginUsername?.addEventListener("input", () =>
        clearError("loginUsername", "loginUsernameError")
    );

    // Submit handler
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = loginUsername.value.trim();
        const password = loginPassword.value;

        if (!username || !password) {
            showBackendMessage("loginForm", "Please fill in all fields", "error");
            return;
        }

        showBackendMessage("loginForm", "Logging in...", "success");

        try {
            const response = await fetch(`${API_BASE_URL}/public/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    username: username,
                    password: password 
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                showBackendMessage("loginForm", errorText || "Invalid credentials", "error");
                return;
            }

            // Response is plain text JWT token
            const token = await response.text();
            
            // Save token
            saveToken(token);
            
            // Save user info
            saveUserInfo({
                username: username,
                loginTime: new Date().toISOString()
            });

            showBackendMessage("loginForm", `Welcome back! Redirecting...`);
            console.log("Login successful, token received");

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } catch (error) {
            console.error("Login error:", error);
            showBackendMessage("loginForm", "Error connecting to server. Please ensure backend is running.", "error");
        }
    });
}

// ===== SIGNUP HANDLER =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    const signupUsername = document.getElementById("signupUsername");
    const signupEmail = document.getElementById("signupEmail");
    const signupPassword = document.getElementById("signupPassword");
    const signupRole = document.getElementById("signupRole");

    // Email validation
    signupEmail?.addEventListener("blur", () => {
        const email = signupEmail.value.trim();
        if (!email) showError("signupEmail", "signupEmailError", "Email is required");
        else if (!validateEmail(email))
            showError("signupEmail", "signupEmailError", "Please enter a valid email");
        else clearError("signupEmail", "signupEmailError");
    });
    signupEmail?.addEventListener("input", () =>
        clearError("signupEmail", "signupEmailError")
    );

    // Submit handler
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = signupUsername.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const role = signupRole.value;

        if (!username || !email || !password || !role) {
            showBackendMessage("signupForm", "Please fill in all fields", "error");
            return;
        }

        if (!validateEmail(email)) {
            showError("signupEmail", "signupEmailError", "Invalid email");
            return;
        }

        showBackendMessage("signupForm", "Creating your account...", "success");

        try {
            // Backend expects roles as array with "ROLE_" prefix
            const roleFormatted = `ROLE_${role.toUpperCase()}`;
            
            const response = await fetch(`${API_BASE_URL}/public/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    username: username,
                    password: password,
                    email: email,
                    roles: [roleFormatted]  // Array format with ROLE_ prefix as per Spring Security convention
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                showBackendMessage("signupForm", errorText || "Signup failed", "error");
                return;
            }

            // Response is plain text confirmation
            const message = await response.text();
            showBackendMessage("signupForm", message || "Account created successfully! Please log in.");
            console.log("Signup response:", message);

            // Clear form
            signupForm.reset();

            // Automatically show login modal after 2 seconds
            setTimeout(() => {
                document.getElementById("signupModal")?.classList.remove("active");
                document.getElementById("loginModal")?.classList.add("active");
                document.body.style.overflow = 'hidden';
            }, 2000);
        } catch (error) {
            console.error("Signup error:", error);
            showBackendMessage("signupForm", "Error connecting to server. Please ensure backend is running.", "error");
        }
    });
}

// ===== Check Authentication Status =====
function isAuthenticated() {
    return !!getToken();
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
