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
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.pageMs / 1000, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}
