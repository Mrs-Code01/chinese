"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  dateKey,
  loadLocalNotes,
  saveLocalNotes,
  setLocalNote,
  getStoredSecret,
  setStoredSecret,
  fetchRemoteNotes,
  pushRemoteNote,
  type JournalNotes,
} from "@/lib/journal";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type SyncStatus = "checking" | "synced" | "offline" | "not-configured" | "gate";
type SaveStatus = "idle" | "saving" | "saved" | "offline" | "error";

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
    secret: string | null;
    syncStatus: SyncStatus;
  }>({
    mounted: false,
    viewYear: 0,
    viewMonth: 0,
    todayKey: "",
    notes: {},
    secret: null,
    syncStatus: "checking",
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [gateInput, setGateInput] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateChecking, setGateChecking] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Real date + localStorage must be read after mount to avoid an
    // SSR/client mismatch (today's date differs from build time).
    async function init() {
      const now = new Date();
      const localNotes = loadLocalNotes();
      const secret = getStoredSecret();

      setState({
        mounted: true,
        viewYear: now.getFullYear(),
        viewMonth: now.getMonth(),
        todayKey: dateKey(now),
        notes: localNotes,
        secret,
        syncStatus: secret ? "checking" : "gate",
      });

      if (secret) {
        const result = await fetchRemoteNotes(secret);
        if (result.ok) {
          setState((s) => ({ ...s, notes: result.notes, syncStatus: "synced" }));
        } else if (result.status === 401) {
          setStoredSecret(null);
          setState((s) => ({ ...s, secret: null, syncStatus: "gate" }));
        } else if (result.status === 500) {
          setState((s) => ({ ...s, syncStatus: "not-configured" }));
        } else {
          setState((s) => ({ ...s, syncStatus: "offline" }));
        }
      }
    }
    init();
  }, []);

  const { mounted, viewYear, viewMonth, todayKey, notes, secret, syncStatus } = state;

  if (!mounted) return null;

  async function submitGate() {
    const candidate = gateInput.trim();
    if (!candidate) return;
    setGateChecking(true);
    setGateError(null);
    const result = await fetchRemoteNotes(candidate);
    setGateChecking(false);
    if (result.ok) {
      setStoredSecret(candidate);
      saveLocalNotes(result.notes);
      setState((s) => ({ ...s, secret: candidate, notes: result.notes, syncStatus: "synced" }));
      setGateInput("");
    } else if (result.status === 401) {
      setGateError("That passphrase doesn't match. Try again.");
    } else if (result.status === 500) {
      setGateError(
        "This site hasn't been set up for cross-device sync yet - see the README (JOURNAL_SECRET)."
      );
    } else {
      setGateError("Couldn't reach the server. Check your connection and try again.");
    }
  }

  function openDay(key: string) {
    setSelectedKey(key);
    setDraft(notes[key] ?? "");
    setSaveStatus("idle");
  }

  function closeModal() {
    // Flush any pending debounced save immediately rather than losing it.
    if (pushTimer.current) {
      clearTimeout(pushTimer.current);
      pushTimer.current = null;
      if (selectedKey && secret) void pushNow(selectedKey, draft);
    }
    setSelectedKey(null);
  }

  async function pushNow(key: string, text: string) {
    if (!secret) return;
    setSaveStatus("saving");
    const result = await pushRemoteNote(secret, key, text);
    if (result.ok) setSaveStatus("saved");
    else if (result.status === 401) {
      setStoredSecret(null);
      setState((s) => ({ ...s, secret: null, syncStatus: "gate" }));
    } else setSaveStatus("offline");
  }

  function updateDraft(text: string) {
    setDraft(text);
    if (!selectedKey) return;

    const updated = setLocalNote(selectedKey, text);
    setState((s) => ({ ...s, notes: updated }));

    if (pushTimer.current) clearTimeout(pushTimer.current);
    if (!secret) return;
    setSaveStatus("saving");
    pushTimer.current = setTimeout(() => {
      void pushNow(selectedKey, text);
    }, 700);
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

  const SYNC_BADGE: Record<SyncStatus, { label: string; className: string }> = {
    checking: { label: "Checking sync…", className: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400" },
    synced: { label: "✓ Synced across devices", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300" },
    offline: { label: "⚠ Offline - saved on this device only", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" },
    "not-configured": { label: "⚠ Sync not set up yet", className: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" },
    gate: { label: "", className: "" },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Learning Journal</h1>
        {syncStatus !== "gate" && (
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${SYNC_BADGE[syncStatus].className}`}>
            {SYNC_BADGE[syncStatus].label}
          </span>
        )}
      </div>
      <p className="mt-1 text-neutral-600 dark:text-neutral-400">
        Click any date to write what you learned that day. Notes are saved
        permanently and follow you across devices.
      </p>

      {syncStatus === "gate" ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="text-lg font-semibold">Enter your journal passphrase</h2>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            This keeps your journal private and lets it sync across your
            devices. Enter the same passphrase everywhere you use it.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitGate();
            }}
            className="mt-4 flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="password"
              value={gateInput}
              onChange={(e) => setGateInput(e.target.value)}
              placeholder="Passphrase"
              autoFocus
              className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-neutral-700 dark:bg-neutral-950"
            />
            <button
              type="submit"
              disabled={gateChecking || !gateInput.trim()}
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {gateChecking ? "Checking…" : "Unlock"}
            </button>
          </form>
          {gateError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{gateError}</p>}
        </div>
      ) : (
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
      )}

      {selectedKey &&
        selectedDate &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={closeModal}
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
                  onClick={closeModal}
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
                {saveStatus === "saving" && "Saving…"}
                {saveStatus === "saved" && "✓ Saved and synced."}
                {saveStatus === "offline" && "Saved on this device only - couldn't reach the server."}
                {saveStatus === "idle" && "Saved automatically as you type."}
              </p>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
