// src/routes/DownloadsPage.tsx  (ou src/pages/DownloadsPage.tsx)
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { api } from "../lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";

type DownloadRow = {
  id: string;
  gameId: string;
  userId: string;
  downloadDate: string;
  game?: { id: string; title: string };
};

export function DownloadsPage() {
  const { user } = useAuth();

  // ✅ Hooks sempre no topo
  const [rows, setRows] = useState<DownloadRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/downloads", { params: { page: 1, pageSize: 50 } });
      const baseRows: DownloadRow[] = data.items || [];

      const withTitles = await Promise.all(
        baseRows.map(async (r) => {
          try {
            const { data: g } = await api.get(`/games/${r.gameId}`);
            return { ...r, game: { id: g.id, title: g.title } };
          } catch {
            return { ...r, game: undefined };
          }
        })
      );

      setRows(withTitles);
    } finally {
      setLoading(false);
    }
  }

  // ✅ useEffect não-condicional; guarda dentro
  useEffect(() => {
    if (user?.userType === "PLAYER") {
      load();
    }
  }, [user]);

  const handleRemove = async (downloadId: string) => {
    await api.delete(`/downloads/${downloadId}`);
    setRows((prev) => prev.filter((r) => r.id !== downloadId));
  };

  // 🔐 Guards DEPOIS dos hooks
  if (!user) return <Navigate to="/login" replace />;
  if (user.userType !== "PLAYER") return <Navigate to="/" replace />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="dark:text-white">Minha Biblioteca</h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Carregando…</p>
      ) : rows.length === 0 ? (
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
          {rows.map((r) => (
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
                  <Button size="sm" onClick={() => (location.href = `/game/${r.gameId}`)}>
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-2"
                    onClick={() => handleRemove(r.id)}
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
