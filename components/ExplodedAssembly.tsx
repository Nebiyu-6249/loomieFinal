"use client";

import gsap from "gsap";

import { useScrollEffect } from "./useScrollEffect";
import {
  APERTURE_CY,
  APERTURE_INSET,
  CAPSULE_RADIUS,
  CLEAR_SPACE,
  MARK,
  pupilRadiusFor,
} from "@/lib/mark";

/**
 * Move three of nine — the exploded assembly.
 *
 * Six plates, stacked as one object, that explode outward on scroll with
 * rotation and scale and then lock into a labelled grid. 2D throughout: CSS
 * transforms only, no WebGL, no perspective.
 *
 * Every plate is drawn from the construction constants, so this is the brand
 * system taking itself apart and putting itself back together rather than six
 * decorative rectangles.
 *
 * Pinned with scrub: 1 and end "+=120%". The preset's 180% held the page for
 * nearly two screens of scroll on an animation that has finished its work in
 * one, which read as the page having stopped rather than the object having
 * been examined. On a phone there is no pin — pinning a viewport-height
 * section on a touch device fights the scroll — so the plates stagger into a
 * two-column grid instead.
 */

const PUPIL_R = pupilRadiusFor(Number.MAX_SAFE_INTEGER);

interface PlateSpec {
  label: string;
  /** Final resting slot in the assembled grid. */
  content: React.ReactNode;
  /** Where it flies to, as a fraction of the container. */
  x: number;
  y: number;
  rotate: number;
}

