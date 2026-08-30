/**
 * Generates real neural TTS audio (ElevenLabs) for the app's Chinese text
 * and records the results in src/data/audioManifest.json.
 *
 * Run locally (this needs outbound network access to api.elevenlabs.io,
 * which is NOT available from a sandboxed Claude Code session):
 *
 *   1. Put your key in .env.local:  ELEVENLABS_API_KEY=sk_...
 *   2. npm run generate-audio
 *
 * Safe to re-run: already-generated text is skipped (tracked in the
 * manifest), so you can run it again next month once your free-tier
 * character quota resets to pick up where you left off. Pass a smaller
 * budget for a single run with:
 *
 *   AUDIO_CHAR_BUDGET=3000 npm run generate-audio
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { words, sentences } from "../src/data";
import { stories } from "../src/data/stories";

// Manually load .env.local so this works with a plain `tsx` invocation.
try {
  const envFile = readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
} catch {
  // no .env.local present - rely on real environment variables
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
// Free-tier API keys can only use voices from your own account's "Default"
// voices (My Voices -> Type: Default), NOT Voice Library voices - those
// 402 with "paid_plan_required" even though they render fine in the web UI.
// There's no universally-safe hardcoded default, so this must be set.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = "eleven_multilingual_v2";
// Free tier is ~10,000 characters/month - leave a small buffer.
const CHAR_BUDGET = Number(process.env.AUDIO_CHAR_BUDGET || 9000);

const PUBLIC_AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const MANIFEST_PATH = path.join(process.cwd(), "src", "data", "audioManifest.json");

function hashText(text: string): string {
  return createHash("sha1").update(text).digest("hex").slice(0, 16);
}

async function loadManifest(): Promise<Record<string, string>> {
  try {
    const raw = await readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

async function saveManifest(manifest: Record<string, string>): Promise<void> {
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

function collectTexts(): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  function add(text: string | undefined): void {
    if (!text) return;
    const t = text.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    ordered.push(t);
  }

  // Priority order: words first (most reused, highest value), then their
  // example sentences, then topic sentences, then full story sentences.
  for (const w of words) add(w.hanzi);
  for (const w of words) add(w.example?.hanzi);
  for (const s of sentences) add(s.hanzi);
  for (const story of stories) {
    for (const sent of story.sentences) {
      add(sent.tokens.map((tok) => tok.hanzi).join(""));
    }
  }

  return ordered;
}

async function synthesize(text: string): Promise<Buffer> {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY as string,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 300)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main(): Promise<void> {
  if (!API_KEY) {
    console.error(
      "Missing ELEVENLABS_API_KEY.\nAdd it to .env.local as:\n  ELEVENLABS_API_KEY=sk_...\nthen run: npm run generate-audio"
    );
    process.exitCode = 1;
    return;
  }

  if (!VOICE_ID) {
    console.error(
      "Missing ELEVENLABS_VOICE_ID.\n" +
        "Free-tier API keys can only use a voice from your own account's " +
        '"Default" voices, not the shared Voice Library (those 402 with ' +
        "paid_plan_required even though they play fine on the website).\n\n" +
        "In the ElevenLabs dashboard: Voices (left sidebar, not Voice Library) " +
        '-> pick a voice, e.g. one of the built-in "Default" ones -> copy its ' +
        "Voice ID, then add it to .env.local as:\n" +
        "  ELEVENLABS_VOICE_ID=...\n" +
        "then run: npm run generate-audio"
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(PUBLIC_AUDIO_DIR, { recursive: true });
  const manifest = await loadManifest();
  const texts = collectTexts();

  let charsUsed = 0;
  let generated = 0;
  let skipped = 0;
  let stoppedEarly = false;
  let consecutiveFailures = 0;
  const MAX_CONSECUTIVE_FAILURES = 3;

  for (const text of texts) {
    if (manifest[text]) {
      skipped++;
      continue;
    }

    if (charsUsed + text.length > CHAR_BUDGET) {
      console.log(
        `\nStopping: next item ("${text}", ${text.length} chars) would exceed the ${CHAR_BUDGET}-character budget for this run.`
      );
      stoppedEarly = true;
      break;
    }

    const filename = `${hashText(text)}.mp3`;
    const filePath = path.join(PUBLIC_AUDIO_DIR, filename);

    try {
      process.stdout.write(`Generating "${text}"... `);
      const audio = await synthesize(text);
      await writeFile(filePath, audio);
      manifest[text] = `/audio/${filename}`;
      charsUsed += text.length;
      generated++;
      consecutiveFailures = 0;
      console.log(`ok (${audio.length} bytes)`);
      // Save after every clip so a mid-run quota cutoff never loses progress.
      await saveManifest(manifest);
    } catch (err) {
      console.log("FAILED");
      const message = err instanceof Error ? err.message : String(err);
      console.error(message);
      if (message.includes("401")) {
        console.error("Bad API key - stopping.");
        stoppedEarly = true;
        break;
      }
      if (message.includes("402") || message.includes("paid_plan_required")) {
        console.error(
          "This voice isn't usable by a free-tier API key (it's a Voice Library " +
            "voice, not one of your account's Default voices). Set ELEVENLABS_VOICE_ID " +
            "to a voice from My Voices in your ElevenLabs dashboard instead - stopping."
        );
        stoppedEarly = true;
        break;
      }
      if (message.includes("429") || message.toLowerCase().includes("quota")) {
        console.error("Quota exceeded - stopping. Re-run next month to continue.");
        stoppedEarly = true;
        break;
      }
      consecutiveFailures++;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        console.error(
          `\n${MAX_CONSECUTIVE_FAILURES} failures in a row - this looks like a systemic problem ` +
            "(network access, firewall, or the API being unreachable) rather than a per-item issue. Stopping."
        );
        stoppedEarly = true;
        break;
      }
      // Otherwise: skip this one item and keep going.
    }

    // Be polite to the API.
    await new Promise((r) => setTimeout(r, 300));
  }

  const remaining = texts.length - generated - skipped;
  console.log(
    `\nDone. Generated ${generated} new clip(s) (${charsUsed} characters used this run), ` +
      `${skipped} already had audio, ${remaining} remaining${
        stoppedEarly ? " (run again to continue)" : ""
      }.`
  );
}

main();
