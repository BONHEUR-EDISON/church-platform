// src/hooks/useAuth.ts

import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export interface User {
  id: string;
  email: string;
  roles: string[];
  churchId: string;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";

// Stocker token + user
export const setAuthData = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Récupérer token
export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

// Récupérer user
export const getUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Récupérer rôle principal
export const getRole = (): string | null => {
  const user = getUser();
  if (!user?.roles || user.roles.length === 0) return null;
  const priorityRoles = ["ADMIN", "PASTOR", "MEMBER"];
  return priorityRoles.find((r) => user.roles.includes(r)) || user.roles[0];
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/";
};

// Hook React pour auth
export const useAuth = (requiredRole?: string | string[]) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(getToken());
  const [role, setRole] = useState<string | null>(getRole());
  const [user, setUser] = useState<User | null>(getUser());

  useEffect(() => {
    setToken(getToken());
    setRole(getRole());
    setUser(getUser());
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    if (requiredRole) {
      const requiredRole = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      if (!requiredRole.includes(role || "")) {
        // Redirige vers son dashboard selon rôle principal
        const mainRole = getRole() || "MEMBER";
        switch (mainRole.toUpperCase()) {
          case "ADMIN":
            navigate("/dashboard/admin", { replace: true });
            break;
          case "PASTOR":
            navigate("/dashboard/pastor", { replace: true });
            break;
          default:
            navigate("/dashboard/member", { replace: true });
        }
      }
    }
  }, [token, role, requiredRole, navigate]);

  const protectRoute = (): boolean => {
    if (!token) return false;
    if (requiredRole) {
      const requiredRole = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];
      if (!requiredRole.includes(role || "")) return false;
    }
    return true;
  };

  return { token, role, user, isAuthenticated: !!token, protectRoute };
};

// Fonction pour login / register
export const authenticate = async (
  endpoint: string,
  data: any
): Promise<User> => {
  const res = await axios.post(endpoint, data);
  const { access_token, user } = res.data;
  if (!access_token || !user) throw new Error("Token ou user manquant");
  setAuthData(access_token, user);
  return user;
};