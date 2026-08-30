import type { Word } from "@/data/types";
import SpeakButton from "./SpeakButton";
import FavoriteButton from "./FavoriteButton";
import HskBadge from "./HskBadge";

export default function WordCard({ word }: { word: Word }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-serif text-3xl leading-none">{word.hanzi}</span>
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            {word.pinyin}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SpeakButton text={word.hanzi} />
          <FavoriteButton id={word.id} />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <HskBadge level={word.hsk} />
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {word.partOfSpeech}
        </span>
      </div>

      <p className="mt-3 text-base font-medium text-neutral-900 dark:text-neutral-100">
        {word.meaning}
      </p>

      <div className="mt-3 space-y-2 text-sm">
        <p className="text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Pronunciation tip:{" "}
          </span>
          {word.pronunciationTip}
        </p>
        <p className="text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            When to use it:{" "}
          </span>
          {word.usageNote}
        </p>
      </div>

      <div className="mt-4 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/60">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg">{word.example.hanzi}</span>
          <SpeakButton text={word.example.hanzi} size="sm" />
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {word.example.pinyin}
        </p>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">
          {word.example.meaning}
        </p>
      </div>
    </div>
  );
}
