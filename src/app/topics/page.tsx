import Link from "next/link";
import { categories, categoryStats } from "@/data";

export const metadata = {
  title: "Topics — HanyuSprint",
};

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Browse by topic</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Vocabulary and sentences grouped by real-life scenario — home, work,
        school, travel, and more.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const stats = categoryStats(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/topics/${cat.slug}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <p className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {cat.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {stats.wordCount} words · {stats.sentenceCount} sentences
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                {cat.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
