const JOURNAL_KEY = "hs-journal-notes";

export type JournalNotes = Record<string, string>;

/** Local (not UTC) date key like "2026-08-30", stable across timezones. */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function loadJournalNotes(): JournalNotes {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(JOURNAL_KEY);
    return raw ? (JSON.parse(raw) as JournalNotes) : {};
  } catch {
    return {};
  }
}

/** Saves (or, if text is blank, clears) the note for one day and returns the updated set. */
export function saveJournalNote(key: string, text: string): JournalNotes {
  const notes = loadJournalNotes();
  if (text.trim()) {
    notes[key] = text;
  } else {
    delete notes[key];
  }
  try {
    window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(notes));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
  return notes;
}
