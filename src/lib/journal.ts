const JOURNAL_KEY = "hs-journal-notes";

export type JournalNotes = Record<string, string>;

/** Local (not UTC) date key like "2026-08-30", stable across timezones. */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// --- Local cache (instant, offline-friendly; the server is the source of truth) ---

export function loadLocalNotes(): JournalNotes {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(JOURNAL_KEY);
    return raw ? (JSON.parse(raw) as JournalNotes) : {};
  } catch {
    return {};
  }
}

export function saveLocalNotes(notes: JournalNotes): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

/** Updates (or, if text is blank, clears) one day in the local cache. */
export function setLocalNote(key: string, text: string): JournalNotes {
  const notes = loadLocalNotes();
  if (text.trim()) notes[key] = text;
  else delete notes[key];
  saveLocalNotes(notes);
  return notes;
}

// --- Server sync, so notes follow you across devices ---
//
// The passphrase is intentionally NEVER persisted (no localStorage,
// sessionStorage, or cookie) - it lives only in React state for the
// lifetime of the page. Refreshing, closing the tab, or someone else
// opening the browser later always lands back on the passphrase gate,
// so a note is never shown "by mistake".

export type RemoteFetchResult =
  | { ok: true; notes: JournalNotes }
  | { ok: false; status: number };

export async function fetchRemoteNotes(secret: string): Promise<RemoteFetchResult> {
  try {
    const res = await fetch("/api/journal", { headers: { "x-journal-secret": secret } });
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json()) as { notes?: JournalNotes };
    return { ok: true, notes: data.notes ?? {} };
  } catch {
    return { ok: false, status: 0 };
  }
}

export async function pushRemoteNote(
  secret: string,
  date: string,
  text: string
): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch("/api/journal", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-journal-secret": secret },
      body: JSON.stringify({ date, text }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
