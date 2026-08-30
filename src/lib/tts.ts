import audioManifest from "@/data/audioManifest.json";

const PREFERRED_VOICE_KEY = "hs-preferred-voice-uri";

export interface RankedVoice {
  voice: SpeechSynthesisVoice;
  /** Rough quality tier for display purposes. */
  tier: "natural" | "good" | "basic";
}

/**
 * Browsers/OSes ship wildly different Chinese voices under the hood - some
 * are genuine neural/natural voices, some are decades-old robotic SAPI
 * voices. There's no standard "quality" field on SpeechSynthesisVoice, so we
 * score by known name patterns to consistently prefer the best-sounding
 * option that's actually available, without requiring any setup.
 */
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;

  // Exact mainland Mandarin beats Taiwan/Hong Kong Mandarin/Cantonese for
  // our content, but any Chinese voice is far better than none.
  if (v.lang === "zh-CN") score += 30;
  else if (v.lang.toLowerCase().startsWith("zh")) score += 10;
  else return -1; // not a Chinese voice at all

  // Microsoft Edge / Windows 11 "Online (Natural)" neural voices - genuinely
  // natural-sounding and free, e.g. "Microsoft Xiaoxiao Online (Natural)".
  if (name.includes("natural")) score += 100;
  if (name.includes("online")) score += 20;

  // Known high-quality neural voice names across platforms.
  const goodNames = [
    "xiaoxiao", "yunxi", "yunyang", "xiaoyi", "yunjian", "xiaomo", // Azure/Edge neural
    "tingting", "meijia", "sinji", // macOS/iOS enhanced Chinese voices
  ];
  if (goodNames.some((n) => name.includes(n))) score += 40;

  // Google's Chinese voice (used on Android Chrome / ChromeOS) is a solid,
  // modern voice.
  if (name.includes("google")) score += 35;

  // Old desktop SAPI voices and generic "Compact" voices tend to sound the
  // most robotic.
  if (name.includes("desktop")) score -= 30;
  if (name.includes("compact")) score -= 20;

  // A locally-installed voice avoids network latency but isn't inherently
  // better or worse quality-wise, so it's not scored either way.

  return score;
}

let cachedRankedVoices: RankedVoice[] | null = null;

function tierFromScore(score: number): RankedVoice["tier"] {
  if (score >= 60) return "natural";
  if (score >= 20) return "good";
  return "basic";
}

/** All available Chinese voices, best first. Empty until voices load. */
export function listChineseVoices(): RankedVoice[] {
  if (cachedRankedVoices) return cachedRankedVoices;
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  const ranked = voices
    .map((voice) => ({ voice, score: scoreVoice(voice) }))
    .filter((v) => v.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map(({ voice, score }) => ({ voice, tier: tierFromScore(score) }));
  cachedRankedVoices = ranked;
  return ranked;
}

export function getPreferredVoiceURI(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PREFERRED_VOICE_KEY);
  } catch {
    return null;
  }
}

export function setPreferredVoiceURI(voiceURI: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (voiceURI) window.localStorage.setItem(PREFERRED_VOICE_KEY, voiceURI);
    else window.localStorage.removeItem(PREFERRED_VOICE_KEY);
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

function pickChineseVoice(): SpeechSynthesisVoice | null {
  const ranked = listChineseVoices();
  if (ranked.length === 0) return null;

  const preferredURI = getPreferredVoiceURI();
  if (preferredURI) {
    const match = ranked.find((r) => r.voice.voiceURI === preferredURI);
    if (match) return match.voice;
  }
  return ranked[0].voice;
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedRankedVoices = null;
  };
}

export function speakChinese(text: string, rate = 0.85): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  const voice = pickChineseVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function isTtsSupported(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

/**
 * Plays real, natural-sounding pre-generated audio (see scripts/generate-audio.ts)
 * when we have it for this exact text, falling back to the browser's built-in
 * (more robotic) speech synthesis otherwise.
 */
export function playChinese(text: string, rate = 0.85): void {
  const url = (audioManifest as Record<string, string>)[text.trim()];
  if (url && typeof window !== "undefined") {
    const audio = new Audio(url);
    audio.play().catch(() => speakChinese(text, rate));
    return;
  }
  speakChinese(text, rate);
}
