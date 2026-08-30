interface GlossItem {
  hanzi: string;
  pinyin?: string;
  meaning?: string;
}

/**
 * Renders a word-by-word breakdown line, e.g. for "我想喝茶":
 *   wǒ (I)  xiǎng (want)  hē (drink)  chá (tea)
 * Shared by SentenceGloss (topic/word sentences, computed via
 * glossSentence) and StoryReader (story sentences, which already carry
 * per-word meanings from how they were authored).
 */
export default function GlossLine({ tokens }: { tokens: GlossItem[] }) {
  if (tokens.length === 0) return null;

  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
      {tokens.map((t, i) =>
        t.meaning ? (
          <span key={i}>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {t.pinyin}
            </span>{" "}
            <span>({t.meaning})</span>
          </span>
        ) : (
          <span key={i} className="italic text-neutral-400 dark:text-neutral-500">
            {t.hanzi}
          </span>
        )
      )}
    </p>
  );
}
