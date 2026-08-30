"use client";

import { useMemo, useState } from "react";
import { categories, words, hskLevels } from "@/data";
import QuizGame from "@/components/QuizGame";

export default function QuizPage() {
  const [topic, setTopic] = useState("all");
  const [hsk, setHsk] = useState<number | "all">("all");
  const [length, setLength] = useState(10);
  const [quizKey, setQuizKey] = useState(0);

  const filtered = useMemo(() => {
    return words
      .filter((w) => topic === "all" || w.category === topic)
      .filter((w) => hsk === "all" || w.hsk === hsk);
  }, [topic, hsk]);


  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Multiple-choice practice, mixing hanzi → meaning and meaning → hanzi
        questions.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          {[5, 10, 15, 20].map((n) => (
            <option key={n} value={n}>
              {n} questions
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={() => setQuizKey((k) => k + 1)}
          className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
        >
          🔀 New quiz with these settings
        </button>
      </div>

      <div className="mt-6">
        <QuizGame
          key={`${topic}-${hsk}-${length}-${quizKey}`}
          words={filtered}
          length={length}
          allWords={words}
        />
      </div>
    </div>
  );
}
