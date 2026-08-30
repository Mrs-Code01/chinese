export interface StoryToken {
  hanzi: string;
  pinyin?: string;
  meaning?: string;
  /** Optional grammar/usage note - why this word is used here. */
  tip?: string;
}

export interface StorySentence {
  tokens: StoryToken[];
  translation: string;
}

export interface Story {
  slug: string;
  title: string;
  hanziTitle: string;
  hsk: number;
  icon: string;
  summary: string;
  sentences: StorySentence[];
}

/**
 * Terse authoring format so stories don't need a full object literal per
 * word. A plain string is punctuation (rendered, not clickable). A tuple is
 * [hanzi, pinyin, meaning, tip?].
 */
export type TokenTuple = string | [string, string, string, string?];

export function t(tuples: TokenTuple[]): StoryToken[] {
  return tuples.map((tok) =>
    typeof tok === "string"
      ? { hanzi: tok }
      : { hanzi: tok[0], pinyin: tok[1], meaning: tok[2], tip: tok[3] }
  );
}
