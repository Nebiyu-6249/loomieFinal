"use client";

import { useId, useRef, useState, useSyncExternalStore } from "react";

import { Robot } from "./Robot";
import { DUBAI_TIME_ZONE, formatTime, type DayColumn } from "@/lib/booking";

/**
 * A booking request, not a calendar.
 *
 * The week is a strip of seven day columns rather than a flat list of times,
 * because a time is only meaningful once you know which day it is on and a
 * list makes you read that off every row. Closed days are shown and labelled
 * rather than omitted — a week with two days missing is not a week — and
 * today is marked, so a reader can find where they are before reading forward.
 *
 * The slots are native radios inside a fieldset, so the whole thing is
 * keyboard-operable by default: arrow keys move between times, tab moves
 * between groups, and there is no custom date picker to get wrong. Calendars
 * are among the most reliably inaccessible widgets on the web and the way to
 * pass that test is not to build one.
 *
 * The robot stands beside it and watches. When a time is chosen it looks at
 * that time and its indicators fire once in sequence; on a successful send it
 * blinks. That is the only feedback on this page that is not text, and it is
 * deliberately never the *only* feedback — every one of those moments also
 * changes a label a screen reader will read.
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

const BUTTON_LABEL: Record<Status["state"], string> = {
  idle: "Request this time",
  sending: "Sending",
  sent: "Requested",
  error: "Request this time",
};

export function BookingForm({ week }: { week: readonly DayColumn[] }) {
  const visitorZone = useSyncExternalStore(
    subscribeNever,
    getTimeZone,
    getServerTimeZone,
  );

  const [selected, setSelected] = useState<string>("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [slotError, setSlotError] = useState(false);
  const [lookAt, setLookAt] = useState<{ x: number; y: number } | null>(null);
  const [signal, setSignal] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const nameId = useId();
  const emailId = useId();
  const noteId = useId();
  const slotErrorId = useId();

  const showsBothZones = visitorZone !== null && visitorZone !== DUBAI_TIME_ZONE;
  const open = week.filter((day) => day.slots.length > 0);
  const nothingOffered = open.length === 0;

  function choose(iso: string, element: HTMLElement) {
    setSelected(iso);
    setSlotError(false);
    setSignal((value) => value + 1);

    // The robot looks at the slot itself, in viewport coordinates, so the
    // gaze lands on the thing that was chosen rather than near it.
    const rect = element.getBoundingClientRect();
    setLookAt({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

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
      setSignal((value) => value + 1);
    } catch {
      setStatus({
        state: "error",
        message:
          "That did not send — the connection failed. Try again, or email the studio directly.",
      });
    }
  }

  /*
    The form replaces itself rather than raising a toast. A toast is a message
    that arrives beside the thing it is about and then leaves; a confirmation
    is the new state of the page, and this is a page whose only job was to
    send one request.
  */
  if (status.state === "sent") {
    const day = week.find((entry) =>
      entry.slots.some((slot) => slot.iso === selected),
    );
    const slot = day?.slots.find((entry) => entry.iso === selected);

    return (
      <div className="booking-confirmed" role="status">
        <div className="booking-confirmed-robot" aria-hidden="true">
          <Robot className="h-full" signal={signal} intensity={0.5} />
        </div>

        <div>
          <h3 className="type-heading text-[clamp(1.5rem,3.4vw,2.25rem)]">
            Request received.
          </h3>
          {slot ? (
            <p className="type-lead mt-step-2">
              {slot.dubaiDay}, {slot.dubaiTime} in Dubai
              {showsBothZones
                ? ` — ${formatTime(slot.iso, visitorZone)} your time`
                : ""}
            </p>
          ) : null}
          <p className="type-body measure mt-step-2 text-slate">
            Nothing is booked yet. The studio will confirm that time by email,
            or propose another if it has gone. If you do not hear back within
            two working days, reply to this request or write to the studio
            directly — the address is at the top of this page.
          </p>
        </div>
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
          className="type-meta mt-step-2 text-field"
          hidden={!slotError}
        >
          Pick one of the times below before sending the request.
        </p>

        <div className="booking-layout mt-step-3">
          {/*
            Beside the strip, small, waiting. It is aria-hidden because
            everything it expresses is also said in text: the selection is a
            checked radio, the acknowledgement is a changed label.
          */}
          <div className="booking-robot" aria-hidden="true">
            <Robot className="h-full" lookAt={lookAt} signal={signal} intensity={0.55} />
          </div>

          {nothingOffered ? (
            <p className="type-body text-slate">
              There are no times left this week. Email the studio and it will
              propose some for next week.
            </p>
          ) : (
            <div ref={stripRef} className="booking-week" data-chosen={selected || undefined}>
              {week.map((day) => (
                <div
                  key={day.key}
                  className="booking-day"
                  data-today={day.isToday || undefined}
                  data-closed={day.closed || undefined}
                >
                  <p className="booking-day-head">
                    <span className="type-micro block text-slate">
                      {day.weekday}
                      {day.isToday ? " · today" : ""}
                    </span>
                    <span className="type-heading mt-1 block text-[1.25rem]">
                      {day.dayNumber} {day.month}
                    </span>
                  </p>

                  {day.closed ? (
                    <p className="type-micro booking-empty">Closed</p>
                  ) : day.slots.length === 0 ? (
                    <p className="type-micro booking-empty">No times left</p>
                  ) : (
                    <ul className="booking-times">
                      {day.slots.map((slot) => {
                        const isSelected = selected === slot.iso;

                        return (
                          <li key={slot.iso}>
                            <label
                              className="booking-slot"
                              data-selected={isSelected || undefined}
                            >
                              <input
                                type="radio"
                                name="slot"
                                value={slot.iso}
                                checked={isSelected}
                                onChange={(event) =>
                                  choose(slot.iso, event.currentTarget.closest("label")!)
                                }
                                className="sr-only"
                              />

                              {/*
                                Three line boxes in every state, so the cell's
                                contents do not move when the visitor's zone
                                becomes known after hydration.
                              */}
                              <span className="type-heading block text-[1.0625rem]">
                                {showsBothZones
                                  ? `${formatTime(slot.iso, visitorZone)}`
                                  : slot.dubaiTime}
                              </span>
                              <span className="type-micro block text-slate">
                                {showsBothZones ? "your time" : "in Dubai"}
                              </span>
                              <span className="type-micro block text-slate">
                                {showsBothZones ? `${slot.dubaiTime} Dubai` : " "}
                              </span>

                              <span className="booking-underline" aria-hidden="true" />
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
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
            className="min-h-12 border-b border-slate bg-transparent pb-2 text-[1rem]"
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
            className="min-h-12 border-b border-slate bg-transparent pb-2 text-[1rem]"
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
          className="border-b border-slate bg-transparent pb-2 text-[1rem]"
        />
      </p>

      <div className="mt-step-4 flex flex-wrap items-center gap-step-3">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="booking-submit type-micro"
          data-state={status.state}
        >
          {BUTTON_LABEL[status.state]}
        </button>

        <p className="type-meta max-w-[34ch]">
          It requests a time. It does not confirm one.
        </p>
      </div>

      <p className="type-meta mt-step-3 text-field" role="alert">
        {status.state === "error" ? status.message : ""}
      </p>
    </form>
  );
}
