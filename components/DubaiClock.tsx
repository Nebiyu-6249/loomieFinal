"use client";

import { useSyncExternalStore } from "react";

import { DUBAI_TIME_ZONE } from "@/lib/booking";

/**
 * The studio's local time, live.
 *
 * The server renders a fixed placeholder of the same width, so the line does
 * not reflow when the real time arrives. The interval lives in the store's
 * subscribe function, which means React clears it on unmount for us.
 *
 * Read as an external value rather than mirrored into state — a clock is the
 * textbook case of something React does not own.
 */

const PLACEHOLDER = "--:--:--";

const formatter = () =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: DUBAI_TIME_ZONE,
  });

let snapshot = PLACEHOLDER;

function subscribe(onChange: () => void): () => void {
  const format = formatter();
  snapshot = format.format(new Date());

  const id = window.setInterval(() => {
    const next = format.format(new Date());
    if (next !== snapshot) {
      snapshot = next;
      onChange();
    }
  }, 1000);

  return () => window.clearInterval(id);
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => PLACEHOLDER;

export function DubaiClock() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <span className="tabular-nums">
      <span aria-hidden="true">{time}</span>
      <span className="sr-only">
        {time === PLACEHOLDER
          ? "Loading the current time in Dubai"
          : `${time} in Dubai`}
      </span>
    </span>
  );
}
