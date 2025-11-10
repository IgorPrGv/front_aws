/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/mygames.hooks.ts
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../lib/api.service';
import type { Game, User } from '../types/models';

export function useMyGames(user: User | null, authLoading: boolean) {
  const [items, setItems] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getMyGames(1, 50); 
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading my games:', error);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return; 
    }
    if (user?.userType === "DEV") {
      load();
    } else {
      setLoading(false);
    }
  }, [user, authLoading, load]); 

  const handleDeleteGame = useCallback(async (gameId: string, gameTitle: string) => {
    const isConfirmed = window.confirm(
      `Tem a certeza que quer apagar permanentemente o jogo "${gameTitle}"?\n\nEsta ação não pode ser desfeita e irá removê-lo da biblioteca de todos os usuários.`
    );

    if (!isConfirmed) return;

    try {
      await apiService.deleteGame(gameId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== gameId));
      setTotal((prevTotal) => prevTotal - 1);
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Erro ao apagar o jogo');
    }
  }, []); 

  return {
    items,
    total,
    loading,
    handleDeleteGame,
  };
}