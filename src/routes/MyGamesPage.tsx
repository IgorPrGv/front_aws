// src/routes/MyGamesPage.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useMyGames } from "../hooks/mygames.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";



export function MyGamesPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { items, total, loading, handleDeleteGame } = useMyGames(user, authLoading);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{id: string, title: string} | null>(null);

  // Função para abrir o modal
  const handleDeleteClick = (game: {id: string, title: string}) => {
    setSelectedGame(game);
    setIsAlertOpen(true);
  };

  // Função que o modal chama
  const handleConfirmDelete = () => {
    if (selectedGame) {
      handleDeleteGame(selectedGame.id); // Chama o hook
    }
  };

  if (!user) return <Navigate to="/login" replace />;
  if (user.userType !== "DEV") return <Navigate to="/" replace />;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="dark:text-white">Meus Jogos</h1>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Carregando…</p>
        ) : items.length === 0 ? (
          <section className="flex flex-col w-full items-center justify-center">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Nenhum jogo adicionado</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 dark:text-gray-400">
                Publique um jogo para ele aparecer aqui.
              </CardContent>
            </Card>
          </section>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((g) => (
              <Card key={g.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">{g.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {g.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Likes: {g.likes} · Dislikes: {g.dislikes}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => navigate(`/game/${g.id}`)}
                    >
                      <BarChart2 className="w-4 h-4" /> Ver
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick({id: g.id, title: g.title})}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">Total: {total}</p>
        )}
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar "{selectedGame?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza? Esta ação irá
              removê-lo da biblioteca de todos os usuários.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Sim, apagar permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}