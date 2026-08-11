"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Move one of nine.
 *
 * 380ms, and it reveals rather than covers: nothing is painted over the page,
 * the incoming content settles into a position it already holds, and the text
 * is readable from the first frame. Enter only — an exit animation would hold
 * the old page up while the reader waits for the new one.
 *
 * This used to be Motion. A whole animation library shipping on every route
 * for one fade was the worst weight-to-value trade on the site, so it is now
 * a CSS keyframe and the dependency is gone. Keying on the pathname remounts
 * the element, which restarts the animation.
 *
 * Wraps main content only. The header is fixed and stays outside, because a
 * transform on an ancestor would make it a containing block and break the fix.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
