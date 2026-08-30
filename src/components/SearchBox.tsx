"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className={compact ? "w-full" : "mx-auto w-full max-w-xl"}
    >
      <div className="flex min-w-0 items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 shadow-sm focus-within:border-brand-400 dark:border-neutral-700 dark:bg-neutral-900">
        <span aria-hidden>🔍</span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search words or sentences (hanzi, pinyin, or English)..."
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
    </form>
  );
}
