"use client";

import { useState } from "react";
import type { Story, StoryToken } from "@/data/storyTypes";
import { speakChinese } from "@/lib/tts";
import PhoneticGuide from "./PhoneticGuide";

export default function StoryReader({ story }: { story: Story }) {
  const [selected, setSelected] = useState<StoryToken | null>(null);

  const fullText = story.sentences.map((s) => s.tokens.map((t) => t.hanzi).join("")).join("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            HSK {story.hsk} story
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            {story.hanziTitle}{" "}
            <span className="text-lg font-normal text-neutral-500 dark:text-neutral-400">
              {story.title}
            </span>
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">{story.summary}</p>
        </div>
        <button
          type="button"
          onClick={() => speakChinese(fullText, 0.8)}
          className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          🔊 Play story
        </button>
      </div>

      <div className="sticky top-16 z-10 mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40">
        {selected ? (
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl">{selected.hanzi}</span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  {selected.pinyin}
                </span>
              </div>
              <p className="mt-1 font-medium text-neutral-900 dark:text-neutral-100">
                {selected.meaning}
              </p>
              {selected.tip && (
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {selected.tip}
                </p>
              )}
              {selected.pinyin && <PhoneticGuide pinyin={selected.pinyin} />}
            </div>
            <button
              type="button"
              onClick={() => speakChinese(selected.hanzi)}
              aria-label={`Play pronunciation of ${selected.hanzi}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-white text-base transition hover:bg-red-50 dark:border-red-900/50 dark:bg-neutral-900"
            >
              🔊
            </button>
          </div>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            👆 Tap any word below to see its meaning, pinyin, and hear it spoken.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {story.sentences.map((sentence, idx) => (
          <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2 font-serif text-2xl leading-relaxed">
              {sentence.tokens.map((tok, tIdx) =>
                tok.pinyin ? (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => setSelected(tok)}
                    className={`rounded px-0.5 underline decoration-dotted decoration-2 underline-offset-4 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-400 ${
                      selected === tok ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400" : ""
                    }`}
                  >
                    {tok.hanzi}
                  </button>
                ) : (
                  <span key={tIdx} className="text-neutral-400">
                    {tok.hanzi}
                  </span>
                )
              )}
              <button
                type="button"
                onClick={() =>
                  speakChinese(sentence.tokens.map((t) => t.hanzi).join(""), 0.8)
                }
                aria-label="Play this sentence"
                className="ml-2 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-sm align-middle dark:border-neutral-700 dark:bg-neutral-800"
              >
                🔊
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {sentence.translation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
