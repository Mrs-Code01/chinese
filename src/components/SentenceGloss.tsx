import { glossSentence } from "@/lib/glossSentence";
import GlossLine from "./GlossLine";

const PUNCTUATION_ONLY = /^[，。？！：；、"'“”‘’（）()·…\s\-,.?!:;/]+$/u;

/**
 * Word-by-word breakdown under a sentence, e.g. for "我想喝茶":
 *   wǒ (I)  xiǎng (want)  hē (drink)  chá (tea)
 * so a learner can tell which syllable means what, not just the sentence
 * as a whole. Words we can't confidently gloss (rarer vocabulary not yet
 * in the dataset) show as plain hanzi instead of a guessed translation.
 */
export default function SentenceGloss({ hanzi }: { hanzi: string }) {
  const tokens = glossSentence(hanzi).filter((t) => !PUNCTUATION_ONLY.test(t.hanzi));
  if (tokens.length === 0) return null;
  return (
    <div className="mt-1.5">
      <GlossLine tokens={tokens} />
    </div>
  );
}
