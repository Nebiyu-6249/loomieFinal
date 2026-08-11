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

/**
 * A full week, starting today.
 *
 * The list used to start tomorrow and skip the weekend entirely, which is
 * right for a list and wrong for a strip: a week with two days missing is not
 * a week, and there is no "today" column to mark. Closed days are now shown
 * and labelled rather than omitted, and today appears even when every slot on
 * it has already passed — a reader needs to see where they are in the week
 * before they can read the rest of it.
 */
const DAYS_OFFERED = 7;

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

export interface DayColumn {
  /** Stable key, and what the column is labelled by. */
  key: string;
  weekday: string;
  dayNumber: string;
  month: string;
  isToday: boolean;
  /** The UAE weekend. Shown, so the week is a week, but empty. */
  closed: boolean;
  slots: ProposedSlot[];
}

/** Seven days in Dubai from today, with the studio's hours on each open one. */
export function proposedWeek(now: Date = new Date()): DayColumn[] {
  // Move into Dubai's calendar day before stepping forward.
  const dubaiNow = new Date(
    now.getTime() + DUBAI_UTC_OFFSET_HOURS * 60 * 60 * 1000,
  );

  return Array.from({ length: DAYS_OFFERED }, (_unused, offset) => {
    const day = new Date(
      Date.UTC(
        dubaiNow.getUTCFullYear(),
        dubaiNow.getUTCMonth(),
        dubaiNow.getUTCDate() + offset,
      ),
    );

    const year = day.getUTCFullYear();
    const month = day.getUTCMonth();
    const date = day.getUTCDate();
    const closed = isWeekend(year, month, date);

    const slots = closed
      ? []
      : SLOT_HOURS.map((hour) =>
          new Date(
            Date.UTC(year, month, date, hour - DUBAI_UTC_OFFSET_HOURS),
          ).toISOString(),
        )
          // A time that has already passed is not a time you can ask for.
          .filter((iso) => new Date(iso).getTime() > now.getTime())
          .map((iso) => ({
            iso,
            dubaiTime: formatTime(iso, DUBAI_TIME_ZONE),
            dubaiDay: formatDay(iso, DUBAI_TIME_ZONE),
          }));

    const parts = new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: DUBAI_TIME_ZONE,
    }).formatToParts(day);

    const part = (type: string) =>
      parts.find((entry) => entry.type === type)?.value ?? "";

    return {
      key: `${year}-${month + 1}-${date}`,
      weekday: part("weekday"),
      dayNumber: part("day"),
      month: part("month"),
      isToday: offset === 0,
      closed,
      slots,
    };
  });
}

/** Every offered instant, flattened. */
export function proposedSlots(now: Date = new Date()): ProposedSlot[] {
  return proposedWeek(now).flatMap((day) => day.slots);
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
