"use client";

import { useMemo, useState } from "react";
import { categories, words, sentences, hskLevels } from "@/data";
import { getFavorites } from "@/lib/storage";
import FlashcardDeck, { type FlashcardItem } from "@/components/FlashcardDeck";

type ContentFilter = "both" | "words" | "sentences";

export default function FlashcardsPage() {
  const [topic, setTopic] = useState("all");
  const [hsk, setHsk] = useState<number | "all">("all");
  const [content, setContent] = useState<ContentFilter>("both");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [deckKey, setDeckKey] = useState(0);

  const items: FlashcardItem[] = useMemo(() => {
    const favIds = favoritesOnly ? new Set(getFavorites()) : null;

    const wordItems: FlashcardItem[] = words
      .filter((w) => topic === "all" || w.category === topic)
      .filter((w) => hsk === "all" || w.hsk === hsk)
      .filter((w) => !favIds || favIds.has(w.id))
      .map((w) => ({ kind: "word", data: w }) as FlashcardItem);

    const sentenceItems: FlashcardItem[] = sentences
      .filter((s) => topic === "all" || s.category === topic)
      .filter((s) => hsk === "all" || s.hsk === hsk)
      .filter((s) => !favIds || favIds.has(s.id))
      .map((s) => ({ kind: "sentence", data: s }) as FlashcardItem);

    if (content === "words") return wordItems;
    if (content === "sentences") return sentenceItems;
    return [...wordItems, ...sentenceItems];
  }, [topic, hsk, content, favoritesOnly]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Flashcards</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Flip each card, then honestly mark whether you knew it. Your progress
        is saved on this device.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="col-span-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 sm:col-span-1"
        >
          <option value="all">All topics</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <select
          value={hsk}
          onChange={(e) => setHsk(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">All HSK</option>
          {hskLevels.map((l) => (
            <option key={l} value={l}>
              HSK {l}
            </option>
          ))}
        </select>

        <select
          value={content}
          onChange={(e) => setContent(e.target.value as ContentFilter)}
          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="both">Words + sentences</option>
          <option value="words">Words only</option>
          <option value="sentences">Sentences only</option>
        </select>

        <label className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900">
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />
          Favorites only
        </label>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => setDeckKey((k) => k + 1)}
          className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
        >
          🔀 Shuffle / restart deck
        </button>
      </div>

      <div className="mt-6">
        <FlashcardDeck
          key={`${topic}-${hsk}-${content}-${favoritesOnly}-${deckKey}`}
          items={items}
        />
      </div>
    </div>
  );
}
