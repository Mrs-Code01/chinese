/**
 * Converts standard tone-marked pinyin into a rough English-phonetic
 * approximation plus a per-syllable tone "melody" (arrows), e.g.
 *   "wǒ xiǎng hē"  ->  syllables: [wǒ↘↗, xiǎng↘↗, hē→]
 *                       approx:    "woh-shyahng-huh"
 *
 * This is intentionally a *rough* approximation for English readers,
 * not IPA. It's generated from a compact initial/final table rather
 * than hand-authored per word, so it works for every entry in the
 * dataset (present and future) with no extra data-entry cost.
 */

export interface PhoneticSyllable {
  /** original substring, tone marks intact, e.g. "xiǎng" */
  original: string;
  /** rough English-phonetic spelling, e.g. "shyahng" */
  approx: string;
  /** 0 = neutral, 1-4 = tone number */
  tone: 0 | 1 | 2 | 3 | 4;
  /** visual tone contour */
  arrow: string;
}

const TONE_ARROWS: Record<number, string> = {
  0: "·",
  1: "→",
  2: "↗",
  3: "↘↗",
  4: "↘",
};

// Every toned vowel character mapped to its base letter + tone number.
const TONE_MAP: Record<string, { base: string; tone: 1 | 2 | 3 | 4 }> = {
  ā: { base: "a", tone: 1 }, á: { base: "a", tone: 2 }, ǎ: { base: "a", tone: 3 }, à: { base: "a", tone: 4 },
  ē: { base: "e", tone: 1 }, é: { base: "e", tone: 2 }, ě: { base: "e", tone: 3 }, è: { base: "e", tone: 4 },
  ī: { base: "i", tone: 1 }, í: { base: "i", tone: 2 }, ǐ: { base: "i", tone: 3 }, ì: { base: "i", tone: 4 },
  ō: { base: "o", tone: 1 }, ó: { base: "o", tone: 2 }, ǒ: { base: "o", tone: 3 }, ò: { base: "o", tone: 4 },
  ū: { base: "u", tone: 1 }, ú: { base: "u", tone: 2 }, ǔ: { base: "u", tone: 3 }, ù: { base: "u", tone: 4 },
  ǖ: { base: "ü", tone: 1 }, ǘ: { base: "ü", tone: 2 }, ǚ: { base: "ü", tone: 3 }, ǜ: { base: "ü", tone: 4 },
};

const CONSONANT_INITIALS = [
  "zh", "ch", "sh", // longest first
  "b", "p", "m", "f", "d", "t", "n", "l",
  "g", "k", "h", "j", "q", "x", "r", "z", "c", "s",
];

const INITIAL_SOUND: Record<string, string> = {
  b: "b", p: "p", m: "m", f: "f", d: "d", t: "t", n: "n", l: "l",
  g: "g", k: "k", h: "h",
  j: "j", q: "ch", x: "sh",
  zh: "jr", ch: "chr", sh: "shr", r: "r",
  z: "dz", c: "ts", s: "s",
};

// Regular finals (used after a real consonant initial, or for the "bare"
// spelling used with j/q/x + non-u finals).
const FINAL_SOUND: Record<string, string> = {
  a: "ah", o: "oh", e: "uh",
  ai: "eye", ei: "ay", ao: "ow", ou: "oh",
  an: "ahn", en: "en", ang: "ahng", eng: "ung", ong: "oong", er: "are",
  i: "ee", ia: "yah", ie: "yeh", iao: "yow", iu: "yoh",
  ian: "yen", in: "een", iang: "yahng", ing: "eeng", iong: "yoong",
  u: "oo", ua: "wah", uo: "waw", uai: "why", ui: "way",
  uan: "wahn", un: "wun", uang: "wahng", ueng: "wung",
  ü: "yu", üe: "weh",
};

// After j/q/x, a final spelled with "u" actually represents ü (real "u"
// never follows j/q/x in Mandarin), so these override the regular table.
const YU_FINAL_SOUND: Record<string, string> = {
  u: "yu", ue: "weh", uan: "wen", un: "yun",
};

// Whole-syllable spellings that don't decompose cleanly as initial+final:
// zero-initial y/w spellings, the "buzzing" zh/ch/sh/r/z/c/s + i syllables,
// and bare vowel syllables.
const SPECIAL_SYLLABLES: Record<string, string> = {
  // zero-initial i-series (y-prefixed spelling)
  yi: "ee", ya: "yah", ye: "yeh", yao: "yow", you: "yoh",
  yan: "yen", yin: "een", yang: "yahng", ying: "eeng", yong: "yoong",
  // zero-initial u-series (w-prefixed spelling)
  wu: "oo", wa: "wah", wo: "woh", wai: "why", wei: "way",
  wan: "wahn", wen: "wun", wang: "wahng", weng: "wung",
  // zero-initial ü-series (yu-prefixed spelling)
  yu: "yu", yue: "yweh", yuan: "ywen", yun: "yun",
  // buzzing/empty-rime syllables
  zhi: "jr", chi: "chr", shi: "shr", ri: "rr",
  zi: "dz", ci: "tsz", si: "sz",
  // bare vowel-only syllables (zero initial, no y/w prefix)
  a: "ah", o: "oh", e: "uh", ai: "eye", ei: "ay", ao: "ow", ou: "oh",
  an: "ahn", en: "en", ang: "ahng", eng: "ung", er: "are",
};

