import { notFound } from "next/navigation";
import Link from "next/link";
import { stories, getStory } from "@/data/stories";
import StoryReader from "@/components/StoryReader";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <Link href="/stories" className="text-sm text-neutral-500 hover:text-red-600 dark:text-neutral-400">
          ← All stories
        </Link>
      </div>
      <StoryReader story={story} />
    </div>
  );
}
