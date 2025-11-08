/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.service.ts
import { api } from './axios';
import type { Game, Review, User } from '../types/models';


// ===================== HELPERS =====================
function getS3Url(key: string | null | undefined): string | null {
  if (!key) return null;
  const bucket = import.meta.env.VITE_S3_BUCKET || '';
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// Transforma resposta do backend para formato esperado pelo frontend
function transformGame(game: any): Game {
  return {
    ...game,
    filePath: game.s3Key ? getS3Url(game.s3Key) : null,
    images: (game.images || []).map((img: any, idx: number) => ({
      id: img.id || `${game.id}-${idx}`,
      gameId: game.id,
      imagePath: getS3Url(img.s3Key) || '',
      orderIndex: img.orderIndex ?? idx,
    })),
  };
}

// ===================== AUTH =====================
export async function login(username: string, password: string): Promise<{ user: User; token: string }> {
  const { data } = await api.post('/auth/login', { username, password });
  return data;
}

export async function register(
  username: string, 
  password: string, 
  userType: 'PLAYER' | 'DEV',
  email?: string
): Promise<{ user: User; token: string }> {
  const { data } = await api.post('/auth/register', { 
    username, 
    password, 
    userType,
    ...(email ? { email } : {})
  });
  return data;
}

// ===================== GAMES =====================
export async function listGames({ 
  search = '', 
  page = 1, 
  pageSize = 12 
} = {}): Promise<{ items: Game[]; page: number; pageSize: number; total: number }> {
  const { data } = await api.get('/games', { 
    params: { search, page, pageSize } 
  });
  
  return {
    ...data,
    items: (data.items || []).map(transformGame),
  };
}

export async function getGameById(id: string): Promise<Game> {
  const { data } = await api.get(`/games/${id}`);
  return transformGame(data);
}

export async function getMyGames(page = 1, pageSize = 50): Promise<{ items: Game[]; total: number }> {
  const { data } = await api.get('/games/my-games', { 
    params: { page, pageSize } 
  });
  
  return {
    ...data,
    items: (data.items || []).map(transformGame),
  };
}

// ===================== UPLOAD =====================
export async function uploadFile(file: File): Promise<{ key: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return data;
}

export async function uploadGameFiles(
  images: File[], 
  gameFile: File | null
): Promise<{ imageKeys?: string[]; s3Key?: string }> {
  const formData = new FormData();
  
  images.forEach(img => formData.append('images', img));
  if (gameFile) formData.append('file', gameFile);
  
  const { data } = await api.post('/files/upload-game', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  
  return data;
}

export async function createGame(payload: {
  title: string;
  description: string;
  genre: string;
  imageKeys?: string[];
  s3Key?: string;
}): Promise<Game> {
  const { data } = await api.post('/games', payload);
  return transformGame(data);
}

export async function updateGame(
  id: string, 
  payload: { title?: string; description?: string; genre?: string }
): Promise<Game> {
  const { data } = await api.put(`/games/${id}`, payload);
  return transformGame(data);
}

export async function deleteGame(id: string): Promise<void> {
  await api.delete(`/games/${id}`);
}

// ===================== RATINGS =====================
export async function likeGame(gameId: string): Promise<{ 
  likes: number; 
  dislikes: number; 
  userRating: 'LIKE' | 'DISLIKE' | null 
}> {
  const { data } = await api.post(`/games/${gameId}/like`);
  return data;
}

export async function dislikeGame(gameId: string): Promise<{ 
  likes: number; 
  dislikes: number; 
  userRating: 'LIKE' | 'DISLIKE' | null 
}> {
  const { data } = await api.post(`/games/${gameId}/dislike`);
  return data;
}

export async function removeRating(gameId: string): Promise<{ 
  likes: number; 
  dislikes: number; 
  userRating: null 
}> {
  const { data } = await api.delete(`/games/${gameId}/rating`);
  return data;
}

export async function getUserRating(gameId: string): Promise<{ 
  userRating: 'LIKE' | 'DISLIKE' | null 
}> {
  const { data } = await api.get(`/games/${gameId}/rating`);
  return data;
}

// ===================== REVIEWS =====================
export async function getGameReviews(gameId: string, limit = 20): Promise<Review[]> {
  const { data } = await api.get(`/games/${gameId}/reviews`, {
    params: { limit }
  });
  
  return (data.items || []).map((r: any) => ({
    reviewId: r.id,      
    gameId: gameId,
    userId: r.userId,
    comment: r.comment,
    createdAt: r.createdAt,
    author: r.author ? {
      id: r.userId,
      username: r.author.username
    } : undefined,
  }));
}

export async function createReview(gameId: string, comment: string): Promise<Review> {
  const { data } = await api.post(`/games/${gameId}/reviews`, { comment });
  
  return {
    reviewId: data.id,
    gameId: gameId,
    userId: data.userId,
    comment: data.comment,
    createdAt: data.createdAt,
    author: data.author ? {
      id: data.userId,
      username: data.author.username
    } : undefined,
  };
}

// ===================== DOWNLOADS =====================
export async function addToLibrary(gameId: string): Promise<void> {
  await api.post('/downloads', { gameId });
}

export async function getMyDownloads(page = 1, pageSize = 50): Promise<{
  items: Array<{
    id: string;
    gameId: string;
    userId: string;
    downloadDate: string;
    game?: Game;
  }>;
  total: number;
}> {
  const { data } = await api.get('/downloads', {
    params: { page, pageSize }
  });
  
  return {
    ...data,
    items: (data.items || []).map((d: any) => ({
      ...d,
      game: d.game ? transformGame(d.game) : undefined,
    })),
  };
}

export async function removeFromLibrary(downloadId: string): Promise<void> {
  await api.delete(`/downloads/${downloadId}`);
}

// ===================== EXPORT =====================
export const apiService = {
  // Auth
  login,
  register,
  
  // Games
  listGames,
  getGameById,
  getMyGames,
  createGame,
  updateGame,
  deleteGame,
  
  // Upload
  uploadFile,
  uploadGameFiles,
  
  // Ratings
  likeGame,
  dislikeGame,
  removeRating,
  getUserRating,
  
  // Reviews
  getGameReviews,
  createReview,
  
  // Downloads
  addToLibrary,
  getMyDownloads,
  removeFromLibrary,
};