// Central config for API base URL — used across the app
// In production, set VITE_API_URL env var on Vercel to your Render backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
