/**
 * The motion budget, as numbers.
 *
 * Five moves for the whole site:
 *
 *   1. Page transition          components/PageTransition.tsx
 *   2. Signature scroll moment  components/HeroAperture.tsx   (homepage only)
 *   3. Text reveal              components/Reveal.tsx
 *   4. Hover on cards and links utilities in globals.css + components/Hoverable
 *   5. Idle behaviour of the eyes  components/LoomieEyes.tsx  (+ the hero apertures,
 *      which track from the same pointer store and the same lerp)
 *
 * Anything else is a plain CSS transition between 150ms and 250ms. Adding a
 * sixth move means removing one of these first.
 */

export const MOTION = {
  /** Under 500ms, and the content is readable in its final position throughout. */
  pageMs: 380,
  revealMs: 620,
  hoverMs: 200,
  /** expo.out, as a cubic-bezier for the CSS and Motion sides. */
  ease: [0.16, 1, 0.3, 1] as const,
  gsapEase: "expo.out",
} as const;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
