/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/LoginPage.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Gamepad2 } from "lucide-react";
import { api } from "../lib/axios";
// ⬇️ usa seu tipo do projeto (ajuste o caminho se diferente)
import type { User } from "../types/models";

type LoginPageProps = {
  onLogin: (user: User) => void;
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");

  // Login (API usa username + password)
  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  // Signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // email é opcional no backend — mantenho no formulário se você quiser guardá-lo
  const [email, setEmail] = useState("");
  // API espera "PLAYER" | "DEV"
  const [userType, setUserType] = useState<"PLAYER" | "DEV">("PLAYER");

  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", {
        username: usernameLogin.trim(),
        password: passwordLogin,
      });
      // salva sessão
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user as User);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Falha no login");
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const body: any = { username: username.trim(), password, userType };
      if (email.trim()) body.email = email.trim();

      const { data } = await api.post("/auth/register", body);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user as User);
    } catch (err: any) {
      setError(err?.response?.data?.error?.message || "Falha no cadastro");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-linear-to-br from-purple-600 to-blue-600 dark:from-purple-900 dark:to-blue-900">
      <Card className="w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="dark:text-white">Game Portal</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Entre ou crie sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    placeholder="Seu username"
                    value={usernameLogin}
                    onChange={(e) => setUsernameLogin(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Sua senha"
                    value={passwordLogin}
                    onChange={(e) => setPasswordLogin(e.target.value)}
                    required
                  />
                </div>
                {error && tab === "login" && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Entrar</Button>
              </form>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    placeholder="Escolha um username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email (opcional)</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-type">Tipo de conta</Label>
                  <select
                    id="account-type"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as "PLAYER" | "DEV")}
                  >
                    <option value="PLAYER">Player</option>
                    <option value="DEV">Developer</option>
                  </select>
                </div>
                {error && tab === "signup" && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full">Criar conta</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


