import {
  getPhoneticBreakdown,
  formatSmoothReading,
  formatToneMelody,
} from "@/lib/pinyinPhonetics";

export default function PhoneticGuide({ pinyin }: { pinyin: string }) {
  const syllables = getPhoneticBreakdown(pinyin);
  if (!syllables) return null;

  return (
    <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/30">
      <p className="text-neutral-700 dark:text-neutral-300">
        <span aria-hidden className="mr-1">
          🗣️
        </span>
        Sounds like:{" "}
        <span className="font-mono font-semibold tracking-wide">
          {formatSmoothReading(syllables)}
        </span>
      </p>
      <p className="mt-1 font-mono tracking-wide text-neutral-500 dark:text-neutral-400">
        {formatToneMelody(syllables)}
      </p>
    </div>
  );
}
