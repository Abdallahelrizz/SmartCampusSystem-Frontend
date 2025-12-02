// ======================================================
// FINAL API CONFIG FOR VERCEL + RAILWAY
// ======================================================
//
// This script decides where the frontend sends API requests.
//
// Priority:
// 1. Use Vercel env var (NEXT_PUBLIC_API_URL), if injected
// 2. Otherwise FORCE Railway backend URL
//
// This guarantees static HTML on Vercel will ALWAYS hit your backend.
//
// ======================================================

(function () {
    // If Vercel injected the backend URL
    if (typeof window.NEXT_PUBLIC_API_URL !== "undefined" && window.NEXT_PUBLIC_API_URL.startsWith("http")) {
        window.API_BASE_URL = window.NEXT_PUBLIC_API_URL;
        return;
    }

    // HARD fallback: your Railway backend URL
    // (Static HTML cannot access env vars without backend injection)
    window.API_BASE_URL = "https://smartcampussystem-backend-production.up.railway.app/api";
})();
