// axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // <- pega do .env no build
  // se usar cookie-session:
  // withCredentials: true,
});

// se usar token em localStorage:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
