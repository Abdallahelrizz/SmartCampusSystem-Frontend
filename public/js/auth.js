// ======================================================
// AUTH.JS - Authentication and API utilities
// ======================================================

// ======================================================
// Token Management
// ======================================================

function getAuthToken() {
    return localStorage.getItem('token');
}

function setAuthToken(token) {
    localStorage.setItem('token', token);
}

function removeAuthToken() {
    localStorage.removeItem('token');
}

// ======================================================
// User Management
// ======================================================

function getCurrentUser() {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

// ======================================================
// Authentication Status
// ======================================================

function isAuthenticated() {
    return !!getAuthToken();
}

// ======================================================
// API Request Helper
// ======================================================

async function apiRequest(path, options = {}) {
    const API_BASE = window.API_BASE_URL;
    const url = `${API_BASE}${path}`;
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const config = {
        ...options,
        headers: headers
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || 'Request failed');
        }

        if (!response.ok) {
            throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ======================================================
// Login Function
// ======================================================

async function doLogin(email, password) {
    try {
        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password }
        });

        if (result.token) {
            setAuthToken(result.token);
        }
        if (result.user) {
            setCurrentUser(result.user);
        }

        return result;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// ======================================================
// Signup Function
// ======================================================

async function doSignup(userData) {
    try {
        const result = await apiRequest('/auth/signup', {
            method: 'POST',
            body: userData
        });

        // Note: New users are pending approval, so no token is returned
        // Only set user data if provided
        if (result.user) {
            setCurrentUser(result.user);
        }

        return result;
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
}

// ======================================================
// Logout Function
// ======================================================

function logout() {
    removeAuthToken();
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// ======================================================
// Redirect to Dashboard
// ======================================================

function redirectToDashboard(role) {
    const validRoles = ['student', 'faculty', 'maintenance', 'admin'];
    if (validRoles.includes(role)) {
        window.location.href = `/dashboard-${role}.html`;
    } else {
        window.location.href = '/login.html';
    }
}

// ======================================================
// Expose functions globally
// ======================================================

window.apiRequest = apiRequest;
window.doLogin = doLogin;
window.doSignup = doSignup;
window.logout = logout;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.setCurrentUser = setCurrentUser;
window.getAuthToken = getAuthToken;
window.setAuthToken = setAuthToken;
window.removeAuthToken = removeAuthToken;
window.redirectToDashboard = redirectToDashboard;
