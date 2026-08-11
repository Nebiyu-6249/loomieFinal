"use client";

import gsap from "gsap";
import type { ReactNode } from "react";

import { useScrollEffect } from "./useScrollEffect";
import { FRAME_BLEED } from "@/lib/frame";

/**
 * Move fourteen of fourteen — the image reveal.
 *
 * Every image slot on the site enters through this, and none of them fade.
 * A clip-path inset opens from one edge over 900ms on power4.inOut while the
 * picture inside settles from 1.15 to 1.0, and a Haze hairline runs along the
 * opening edge a beat ahead of it — the frame opens, the light arrives, the
 * picture lands.
 *
 * Then it never quite stops: the picture parallaxes 12% of its own height
 * inside the frame, scrubbed, for as long as the frame is on screen. On hover
 * it takes a further 1.04 with the frame holding still, and an Ember glow
 * comes up behind it.
 *
 * The opening edge alternates down each page from the `index` prop rather
 * than being chosen per call site — four slots that all open from the left
 * are a rhythm, and a rhythm is the thing this is meant to avoid.
 *
 * It wraps whatever it is given, so an empty slot's drawn composition and a
 * real photograph enter identically. Nothing about the motion changes when
 * the files land.
 */

/** Parallax travel, as a percentage of the drifting element's own height. */
const DRIFT_PERCENT = FRAME_BLEED * 100;

const EDGES = ["left", "bottom", "right", "top"] as const;
type Edge = (typeof EDGES)[number];

/** Closed inset for each opening edge: the frame is a line on that side. */
const CLOSED: Record<Edge, string> = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
};

const OPEN = "inset(0% 0% 0% 0%)";

/** Which side the hairline runs along, and how it grows. */
const EDGE_LINE: Record<Edge, string> = {
  left: "frame-edge-vertical frame-edge-left",
  right: "frame-edge-vertical frame-edge-right",
  top: "frame-edge-horizontal frame-edge-top",
  bottom: "frame-edge-horizontal frame-edge-bottom",
};

interface FrameProps {
  children: ReactNode;
  /**
   * Position in the page's run of slots. Decides the opening edge, so a page
   * numbers its slots once and never picks an edge by hand.
   */
  index?: number;
  /** Suppress the parallax where a slot is too small for 12% to read. */
  parallax?: boolean;
  className?: string;
  /** The aspect ratio and ground of the slot. This is the box that holds. */
  style?: React.CSSProperties;
}

export function Frame({
  children,
  index = 0,
  parallax = true,
  className = "",
  style,
}: FrameProps) {
  const edge = EDGES[index % EDGES.length];

  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const clip = root.querySelector<HTMLElement>("[data-frame-clip]");
      const picture = root.querySelector<HTMLElement>("[data-frame-drift]");
      const line = root.querySelector<HTMLElement>("[data-frame-edge]");
      if (!clip || !picture) return;

      const context = gsap.context(() => {
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        });

        // The hairline lands first and holds for a moment, so the opening
        // reads as light arriving at an edge rather than a box growing.
        if (line) {
          reveal.fromTo(
            line,
            { scaleX: 0, scaleY: 0, opacity: 1 },
            { scaleX: 1, scaleY: 1, duration: 0.42, ease: "power3.out" },
            0,
          );
          reveal.to(line, { opacity: 0, duration: 0.5, ease: "none" }, 0.62);
        }

        reveal.fromTo(
          clip,
          { clipPath: CLOSED[edge] },
          { clipPath: OPEN, duration: 0.9, ease: "power4.inOut" },
          0.12,
        );

        reveal.fromTo(
          picture,
          { scale: 1.15 },
          { scale: 1, duration: 0.9, ease: "power4.inOut" },
          0.12,
        );

        if (!parallax) return;

        /*
          The parallax owns y and the reveal owns scale, so the two never
          write the same property. It starts from the frame entering the
          viewport rather than from the reveal finishing — by the time the
          slot is centred the drift is already mid-travel, which is what
          keeps it from reading as a second animation.
        */
        gsap.fromTo(
          picture,
          { yPercent: -DRIFT_PERCENT },
          {
            yPercent: DRIFT_PERCENT,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }, root);

      return () => context.revert();
    });
  });

  return (
    <div ref={rootRef} className={`frame ${className}`} style={style}>
      <div data-frame-clip="" className="frame-clip">
        {/*
          12% of parallax travel needs 12% of extra height to travel through,
          or the drift would expose the frame's own ground at one end.

          .frame-drift is the script's; .frame-lift is the stylesheet's. Both
          animate a transform, so they cannot be the same element.
        */}
        <div data-frame-drift="" className="frame-drift">
          <div className="frame-lift">{children}</div>
        </div>
      </div>

      <span
        data-frame-edge=""
        aria-hidden="true"
        className={`frame-edge ${EDGE_LINE[edge]}`}
      />
    </div>
  );
}
