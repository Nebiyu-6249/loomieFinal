"use client";

import gsap from "gsap";

import { useScrollEffect } from "./useScrollEffect";
import { APERTURE_INSET, CAPSULE_RADIUS, MARK, pupilRadiusFor } from "@/lib/mark";

/**
 * Move four of fourteen — the ticker.
 *
 * One row, nowrap, pinned and scrubbed horizontally. The gaps between phrases
 * are deliberately uneven — between 3rem and 10rem — so it reads like ticker
 * tape rather than a row of evenly spaced panels, and the glyphs sit in the
 * flow as punctuation rather than as separate slides.
 *
 * Scrub-driven with no easing, following the pin preset — but at half a pixel
 * of page scroll per pixel of travel, not the preset's 1:1.
 *
 * On a phone there is no pin: a CSS marquee scrolls it instead, because
 * pinning and then hijacking horizontal scroll on a touch device is a good
 * way to trap someone mid-page.
 */

const PUPIL_R = pupilRadiusFor(Number.MAX_SAFE_INTEGER);

/** Vertical scroll spent per pixel of horizontal travel. */
const SCROLL_RATIO = 0.5;

function Snowflake() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.5em] w-[0.5em] shrink-0" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="3.3" y1="7" x2="20.7" y2="17" />
        <line x1="3.3" y1="17" x2="20.7" y2="7" />
        <path d="M12 6 L9.4 3.6 M12 6 L14.6 3.6 M12 18 L9.4 20.4 M12 18 L14.6 20.4" />
      </g>
    </svg>
  );
}

function ApertureGlyph() {
  return (
    <svg
      viewBox={`0 0 ${MARK.gridWidth} ${MARK.gridHeight}`}
      className="h-[0.38em] w-auto shrink-0"
      aria-hidden="true"
    >
      <rect
        width={MARK.gridWidth}
        height={MARK.gridHeight}
        rx={CAPSULE_RADIUS}
        fill="currentColor"
      />
      <circle cx={APERTURE_INSET} cy={MARK.gridHeight / 2} r={MARK.apertureRadius} fill="var(--color-void)" />
      <circle cx={APERTURE_INSET} cy={MARK.gridHeight / 2} r={PUPIL_R} fill="currentColor" />
      <circle cx={MARK.gridWidth - APERTURE_INSET} cy={MARK.gridHeight / 2} r={MARK.apertureRadius} fill="var(--color-void)" />
      <circle cx={MARK.gridWidth - APERTURE_INSET} cy={MARK.gridHeight / 2} r={PUPIL_R} fill="currentColor" />
    </svg>
  );
}

function RiverCurve() {
  return (
    <svg viewBox="0 0 60 24" className="h-[0.38em] w-[0.95em] shrink-0" aria-hidden="true">
      <path
        d="M2 18 C 12 18, 14 6, 24 6 S 38 18, 48 18 S 56 12, 58 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Uneven by design. Even gaps read as a carousel. */
const PHRASES: { text: string; gap: string; glyph: "snow" | "mark" | "river" }[] = [
  { text: "Loomie began the way snow does", gap: "6rem", glyph: "snow" },
  { text: "quietly", gap: "10rem", glyph: "mark" },
  { text: "without competing for attention", gap: "3rem", glyph: "river" },
  { text: "snow becomes a river under the warmth of the sun", gap: "8rem", glyph: "snow" },
  { text: "and a river reaches everywhere", gap: "4.5rem", glyph: "mark" },
];

function Glyph({ kind }: { kind: "snow" | "mark" | "river" }) {
  if (kind === "snow") return <Snowflake />;
  if (kind === "river") return <RiverCurve />;
  return <ApertureGlyph />;
}

function Run({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      data-run=""
      className="flex shrink-0 items-center"
      {...(ariaHidden ? { "aria-hidden": "true" } : {})}
    >
      {PHRASES.map((phrase) => (
        <span
          key={phrase.text}
          className="flex shrink-0 items-center"
          style={{ paddingRight: phrase.gap }}
        >
          <span className="type-display whitespace-nowrap text-[clamp(2.5rem,6vw,5rem)]">
            {phrase.text}
          </span>
          <span className="ml-[0.4em] text-[clamp(2.5rem,6vw,5rem)] text-slate">
            <Glyph kind={phrase.glyph} />
          </span>
        </span>
      ))}
    </div>
  );
}

export function Ticker() {
  const rootRef = useScrollEffect<HTMLElement>(({ root, onMotion }) => {
    onMotion("(min-width: 48rem)", () => {
      const track = root.querySelector<HTMLElement>("[data-track]");
      const frame = root.querySelector<HTMLElement>("[data-frame]");
      const run = root.querySelector<HTMLElement>("[data-run]");
      if (!track || !frame || !run) return;

      /*
        Measured against the first run, not the whole track. The track holds
        two copies of the phrases so the phone's CSS marquee has no seam, and
        measuring the whole thing made the desktop pin scroll the same five
        phrases twice — 9,400px of the homepage's 18,000, for one sentence
        read two times. The duplicate still earns its place here: it fills the
        right of the frame as the first run leaves, so the travel never ends
        on empty ground.
      */
      const travel = () => Math.max(0, run.scrollWidth - frame.clientWidth);

      const tween = gsap.to(track, {
        // Recomputed on refresh so a resize cannot leave it short or overrun.
        x: () => -travel(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          // Half the travel in scroll distance: the line moves at twice the
          // speed of the page, which reads as a deliberate pass rather than a
          // section the page got stuck in.
          end: () => `+=${travel() * SCROLL_RATIO}`,
          scrub: 1,
          pin: frame,
          anticipatePin: 1,
          // Pinned with transforms rather than position: fixed. The cause
          // is gone — the transition that wrapped main in an animating
          // transform, making it the containing block for fixed descendants
          // and landing this pin thousands of pixels off, is now two fixed
          // lids outside the content tree. The setting stays because it does
          // not depend on nothing above it ever growing a transform again.
          pinType: "transform",
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
  });

  return (
    <section ref={rootRef} aria-labelledby="ticker" className="relative">
      <h2 id="ticker" className="sr-only">
        The studio&rsquo;s story
      </h2>

      <div
        data-frame=""
        className="flex items-center overflow-hidden py-step-4 md:h-svh md:py-0"
      >
        <div data-track="" className="ticker-track flex w-max items-center px-step-2 md:px-step-3">
          <Run />
          {/* A second copy so the marquee on small screens has no seam. */}
          <Run ariaHidden />
        </div>
      </div>
    </section>
  );
}
