// ======================================================
// AUTH.JS - FINAL FIXED VERSION
// ======================================================

// Helper function for API requests
async function apiRequest(path, options = {}) {
    const API_BASE = window.API_BASE_URL; // ALWAYS correct from config.js
    const url = `${API_BASE}${path}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            ...options
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || "Request failed");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// LOGIN FUNCTION
async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const result = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        console.log("Login result:", result);

        if (result.role) {
            window.location.href = `/dashboard-${result.role}.html`;
        } else {
            alert("Unexpected login response. Contact support.");
        }
    } catch (error) {
        alert("Invalid email or password.");
        console.error(error);
    }
}

// SIGNUP FUNCTION
async function signup(event) {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const role = document.getElementById("role")?.value.trim();

    if (!name || !email || !password || !role) {
        alert("All fields are required.");
        return;
    }

    try {
        const result = await apiRequest("/auth/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password, role })
        });

        console.log("Signup result:", result);

        alert("Signup successful! You can now login.");
        window.location.href = "/login.html";
    } catch (error) {
        alert("Signup failed. Email may already exist.");
        console.error(error);
    }
}

// Expose functions globally
window.login = login;
window.signup = signup;