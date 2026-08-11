"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MOTION } from "@/lib/motion";

/**
 * Move one of five.
 *
 * 380ms, and it reveals rather than covers: nothing is painted over the page,
 * the incoming content simply settles into a position it already holds. The
 * text is readable from the first frame, so nobody waits on it to start
 * reading. Enter only — an exit animation would hold the old page up while
 * the reader waits for the new one.
 *
 * Wraps main content only. The header is fixed and stays outside, because a
 * transform on an ancestor would make it a containing block and break the fix.
 *
 * The wrapper is rendered in every case. Returning a bare fragment under
 * reduced motion would change the shape of the tree between the server and
 * the client and fail hydration — so the element stays and only the animation
 * is switched off, which is also what "renders in its final visible state"
 * means here.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={pathname}
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: MOTION.pageMs / 1000, ease: MOTION.ease }
      }
    >
      {children}
    </motion.div>
  );
}