function buildSyllableTable(): Record<string, string> {
  const table: Record<string, string> = {};
  const jqx = ["j", "q", "x"];
  const regularInitials = CONSONANT_INITIALS.filter((i) => !jqx.includes(i));

  for (const initial of regularInitials) {
    for (const final of Object.keys(FINAL_SOUND)) {
      if (final === "ü" || final === "üe") continue; // only follows n/l, handled below
      table[initial + final] = INITIAL_SOUND[initial] + FINAL_SOUND[final];
    }
  }

  // j/q/x never precede a real "u" - a final spelled with plain "u" after
  // them always represents ü, so those go through YU_FINAL_SOUND instead.
  for (const initial of jqx) {
    for (const final of Object.keys(FINAL_SOUND)) {
      if (final === "ü" || final === "üe" || final.startsWith("u")) continue;
      table[initial + final] = INITIAL_SOUND[initial] + FINAL_SOUND[final];
    }
    for (const final of Object.keys(YU_FINAL_SOUND)) {
      table[initial + final] = INITIAL_SOUND[initial] + YU_FINAL_SOUND[final];
    }
  }

  // ü / üe (actual umlaut) only ever follow n or l (nu/nü, lu/lü are a
  // real minimal pair, so pinyin keeps the umlaut there).
  for (const initial of ["n", "l"]) {
    table[initial + "ü"] = INITIAL_SOUND[initial] + FINAL_SOUND["ü"];
    table[initial + "üe"] = INITIAL_SOUND[initial] + FINAL_SOUND["üe"];
  }

  Object.assign(table, SPECIAL_SYLLABLES);
  return table;
}

const SYLLABLE_PHONETIC = buildSyllableTable();

/** Backtracking maximal-munch segmenter. Returns syllable lengths, or null. */
function trySegment(letters: string): number[] | null {
  if (letters.length === 0) return [];
  const maxLen = Math.min(6, letters.length);
  for (let len = maxLen; len >= 1; len--) {
    const candidate = letters.slice(0, len);
    if (candidate in SYLLABLE_PHONETIC) {
      const rest = trySegment(letters.slice(len));
      if (rest !== null) return [len, ...rest];
    }
  }
  return null;
}

interface TokenAnalysis {
  base: string;
  toneAt: number[];
}

function analyzeToken(token: string): TokenAnalysis {
  let base = "";
  const toneAt: number[] = [];
  for (const ch of token) {
    const toned = TONE_MAP[ch];
    if (toned) {
      base += toned.base;
      toneAt.push(toned.tone);
    } else {
      base += ch.toLowerCase();
      toneAt.push(0);
    }
  }
  return { base, toneAt };
}

function segmentToken(token: string): PhoneticSyllable[] | null {
  const { base, toneAt } = analyzeToken(token);
  if (!base) return null;

  let lengths = trySegment(base);
  let erhuaExtra = 0;
  if (!lengths && base.length > 1 && base.endsWith("r")) {
    // Handle erhua (e.g. "dianr") - retry without the trailing "r" suffix.
    lengths = trySegment(base.slice(0, -1));
    if (lengths) erhuaExtra = 1;
  }
  if (!lengths || lengths.length === 0) return null;

  const syllables: PhoneticSyllable[] = [];
  let pos = 0;
  lengths.forEach((len, idx) => {
    const isLast = idx === lengths!.length - 1;
    const extra = isLast ? erhuaExtra : 0;
    const start = pos;
    const end = pos + len + extra;
    const syllableBase = base.slice(start, start + len);
    const tone = (toneAt.slice(start, end).find((t) => t !== 0) ?? 0) as 0 | 1 | 2 | 3 | 4;
    const approx = (SYLLABLE_PHONETIC[syllableBase] ?? syllableBase) + (extra ? "r" : "");
    syllables.push({
      original: token.slice(start, end),
      approx,
      tone,
      arrow: TONE_ARROWS[tone],
    });
    pos = end;
  });
  return syllables;
}

/**
 * Breaks a pinyin string (words separated by spaces, syllables within a
 * word concatenated as normal pinyin orthography) into phonetic syllables.
 * Tokens that can't be parsed (stray punctuation, non-pinyin text like
 * "VPN" or "App") are silently skipped. Returns null if nothing could be
 * parsed at all.
 */
export function getPhoneticBreakdown(pinyin: string): PhoneticSyllable[] | null {
  if (!pinyin) return null;
  // Split on whitespace, then further on punctuation that marks a hard
  // syllable/word boundary (apostrophe, hyphen, slash, and other symbols).
  const tokens = pinyin.split(/[\s'/()（）,，.。!!??:：;；]+/u).filter(Boolean);

  const result: PhoneticSyllable[] = [];
  for (const token of tokens) {
    const cleaned = token.replace(/[^a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/g, "");
    if (!cleaned) continue;
    const syllables = segmentToken(cleaned);
    if (syllables) result.push(...syllables);
  }
  return result.length > 0 ? result : null;
}

export function formatSmoothReading(syllables: PhoneticSyllable[]): string {
  return syllables.map((s) => s.approx).join("-");
}

export function formatToneMelody(syllables: PhoneticSyllable[]): string {
  return syllables.map((s) => `${s.original}${s.arrow}`).join("  ");
}
