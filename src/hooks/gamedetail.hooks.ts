// src/hooks/gamedetail.hooks.ts
import { useEffect, useState, useCallback } from "react";
import { apiService } from "../lib/api.service";
import type { Game, Review, User } from "../types/models";

export function useGameDetail(gameId: string | undefined, user: User | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState("");
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);

  const loadGame = useCallback(async () => {
    if (!gameId) return;
    try {
      const gameData = await apiService.getGameById(gameId);
      setGame(gameData);
    } catch (error) {
      console.error("Erro ao carregar jogo:", error);
    }
  }, [gameId]);

  const loadReviews = useCallback(async () => {
    if (!gameId) return;
    try {
      const reviewsData = await apiService.getGameReviews(gameId, 50);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Erro ao carregar reviews:", error);
    }
  }, [gameId]);

  const loadUserRating = useCallback(async () => {
    if (!user || !gameId) {
      setUserLiked(false);
      setUserDisliked(false);
      return;
    }
    try {
      const data = await apiService.getUserRating(gameId);
      setUserLiked(data.userRating === "LIKE");
      setUserDisliked(data.userRating === "DISLIKE");
    } catch (error) {
      console.error("Erro ao buscar rating do usuário:", error);
    }
  }, [gameId, user]);

  useEffect(() => {
    loadGame();
    loadReviews();
    loadUserRating();
  }, [loadGame, loadReviews, loadUserRating]); 

  const handleLike = async () => {
    if (!gameId) return;
    const data = await apiService.likeGame(gameId);
    setGame(g => (g ? { ...g, likes: data.likes, dislikes: data.dislikes } : g));
    setUserLiked(data.userRating === 'LIKE');
    setUserDisliked(data.userRating === 'DISLIKE');
  };

  const handleDislike = async () => {
    if (!gameId) return;
    const data = await apiService.dislikeGame(gameId);
    setGame(g => (g ? { ...g, likes: data.likes, dislikes: data.dislikes } : g));
    setUserLiked(data.userRating === 'LIKE');
    setUserDisliked(data.userRating === 'DISLIKE');
  };

  const handleResetRating = async () => {
    if (!gameId) return;
    const data = await apiService.removeRating(gameId);
    setGame(g => (g ? { ...g, likes: data.likes, dislikes: data.dislikes } : g));
    setUserLiked(data.userRating === 'LIKE');
    setUserDisliked(data.userRating === 'DISLIKE');
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !gameId) return;
    const newReview = await apiService.createReview(gameId, newComment.trim());
    setReviews(prev => [newReview, ...prev]);
    setNewComment("");
  };

  return {
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
  };
}