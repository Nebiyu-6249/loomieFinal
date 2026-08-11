"use client";

import { useId, useState, useSyncExternalStore } from "react";

import { DUBAI_TIME_ZONE, formatTime, type ProposedSlot } from "@/lib/booking";

/**
 * A booking request, not a calendar.
 *
 * The slots are native radios inside a fieldset, so the whole thing is
 * keyboard-operable by default — arrow keys move between times, tab moves
 * between groups — and there is no custom date picker to get wrong. Calendars
 * are among the most reliably inaccessible widgets on the web, and the way to
 * pass that test is not to build one.
 *
 * Every time is shown in both zones once the visitor's own zone is known. The
 * server does not know it, so the server renders Dubai alone and the reader's
 * side is added after mount rather than guessed.
 */

/** The visitor's zone never changes while the page is open. */
const subscribeNever = () => () => {};
const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimeZone = () => null;

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

export function BookingForm({ slots }: { slots: readonly ProposedSlot[] }) {
  const visitorZone = useSyncExternalStore(
    subscribeNever,
    getTimeZone,
    getServerTimeZone,
  );

  const [selected, setSelected] = useState<string>("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [slotError, setSlotError] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const noteId = useId();
  const slotErrorId = useId();

  const showsBothZones = visitorZone !== null && visitorZone !== DUBAI_TIME_ZONE;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected) {
      setSlotError(true);
      document.getElementById(slotErrorId)?.focus();
      return;
    }

    setSlotError(false);
    setStatus({ state: "sending" });

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: selected,
          name: data.get("name"),
          email: data.get("email"),
          note: data.get("note"),
          visitorTimeZone: visitorZone,
        }),
      });

      const body: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          body && typeof body === "object" && "error" in body
            ? String((body as { error: unknown }).error)
            : "That did not send. Try again, or email the studio directly.";
        setStatus({ state: "error", message });
        return;
      }

      setStatus({ state: "sent" });
    } catch {
      setStatus({
        state: "error",
        message:
          "That did not send — the connection failed. Try again, or email the studio directly.",
      });
    }
  }

  if (status.state === "sent") {
    return (
      <div className="border-t border-ink pt-step-3" role="status">
        <h3 className="type-heading text-[clamp(1.5rem,3.4vw,2.25rem)]">
          Request received.
        </h3>
        <p className="type-body measure mt-step-2 text-slate">
          Nothing is booked yet — the studio will confirm the time by email, or
          propose another if that one has gone.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <fieldset
        className="border-0 p-0"
        aria-describedby={slotError ? slotErrorId : undefined}
      >
        <legend className="type-micro text-slate">
          Choose a time
          {showsBothZones ? " — shown in your zone and in Dubai" : " — Dubai time"}
        </legend>

        <p
          id={slotErrorId}
          tabIndex={-1}
          className="type-meta mt-step-2 text-ink"
          hidden={!slotError}
        >
          Pick one of the times below before sending the request.
        </p>

        <div className="mt-step-3 grid gap-px bg-drift sm:grid-cols-3">
          {slots.map((slot) => {
            // Dubai's side arrives preformatted from the server; only the
            // visitor's side is computed here, and only after mount.
            const { dubaiTime, dubaiDay } = slot;
            const isSelected = selected === slot.iso;

            return (
              <label
                key={slot.iso}
                className={`flex min-h-24 cursor-pointer flex-col justify-center gap-1 p-step-2 transition-colors duration-200 ${
                  isSelected ? "bg-ink text-field" : "bg-field hover:bg-drift"
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  value={slot.iso}
                  checked={isSelected}
                  onChange={() => {
                    setSelected(slot.iso);
                    setSlotError(false);
                  }}
                  className="sr-only"
                />

                <span className="type-micro opacity-70">{dubaiDay}</span>

                {showsBothZones ? (
                  <>
                    <span className="type-heading text-[1.0625rem]">
                      {formatTime(slot.iso, visitorZone)} your time
                    </span>
                    <span className="type-micro opacity-70">
                      {dubaiTime} in Dubai
                    </span>
                  </>
                ) : (
                  <span className="type-heading text-[1.0625rem]">
                    {dubaiTime} in Dubai
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-step-4 grid gap-step-3 md:grid-cols-2">
        <p className="flex flex-col gap-step-1">
          <label htmlFor={nameId} className="type-micro text-slate">
            Your name
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            autoComplete="name"
            className="min-h-12 border-b border-ink bg-transparent pb-2 text-[1rem] outline-none focus-visible:border-b-2"
          />
        </p>

        <p className="flex flex-col gap-step-1">
          <label htmlFor={emailId} className="type-micro text-slate">
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className="min-h-12 border-b border-ink bg-transparent pb-2 text-[1rem] outline-none focus-visible:border-b-2"
          />
        </p>
      </div>

      <p className="mt-step-3 flex flex-col gap-step-1">
        <label htmlFor={noteId} className="type-micro text-slate">
          What are you building? <span className="opacity-70">(optional)</span>
        </label>
        <textarea
          id={noteId}
          name="note"
          rows={3}
          className="border-b border-ink bg-transparent pb-2 text-[1rem] outline-none focus-visible:border-b-2"
        />
      </p>

      <div className="mt-step-4 flex flex-wrap items-center gap-step-3">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="type-micro min-h-12 border border-ink px-step-2 py-step-1 text-ink hover:bg-ink hover:text-field disabled:opacity-50"
        >
          {status.state === "sending" ? "Sending…" : "[ Request this time ]"}
        </button>

        <p className="type-meta" role="status" aria-live="polite">
          {status.state === "error" ? status.message : ""}
        </p>
      </div>

      <p className="type-meta mt-step-3">
        Sending this asks the studio to hold the time. It is a request, not a
        confirmed booking.
      </p>
    </form>
  );
}
