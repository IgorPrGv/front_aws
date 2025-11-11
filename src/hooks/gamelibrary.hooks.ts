/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/gamelibrary.hooks.ts
import { useAuth } from "../providers/AuthProvider";
import { apiService } from "../lib/api.service";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useGameLibrary() {
  const { user } = useAuth();

  const addToLibrary = async (gameId: string) => {
    if (!user) {
      alert("Faça login para adicionar à sua biblioteca.");
      return;
    }
    if (user.userType !== 'PLAYER') {
      toast.error("Apenas Jogadores podem adicionar jogos à biblioteca.");
      return;
    }

    try {
      await apiService.addToLibrary(gameId);
      toast.success("Adicionado à sua biblioteca!");
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || 'Erro ao adicionar';
      toast.error(msg);
    }
  };

  return { addToLibrary };
}

export function useMyDownloads() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await apiService.getMyDownloads(1, 50);
      setItems(items);
    } catch (error) {
      console.error('Error loading downloads:', error);
      setItems([]); 
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (user?.userType === "PLAYER") {
      load();
    } else if (!user) {
      setItems([]);
      setLoading(false);
    }
  }, [user, load]);

  // Lógica de Remoção
  const removeFromLibrary = async (downloadId: string) => {
    try {
      await apiService.removeFromLibrary(downloadId);
      setItems((prev) => prev.filter((r) => r.id !== downloadId));
      toast.success("Jogo removido da biblioteca.");
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || 'Erro ao remover';
      toast.error(msg);
    }
  };

  return {
    items,
    loading,
    removeFromLibrary,
  };
}