(function () {
    if (typeof window.NEXT_PUBLIC_API_URL !== "undefined" && window.NEXT_PUBLIC_API_URL.startsWith("http")) {
        window.API_BASE_URL = window.NEXT_PUBLIC_API_URL;
        return;
    }
    window.API_BASE_URL = "https://smartcampussystem-backend-production.up.railway.app/api";
})();
