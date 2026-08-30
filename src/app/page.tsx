import Link from "next/link";
import { categories, words, sentences, hskLevels, categoryStats } from "@/data";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          你好！Nǐ hǎo!
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Learn to speak real, everyday Mandarin
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Words and sentences for home, work, school, travel, and everything in
          between — every entry comes with pinyin, a pronunciation tip, and a
          note on exactly when to use it. Built for learners heading to life in
          China.
        </p>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Words" value={words.length} />
        <StatCard label="Sentences" value={sentences.length} />
        <StatCard label="Topics" value={categories.length} />
        <StatCard label="HSK Levels" value={hskLevels.length} />
      </section>

      <section className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/topics"
          className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Browse by topic
        </Link>
        <Link
          href="/hsk"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          Browse by HSK level
        </Link>
        <Link
          href="/stories"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          Read a story
        </Link>
        <Link
          href="/flashcards"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          Practice with flashcards
        </Link>
        <Link
          href="/quiz"
          className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          Take a quiz
        </Link>
      </section>

      <section className="mt-14">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Topics</h2>
          <Link href="/topics" className="text-sm font-medium text-red-600 dark:text-red-400">
            See all →
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const stats = categoryStats(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/topics/${cat.slug}`}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <p className="font-semibold group-hover:text-red-600 dark:group-hover:text-red-400">
                      {cat.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {stats.wordCount} words · {stats.sentenceCount} sentences
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {cat.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{value}+</p>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
    </div>
  );
}
