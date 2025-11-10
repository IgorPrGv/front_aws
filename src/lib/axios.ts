// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  console.log(
    `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
    config.data || config.params || "(sem payload)"
  );

  return config;
});

api.interceptors.response.use(
  (response) => {

    console.log(
      `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      `[API Error] ${error.config.method?.toUpperCase()} ${error.config.url}`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);