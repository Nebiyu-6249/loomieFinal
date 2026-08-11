"use client";

import gsap from "gsap";

import { useScrollEffect } from "./useScrollEffect";

/**
 * Move six of nine — the drawn line.
 *
 * A single SVG path that draws itself across the middle of the homepage:
 * stroke-dasharray and stroke-dashoffset seeded from getTotalLength(),
 * scrubbed at 0.5. Scrub-driven with no easing, per the Scroll Reveal preset
 * at the scrub tier.
 *
 * No pin. The svg is sticky inside its own container so it survives a resize
 * without the path and the sections drifting apart, and the length is
 * re-measured on resize rather than cached from first paint.
 *
 * Gentle river curves, not one page-long path — a single path spanning the
 * whole document would be impossible to keep aligned to anything.
 */
export function JourneyLine({ className = "" }: { className?: string }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const path = root.querySelector<SVGPathElement>("path");
      if (!path) return;

      const apply = () => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      };

      apply();

      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // A resize changes the rendered length, so the dash pattern is reseeded.
      const observer = new ResizeObserver(() => {
        apply();
        tween.scrollTrigger?.refresh();
      });
      observer.observe(root);

      return () => {
        observer.disconnect();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
  });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
    >
      <svg
        className="sticky top-0 h-svh w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 12 -10 C 30 18, 4 34, 26 52 S 62 66, 46 88 S 58 118, 84 128"
          stroke="var(--color-slate)"
          strokeWidth="0.18"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
