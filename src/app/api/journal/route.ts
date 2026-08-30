import { NextRequest, NextResponse } from "next/server";
import { getAllNotes, setNote, isJournalStoreConfigured } from "@/lib/journalStore.server";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_NOTE_LENGTH = 20000;

function hasValidSecret(req: NextRequest): boolean {
  const expected = process.env.JOURNAL_SECRET;
  if (!expected) return false;
  return req.headers.get("x-journal-secret") === expected;
}

function missingSecretResponse() {
  return NextResponse.json(
    { error: "Server is missing the JOURNAL_SECRET environment variable." },
    { status: 500 }
  );
}

export async function GET(req: NextRequest) {
  if (!process.env.JOURNAL_SECRET) return missingSecretResponse();
  if (!hasValidSecret(req)) {
    return NextResponse.json({ error: "Invalid passphrase." }, { status: 401 });
  }

  const notes = await getAllNotes();
  return NextResponse.json({ notes, persistent: isJournalStoreConfigured() });
}

export async function PUT(req: NextRequest) {
  if (!process.env.JOURNAL_SECRET) return missingSecretResponse();
  if (!hasValidSecret(req)) {
    return NextResponse.json({ error: "Invalid passphrase." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.date !== "string" || typeof body.text !== "string") {
    return NextResponse.json({ error: "Expected { date, text }." }, { status: 400 });
  }
  if (!DATE_RE.test(body.date)) {
    return NextResponse.json({ error: "Invalid date, expected YYYY-MM-DD." }, { status: 400 });
  }
  if (body.text.length > MAX_NOTE_LENGTH) {
    return NextResponse.json({ error: "Note is too long." }, { status: 400 });
  }

  await setNote(body.date, body.text);
  return NextResponse.json({ ok: true });
}
