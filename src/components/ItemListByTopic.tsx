"use client";

import { useMemo, useState } from "react";
import type { Word, Sentence, Category } from "@/data/types";
import WordCard from "./WordCard";
import SentenceCard from "./SentenceCard";

export default function ItemListByTopic({
  words,
  sentences,
  categories,
}: {
  words: Word[];
  sentences: Sentence[];
  categories: Category[];
}) {
  const [tab, setTab] = useState<"words" | "sentences">("words");
  const [topicFilter, setTopicFilter] = useState<string>("all");

  const topicsPresent = useMemo(() => {
    const set = new Set<string>();
    for (const w of words) set.add(w.category);
    for (const s of sentences) set.add(s.category);
    return categories.filter((c) => set.has(c.slug));
  }, [words, sentences, categories]);

  const filteredWords =
    topicFilter === "all" ? words : words.filter((w) => w.category === topicFilter);
  const filteredSentences =
    topicFilter === "all"
      ? sentences
      : sentences.filter((s) => s.category === topicFilter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900">
          <TabButton active={tab === "words"} onClick={() => setTab("words")}>
            Words ({filteredWords.length})
          </TabButton>
          <TabButton active={tab === "sentences"} onClick={() => setTab("sentences")}>
            Sentences ({filteredSentences.length})
          </TabButton>
        </div>

        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">All topics</option>
          {topicsPresent.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tab === "words"
          ? filteredWords.map((w) => <WordCard key={w.id} word={w} />)
          : filteredSentences.map((s) => <SentenceCard key={s.id} sentence={s} />)}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-red-600 text-white"
          : "text-neutral-600 hover:text-red-600 dark:text-neutral-300 dark:hover:text-red-400"
      }`}
    >
      {children}
    </button>
  );
}
