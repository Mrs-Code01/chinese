import { notFound } from "next/navigation";
import Link from "next/link";
import { hskLevels, wordsByHsk, sentencesByHsk, categories } from "@/data";
import ItemListByTopic from "@/components/ItemListByTopic";

export function generateStaticParams() {
  return hskLevels.map((level) => ({ level: String(level) }));
}

export default async function HskLevelPage({
  params,
}: PageProps<"/hsk/[level]">) {
  const { level } = await params;
  const levelNum = Number(level);
  if (!hskLevels.includes(levelNum as (typeof hskLevels)[number])) notFound();

  const words = wordsByHsk(levelNum);
  const sentences = sentencesByHsk(levelNum);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/hsk" className="text-sm text-neutral-500 hover:text-red-600 dark:text-neutral-400">
        ← All HSK levels
      </Link>

      <h1 className="mt-3 text-2xl font-bold">HSK {levelNum}</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        {words.length} words · {sentences.length} sentences at this level.
      </p>

      <div className="mt-8">
        <ItemListByTopic words={words} sentences={sentences} categories={categories} />
      </div>
    </div>
  );
}
