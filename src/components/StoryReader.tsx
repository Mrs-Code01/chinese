"use client";

import { useState } from "react";
import type { Story, StoryToken } from "@/data/storyTypes";
import { playChinese } from "@/lib/tts";
import PhoneticGuide from "./PhoneticGuide";
import GlossLine from "./GlossLine";

export default function StoryReader({ story }: { story: Story }) {
  const [selected, setSelected] = useState<StoryToken | null>(null);

  const fullText = story.sentences.map((s) => s.tokens.map((t) => t.hanzi).join("")).join("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
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
          onClick={() => playChinese(fullText, 0.8)}
          className="shrink-0 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
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
              onClick={() => playChinese(selected.hanzi)}
              aria-label={`Play pronunciation of ${selected.hanzi}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-white text-base transition hover:bg-brand-50 dark:border-brand-900/50 dark:bg-neutral-900"
            >
              🔊
            </button>
          </div>
        ) : (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            👆 Pinyin is shown under every word. Tap any word for its meaning,
            an English pronunciation guide, and to hear it spoken aloud.
          </p>
        )}
      </div>

      <div className="mt-8 space-y-6">
        {story.sentences.map((sentence, idx) => (
          <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-1 flex-wrap items-end gap-x-0.5 gap-y-2">
                {sentence.tokens.map((tok, tIdx) =>
                  tok.pinyin ? (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => setSelected(tok)}
                      className={`flex flex-col items-center rounded px-1 pb-0.5 pt-1 transition hover:bg-brand-50 dark:hover:bg-brand-950/40 ${
                        selected === tok ? "bg-brand-100 dark:bg-brand-950/60" : ""
                      }`}
                    >
                      <span
                        className={`border-b border-dotted border-neutral-300 font-serif text-2xl leading-tight dark:border-neutral-600 ${
                          selected === tok ? "text-brand-700 dark:text-brand-400" : ""
                        }`}
                      >
                        {tok.hanzi}
                      </span>
                      <span className="text-xs leading-tight text-neutral-500 dark:text-neutral-400">
                        {tok.pinyin}
                      </span>
                    </button>
                  ) : (
                    <span key={tIdx} className="flex flex-col items-center px-0.5 pb-0.5 pt-1">
                      <span className="font-serif text-2xl leading-tight text-neutral-400">
                        {tok.hanzi}
                      </span>
                      <span className="text-xs leading-tight text-transparent" aria-hidden>
                        ·
                      </span>
                    </span>
                  )
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  playChinese(sentence.tokens.map((t) => t.hanzi).join(""), 0.8)
                }
                aria-label="Play this sentence"
                className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              >
                🔊
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {sentence.translation}
            </p>
            <div className="mt-1.5">
              <GlossLine tokens={sentence.tokens.filter((t) => t.pinyin)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
