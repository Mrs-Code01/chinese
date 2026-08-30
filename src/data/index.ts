import type { Word, Sentence } from "./types";
import { categories, getCategory } from "./categories";

import * as greetingsBasics from "./content/greetings-basics";
import * as numbersTime from "./content/numbers-time";
import * as family from "./content/family";
import * as home from "./content/home";
import * as foodDining from "./content/food-dining";
import * as shopping from "./content/shopping";
import * as workplace from "./content/workplace";
import * as school from "./content/school";
import * as travelTransport from "./content/travel-transport";
import * as directions from "./content/directions";
import * as health from "./content/health";
import * as weather from "./content/weather";
import * as emotions from "./content/emotions";
import * as peopleAppearance from "./content/people-appearance";
import * as technologyPhone from "./content/technology-phone";
import * as socialSmalltalk from "./content/social-smalltalk";
import * as hobbiesLeisure from "./content/hobbies-leisure";
import * as dailyRoutine from "./content/daily-routine";
import * as moneyBanking from "./content/money-banking";
import * as idiomsProverbs from "./content/idioms-proverbs";
import * as measureWords from "./content/measure-words";
import * as emergencySafety from "./content/emergency-safety";
import * as clothingAppearance from "./content/clothing-appearance";
import * as relationshipsDating from "./content/relationships-dating";
import * as essentialBasics from "./content/essential-basics";
import * as commonVerbs from "./content/common-verbs";

const modules = [
  greetingsBasics,
  numbersTime,
  family,
  home,
  foodDining,
  shopping,
  workplace,
  school,
  travelTransport,
  directions,
  health,
  weather,
  emotions,
  peopleAppearance,
  technologyPhone,
  socialSmalltalk,
  hobbiesLeisure,
  dailyRoutine,
  moneyBanking,
  idiomsProverbs,
  measureWords,
  emergencySafety,
  clothingAppearance,
  relationshipsDating,
  essentialBasics,
  commonVerbs,
];

export const words: Word[] = modules.flatMap((m) => m.words);
export const sentences: Sentence[] = modules.flatMap((m) => m.sentences);

export { categories, getCategory };

export const hskLevels = [1, 2, 3, 4, 5, 6] as const;

export function wordsByCategory(slug: string): Word[] {
  return words.filter((w) => w.category === slug);
}

export function sentencesByCategory(slug: string): Sentence[] {
  return sentences.filter((s) => s.category === slug);
}

export function wordsByHsk(level: number): Word[] {
  return words.filter((w) => w.hsk === level);
}

export function sentencesByHsk(level: number): Sentence[] {
  return sentences.filter((s) => s.hsk === level);
}

export function findWord(id: string): Word | undefined {
  return words.find((w) => w.id === id);
}

export function findSentence(id: string): Sentence | undefined {
  return sentences.find((s) => s.id === id);
}

export function categoryStats(slug: string) {
  return {
    wordCount: wordsByCategory(slug).length,
    sentenceCount: sentencesByCategory(slug).length,
  };
}

export function hskStats(level: number) {
  return {
    wordCount: wordsByHsk(level).length,
    sentenceCount: sentencesByHsk(level).length,
  };
}

function normalize(str: string): string {
  return str.toLowerCase().trim();
}

export interface SearchResult {
  type: "word" | "sentence";
  item: Word | Sentence;
}

export function search(query: string, limit = 50): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const w of words) {
    if (
      w.hanzi.includes(query) ||
      normalize(w.pinyin).includes(q) ||
      normalize(w.meaning).includes(q)
    ) {
      results.push({ type: "word", item: w });
    }
  }

  for (const s of sentences) {
    if (
      s.hanzi.includes(query) ||
      normalize(s.pinyin).includes(q) ||
      normalize(s.meaning).includes(q)
    ) {
      results.push({ type: "sentence", item: s });
    }
  }

  return results.slice(0, limit);
}
