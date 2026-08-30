import { words } from "@/data";
import { GLOSS_DICTIONARY } from "./glossDictionary";

export interface GlossToken {
  hanzi: string;
  pinyin?: string;
  meaning?: string;
}

const PUNCTUATION = /^[，。？！：；、"'“”‘’（）()·…\s\-,.?!:;/]+$/u;

let cachedIndex: Map<string, { pinyin: string; meaning: string }> | null = null;

/** hanzi -> {pinyin, meaning}, built once from the full vocabulary list
 * (longer/more specific entries aren't prioritized here - exact hanzi
 * match only - so this is a plain lookup, not itself a segmenter). */
function getWordIndex(): Map<string, { pinyin: string; meaning: string }> {
  if (cachedIndex) return cachedIndex;
  const idx = new Map<string, { pinyin: string; meaning: string }>();
  for (const w of words) {
    if (!idx.has(w.hanzi)) idx.set(w.hanzi, { pinyin: w.pinyin, meaning: w.meaning });
  }
  for (const [hanzi, entry] of Object.entries(GLOSS_DICTIONARY)) {
    if (!idx.has(hanzi)) idx.set(hanzi, entry);
  }
  cachedIndex = idx;
  return idx;
}

const MAX_WORD_LENGTH = 6;

/**
 * Breaks a Chinese sentence into word-by-word glosses using greedy
 * longest-match segmentation against the app's own vocabulary (plus a
 * small supplementary dictionary of common grammar words/pronouns), e.g.
 * "我想喝茶" -> [wǒ (I), xiǎng (want), hē (drink), chá (tea)].
 *
 * Punctuation passes through ungloss-able; hanzi chunks with no match in
 * either dictionary are returned without pinyin/meaning rather than
 * guessed at, since a language learner needs to trust every gloss shown.
 */
export function glossSentence(hanzi: string): GlossToken[] {
  const index = getWordIndex();
  const chars = Array.from(hanzi);
  const tokens: GlossToken[] = [];
  let i = 0;

  while (i < chars.length) {
    if (PUNCTUATION.test(chars[i])) {
      tokens.push({ hanzi: chars[i] });
      i++;
      continue;
    }

    let matched = false;
    const maxLen = Math.min(MAX_WORD_LENGTH, chars.length - i);
    for (let len = maxLen; len >= 1; len--) {
      const candidate = chars.slice(i, i + len).join("");
      const entry = index.get(candidate);
      if (entry) {
        tokens.push({ hanzi: candidate, pinyin: entry.pinyin, meaning: entry.meaning });
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push({ hanzi: chars[i] });
      i++;
    }
  }

  return tokens;
}
