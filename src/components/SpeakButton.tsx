"use client";

import { playChinese } from "@/lib/tts";

export default function SpeakButton({
  text,
  size = "md",
}: {
  text: string;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        playChinese(text);
      }}
      aria-label={`Play pronunciation of ${text}`}
      title="Listen"
      className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 active:scale-95 dark:border-brand-900/50 dark:bg-brand-950/40 dark:text-brand-400 dark:hover:bg-brand-950/70`}
    >
      🔊
    </button>
  );
}
