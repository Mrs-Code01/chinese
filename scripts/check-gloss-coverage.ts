/**
 * Reports what percentage of hanzi across every sentence and word example
 * can be word-by-word glossed (see src/lib/glossSentence.ts), and lists
 * the most common still-unglossed characters so gaps in
 * src/lib/glossDictionary.ts are easy to spot as content grows.
 *
 * Run with: npx tsx scripts/check-gloss-coverage.ts
 */
import { words, sentences } from "../src/data";
import { glossSentence } from "../src/lib/glossSentence";

const PUNCT_ONLY = /^[，。？！：；、"'“”‘’（）()·…\s\-,.?!:;/]+$/u;

let totalChars = 0;
let unknownChars = 0;
const unknownFreq = new Map<string, number>();

const allTexts: string[] = [];
for (const s of sentences) allTexts.push(s.hanzi);
for (const w of words) allTexts.push(w.example.hanzi);

for (const text of allTexts) {
  const tokens = glossSentence(text);
  for (const tok of tokens) {
    if (PUNCT_ONLY.test(tok.hanzi)) continue;
    totalChars += tok.hanzi.length;
    if (!tok.meaning) {
      unknownChars += tok.hanzi.length;
      unknownFreq.set(tok.hanzi, (unknownFreq.get(tok.hanzi) ?? 0) + 1);
    }
  }
}

console.log(`Total sentences+examples checked: ${allTexts.length}`);
console.log(`Total non-punctuation hanzi chars: ${totalChars}`);
console.log(`Unknown (ungloss-able) chars: ${unknownChars} (${((unknownChars / totalChars) * 100).toFixed(1)}%)`);
console.log(`Coverage: ${(100 - (unknownChars / totalChars) * 100).toFixed(1)}%`);
console.log(`\nTop 60 most frequent still-unmatched characters:`);
const sorted = [...unknownFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60);
for (const [ch, count] of sorted) console.log(`  ${ch}  x${count}`);
