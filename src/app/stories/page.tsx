import Link from "next/link";
import { stories } from "@/data/stories";

export const metadata = {
  title: "Story Book — XiaoLi",
};

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Story Book</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Short stories built from words you&apos;re learning. Tap any word to
        see its meaning, pinyin, and hear it spoken aloud.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/stories/${story.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{story.icon}</span>
              <div>
                <p className="text-lg font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {story.hanziTitle}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {story.title} · HSK {story.hsk} · {story.sentences.length} sentences
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {story.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
