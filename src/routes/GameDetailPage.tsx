// src/pages/GameDetailPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ThumbsUp, ThumbsDown, Download, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { ImageModal } from "../components/ImageModal";
import { useAuth } from "../providers/AuthProvider";
import { useGameDetail } from "../hooks/gamedetail.hooks";
import { useGameLibrary } from "../hooks/gamelibrary.hooks";

export function GameDetailPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    game,
    reviews,
    newComment,
    setNewComment,
    userLiked,
    userDisliked,
    handleLike,
    handleDislike,
    handleResetRating,
    handleSubmitComment,
  } = useGameDetail(gameId, user);

  const { addToLibrary } = useGameLibrary(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageAlt, setSelectedImageAlt] = useState("");

  const openImageModal = (src: string, alt: string) => {
    setSelectedImage(src);
    setSelectedImageAlt(alt);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
    setSelectedImageAlt("");
  };

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
              <div key={image.orderIndex} className="aspect-video overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 cursor-pointer" 
              onClick={() => openImageModal(image.imagePath, `${game.title} screenshot ${image.orderIndex + 1}`)}
              >
                <ImageWithFallback
                  src={image.imagePath}
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
            <CardHeader><CardTitle className="dark:text-white">Comentários</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder={user ? "Escreva sua review..." : "Entre para comentar"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  disabled={!user}
                />
                <Button type="submit">Postar comentário</Button>
              </form>

              <div className="space-y-4 mt-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">Sem comentários ainda. Seja o primeiro!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.reviewId} className="border-b dark:border-gray-700 pb-4 last:border-b-0">
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
                
                <a href={game.filePath} download>
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
                <Button onClick={() => addToLibrary(game.id)} className="w-full gap-2">
                  <Download className="w-4 h-4" /> Salvar na minha biblioteca
                </Button>
              )}
              {(!user || user.userType !== "PLAYER") && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faça login como <strong>Jogador</strong> para salvar este jogo na sua biblioteca.
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
      <ImageModal
        isOpen={isModalOpen}
        src={selectedImage}
        alt={selectedImageAlt}
        onClose={closeImageModal}
      />
    </div>
  );
}
