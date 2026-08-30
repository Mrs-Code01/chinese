"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  listChineseVoices,
  getPreferredVoiceURI,
  setPreferredVoiceURI,
  speakChinese,
  isTtsSupported,
  type RankedVoice,
} from "@/lib/tts";

const TIER_LABEL: Record<RankedVoice["tier"], string> = {
  natural: "✨ Natural",
  good: "🙂 Good",
  basic: "🤖 Basic",
};

const TIER_STYLE: Record<RankedVoice["tier"], string> = {
  natural: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  good: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300",
  basic: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

const SAMPLE_TEXT = "你好，很高兴认识你。";

export default function VoiceSettings() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<{
    voices: RankedVoice[];
    selected: string | null;
    supported: boolean;
  }>({ voices: [], selected: null, supported: true });
  const { voices, selected, supported } = state;

  useEffect(() => {
    if (!open) return;

    function refresh() {
      const list = listChineseVoices();
      // Reading browser voice state must happen client-side after mount.
      setState({
        voices: list,
        selected: getPreferredVoiceURI() ?? list[0]?.voice.voiceURI ?? null,
        supported: isTtsSupported(),
      });
    }
    refresh();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = refresh;
    }
  }, [open]);

  function setSelected(voiceURI: string | null) {
    setState((s) => ({ ...s, selected: voiceURI }));
  }

  function choose(voiceURI: string) {
    setSelected(voiceURI);
    setPreferredVoiceURI(voiceURI);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition hover:border-red-300 hover:text-red-600 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-red-400"
      >
        🔊 Voice
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setOpen(false)}
          >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Choose a voice</h2>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Audio uses your browser&apos;s built-in Chinese voices.
                  Quality depends on your device — pick whichever sounds most
                  natural to you.
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

            {!supported && (
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                Your browser doesn&apos;t support speech synthesis.
              </p>
            )}

            {supported && voices.length === 0 && (
              <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                No Chinese voice was found on this device yet. Some browsers
                load voices with a short delay — try reopening this panel in
                a moment. If none appear, your device may not have a Chinese
                voice installed (see tips below).
              </p>
            )}

            <div className="mt-4 space-y-2">
              {voices.map(({ voice, tier }) => (
                <label
                  key={voice.voiceURI}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${
                    selected === voice.voiceURI
                      ? "border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
                      : "border-neutral-200 dark:border-neutral-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="voice"
                      checked={selected === voice.voiceURI}
                      onChange={() => choose(voice.voiceURI)}
                    />
                    <div>
                      <p className="text-sm font-medium">{voice.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {voice.lang}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${TIER_STYLE[tier]}`}
                    >
                      {TIER_LABEL[tier]}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        speakChinese(SAMPLE_TEXT);
                      }}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      ▶ Test
                    </button>
                  </div>
                </label>
              ))}
            </div>

            <details className="mt-5 text-sm text-neutral-600 dark:text-neutral-400">
              <summary className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-200">
                Not happy with any of these? Get a better voice for free.
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <strong>Windows (Edge or Chrome):</strong> Settings → Time
                  &amp; Language → Speech → Manage voices → add a Chinese
                  (Simplified) &quot;Natural&quot; voice. These sound
                  genuinely close to a native speaker.
                </li>
                <li>
                  <strong>Mac / iPhone / iPad:</strong> Settings →
                  Accessibility → Spoken Content → Voices → Chinese →
                  download an &quot;Enhanced&quot; or &quot;Premium&quot;
                  voice like Tingting.
                </li>
                <li>
                  <strong>Android:</strong> usually ships Google&apos;s
                  Chinese voice already — make sure &quot;Google
                  Text-to-speech&quot; is set as the default engine in your
                  phone&apos;s accessibility settings.
                </li>
              </ul>
              <p className="mt-2">
                After installing a new voice, close and reopen this panel.
              </p>
            </details>
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
