const HSK_COLORS: Record<number, string> = {
  1: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  2: "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300",
  3: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  4: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-300",
  5: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
  6: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300",
};

export default function HskBadge({ level }: { level: number }) {
  const color =
    HSK_COLORS[level] ??
    "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      HSK {level}
    </span>
  );
}
