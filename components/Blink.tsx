"use client";

import { usePathname } from "next/navigation";

/**
 * Move twelve of fourteen — the blink. Replaces the page transition.
 *
 * Two Void lids that meet at the middle of the viewport and retract to the
 * top and bottom edges, with a Field hairline at the seam fading as they
 * part. The site opens its eye and you are somewhere else.
 *
 * Where the brief and this differ, and why: the brief asks the aperture to
 * close on the outgoing page and reopen on the incoming one. The App Router
 * gives no "navigation started" signal outside an individual Link, so a close
 * means intercepting every click, animating, and only then routing — which
 * adds its own duration to every navigation and leaves a reader looking at a
 * shut eye if the route is slow. So this is the reopen alone, which is the
 * half the brief weights anyway. It reads as a blink because the lids start
 * closed; what it never does is hold someone up.
 *
 * Lids rather than a clip-path on the content: clipping the main element
 * would put a stacking context and a clip around every pinned section for the
 * life of the page. Two fixed siblings scaling on the compositor touch
 * nothing.
 *
 * Keyed on the pathname so the remount restarts the CSS animation.
 */
export function Blink() {
  const pathname = usePathname();

  return (
    <>
      <span
        key={`${pathname}-top`}
        className="blink-lid blink-lid-top"
        aria-hidden="true"
      />
      <span
        key={`${pathname}-bottom`}
        className="blink-lid blink-lid-bottom"
        aria-hidden="true"
      />
      <span
        key={`${pathname}-seam`}
        className="blink-seam"
        aria-hidden="true"
      />
    </>
  );
}
