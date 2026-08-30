import { search } from "@/data";
import WordCard from "@/components/WordCard";
import SentenceCard from "@/components/SentenceCard";
import type { Word, Sentence } from "@/data/types";

export const metadata = {
  title: "Search — HanyuSprint",
};

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = query ? search(query, 100) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Search</h1>
      {query ? (
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {results.length} result{results.length === 1 ? "" : "s"} for{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            &ldquo;{query}&rdquo;
          </span>
        </p>
      ) : (
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Use the search bar above to find any word or sentence by hanzi,
          pinyin, or English meaning.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {results.map((r) =>
          r.type === "word" ? (
            <WordCard key={r.item.id} word={r.item as Word} />
          ) : (
            <SentenceCard key={r.item.id} sentence={r.item as Sentence} />
          )
        )}
      </div>

      {query && results.length === 0 && (
        <p className="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No matches found. Try a different word, pinyin spelling, or English term.
        </p>
      )}
    </div>
  );
}
