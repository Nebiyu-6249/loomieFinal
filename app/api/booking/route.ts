import { NextResponse } from "next/server";

import { isOfferedSlot } from "@/lib/booking";

/**
 * Receives a booking request.
 *
 * There is no mail transport wired up yet — the founder has not chosen one —
 * so this validates the request properly and records it in the server log. It
 * returns success only for a request that would genuinely have been sendable,
 * so the interface never tells someone their request went through when the
 * shape of it was wrong.
 *
 * To make it live, replace the logging block with a call to the transport of
 * choice. Nothing else here has to change.
 */

const MAX_NOTE = 2000;
const MAX_NAME = 200;

interface BookingRequest {
  slot: string;
  name: string;
  email: string;
  note: string;
  visitorTimeZone: string | null;
}

function parse(body: unknown): BookingRequest | { error: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "That request was not readable." };
  }

  const record = body as Record<string, unknown>;

  const slot = typeof record.slot === "string" ? record.slot.trim() : "";
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const note = typeof record.note === "string" ? record.note.trim() : "";
  const visitorTimeZone =
    typeof record.visitorTimeZone === "string" ? record.visitorTimeZone : null;

  if (!slot) return { error: "Pick one of the times offered." };

  // The instant has to be one this server actually put on the page.
  if (!isOfferedSlot(slot)) {
    return {
      error: "That time is no longer being offered. Reload and pick another.",
    };
  }

  if (!name || name.length > MAX_NAME) {
    return { error: "Add your name so the studio knows who is asking." };
  }

  // Deliberately permissive: the transport is the real check, and over-strict
  // patterns reject valid addresses.
  if (!email || email.length > MAX_NAME || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "That email address does not look right." };
  }

  if (note.length > MAX_NOTE) {
    return { error: "That message is too long to send." };
  }

  return { slot, name, email, note, visitorTimeZone };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "That request was not readable." },
      { status: 400 },
    );
  }

  const parsed = parse(body);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // Replace with the founder's chosen transport.
  console.info("[booking] request received", {
    slot: parsed.slot,
    name: parsed.name,
    email: parsed.email,
    visitorTimeZone: parsed.visitorTimeZone,
    noteLength: parsed.note.length,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
