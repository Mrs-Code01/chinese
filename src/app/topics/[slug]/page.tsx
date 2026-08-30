import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory, wordsByCategory, sentencesByCategory } from "@/data";
import ItemListTabs from "@/components/ItemListTabs";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function TopicPage({
  params,
}: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const words = wordsByCategory(slug);
  const sentences = sentencesByCategory(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/topics" className="text-sm text-neutral-500 hover:text-brand-600 dark:text-neutral-400">
        ← All topics
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-neutral-600 dark:text-neutral-400">{category.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <ItemListTabs words={words} sentences={sentences} />
      </div>
    </div>
  );
}
