# HanyuSprint 🀄

A Mandarin learning app built for real life in China — words and everyday
sentences for home, work, school, travel, and more, each with pinyin, a
pronunciation tip, and a note on exactly when to use it.

## What's here right now

- **550 words** and **520 sentences**, hand-written (not auto-translated),
  across **25 real-life topics**: greetings, numbers & time, family, home,
  food & dining, shopping, workplace, school, travel & transport, directions,
  health, weather, emotions, people & appearance, technology/phone, social &
  small talk, hobbies, daily routine, money & banking, idioms & proverbs,
  measure words, emergency & safety, clothing, relationships & dating, and
  essential HSK1 basics (question words, core verbs/adjectives, connectors).
- Every entry is tagged with an **HSK level (1–6)** so you can browse by
  topic or by difficulty.
- Every word has: hanzi, pinyin with tone marks, part of speech, English
  meaning, a **pronunciation tip** (which tones/sounds trip people up), a
  **usage note** (when/with whom you'd actually say this), and an example
  sentence.
- Every sentence has: hanzi, pinyin, English meaning, HSK level, and a usage
  note explaining the real-life context.
- **Text-to-speech** on every card (🔊 button), using the browser's built-in
  Chinese voice — no setup required. A **🔊 Voice** picker in the header
  (`src/components/VoiceSettings.tsx`) auto-ranks every Chinese voice your
  browser/OS has installed (favoring genuinely natural neural voices like
  Windows/Edge's "Online (Natural)" voices, Google's voice, and macOS's
  enhanced voices over old robotic ones), lets you preview and pick one, and
  explains how to install a better free voice if your device only has
  low-quality ones.
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
- **Story Book** (`/stories`): 42 stories (toward a target of 50) built from
  real vocabulary, tied to the theme of moving to and living in China
  (airport arrival, apartment hunting, hiking, a Chinese wedding, learning
  to drive, a year-in-review, and more). Pinyin is shown under every word by
  default. Tap any word to see its meaning, an English pronunciation guide,
  an optional grammar note explaining why that word is used there (e.g. why
  了 sits in a different spot from sentence to sentence), and hear it spoken
  aloud. Each sentence also shows its English translation and has its own
  play button.

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
      ... (25 files total)
    index.ts            # aggregates all content + search/filter helpers
    storyTypes.ts        # Story/StorySentence/StoryToken types + t() helper
    stories/              # story content files + index.ts aggregator
  lib/
    tts.ts              # browser text-to-speech helper
    storage.ts          # localStorage helpers (favorites, progress)
    pinyinPhonetics.ts   # generates "sounds like" + tone melody from pinyin
  components/            # WordCard, SentenceCard, FlashcardDeck, QuizGame,
                          # StoryReader, PhoneticGuide, ...
  app/
    page.tsx             # home dashboard
    topics/               # browse by topic
    hsk/                  # browse by HSK level
    stories/               # story book list + reader
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
China long-term: more HSK 1 vocabulary (toward 500+), more HSK 4–6
vocabulary, business/negotiation language, apartment hunting & contracts in
more depth, banking & visas in more depth, and regional dialect notes
(Shanghainese/Cantonese greetings if relevant to where you're headed).

### Growing the Story Book

Stories live in `src/data/stories/` (one file can hold several `Story`
objects) and are aggregated in `src/data/stories/index.ts`. Each story is
built with the `t([...])` helper from `src/data/storyTypes.ts`, which takes
a terse tuple format so you don't have to write a full object per word:

```ts
import { t, type Story } from "../storyTypes";

const myStory: Story = {
  slug: "my-story",
  title: "My Story",
  hanziTitle: "我的故事",
  hsk: 1,
  icon: "📖",
  summary: "A one-line description shown on the story list page.",
  sentences: [
    {
      translation: "I am learning Chinese.",
      tokens: t([
        ["我", "wǒ", "I, me"],
        ["在", "zài", "[ongoing action marker]"],
        ["学", "xué", "to learn"],
        ["中文", "Zhōngwén", "Chinese (language)"],
        "。", // a plain string = punctuation, rendered but not clickable
      ]),
    },
  ],
};
```

The 4th tuple item (optional) is a short grammar/usage tip shown only for
that word in that sentence — use it sparingly, just for the genuinely
notable words (了, 的, measure words, aspect markers, etc.), not every word.
Register new files in the `storyModules` array in `src/data/stories/index.ts`.
Currently at 42 stories, toward a target of 50.

## Notes on accuracy

Pinyin tone marks, part-of-speech tags, and usage notes were written by hand
with care, but this is a large hand-authored dataset — if you spot an error,
it's worth double-checking against a dictionary (e.g. Pleco) before you rely
on it for something important, and feel free to fix it directly in the
relevant `src/data/content/*.ts` file.
