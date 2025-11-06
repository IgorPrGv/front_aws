// src/lib/downloads.mock.ts
export type Download = {
  id: string;
  gameId: string;
  userId: string;
  downloadDate: string; // ISO
};

const KEY = "downloads";

function readAll(): Download[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Download[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: Download[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addDownload(gameId: string, userId: string) {
  const list = readAll();
  list.unshift({
    id: Date.now().toString(),
    gameId,
    userId,
    downloadDate: new Date().toISOString(),
  });
  writeAll(list);
}

export function getDownloadsByUser(userId: string): Download[] {
  return readAll()
    .filter((d) => d.userId === userId)
    .sort((a, b) => (a.downloadDate < b.downloadDate ? 1 : -1));
}

export function resetDownloads() {
  localStorage.removeItem(KEY);
}

export function removeDownload(downloadId: string) {
  const raw = localStorage.getItem("downloads");
  const all = raw ? (JSON.parse(raw) as Download[]) : [];
  const updated = all.filter(d => d.id !== downloadId);
  localStorage.setItem("downloads", JSON.stringify(updated));
}

