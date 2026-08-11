/**
 * Proposed call times.
 *
 * Dubai is UTC+4 and observes no daylight saving, so a wall-clock time in the
 * studio's day converts to an instant with plain arithmetic and stays correct
 * all year. Slots are built on the server per request, which keeps the dates
 * real, keeps the markup identical on both sides of hydration, and means the
 * list is still there for a reader without JavaScript.
 */

export const DUBAI_TIME_ZONE = "Asia/Dubai";
export const DUBAI_UTC_OFFSET_HOURS = 4;

/** Studio hours, in Dubai wall-clock time. */
const SLOT_HOURS = [10, 13, 16] as const;
const DAYS_OFFERED = 3;

export interface ProposedSlot {
  /** The instant, as an ISO string. The only thing the client is trusted with. */
  iso: string;
  /**
   * Dubai's side of the label, formatted once on the server and passed down.
   *
   * Node and the browser ship different ICU builds, and they disagree about
   * small things — most reliably the space before "am"/"pm", which is a narrow
   * no-break space in newer data and an ordinary one in older. Formatting the
   * same instant on both sides of hydration is therefore a mismatch waiting to
   * happen, so it is only ever done here.
   */
  dubaiTime: string;
  dubaiDay: string;
}

/** Saturday and Sunday are the UAE weekend. */
function isWeekend(year: number, month: number, day: number): boolean {
  const weekday = new Date(Date.UTC(year, month, day)).getUTCDay();
  return weekday === 6 || weekday === 0;
}

/**
 * The next few working days in Dubai, from tomorrow, at the studio's hours.
 */
export function proposedSlots(now: Date = new Date()): ProposedSlot[] {
  // Move into Dubai's calendar day before stepping forward.
  const dubaiNow = new Date(
    now.getTime() + DUBAI_UTC_OFFSET_HOURS * 60 * 60 * 1000,
  );

  const slots: ProposedSlot[] = [];
  let cursor = 1;
  let daysAdded = 0;

  while (daysAdded < DAYS_OFFERED && cursor < 14) {
    const day = new Date(
      Date.UTC(
        dubaiNow.getUTCFullYear(),
        dubaiNow.getUTCMonth(),
        dubaiNow.getUTCDate() + cursor,
      ),
    );

    const year = day.getUTCFullYear();
    const month = day.getUTCMonth();
    const date = day.getUTCDate();

    if (!isWeekend(year, month, date)) {
      for (const hour of SLOT_HOURS) {
        const iso = new Date(
          Date.UTC(year, month, date, hour - DUBAI_UTC_OFFSET_HOURS),
        ).toISOString();

        slots.push({
          iso,
          dubaiTime: formatTime(iso, DUBAI_TIME_ZONE),
          dubaiDay: formatDay(iso, DUBAI_TIME_ZONE),
        });
      }
      daysAdded += 1;
    }

    cursor += 1;
  }

  return slots;
}

export function formatTime(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(new Date(iso));
}

export function formatDay(iso: string, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone,
  }).format(new Date(iso));
}

/**
 * Guards the route handler against an instant that is not one we offered.
 *
 * A request can legitimately arrive just after the offered window rolls
 * forward, so yesterday's list is accepted too rather than rejecting someone
 * who filled the form in slowly.
 */
export function isOfferedSlot(iso: string, now: Date = new Date()): boolean {
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return [...proposedSlots(now), ...proposedSlots(yesterday)].some(
    (slot) => slot.iso === iso,
  );
}
