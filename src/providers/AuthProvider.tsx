/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/axios";
import type { User } from "../types/models";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  signup: (username: string, password: string, userType: "PLAYER" | "DEV") => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Recupera sessão do localStorage ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("✅ [Auth] Login successful:", data.user.username);
      return data.user;
    } catch (error: any) {
      console.error("❌ [Auth] Falha no login."); 
      throw error;
    }
  };

  const signup = async (username: string, password: string, userType: "PLAYER" | "DEV") => {
    try {
      const { data } = await api.post("/auth/register", { username, password, userType });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("✅ [Auth] Signup successful:", data.user.username); 
      return data.user;
    } catch (error: any) {
      console.error("❌ [Auth] Falha no cadastro."); 
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
