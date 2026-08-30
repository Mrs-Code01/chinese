"use client";

import { useMemo, useState } from "react";
import type { Word, Sentence } from "@/data/types";
import WordCard from "./WordCard";
import SentenceCard from "./SentenceCard";

export default function ItemListTabs({
  words,
  sentences,
}: {
  words: Word[];
  sentences: Sentence[];
}) {
  const [tab, setTab] = useState<"words" | "sentences">("words");
  const [hskFilter, setHskFilter] = useState<number | "all">("all");

  const levels = useMemo(() => {
    const set = new Set<number>();
    for (const w of words) set.add(w.hsk);
    for (const s of sentences) set.add(s.hsk);
    return Array.from(set).sort((a, b) => a - b);
  }, [words, sentences]);

  const filteredWords =
    hskFilter === "all" ? words : words.filter((w) => w.hsk === hskFilter);
  const filteredSentences =
    hskFilter === "all" ? sentences : sentences.filter((s) => s.hsk === hskFilter);

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
          value={hskFilter}
          onChange={(e) =>
            setHskFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="all">All HSK levels</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              HSK {lvl}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tab === "words"
          ? filteredWords.map((w) => <WordCard key={w.id} word={w} />)
          : filteredSentences.map((s) => <SentenceCard key={s.id} sentence={s} />)}
      </div>

      {tab === "words" && filteredWords.length === 0 && (
        <EmptyState />
      )}
      {tab === "sentences" && filteredSentences.length === 0 && (
        <EmptyState />
      )}
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

function EmptyState() {
  return (
    <p className="col-span-full py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
      No items at this HSK level yet.
    </p>
  );
}