const PLATES: PlateSpec[] = [
  {
    label: "Capsule",
    x: -0.34,
    y: -0.22,
    rotate: -9,
    content: (
      <svg viewBox="0 0 70 36" className="h-full w-full p-3" aria-hidden="true">
        <rect
          width={MARK.gridWidth}
          height={MARK.gridHeight}
          rx={CAPSULE_RADIUS}
          fill="none"
          stroke="var(--color-field)"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    label: "Aperture",
    x: 0.34,
    y: -0.26,
    rotate: 7,
    content: (
      <svg viewBox="0 0 70 36" className="h-full w-full p-3" aria-hidden="true">
        <circle
          cx={APERTURE_INSET}
          cy={APERTURE_CY}
          r={MARK.apertureRadius}
          fill="var(--color-field)"
        />
        <circle
          cx={MARK.gridWidth - APERTURE_INSET}
          cy={APERTURE_CY}
          r={MARK.apertureRadius}
          fill="none"
          stroke="var(--color-field)"
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    label: "Pupil",
    x: -0.38,
    y: 0.2,
    rotate: 6,
    content: (
      <svg viewBox="0 0 70 36" className="h-full w-full p-3" aria-hidden="true">
        <circle
          cx={MARK.gridWidth / 2}
          cy={APERTURE_CY}
          r={MARK.apertureRadius}
          fill="var(--color-haze)"
        />
        <circle
          cx={MARK.gridWidth / 2}
          cy={APERTURE_CY}
          r={PUPIL_R}
          fill="var(--color-field)"
        />
      </svg>
    ),
  },
  {
    label: "Colour",
    x: 0.38,
    y: 0.18,
    rotate: -6,
    content: (
      // Stops short of the bottom edge so the caption has clear ground.
      <div className="flex h-[calc(100%-1.6rem)] w-full">
        {["#0a0b0d", "#3a4046", "#8a949b", "#f0b45a"].map((fill) => (
          <span key={fill} className="h-full flex-1" style={{ backgroundColor: fill }} />
        ))}
      </div>
    ),
  },
  {
    label: "Type",
    x: -0.06,
    y: 0.34,
    rotate: 3,
    content: (
      <div className="flex h-full w-full flex-col justify-center gap-1 p-3">
        <span className="type-display text-[2rem] leading-none">Aa</span>
        <span className="type-heading text-[0.9rem]">Aa</span>
        <span className="type-micro">Aa</span>
      </div>
    ),
  },
  {
    label: "Grid",
    x: 0.08,
    y: -0.36,
    rotate: -4,
    content: (
      <svg viewBox="0 0 70 36" className="h-full w-full p-3" aria-hidden="true">
        <rect
          x={-CLEAR_SPACE / 2}
          y={-CLEAR_SPACE / 2}
          width={MARK.gridWidth + CLEAR_SPACE}
          height={MARK.gridHeight + CLEAR_SPACE}
          fill="none"
          stroke="var(--color-slate)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        <line x1={APERTURE_INSET} y1="0" x2={APERTURE_INSET} y2="36" stroke="var(--color-slate)" strokeWidth="0.6" />
        <line x1={MARK.gridWidth - APERTURE_INSET} y1="0" x2={MARK.gridWidth - APERTURE_INSET} y2="36" stroke="var(--color-slate)" strokeWidth="0.6" />
        <line x1="0" y1={APERTURE_CY} x2="70" y2={APERTURE_CY} stroke="var(--color-slate)" strokeWidth="0.6" />
      </svg>
    ),
  },
];

export function ExplodedAssembly() {
  const rootRef = useScrollEffect<HTMLElement>(({ root, onMotion }) => {
    // Desktop: pinned, stacked, exploding outward and locking into a grid.
    onMotion("(min-width: 48rem)", () => {
      const stage = root.querySelector<HTMLElement>("[data-assembly-stage]");
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", root);
      const labels = gsap.utils.toArray<HTMLElement>("[data-plate-label]", root);
      if (!stage || plates.length === 0) return;

      gsap.set(labels, { opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          // Pinned with transforms rather than position: fixed. The page
          // transition wrapper animates a transform, which makes it the
          // containing block for fixed descendants while it runs — a pin
          // measured during that lands thousands of pixels off. Transform
          // pinning is immune to it.
          pinType: "transform",
          invalidateOnRefresh: true,
        },
      });

      plates.forEach((plate, index) => {
        const spec = PLATES[index];

        timeline.fromTo(
          plate,
          // xPercent/yPercent do the centring, so x and y are free for the
          // timeline to own and the plate is centred whatever the pinned
          // container measures.
          { xPercent: -50, yPercent: -50, x: 0, y: 0, rotate: 0, scale: 0.78 },
          {
            // Resolved on refresh, against the viewport rather than the pin
            // spacer — the spacer is taller than the screen by the scroll
            // distance, so measuring it scatters the plates off-screen.
            x: () => spec.x * window.innerWidth * 0.6,
            y: () => spec.y * window.innerHeight * 0.62,
            xPercent: -50,
            yPercent: -50,
            rotate: spec.rotate,
            scale: 1,
            ease: "none",
          },
          0,
        );
      });

      // Then it squares up: rotation out, and the labels arrive.
      timeline.to(plates, { rotate: 0, ease: "none", stagger: 0.02 }, ">-0.2");
      timeline.to(labels, { opacity: 1, ease: "none", stagger: 0.03 }, "<");

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    // Phone: no pin. Pinning a full-height section on a touch device fights
    // the scroll, so the plates simply stagger into the two-column grid.
    onMotion("(max-width: 47.99rem)", () => {
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", root);

      const tween = gsap.from(plates, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="system"
      className="relative px-step-2 py-step-5 md:px-step-3"
    >
      <div className="mx-auto max-w-[100rem]">
        <h2 id="system" className="type-micro text-slate">
          One system, taken apart
        </h2>
      </div>

      <div data-assembly-stage="" className="relative md:h-svh">
        <div className="mt-step-4 grid grid-cols-2 gap-step-2 md:absolute md:inset-0 md:mt-0 md:block">
          {PLATES.map((plate) => (
            <figure
              key={plate.label}
              data-plate=""
              className="relative aspect-[4/3] w-full border border-haze bg-void md:absolute md:left-1/2 md:top-1/2 md:h-[clamp(8rem,13vw,11rem)] md:w-[clamp(11rem,17vw,15rem)]"
            >
              {plate.content}
              <figcaption
                data-plate-label=""
                className="type-micro absolute bottom-2 left-3 text-slate"
              >
                {plate.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
