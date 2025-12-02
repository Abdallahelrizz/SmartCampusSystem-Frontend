# API Configuration for Frontend

The frontend now uses a configurable API base URL instead of hardcoded `localhost`.

## How It Works

1. **`config.js`** sets `window.API_BASE_URL`
2. **`auth.js`** uses `window.API_BASE_URL` or defaults to `/api`
3. All API calls use this dynamic URL

## Configuration Options

### Option 1: Auto-Detection (Default)
- **Local development**: Automatically uses `http://localhost:3001/api`
- **Production (same origin)**: Uses `/api` (backend serves frontend)

### Option 2: Set Explicitly (For Separate Deployments)
If your frontend and backend are on different domains, add this **before** `config.js` loads:

```html
<script>
    window.API_BASE_URL = 'https://your-backend.railway.app/api';
</script>
<script src="/js/config.js"></script>
<script src="/js/auth.js"></script>
```

### Option 3: Environment Variable Replacement (Build Time)
For Vercel/Netlify, you can replace the URL at build time:

```javascript
// In config.js, replace the default with:
window.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
```

Then set `API_BASE_URL` in your hosting platform's environment variables.

## Current Setup

- ✅ All HTML files load `config.js` before `auth.js`
- ✅ Defaults to `localhost:3001/api` for local dev
- ✅ Defaults to `/api` for production (same origin)
- ✅ Can be overridden by setting `window.API_BASE_URL` before config loads

