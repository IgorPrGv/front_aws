// src/routes/DownloadsPage.tsx
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useMyDownloads } from "../hooks/gamelibrary.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";

export function DownloadsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { items, loading, removeFromLibrary } = useMyDownloads();

  if (authLoading) {
     return <p className="text-gray-500 dark:text-gray-400 px-4 py-8">Carregando…</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (user.userType !== "PLAYER") return <Navigate to="/" replace />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="dark:text-white">Minha Biblioteca</h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Carregando…</p>
      ) : items.length === 0 ? (
        <section className="flex flex-col w-full h-full items-center justify-center">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Nenhum jogo adicionado</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 dark:text-gray-400">
              Salve um jogo para ele aparecer aqui.
            </CardContent>
          </Card>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <Card key={r.id} className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">
                  {r.game?.title ?? "Jogo removido"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(r.downloadDate).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/game/${r.gameId}`)}
                  >
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={() => removeFromLibrary(r.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
