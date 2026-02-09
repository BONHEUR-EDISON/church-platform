// apps/web/src/api/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Ajouter automatiquement le token à chaque requête
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
 



/*
import axios from "axios";
import { getToken } from "../hooks/useAuth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;



// src/api/instance.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
   headers: { "Content-Type": "application/json" },
});

// Intercepteur pour ajouter automatiquement le token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globales
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // token invalide ou rôle insuffisant
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirection vers login
    }
    return Promise.reject(error);
  }
);

export default instance;*/
