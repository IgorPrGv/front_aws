/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/user.hooks.ts
import { useState } from "react";
import { api } from "../lib/axios";
import type { User } from "../types/models";

type UseAuthFormProps = {
  onLogin: (user: User) => void;
};

export function useAuthForm({ onLogin }: UseAuthFormProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Estados do formulário de Login
  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  // Estados do formulário de Signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"PLAYER" | "DEV">("PLAYER");

  const [error, setError] = useState("");

  async function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    console.log("🔄 Tentando login com:", usernameLogin);
    try {
      const { data } = await api.post("/auth/login", {
        username: usernameLogin.trim(),
        password: passwordLogin,
      });
      
      console.log("✅ Login bem-sucedido:", data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user as User);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || "Falha no login";
      console.error("❌ Falha no login:", errorMsg, err.response);
      setError(errorMsg);
    }
  }

  async function onSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const body: any = { username: username.trim(), password, userType };
      if (email.trim()) body.email = email.trim();

      console.log("🔄 Tentando cadastro com:", body);
      const { data } = await api.post("/auth/register", body);
      console.log("✅ Cadastro bem-sucedido:", data.user);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user as User);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || "Falha no cadastro";
      console.error("❌ Falha no cadastro:", errorMsg, err.response);
      setError(errorMsg);
    }
  }

  return {
    tab,
    setTab,
    error,
    usernameLogin,
    setUsernameLogin,
    passwordLogin,
    setPasswordLogin,
    onLoginSubmit,
    username,
    setUsername,
    password,
    setPassword,
    email,
    setEmail,
    userType,
    setUserType,
    onSignupSubmit,
  };
}