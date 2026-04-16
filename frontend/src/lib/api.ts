import axios from "axios";

// Dynamically construct API URL based on current hostname
// This ensures the API URL matches wherever the frontend is accessed from
const getApiUrl = () => {
  // If VITE_API_URL is set in environment, use it (for development/override)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Otherwise, use the same hostname as the frontend with port 8000
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // e.g., 192.168.50.102 or localhost
  return `${protocol}//${hostname}:8000`;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
