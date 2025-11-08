// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Gamepad2, Upload, LogOut, Moon, Sun, Library } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl dark:text-white">Game Portal</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Alternar tema">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {user?.userType === "DEV" ? (
              <>
                <Button onClick={() => navigate("/my-games")} variant="outline" className="gap-2">
                  <Library className="w-4 h-4" /> My Games
                </Button>
                <Button onClick={() => navigate("/upload")} variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" /> Upload Game
                </Button>
              </>
            ) : user?.userType === "PLAYER" ? (
              <Button onClick={() => navigate("/downloads")} variant="outline" className="gap-2">
                <Library className="w-4 h-4" /> Downloads
              </Button>
            ) : null}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.userType === "DEV" ? "Developer" : "Player"}
                  </p>
                </div>
                <Button onClick={logout} variant="ghost" size="icon" aria-label="Sair">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>Entrar</Button>
                <Button onClick={() => navigate("/login")}>Criar conta</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
