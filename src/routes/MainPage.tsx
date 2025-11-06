// src/pages/MainPage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Download, ThumbsUp, Search } from 'lucide-react';
import { useAuth } from "../providers/AuthProvider";
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { api } from '../lib/axios';

// ⚠️ Removidos: addDownload (mock), mockGames, types dos mocks

type GameImage = { imagePath: string; orderIndex: number };
type Game = {
  id: string;
  title: string;
  description: string;
  genre: string;
  images: GameImage[];
  likes: number;
  dislikes: number;
  createdAt: string;
};

type MainPageProps = {
  onGameClick: (gameId: string) => void;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function listGames({ search = '', page = 1, pageSize = 12 } = {}) {
  const { data } = await api.get('/games', { params: { search, page, pageSize } });
  return data as { items: Game[]; page: number; pageSize: number; total: number };
}

export function MainPage({ onGameClick }: MainPageProps) {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { items, total } = await listGames({ search: searchTerm, page, pageSize });
      setGames(items);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    await load();
  };

  const handleAddDownload = async (gameId: string) => {
    if (!user) {
      alert("Faça login para adicionar à sua biblioteca.");
      return;
    }
    await api.post("/downloads", { gameId });
    alert("Adicionado à sua biblioteca!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="mb-2 dark:text-white">Available Games</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Browse and download your favorite games</p>

        <form onSubmit={onSearch} className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </form>
      </div>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Carregando…</p>
      ) : games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No games found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {game.images?.[0] ? (
                  <ImageWithFallback
                    src={`${API}${game.images[0].imagePath}`}
                    alt={game.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">Sem imagem</div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="dark:text-white">{game.title}</CardTitle>
                  <Badge>{game.genre}</Badge>
                </div>
                <CardDescription className="line-clamp-2 dark:text-gray-400">
                  {game.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {game.likes}
                    </span>
                    <span>{game.likes - game.dislikes > 0 ? '+' : ''}{game.likes - game.dislikes}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => onGameClick(game.id)} className="flex-1">
                    View Details
                  </Button>

                  {(!user || user.userType === 'PLAYER') && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddDownload(game.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>

            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Página {page} · Total {total}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <Button variant="outline" disabled={(page * pageSize) >= total} onClick={() => setPage(p => p + 1)}>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
