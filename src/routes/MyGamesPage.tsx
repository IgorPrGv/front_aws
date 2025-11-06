// src/routes/MyGamesPage.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BarChart2 } from "lucide-react";

type Game = {
  id: string;
  title: string;
  description: string;
  genre: string;
  likes: number;
  dislikes: number;
  createdAt: string;
};

export function MyGamesPage() {
  const { user, loading } = useAuth();

  const [items, setItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(true);

  async function load() {
    setBusy(true);
    try {
      const { data } = await api.get("/dev/my-games", { params: { page: 1, pageSize: 50 } });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (user?.userType === "DEV") load();
  }, [user]);

  if (loading) {
    return <p className="text-gray-500 dark:text-gray-400 px-4 py-8">Carregando…</p>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.userType !== "DEV") return <Navigate to="/" replace />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dark:text-white">Meus Jogos</h1>
      </div>

      {busy ? (
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
                    onClick={() => (location.href = `/game/${g.id}`)}
                  >
                    <BarChart2 className="w-4 h-4" /> Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!busy && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Total: {total}</p>
      )}
    </div>
  );
}
