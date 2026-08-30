import type { Sentence } from "@/data/types";
import SpeakButton from "./SpeakButton";
import FavoriteButton from "./FavoriteButton";
import HskBadge from "./HskBadge";
import PhoneticGuide from "./PhoneticGuide";

export default function SentenceCard({ sentence }: { sentence: Sentence }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <span className="font-serif text-2xl leading-snug">{sentence.hanzi}</span>
        <div className="flex shrink-0 items-center gap-2">
          <SpeakButton text={sentence.hanzi} />
          <FavoriteButton id={sentence.id} />
        </div>
      </div>

      <p className="mt-1 text-neutral-500 dark:text-neutral-400">{sentence.pinyin}</p>
      <p className="mt-2 text-base font-medium text-neutral-900 dark:text-neutral-100">
        {sentence.meaning}
      </p>

      <PhoneticGuide pinyin={sentence.pinyin} />

      <div className="mt-3 flex items-center gap-2">
        <HskBadge level={sentence.hsk} />
      </div>

      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
          When to use it:{" "}
        </span>
        {sentence.usageNote}
      </p>
    </div>
  );
}
