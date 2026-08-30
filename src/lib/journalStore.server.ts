import "server-only";
import { Redis } from "@upstash/redis";

const REDIS_KEY = "hanyusprint:journal-notes";

// Falls back to an in-memory store when Upstash isn't configured (e.g. local
// dev without env vars). This resets on every server restart, so it's only
// suitable for local testing - production needs real Upstash credentials
// (see README) for notes to actually persist and sync across devices.
const memoryStore = new Map<string, string>();

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function isJournalStoreConfigured(): boolean {
  return getRedis() !== null;
}

export async function getAllNotes(): Promise<Record<string, string>> {
  const redis = getRedis();
  if (!redis) return Object.fromEntries(memoryStore);
  const notes = await redis.hgetall<Record<string, string>>(REDIS_KEY);
  return notes ?? {};
}

/** Saves (or, if text is blank, clears) the note for one day. */
export async function setNote(date: string, text: string): Promise<void> {
  const redis = getRedis();
  const trimmed = text.trim();
  if (!redis) {
    if (trimmed) memoryStore.set(date, text);
    else memoryStore.delete(date);
    return;
  }
  if (trimmed) {
    await redis.hset(REDIS_KEY, { [date]: text });
  } else {
    await redis.hdel(REDIS_KEY, date);
  }
}
