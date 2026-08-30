export type ProgressStatus = "new" | "learning" | "known";

const FAVORITES_KEY = "hs-favorites";
const PROGRESS_KEY = "hs-progress";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

export function getFavorites(): string[] {
  return readJson<string[]>(FAVORITES_KEY, []);
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const next = current.includes(id)
    ? current.filter((f) => f !== id)
    : [...current, id];
  writeJson(FAVORITES_KEY, next);
  return next;
}

export function getProgress(): Record<string, ProgressStatus> {
  return readJson<Record<string, ProgressStatus>>(PROGRESS_KEY, {});
}

export function setProgress(id: string, status: ProgressStatus): void {
  const current = getProgress();
  writeJson(PROGRESS_KEY, { ...current, [id]: status });
}

export function getStatus(id: string): ProgressStatus {
  return getProgress()[id] ?? "new";
}
