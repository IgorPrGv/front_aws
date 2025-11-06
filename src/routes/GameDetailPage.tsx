// src/pages/GameDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ThumbsUp, ThumbsDown, Download, ArrowLeft } from "lucide-react";
import { api } from "../lib/axios";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../providers/AuthProvider";

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
  developerId: string;
  filePath?: string | null; 
};
type Review = {
  id: string;
  userId: string;
  comment: string;
  createdAt: string;
  author?: { id: string; username: string }; 
};


const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function GameDetailPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const likeKey = useMemo(() => `rating_${gameId ?? ""}`, [gameId]);

  async function loadGame() {
    if (!gameId) return;
    const { data } = await api.get(`/games/${gameId}`);
    setGame(data);
  }
  async function loadReviews(p = 1) {
    if (!gameId) return;
    const { data } = await api.get(`/games/${gameId}/reviews`, { params: { page: p, pageSize: 50 } });
    setReviews(data.items || []);
  }
  function loadLocalRating() {
    const status = localStorage.getItem(likeKey);
    setUserLiked(status === "LIKE");
    setUserDisliked(status === "DISLIKE");
  }

  useEffect(() => {
    loadGame();
    loadReviews();
    loadLocalRating();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  async function handleLike() {
    if (!gameId) return;
    const { data } = await api.post(`/games/${gameId}/like`);
    setGame(g => (g ? { ...g, likes: data.likes, dislikes: data.dislikes } : g));
    localStorage.setItem(likeKey, "LIKE");
    setUserLiked(true);
    setUserDisliked(false);
  }
  async function handleDislike() {
    if (!gameId) return;
    const { data } = await api.post(`/games/${gameId}/dislike`);
    setGame(g => (g ? { ...g, likes: data.likes, dislikes: data.dislikes } : g));
    localStorage.setItem(likeKey, "DISLIKE");
    setUserLiked(false);
    setUserDisliked(true);
  }
  async function handleResetRating() {
    if (!gameId) return;
    const { data } = await api.delete(`/games/${gameId}/rating`);
    setGame(g => (g ? { ...g, likes: data.likes, dislikes: data.dislikes } : g));
    localStorage.removeItem(likeKey);
    setUserLiked(false);
    setUserDisliked(false);
  }
  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !gameId) return;
    const { data } = await api.post(`/games/${gameId}/reviews`, { comment: newComment.trim() });
    setReviews(prev => [data, ...prev]);
    setNewComment("");
  }
  async function handleSaveToLibrary() {
    if (!user) return alert("Faça login para salvar na biblioteca.");
    if (user.userType !== "PLAYER") return alert("Apenas usuários PLAYER podem salvar na biblioteca.");
    if (!gameId) return;
    await api.post("/downloads", { gameId });
    alert("Jogo salvo na sua biblioteca!");
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <p>Jogo não encontrado.</p>
      </div>
    );
  }

  const fileName =
    game.filePath ? decodeURIComponent(game.filePath.split("/").pop() || "") : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="mb-2 dark:text-white">{game.title}</h1>
                <Badge>{game.genre}</Badge>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{game.description}</p>
          </div>

          {/* Imagens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(game.images || []).slice(0, 3).map((image) => (
              <div key={image.orderIndex} className="aspect-video overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                <ImageWithFallback
                  src={`${API}${image.imagePath}`}
                  alt={`${game.title} screenshot ${image.orderIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Like/Dislike */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">Avalie este jogo</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4">
              <Button variant={userLiked ? "default" : "outline"} className="gap-2" onClick={handleLike}>
                <ThumbsUp className="w-4 h-4" /> Like ({game.likes})
              </Button>
              <Button variant={userDisliked ? "default" : "outline"} className="gap-2" onClick={handleDislike}>
                <ThumbsDown className="w-4 h-4" /> Dislike ({game.dislikes})
              </Button>
              {(userLiked || userDisliked) && (
                <Button variant="ghost" onClick={handleResetRating}>Remover avaliação</Button>
              )}
            </CardContent>
          </Card>

          {/* Comentários */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">Reviews & Comentários</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder={user ? "Escreva sua review..." : "Entre para comentar"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button type="submit">Postar comentário</Button>
              </form>

              <div className="space-y-4 mt-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">Sem comentários ainda. Seja o primeiro!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="border-b dark:border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {r.author?.username ?? `Usuário ${r.userId.slice(0, 6)}`}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap wrap-break-word">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Arquivo do jogo */}
          {game.filePath && fileName && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Arquivo do Jogo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm dark:text-gray-300 break-all">{fileName}</p>
                
                <a href={`${API}${game.filePath}`} download>
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Baixar arquivo
                  </Button>
                </a>
              </CardContent>
            </Card>
          )}

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">Biblioteca</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {user?.userType === "PLAYER" && (
                <Button onClick={handleSaveToLibrary} className="w-full gap-2">
                  <Download className="w-4 h-4" /> Salvar na minha biblioteca
                </Button>
              )}
              {(!user || user.userType !== "PLAYER") && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faça login como <strong>USER</strong> para salvar este jogo na sua biblioteca.
                </p>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Publicado em: {new Date(game.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader><CardTitle className="dark:text-white">Estatísticas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Likes</span><span className="dark:text-white">{game.likes}</span></div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Dislikes</span><span className="dark:text-white">{game.dislikes}</span></div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rating</span>
                <span className="dark:text-white">
                  {game.likes + game.dislikes > 0 ? Math.round((game.likes / (game.likes + game.dislikes)) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Comentários</span><span className="dark:text-white">{reviews.length}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
