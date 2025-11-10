/* eslint-disable @typescript-eslint/no-explicit-any */
// src/routes/MyGamesPage.tsx
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { apiService } from "../lib/api.service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart2, Trash2 } from "lucide-react";
import type { Game } from "../types/models";

export function MyGamesPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const data = await apiService.getMyGames(1, 50);
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading my games:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.userType === "DEV") {
      load();
    }
  }, [user]);

  if (authLoading) {
    return <p className="text-gray-500 dark:text-gray-400 px-4 py-8">Carregando…</p>;
  }

  const handleDeleteGame = async (gameId: string, gameTitle: string) => {
    // Adicionar confirmação
    const isConfirmed = window.confirm(
      `Tem a certeza que quer apagar permanentemente o jogo "${gameTitle}"?\n\nEsta ação não pode ser desfeita e irá removê-lo da biblioteca de todos os usuários.`
    );

    if (!isConfirmed) return;

    try {
      setLoading(true); // (Opcional) Mostrar um feedback de loading
      await apiService.deleteGame(gameId);
      // Atualizar o estado local para remover o card
      setItems((prevItems) => prevItems.filter((item) => item.id !== gameId));
      setTotal((prevTotal) => prevTotal - 1);
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Erro ao apagar o jogo');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Navigate to="/login" replace />;
  if (user.userType !== "DEV") return <Navigate to="/" replace />;

  return (
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
                    onClick={() => handleDeleteGame(g.id, g.title)}
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
  );
}