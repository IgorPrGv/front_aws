// src/lib/api.mock.ts
export type Game = {
  id: string;
  title: string;
  description: string;
  genre: string;
  images: string[];
  uploadedBy: string;
  uploadedAt: string;
  likes: number;
  dislikes: number;
};

export const mockGames: Game[] = [
  {
    id: "1",
    title: "Space Adventure",
    description:
      "An epic space exploration game with stunning graphics and engaging gameplay. Explore distant galaxies and fight alien enemies.",
    genre: "Action",
    images: [
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5",
      "https://images.unsplash.com/photo-1538370965046-79c0d6907d47",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    ],
    uploadedBy: "gamedev",
    uploadedAt: "2025-10-28",
    likes: 245,
    dislikes: 12,
  },
  {
    id: "2",
    title: "Fantasy Quest",
    description:
      "Embark on a magical journey through mystical lands filled with dragons, wizards, and ancient treasures.",
    genre: "RPG",
    images: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5",
      "https://images.unsplash.com/photo-1511882150382-421056c89033",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
    ],
    uploadedBy: "gamedev",
    uploadedAt: "2025-10-25",
    likes: 189,
    dislikes: 8,
  },
  {
    id: "3",
    title: "Racing Thunder",
    description:
      "High-speed racing action with realistic physics and stunning tracks around the world.",
    genre: "Racing",
    images: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888",
    ],
    uploadedBy: "gamedev",
    uploadedAt: "2025-10-30",
    likes: 321,
    dislikes: 15,
  },
];


/** Chave usada no localStorage para persistir/editar o mock pela UI */
const LS_KEY = "games";

/** Retorna o array de jogos a partir do localStorage, seedando com mock se vazio */
export function getGames(): Game[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Game[];
  // eslint-disable-next-line no-empty
  } catch {}
  localStorage.setItem(LS_KEY, JSON.stringify(mockGames));
  return [...mockGames];
}

/** Persiste a lista completa de jogos no localStorage */
export function saveGames(games: Game[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(games));
}

/** Busca um jogo pelo id  */
export function getGameById(id: string): Game | undefined {
  return getGames().find((g) => g.id === id);
}

/** Insere/atualiza um jogo no storage */
export function upsertGame(game: Game) {
  const list = getGames();
  const i = list.findIndex((g) => g.id === game.id);
  if (i >= 0) list[i] = game;
  else list.push(game);
  saveGames(list);
}

/** Restaura o mock original */
export function resetMock() {
  saveGames(mockGames);
}