"use client";

import { speakChinese } from "@/lib/tts";

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
        speakChinese(text);
      }}
      aria-label={`Play pronunciation of ${text}`}
      title="Listen"
      className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 active:scale-95 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/70`}
    >
      🔊
    </button>
  );
}
