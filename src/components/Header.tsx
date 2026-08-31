"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import SearchBox from "./SearchBox";
import VoiceSettings from "./VoiceSettings";
import ColorThemePicker from "./ColorThemePicker";

const NAV_LINKS = [
  { href: "/topics", label: "Topics" },
  { href: "/hsk", label: "HSK Levels" },
  { href: "/stories", label: "Stories" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quiz", label: "Quiz" },
  { href: "/favorites", label: "Favorites" },
  { href: "/journal", label: "Journal" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever navigation happens. Adjusting state
  // during render (rather than in an effect) avoids an extra render pass -
  // see https://react.dev/learn/you-might-not-need-an-effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span aria-hidden>🀄</span>
          <span>
            <span className="text-brand-600 dark:text-brand-400">Xiao</span>Li
          </span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium text-neutral-600 dark:text-neutral-300 min-[1400px]:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap transition hover:text-brand-600 dark:hover:text-brand-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="min-w-0 flex-1 sm:max-w-xs min-[1400px]:max-w-72">
            <Suspense fallback={null}>
              <SearchBox compact />
            </Suspense>
          </div>
          <div className="hidden items-center gap-2 min-[1400px]:flex">
            <VoiceSettings />
            <ColorThemePicker />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-lg text-neutral-600 transition hover:border-brand-300 hover:text-brand-600 min-[1400px]:hidden dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-400"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-neutral-200 px-4 py-3 min-[1400px]:hidden dark:border-neutral-800">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-brand-50 hover:text-brand-600 dark:text-neutral-200 dark:hover:bg-brand-950/40 dark:hover:text-brand-400"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <VoiceSettings />
              <ColorThemePicker />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
