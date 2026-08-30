# HanyuSprint 🀄

A Mandarin learning app built for real life in China — words and everyday
sentences for home, work, school, travel, and more, each with pinyin, a
pronunciation tip, and a note on exactly when to use it.

## What's here right now

- **480 words** and **480 sentences**, hand-written (not auto-translated),
  across **24 real-life topics**: greetings, numbers & time, family, home,
  food & dining, shopping, workplace, school, travel & transport, directions,
  health, weather, emotions, people & appearance, technology/phone, social &
  small talk, hobbies, daily routine, money & banking, idioms & proverbs,
  measure words, emergency & safety, clothing, and relationships & dating.
- Every entry is tagged with an **HSK level (1–6)** so you can browse by
  topic or by difficulty.
- Every word has: hanzi, pinyin with tone marks, part of speech, English
  meaning, a **pronunciation tip** (which tones/sounds trip people up), a
  **usage note** (when/with whom you'd actually say this), and an example
  sentence.
- Every sentence has: hanzi, pinyin, English meaning, HSK level, and a usage
  note explaining the real-life context.
- **Text-to-speech** on every card (🔊 button), using the browser's built-in
  Chinese voice — no setup required.
- **"Sounds like" phonetic guide** on every card: an English-phonetic
  approximation (e.g. "nee-how") plus a per-syllable tone-melody line (e.g.
  "nǐ↘↗ hǎo↘↗"), generated automatically from the pinyin by
  `src/lib/pinyinPhonetics.ts` — not hand-written, so it works for every
  entry (past and future) with zero extra data-entry cost.
- **Favorites** (☆) saved to your device via `localStorage`.
- **Flashcards** mode: flip cards, filter by topic/HSK/favorites, mark
  "still learning" vs "know this" (progress saved locally).
- **Quiz** mode: multiple-choice, mixing hanzi→meaning and meaning→hanzi
  questions, filterable by topic/HSK/question count.
- **Search** across all words and sentences by hanzi, pinyin, or English.

This is intentionally a **solid starter core, not the finish line** — see
"Growing toward 5,000 + 5,000" below for how to keep expanding it.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```

## Project structure

```
src/
  data/
    types.ts          # Word / Sentence / Category TypeScript types
    categories.ts      # topic metadata (slug, name, icon, description)
    content/            # one file per topic, exports `words` + `sentences`
      greetings-basics.ts
      numbers-time.ts
      ... (18 files total)
    index.ts            # aggregates all content + search/filter helpers
  lib/
    tts.ts              # browser text-to-speech helper
    storage.ts          # localStorage helpers (favorites, progress)
  components/            # WordCard, SentenceCard, FlashcardDeck, QuizGame, ...
  app/
    page.tsx             # home dashboard
    topics/               # browse by topic
    hsk/                  # browse by HSK level
    flashcards/            # flashcard practice
    quiz/                  # multiple-choice quiz
    favorites/             # starred items
    search/                # search results
```

## Growing toward 5,000 + 5,000

The whole app is data-driven, so adding more content never requires touching
the UI. To add a new batch of words/sentences to an existing topic, open its
file in `src/data/content/` and append more objects matching the `Word` or
`Sentence` shape in `src/data/types.ts`:

```ts
{
  id: "w-food-21",                 // unique id: w-<topic>-<n> or s-<topic>-<n>
  hanzi: "美味",
  pinyin: "měiwèi",
  partOfSpeech: "adjective",
  meaning: "delicious, delectable",
  hsk: 4,
  category: "food-dining",         // must match the topic's slug
  pronunciationTip: "...",
  usageNote: "...",
  example: { hanzi: "...", pinyin: "...", meaning: "..." },
}
```

To add a brand-new topic: add its metadata to `src/data/categories.ts`,
create `src/data/content/<slug>.ts` exporting `words`/`sentences` arrays, and
register it in the `modules` array in `src/data/index.ts`. Everything else
(topic pages, flashcards, quiz, search, HSK filtering) picks it up
automatically — no other code changes needed.

Good next batches to write, roughly in priority order for someone moving to
China long-term: numbers/measure words in depth, more HSK 4–6 vocabulary,
idioms (chengyu) with usage notes, business/negotiation language, apartment
hunting & contracts, banking & visas in more depth, and regional dialect
notes (Shanghainese/Cantonese greetings if relevant to where you're headed).

## Notes on accuracy

Pinyin tone marks, part-of-speech tags, and usage notes were written by hand
with care, but this is a large hand-authored dataset — if you spot an error,
it's worth double-checking against a dictionary (e.g. Pleco) before you rely
on it for something important, and feel free to fix it directly in the
relevant `src/data/content/*.ts` file.
