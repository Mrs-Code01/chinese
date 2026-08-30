import "server-only";
import { createClient } from "@supabase/supabase-js";

const TABLE = "journal_notes";

// Falls back to an in-memory store when Supabase isn't configured (e.g.
// local dev without env vars). This resets on every server restart, so
// it's only suitable for local testing - production needs real Supabase
// credentials (see README) for notes to actually persist and sync across
// devices.
const memoryStore = new Map<string, string>();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isJournalStoreConfigured(): boolean {
  return getSupabase() !== null;
}

export async function getAllNotes(): Promise<Record<string, string>> {
  const supabase = getSupabase();
  if (!supabase) return Object.fromEntries(memoryStore);

  const { data, error } = await supabase.from(TABLE).select("date, text");
  if (error) throw new Error(`Supabase error: ${error.message}`);

  const notes: Record<string, string> = {};
  for (const row of data ?? []) notes[row.date as string] = row.text as string;
  return notes;
}

/** Saves (or, if text is blank, clears) the note for one day. */
export async function setNote(date: string, text: string): Promise<void> {
  const supabase = getSupabase();
  const trimmed = text.trim();

  if (!supabase) {
    if (trimmed) memoryStore.set(date, text);
    else memoryStore.delete(date);
    return;
  }

  if (trimmed) {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ date, text, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Supabase error: ${error.message}`);
  } else {
    const { error } = await supabase.from(TABLE).delete().eq("date", date);
    if (error) throw new Error(`Supabase error: ${error.message}`);
  }
}
