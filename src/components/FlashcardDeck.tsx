"use client";

import { useEffect, useMemo, useState } from "react";
import type { Word, Sentence } from "@/data/types";
import SpeakButton from "./SpeakButton";
import HskBadge from "./HskBadge";
import { setProgress, type ProgressStatus } from "@/lib/storage";

type Item =
  | { kind: "word"; data: Word }
  | { kind: "sentence"; data: Sentence };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardDeck({ items }: { items: Item[] }) {
  // Start with the deterministic (unshuffled) order so server and client
  // render identically, then shuffle client-side after mount.
  const [deck, setDeck] = useState(items);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeck(shuffle(items));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);

  const current = deck[index];

  const hanzi = current
    ? current.kind === "word"
      ? current.data.hanzi
      : current.data.hanzi
    : "";
  const pinyin = current?.data.pinyin ?? "";
  const meaning = current?.data.meaning ?? "";

  const detail = useMemo(() => {
    if (!current) return null;
    if (current.kind === "word") {
      return (
        <>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Pronunciation tip:{" "}
            </span>
            {current.data.pronunciationTip}
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              When to use it:{" "}
            </span>
            {current.data.usageNote}
          </p>
        </>
      );
    }
    return (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          When to use it:{" "}
        </span>
        {current.data.usageNote}
      </p>
    );
  }, [current]);

  if (!current) {
    return (
      <p className="py-16 text-center text-neutral-500 dark:text-neutral-400">
        No cards match your current filters. Try widening them.
      </p>
    );
  }

  const finished = index >= deck.length;

  function goNext(status: ProgressStatus) {
    if (!current) return;
    const id = current.data.id;
    setProgress(id, status);
    setDone((d) => d + 1);
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-3xl">🎉</p>
        <h3 className="mt-2 text-lg font-semibold">Deck complete!</h3>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          You reviewed {done} card{done === 1 ? "" : "s"}. Reload this page or
          change filters to start a new deck.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Card {index + 1} of {deck.length}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-4 flex min-h-64 w-full flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        {!flipped ? (
          <>
            <span className="font-serif text-5xl">{hanzi}</span>
            <span className="mt-4 text-xs uppercase tracking-wide text-neutral-400">
              Tap to reveal
            </span>
          </>
        ) : (
          <div className="w-full text-left">
            <div className="flex items-center justify-center gap-3">
              <span className="font-serif text-4xl">{hanzi}</span>
              <HskBadge level={current.data.hsk} />
            </div>
            <p className="mt-2 text-center text-lg text-neutral-500 dark:text-neutral-400">
              {pinyin}
            </p>
            <p className="mt-1 text-center text-xl font-semibold">{meaning}</p>
            <div className="mx-auto mt-4 max-w-md">{detail}</div>
          </div>
        )}
      </button>

      <div className="mt-4 flex justify-center">
        <SpeakButton text={hanzi} />
      </div>

      {flipped && (
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => goNext("learning")}
            className="rounded-full bg-amber-100 px-5 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-200 dark:bg-amber-950/50 dark:text-amber-300"
          >
            Still learning 🤔
          </button>
          <button
            type="button"
            onClick={() => goNext("known")}
            className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300"
          >
            I know this ✅
          </button>
        </div>
      )}

      {!flipped && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Show answer
          </button>
        </div>
      )}
    </div>
  );
}

export type { Item as FlashcardItem };
