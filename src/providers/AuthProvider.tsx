/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// src/providers/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../lib/axios";
import type { User } from "../types/models";

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  signup: (username: string, password: string, userType: "PLAYER" | "DEV") => Promise<User>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
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

  const login = useCallback(async (username: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("[Auth] bem sucedido:", data.user.username);
      return data.user;
    } catch (error: any) {
      console.error("[Auth] Falha no login."); 
      throw error;
    }
  }, []);

  const signup = useCallback(async (username: string, password: string, userType: "PLAYER" | "DEV") => {
    try {
      const { data } = await api.post("/auth/register", { username, password, userType });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      console.log("[Auth] Signup successful:", data.user.username); 
      return data.user;
    } catch (error: any) {
      console.error("[Auth] Falha no cadastro."); 
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    console.log("[Auth] Usuário deslogado.");
  }, []);

  const deleteAccount = useCallback(async () => {
    console.log("[Auth] Tentando excluir conta...");
    try {
      await api.delete("/auth/me"); 
      console.log("[Auth] Conta excluída com sucesso.");
      logout(); 
    } catch (error) {
      console.error("[Auth] Falha ao excluir conta:", error);
      throw error;
    }
  }, [logout]);

  const value = useMemo(() => ({ user, loading, login, signup, logout, deleteAccount }), [user, loading, login, signup, logout, deleteAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
