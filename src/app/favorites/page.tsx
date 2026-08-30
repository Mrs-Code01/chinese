"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/storage";
import { findWord, findSentence } from "@/data";
import WordCard from "@/components/WordCard";
import SentenceCard from "@/components/SentenceCard";
import type { Word, Sentence } from "@/data/types";

interface FavoritesState {
  loaded: boolean;
  words: Word[];
  sentences: Sentence[];
}

function loadFavorites(): FavoritesState {
  const ids = getFavorites();
  const wordsList: Word[] = [];
  const sentencesList: Sentence[] = [];
  for (const id of ids) {
    const w = findWord(id);
    if (w) {
      wordsList.push(w);
      continue;
    }
    const s = findSentence(id);
    if (s) sentencesList.push(s);
  }
  return { loaded: true, words: wordsList, sentences: sentencesList };
}

export default function FavoritesPage() {
  const [state, setState] = useState<FavoritesState>({
    loaded: false,
    words: [],
    sentences: [],
  });

  useEffect(() => {
    // Reading localStorage must happen after mount to avoid SSR/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadFavorites());
  }, []);

  const { loaded, words: favWords, sentences: favSentences } = state;
  const isEmpty = loaded && favWords.length === 0 && favSentences.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Your favorites</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Words and sentences you&apos;ve starred, saved on this device.
      </p>

      {isEmpty && (
        <p className="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
          You haven&apos;t starred anything yet. Tap the ☆ on any word or
          sentence to save it here.
        </p>
      )}

      {favWords.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Words ({favWords.length})</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {favWords.map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
        </section>
      )}

      {favSentences.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Sentences ({favSentences.length})</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {favSentences.map((s) => (
              <SentenceCard key={s.id} sentence={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
