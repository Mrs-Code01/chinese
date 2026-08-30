"use client";

import { useEffect, useState } from "react";
import type { Word } from "@/data/types";
import SpeakButton from "./SpeakButton";

type Direction = "hanziToMeaning" | "meaningToHanzi";

interface Question {
  prompt: Word;
  options: Word[];
  direction: Direction;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(pool: Word[], allWords: Word[], mixedDirection: boolean): Question[] {
  const shuffledPool = shuffle(pool);
  return shuffledPool.map((word) => {
    const distractorSource = allWords.filter((w) => w.id !== word.id);
    const distractors = shuffle(distractorSource).slice(0, 3);
    const options = shuffle([word, ...distractors]);
    const direction: Direction = mixedDirection
      ? Math.random() < 0.5
        ? "hanziToMeaning"
        : "meaningToHanzi"
      : "hanziToMeaning";
    return { prompt: word, options, direction };
  });
}

export default function QuizGame({
  words,
  length,
  allWords,
}: {
  words: Word[];
  length: number;
  allWords: Word[];
}) {
  // Questions involve randomness (shuffled order, distractors), so they're
  // built client-side after mount to avoid a server/client hydration mismatch.
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const pool = shuffle(words).slice(0, length);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestions(buildQuestions(pool, allWords, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questions) {
    return (
      <p className="py-16 text-center text-neutral-500 dark:text-neutral-400">
        Preparing your quiz...
      </p>
    );
  }

  const question = questions[index];

  const isFinished = index >= questions.length;

  if (questions.length < 4) {
    return (
      <p className="py-16 text-center text-neutral-500 dark:text-neutral-400">
        Not enough words in this selection for a quiz (need at least 4). Try
        widening your filters.
      </p>
    );
  }

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-3xl">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</p>
        <h3 className="mt-2 text-lg font-semibold">Quiz complete!</h3>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          You scored {score} / {questions.length} ({pct}%)
        </p>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          Change your filters or reload the page to try a new set.
        </p>
      </div>
    );
  }

  const isHanziToMeaning = question.direction === "hanziToMeaning";

  function handleSelect(optionId: string) {
    if (selected) return;
    setSelected(optionId);
    if (optionId === question.prompt.id) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="mt-4 rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        {isHanziToMeaning ? (
          <div>
            <div className="flex items-center justify-center gap-3">
              <span className="font-serif text-4xl">{question.prompt.hanzi}</span>
              <SpeakButton text={question.prompt.hanzi} />
            </div>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400">
              {question.prompt.pinyin}
            </p>
            <p className="mt-4 text-sm uppercase tracking-wide text-neutral-400">
              What does this mean?
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-semibold">{question.prompt.meaning}</p>
            <p className="mt-4 text-sm uppercase tracking-wide text-neutral-400">
              Which word matches this meaning?
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((opt) => {
          const isCorrect = opt.id === question.prompt.id;
          const isSelected = opt.id === selected;
          let style =
            "border-neutral-200 bg-white hover:border-red-300 dark:border-neutral-800 dark:bg-neutral-900";
          if (selected) {
            if (isCorrect) {
              style =
                "border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40";
            } else if (isSelected) {
              style = "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/40";
            } else {
              style = "border-neutral-200 bg-white opacity-60 dark:border-neutral-800 dark:bg-neutral-900";
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              disabled={!!selected}
              className={`rounded-2xl border p-4 text-left shadow-sm transition ${style}`}
            >
              {isHanziToMeaning ? (
                <span className="font-medium">{opt.meaning}</span>
              ) : (
                <div>
                  <span className="font-serif text-xl">{opt.hanzi}</span>
                  <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {opt.pinyin}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {index + 1 < questions.length ? "Next question →" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}
