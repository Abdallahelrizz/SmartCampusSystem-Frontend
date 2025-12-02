// Authentication utilities
// API_BASE_URL is set in config.js or via window.API_BASE_URL
const API_BASE = window.API_BASE_URL || '/api';

function getAuthToken() {
    return localStorage.getItem('token');
}

function setAuthToken(token) {
    localStorage.setItem('token', token);
}

function removeAuthToken() {
    localStorage.removeItem('token');
}

function getCurrentUser() {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : {};
    } catch (e) {
        return {};
    }
}

function setCurrentUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function isAuthenticated() {
    return !!getAuthToken();
}

function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    
    const config = {
        ...options,
        headers: {
            ...(isFormData ? {} : getAuthHeaders()), // Don't set Content-Type for FormData
            ...options.headers
        }
    };

    // Add Authorization header separately for FormData
    if (isFormData) {
        const token = getAuthToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    if (options.body && typeof options.body === 'object' && !isFormData) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        
        // Handle non-JSON responses
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
        if (error.message) {
            throw error;
        }
        throw new Error('Network error. Please check your connection.');
    }
}

// Login function
async function login(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password }
    });

    if (data.token) {
        setAuthToken(data.token);
    }
    if (data.user) {
        setCurrentUser(data.user);
    }
    return data;
}

// Signup function
async function signup(userData) {
    const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: userData
    });

    if (data.token) {
        setAuthToken(data.token);
    }
    if (data.user) {
        setCurrentUser(data.user);
    }
    return data;
}

// Logout function
function logout() {
    removeAuthToken();
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Check authentication on page load
function checkAuth() {
    const path = window.location.pathname;
    const isPublicPage = path === '/' || path.includes('login') || path.includes('signup');
    
    if (!isAuthenticated() && !isPublicPage) {
        window.location.href = '/login';
    }
}

// Redirect based on role
function redirectToDashboard(role) {
    const validRoles = ['student', 'faculty', 'maintenance', 'admin'];
    if (validRoles.includes(role)) {
        window.location.href = `/dashboard/${role}`;
    } else {
        window.location.href = '/login';
    }
}

// Make functions available globally
window.login = login;
window.signup = signup;
window.logout = logout;
window.checkAuth = checkAuth;
window.redirectToDashboard = redirectToDashboard;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.apiRequest = apiRequest;
