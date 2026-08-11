"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MOTION, prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one text reveal treatment, used everywhere.
 *
 * Each block carries a hairline above it whose width is set by its position in
 * the page's sequence: the first block's rule is short, the last one's runs the
 * full column. Read a page top to bottom and the measure widens — the river
 * reaching its delta, stated structurally rather than drawn.
 *
 * On entry the rule scales out from its left edge and the text rises eight
 * pixels. Both are transforms, so nothing reflows and the text never re-wraps
 * mid-animation.
 *
 * The last rule of a sequence is Ink rather than Drift, so the arrival at
 * full width is something you see rather than something you infer.
 *
 * The hidden state is only ever applied by script, after the reduced-motion
 * check has passed — so reduced motion, a GSAP failure and no JavaScript at
 * all each leave the block in its final, readable state rather than blank.
 */

const MIN_RULE = 22;
const MAX_RULE = 100;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Web fonts land after the first measurement and move everything down the
 * page, which leaves every trigger position stale — and a block whose trigger
 * has been pushed below its start never reveals. One refresh once the fonts
 * have settled, for the whole document.
 */
let refreshScheduled = false;

function refreshOnFontsReady() {
  if (refreshScheduled) return;
  refreshScheduled = true;

  document.fonts?.ready
    .then(() => ScrollTrigger.refresh())
    .catch(() => undefined);
}

interface RevealProps {
  children: ReactNode;
  /** Zero-based position in the page's sequence of blocks. */
  step?: number;
  /** How many blocks the sequence holds. */
  steps?: number;
  className?: string;
  /** Suppress the hairline where a rule would be noise. */
  rule?: boolean;
}

export function Reveal({
  children,
  step = 0,
  steps = 1,
  className = "",
  rule = true,
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const widthPercent =
    steps <= 1
      ? MAX_RULE
      : MIN_RULE + ((MAX_RULE - MIN_RULE) * step) / (steps - 1);

  const isFinal = steps <= 1 || step === steps - 1;

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    refreshOnFontsReady();

    const ruleEl = root.querySelector<HTMLElement>("[data-reveal-rule]");
    const contentEl = root.querySelector<HTMLElement>("[data-reveal-content]");

    const context = gsap.context(() => {
      if (ruleEl) gsap.set(ruleEl, { scaleX: 0 });
      if (contentEl) gsap.set(contentEl, { opacity: 0, y: 8 });

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 88%", once: true },
      });

      if (ruleEl) {
        timeline.to(
          ruleEl,
          {
            scaleX: 1,
            duration: MOTION.revealMs / 1000,
            ease: MOTION.gsapEase,
          },
          0,
        );
      }

      if (contentEl) {
        timeline.to(
          contentEl,
          {
            opacity: 1,
            y: 0,
            duration: MOTION.revealMs / 1000,
            ease: MOTION.gsapEase,
          },
          0.06,
        );
      }
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {rule ? (
        <span
          aria-hidden="true"
          className={`mb-step-2 block h-px origin-left ${
            isFinal ? "bg-field" : "bg-haze"
          }`}
          data-reveal-rule=""
          style={{ width: `${widthPercent}%` }}
        />
      ) : null}
      <span className="block" data-reveal-content="">
        {children}
      </span>
    </div>
  );
}
