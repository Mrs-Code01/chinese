"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { dateKey, loadJournalNotes, saveJournalNote, type JournalNotes } from "@/lib/journal";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export default function JournalCalendar() {
  const [state, setState] = useState<{
    mounted: boolean;
    viewYear: number;
    viewMonth: number;
    todayKey: string;
    notes: JournalNotes;
  }>({ mounted: false, viewYear: 0, viewMonth: 0, todayKey: "", notes: {} });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    // Reading the real date and localStorage must happen after mount to
    // avoid SSR/client mismatches (today's date differs from build time).
    function init() {
      const now = new Date();
      setState({
        mounted: true,
        viewYear: now.getFullYear(),
        viewMonth: now.getMonth(),
        todayKey: dateKey(now),
        notes: loadJournalNotes(),
      });
    }
    init();
  }, []);

  const { mounted, viewYear, viewMonth, todayKey, notes } = state;

  if (!mounted) return null;

  function openDay(key: string) {
    setSelectedKey(key);
    setDraft(notes[key] ?? "");
  }

  function updateDraft(text: string) {
    setDraft(text);
    if (selectedKey) {
      const updated = saveJournalNote(selectedKey, text);
      setState((s) => ({ ...s, notes: updated }));
    }
  }

  function goToMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setState((s) => ({ ...s, viewYear: d.getFullYear(), viewMonth: d.getMonth() }));
  }

  function goToToday() {
    const now = new Date();
    setState((s) => ({ ...s, viewYear: now.getFullYear(), viewMonth: now.getMonth() }));
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedDate = selectedKey ? new Date(`${selectedKey}T00:00:00`) : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Learning Journal</h1>
      <p className="mt-1 text-neutral-600 dark:text-neutral-400">
        Click any date to write what you learned that day. Everything is
        saved on this device and never erased automatically.
      </p>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            aria-label="Previous month"
            className="rounded-full px-3 py-1.5 text-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {MONTH_LABELS[viewMonth]} {viewYear}
            </h2>
            <button
              type="button"
              onClick={goToToday}
              className="rounded-full border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-400"
            >
              Today
            </button>
          </div>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            aria-label="Next month"
            className="rounded-full px-3 py-1.5 text-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const key = dateKey(new Date(viewYear, viewMonth, day));
            const hasNote = Boolean(notes[key]?.trim());
            const isToday = key === todayKey;
            return (
              <button
                key={i}
                type="button"
                onClick={() => openDay(key)}
                aria-label={`${MONTH_LABELS[viewMonth]} ${day}, ${viewYear}${hasNote ? " (has a note)" : ""}`}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition hover:bg-brand-50 dark:hover:bg-brand-950/40 ${
                  isToday ? "ring-2 ring-brand-400" : ""
                } ${
                  hasNote
                    ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-brand-300"
                    : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {day}
                {hasNote && (
                  <span
                    className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-brand-500"
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedKey &&
        selectedDate &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setSelectedKey(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold">
                  {selectedDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  aria-label="Close"
                  className="shrink-0 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  ✕
                </button>
              </div>
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => updateDraft(e.target.value)}
                placeholder="What did you learn today?"
                rows={8}
                className="mt-4 w-full resize-none rounded-xl border border-neutral-300 bg-white p-3 text-sm text-neutral-900 outline-none focus:border-brand-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
              />
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Saved automatically as you type.
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
