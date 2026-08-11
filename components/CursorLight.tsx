"use client";

import { useEffect, useRef } from "react";

/**
 * Move eleven of fourteen — the cursor light.
 *
 * A large soft Ember radial that follows the pointer at a lag, sitting one
 * layer below the grain. Because the grain blends in overlay, it is close to
 * invisible over the deepest Void and comes up as the ground beneath it
 * lightens — so the light does not just brighten a patch of page, it develops
 * the grain inside its own falloff. That is the effect the reference images
 * are getting, and it only works in this order: light under grain.
 *
 * Screen blend rather than a plain overlay: screen can only lighten, so the
 * light can pass across type without ever muddying it. Over Field text at
 * these opacities the change is under a percent.
 *
 * The element is a fixed-size div moved with translate3d rather than a
 * full-viewport gradient repainted at a new position each frame — the same
 * picture, but composited instead of rasterised sixty times a second.
 *
 * Desktop and a real pointer only. A touch device has no hovering cursor to
 * follow, and a light that jumped to wherever a thumb last landed would be a
 * different, worse effect.
 */

/** Fraction of the remaining distance closed per frame. Lower trails more. */
const LERP = 0.085;
/** Below this the light has arrived; stop scheduling frames. */
const SETTLED_PX = 0.4;

const ACTIVE_QUERY =
  "(min-width: 48rem) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function CursorLight() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;

    const query = window.matchMedia(ACTIVE_QUERY);
    let teardown: (() => void) | undefined;

    const start = () => {
      // Parked at the centre so the first move eases out from the middle of
      // the screen rather than flying in from the top-left origin.
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let targetX = x;
      let targetY = y;
      let frame = 0;

      const place = () => {
        light.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      };
      place();

      const tick = () => {
        x += (targetX - x) * LERP;
        y += (targetY - y) * LERP;
        place();

        if (
          Math.abs(targetX - x) < SETTLED_PX &&
          Math.abs(targetY - y) < SETTLED_PX
        ) {
          frame = 0;
          return;
        }
        frame = requestAnimationFrame(tick);
      };

      const onMove = (event: PointerEvent) => {
        targetX = event.clientX;
        targetY = event.clientY;
        light.dataset.lit = "true";
        if (!frame) frame = requestAnimationFrame(tick);
      };

      // Leaving the window puts the light out rather than stranding it at the
      // edge, which otherwise reads as a permanent hot spot in one corner.
      const onLeave = (event: PointerEvent) => {
        if (event.relatedTarget) return;
        delete light.dataset.lit;
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerout", onLeave);

      return () => {
        if (frame) cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerout", onLeave);
        delete light.dataset.lit;
      };
    };

    const sync = () => {
      teardown?.();
      teardown = query.matches ? start() : undefined;
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return <div ref={lightRef} className="cursor-light" aria-hidden="true" />;
}
