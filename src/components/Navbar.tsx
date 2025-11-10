// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Gamepad2, Upload, LogOut, Moon, Sun, Library, Trash2, CircleUser } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { useTheme } from "../providers/ThemeProvider";
import { useAuth } from "../providers/AuthProvider";

export function Navbar() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Tem certeza que deseja excluir sua conta?\n\nEsta ação é permanente, apagará todos os seus dados e não pode ser desfeita."
    );
    
    if (!isConfirmed) return;

    try {
      await deleteAccount(); 
      alert("Conta excluída com sucesso.");
      navigate('/login'); 
    } catch (error) {
      alert("Erro ao excluir a conta. Tente novamente.");
      console.error("Falha ao excluir conta:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="bg-purple-600 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl dark:text-white">Steam da UFC</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Button onClick={toggleTheme} variant="outline" size="icon" aria-label="Alternar tema">
              {resolvedTheme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>

            {user?.userType === "DEV" ? (
              <>
                <Button onClick={() => navigate("/my-games")} variant="outline" className="gap-2">
                  <Library className="w-4 h-4" /> Meus Jogos
                </Button>
                <Button onClick={() => navigate("/upload")} variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" /> Criar Jogo
                </Button>
              </>
            ) : user?.userType === "PLAYER" ? (
              <Button onClick={() => navigate("/downloads")} variant="outline" className="gap-2">
                <Library className="w-4 h-4" /> Biblioteca
              </Button>
            ) : null}

            {user ? (
              <DropdownMenu>
                {/* O Botão que o usuário vê na Navbar (o "Trigger") */}
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Abrir menu do usuário</span>
                  </Button>
                </DropdownMenuTrigger>

                {/* O Conteúdo que aparece ao clicar */}
                <DropdownMenuContent align="end">
                  {/* O "Cabeçalho" do menu com as infos */}
                  <DropdownMenuLabel>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {user.userType === "DEV" ? "Developer" : "Player"}
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
                  {/* As Ações */}
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleDeleteAccount}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir Conta</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
