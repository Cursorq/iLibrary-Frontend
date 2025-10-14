// ===== Helper Functions =====

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show error message
function showError(inputId, errorId, message) {
  const errorElement = document.getElementById(errorId);
  const inputElement = document.getElementById(inputId);
  if (errorElement) errorElement.textContent = message;
  if (inputElement) inputElement.style.borderColor = "hsl(0, 84%, 60%)";
}

// Clear error message
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
  messageDiv.style.color = type === "error" ? "red" : "green";
  messageDiv.style.marginTop = "10px";
}

// ===== API Base URL =====
const API_BASE = "http://localhost:8080/public/signup"; // change if backend port differs

// ===== LOGIN HANDLER =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginRole = document.getElementById("loginRole");

  // Email validation
  loginEmail?.addEventListener("blur", () => {
    const email = loginEmail.value.trim();
    if (!email) showError("loginEmail", "loginEmailError", "Email is required");
    else if (!validateEmail(email))
      showError("loginEmail", "loginEmailError", "Please enter a valid email");
    else clearError("loginEmail", "loginEmailError");
  });
  loginEmail?.addEventListener("input", () =>
    clearError("loginEmail", "loginEmailError")
  );

  // Submit handler
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    const role = loginRole.value;

    if (!email || !password || !role) {
      alert("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      showError("loginEmail", "loginEmailError", "Invalid email");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/public/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        showBackendMessage("loginForm", data.message || "Invalid credentials", "error");
        return;
      }

      // Success
      showBackendMessage("loginForm", `Welcome back, ${data.username || "User"}!`);
      console.log("Login response:", data);

      // Redirect to dashboard
      setTimeout(() => (window.location.href = "dashboard.html"), 1500);
    } catch (error) {
      console.error("Login error:", error);
      showBackendMessage("loginForm", "Error connecting to server", "error");
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
      alert("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      showError("signupEmail", "signupEmailError", "Invalid email");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/public/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        showBackendMessage("signupForm", data.message || "Signup failed", "error");
        return;
      }

      // Success
      showBackendMessage("signupForm", "Account created successfully! You can now log in.");
      console.log("Signup response:", data);

      // Automatically show login modal
      document.getElementById("signupModal")?.classList.remove("active");
      document.getElementById("loginModal")?.classList.add("active");
    } catch (error) {
      console.error("Signup error:", error);
      showBackendMessage("signupForm", "Error connecting to server", "error");
    }
  });
}
