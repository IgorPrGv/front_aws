import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../lib/api.service';
import type { Game } from '../types/models';

const PAGE_SIZE = 12;

export function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (search: string, currentPage: number) => {
    setLoading(true);
    console.log(`Carregando jogos... (Página: ${currentPage}, Busca: "${search}")`);
    try {
      const result = await apiService.listGames({ 
        search: search, 
        page: currentPage, 
        pageSize: PAGE_SIZE 
      });
      setGames(result.items);
      setTotal(result.total);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
      setGames([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(searchTerm, page);
  }, [page, searchTerm, load]); 

  // Handler para o formulário de busca
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); 
    if (page === 1) {
      load(searchTerm, 1);
    } else {
      setPage(1);
    }
  };

  return {
    games,
    loading,
    total,
    page,
    pageSize: PAGE_SIZE,
    searchTerm,
    setSearchTerm, 
    onSearchSubmit,
    setPage, 
  };
}