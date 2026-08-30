"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { COLOR_THEMES, DEFAULT_THEME_ID, themeToCssText, type ColorTheme } from "@/lib/colorThemes";

const THEME_ID_KEY = "hs-color-theme-id";
const THEME_VARS_KEY = "hs-color-theme-vars";

function applyTheme(theme: ColorTheme): void {
  document.documentElement.style.cssText += themeToCssText(theme);
  try {
    window.localStorage.setItem(THEME_ID_KEY, theme.id);
    window.localStorage.setItem(THEME_VARS_KEY, themeToCssText(theme));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

export default function ColorThemePicker() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(DEFAULT_THEME_ID);

  useEffect(() => {
    if (!open) return;

    function loadSaved() {
      try {
        const saved = window.localStorage.getItem(THEME_ID_KEY);
        if (saved) setSelectedId(saved);
      } catch {
        // ignore storage errors
      }
    }
    loadSaved();
  }, [open]);

  function choose(theme: ColorTheme) {
    setSelectedId(theme.id);
    applyTheme(theme);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Change color theme"
        title="Change color theme"
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:border-brand-300 hover:text-brand-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-brand-400"
      >
        🎨 Theme
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Choose a color theme</h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Pick an accent color for the whole site. Saved on this device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="shrink-0 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => choose(theme)}
                    aria-label={theme.label}
                    title={theme.label}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition ${
                      selectedId === theme.id
                        ? "border-neutral-400 bg-neutral-50 dark:border-neutral-500 dark:bg-neutral-800"
                        : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <span
                      className="h-8 w-8 rounded-full ring-1 ring-inset ring-black/10"
                      style={{ backgroundColor: theme.swatchHex }}
                    >
                      {selectedId === theme.id && (
                        <span className="flex h-full w-full items-center justify-center text-sm text-white">
                          ✓
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">
                      {theme.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
