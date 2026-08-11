/**
 * The motion inventory, and the numbers the moves share.
 *
 * The budget started at five and was raised to nine, then to fourteen. It is
 * still a budget: every entry is named, and a fifteenth means removing one of
 * these first.
 *
 *    1. Letter reveal            components/LetterReveal.tsx
 *    2. Hero aperture            components/HeroAperture.tsx   (homepage only)
 *    3. Exploded assembly        components/ExplodedAssembly.tsx
 *    4. Ticker                   components/Ticker.tsx (+ the phone marquee in CSS)
 *    5. Card stack               components/CardStack.tsx
 *    6. Drawn line               components/JourneyLine.tsx
 *    7. Text reveal              components/Reveal.tsx
 *    8. Hover                    utilities in globals.css
 *    9. Eye idle and gaze        components/LoomieEyes.tsx (+ the hero apertures,
 *       which track from the same pointer store and the same lerp)
 *   10. Living grain             components/Grain.tsx
 *   11. Cursor light             components/CursorLight.tsx
 *   12. Blink                    components/Blink.tsx — replaces the old page
 *       transition, which was move 1 of the original five
 *   13. Robot idle               not built: waiting on the reference images
 *   14. Image reveal             components/Frame.tsx
 *
 * Anything not on this list is a plain CSS transition between 150ms and 250ms.
 *
 * Every one of them is off under `prefers-reduced-motion: reduce`, with two
 * deliberate exceptions: the grain freezes rather than disappearing, because
 * the texture is the ground rather than an animation; and the eyes hold a
 * fixed forward gaze rather than closing.
 */

export const MOTION = {
  /** The blink, end to end. Under 500ms, per the brief. */
  blinkMs: 420,
  revealMs: 620,
  hoverMs: 200,
  /** expo.out, as a cubic-bezier for the CSS side. */
  ease: [0.16, 1, 0.3, 1] as const,
  gsapEase: "expo.out",
} as const;

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
