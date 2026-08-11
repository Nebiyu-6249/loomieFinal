/**
 * How much taller the drifting element inside an image frame is than the
 * frame itself, so the scroll parallax has ground to travel through.
 *
 * It lives here rather than in components/Frame.tsx because Plate is a server
 * component and Frame is a client one: a plain value exported from a
 * "use client" module and imported by a server component comes back as a
 * client reference, not the number — which silently produced
 * `viewBox="0 0 400 NaN"` and blanked every drawn plate on the site.
 *
 * Three things have to agree on this number: `.frame-drift` in globals.css
 * (height 124%, top -12%), the parallax range in components/Frame.tsx, and
 * any artwork drawn to fill the box, which must be authored at the
 * overscanned height rather than scaled up to cover it.
 */
export const FRAME_OVERSCAN = 1.24;

/** Half the overscan, as the fraction each edge is pulled out by. */
export const FRAME_BLEED = (FRAME_OVERSCAN - 1) / 2;
