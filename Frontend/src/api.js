/**
 * API base for uploads. Set VITE_API_URL in .env (e.g. Render URL) for production.
 * Dev: run backend on port 5000, or point VITE_API_URL at your deployed API.
 */
const DEFAULT_PROD_API = "https://file-uploder-64w8.onrender.com";

export const endpoints = {
  upload: `${DEFAULT_PROD_API}/upload`,
  uploadMultiple: `${DEFAULT_PROD_API}/uploadMultiple`,
};
