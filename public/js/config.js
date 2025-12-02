// API Configuration
// Priority: 1. window.API_BASE_URL (set via inline script), 2. data-api-url attribute, 3. auto-detect
window.API_BASE_URL = window.API_BASE_URL || (() => {
    // Check if set via data attribute on html tag
    const htmlElement = document.documentElement;
    const dataApiUrl = htmlElement.getAttribute('data-api-url');
    if (dataApiUrl) {
        return dataApiUrl.endsWith('/api') ? dataApiUrl : `${dataApiUrl}/api`;
    }
    
    // Auto-detect based on environment
    const hostname = window.location.hostname;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001/api';
    }
    
    // Vercel deployment - check for Railway backend URL
    // If on Vercel (vercel.app domain), you MUST set the Railway URL
    if (hostname.includes('vercel.app')) {
        // TODO: Replace with your Railway backend URL
        // Get this from Railway → Settings → Public Domain
        const RAILWAY_URL = 'https://smartcampussystem-backend-production.up.railway.app'; // ⚠️ CHANGE THIS!
        
        if (RAILWAY_URL.includes('your-backend')) {
            console.error('❌ Railway backend URL not configured!');
            console.error('   Edit frontend/public/js/config.js and set RAILWAY_URL');
            console.error('   Get your URL from Railway → Settings → Public Domain');
            return '/api'; // This will fail, but prevents silent errors
        }
        
        // Remove trailing slash if present, then add /api
        const cleanUrl = RAILWAY_URL.replace(/\/+$/, '');
        return `${cleanUrl}/api`;
    }
    
    // Production: same origin (backend serves frontend)
    return '/api';
})();

console.log('🔗 API Base URL:', window.API_BASE_URL);

