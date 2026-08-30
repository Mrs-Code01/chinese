import Link from "next/link";
import { Suspense } from "react";
import SearchBox from "./SearchBox";

const NAV_LINKS = [
  { href: "/topics", label: "Topics" },
  { href: "/hsk", label: "HSK Levels" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quiz", label: "Quiz" },
  { href: "/favorites", label: "Favorites" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span aria-hidden>🀄</span>
          <span>
            <span className="text-red-600 dark:text-red-400">Hanyu</span>Sprint
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition hover:text-red-600 dark:hover:text-red-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sm:ml-auto sm:w-72">
          <Suspense fallback={null}>
            <SearchBox compact />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
