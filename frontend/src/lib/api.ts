import axios from "axios";

// With nginx reverse proxy, we use relative URLs
// nginx will proxy /api/* and /token to the backend
// This works seamlessly with both HTTP and HTTPS
const API_URL = import.meta.env.VITE_API_URL || "";

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
