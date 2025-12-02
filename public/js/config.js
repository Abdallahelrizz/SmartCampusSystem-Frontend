// API Configuration
// Set API_BASE_URL via environment variable or inline script before this loads
// Example: <script>window.API_BASE_URL = 'https://your-backend.railway.app/api';</script>
window.API_BASE_URL = window.API_BASE_URL || (() => {
    // Auto-detect based on environment
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
    }
    
    // Production: use same origin (backend serves frontend) or set explicitly
    // If backend and frontend are on different domains, set window.API_BASE_URL before this script loads
    return '/api';
})();

