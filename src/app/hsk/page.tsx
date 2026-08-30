import Link from "next/link";
import { hskLevels, hskStats } from "@/data";

export const metadata = {
  title: "HSK Levels — HanyuSprint",
};

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "Absolute basics — greetings, numbers, simple everyday needs.",
  2: "Simple daily communication on familiar topics.",
  3: "Handle most everyday situations, from shopping to travel.",
  4: "Discuss a wide range of topics fairly fluently.",
  5: "Read newspapers, watch shows, and give full talks with ease.",
  6: "Near-native comprehension and expression, written and spoken.",
};

export default function HskPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Browse by HSK level</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        HSK (Hanyu Shuiping Kaoshi) is the standard Chinese proficiency scale,
        from HSK 1 (beginner) to HSK 6 (advanced). Use it to pace your
        learning.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hskLevels.map((level) => {
          const stats = hskStats(level);
          return (
            <Link
              key={level}
              href={`/hsk/${level}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <p className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                HSK {level}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {stats.wordCount} words · {stats.sentenceCount} sentences
              </p>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                {LEVEL_DESCRIPTIONS[level]}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
