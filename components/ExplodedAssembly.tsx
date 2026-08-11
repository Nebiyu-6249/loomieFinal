"use client";

import gsap from "gsap";

import {
  Arm,
  Base,
  ChestPanel,
  Eye,
  HeadShell,
  NeckRings,
  RobotDefs,
  Torso,
} from "./RobotParts";
import { useScrollEffect } from "./useScrollEffect";
import {
  APERTURE_CY,
  APERTURE_INSET,
  CAPSULE_RADIUS,
  MARK,
  pupilRadiusFor,
} from "@/lib/mark";
import {
  BASE_Y,
  CHEST,
  EYE_CY,
  HEAD_Y,
  NECK_Y,
  ROBOT,
  TORSO_Y,
} from "@/lib/robot";

/**
 * Move three of fourteen — the exploded assembly.
 *
 * The robot comes apart along Z and outward, each piece labelled, and then
 * draws back together and locks. Then the head simplifies into the flat mark.
 *
 * That last move is the point of the whole section. It was six abstract
 * plates labelled CAPSULE, GRID, TYPE and so on — a diagram of nothing in
 * particular, running in parallel to the robot rather than connected to it.
 * Exploding the machine itself and resolving it into the logo demonstrates
 * Connectivity with the site's own centrepiece: one system carrying a single
 * idea from a three-dimensional object down to a wordmark.
 *
 * Every part here is imported from RobotParts, the same module the assembled
 * robot draws from, so there is no second copy of the machine to drift out of
 * step. Each part is drawn in the figure's own coordinates and moved by a
 * transform — an exploded part is the same path translated, not a redrawing.
 *
 * Pinned at +=120% with pinType transform. On a phone there is no pin: the
 * parts stagger into a two-column grid, which is the same information without
 * hijacking a touch scroll.
 */

const PUPIL_R = pupilRadiusFor(Number.MAX_SAFE_INTEGER);

interface Part {
  label: string;
  content: React.ReactNode;
  /** Where it flies to, as a fraction of the stage. */
  x: number;
  y: number;
  /** Depth, so the explosion has front and back rather than being a starburst. */
  z: number;
  /** Where the label sits, in the figure's own coordinates. */
  labelY: number;
}

const PARTS: Part[] = [
  {
    label: "Head capsule",
    x: -0.3,
    y: -0.26,
    z: 260,
    labelY: HEAD_Y + ROBOT.headHeight + 34,
    content: <HeadShell />,
  },
  {
    label: "Apertures",
    x: 0.3,
    y: -0.28,
    z: 190,
    labelY: EYE_CY + ROBOT.headHeight * 0.6,
    content: (
      <>
        <Eye side="left" />
        <Eye side="right" />
      </>
    ),
  },
  {
    label: "Neck rings",
    x: -0.34,
    y: 0.0,
    z: 60,
    labelY: NECK_Y + ROBOT.neckHeight + 30,
    content: <NeckRings />,
  },
  {
    label: "Chassis",
    x: 0.3,
    y: 0.04,
    z: -60,
    labelY: TORSO_Y + ROBOT.torsoHeight + 30,
    content: <Torso />,
  },
  {
    label: "Chest panel",
    x: -0.05,
    y: 0.26,
    z: 120,
    labelY: CHEST.y + CHEST.height + 32,
    content: <ChestPanel pulse={false} />,
  },
  {
    label: "Arms",
    x: 0.32,
    y: 0.28,
    z: -160,
    // Above the chassis label rather than beside it — at the same
    // height the two ran into each other.
    labelY: TORSO_Y - 26,
    content: (
      <>
        <Arm side="left" />
        <Arm side="right" />
      </>
    ),
  },
  {
    label: "Base",
    x: -0.28,
    y: 0.3,
    z: -240,
    labelY: BASE_Y + ROBOT.baseHeight + 34,
    content: <Base />,
  },
];

/** The flat mark the head resolves into, drawn at the head's own position. */
function FlatMark() {
  const width = ROBOT.headWidth;
  const unit = width / MARK.gridWidth;
  const x = ROBOT.cx - width / 2;
  const y = ROBOT.top;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={MARK.gridHeight * unit}
        rx={CAPSULE_RADIUS * unit}
        fill="var(--color-smoke)"
      />
      {[APERTURE_INSET, MARK.gridWidth - APERTURE_INSET].map((inset) => (
        <g key={inset}>
          <circle
            cx={x + inset * unit}
            cy={y + APERTURE_CY * unit}
            r={MARK.apertureRadius * unit}
            fill="var(--color-field)"
          />
          <circle
            cx={x + inset * unit}
            cy={y + APERTURE_CY * unit}
            r={PUPIL_R * unit}
            fill="var(--color-void)"
          />
        </g>
      ))}
    </g>
  );
}

export function ExplodedAssembly() {
  const rootRef = useScrollEffect<HTMLElement>(({ root, onMotion }) => {
    onMotion("(min-width: 48rem)", () => {
      const stage = root.querySelector<HTMLElement>("[data-assembly-stage]");
      const parts = gsap.utils.toArray<HTMLElement>("[data-part]", root);
      const labels = gsap.utils.toArray<HTMLElement>("[data-part-label]", root);
      const flat = root.querySelector<HTMLElement>("[data-flat-mark]");
      const head = root.querySelector<HTMLElement>('[data-part="0"]');
      if (!stage || parts.length === 0) return;

      gsap.set(labels, { opacity: 0 });
      if (flat) gsap.set(flat, { opacity: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          // Pinned with transforms rather than position: fixed, which does not
          // depend on nothing above this ever growing a transform.
          pinType: "transform",
          invalidateOnRefresh: true,
        },
      });

      /*
        Out, hold, back. One timeline rather than two triggers, so the
        reassembly is genuinely the reverse of the explosion and cannot drift
        out of register with it.
      */
      parts.forEach((part, index) => {
        const spec = PARTS[index];
        timeline.fromTo(
          part,
          { x: 0, y: 0, z: 0, rotate: 0 },
          {
            x: () => spec.x * window.innerWidth * 0.42,
            y: () => spec.y * window.innerHeight * 0.3,
            z: spec.z,
            rotate: spec.x * 10,
            ease: "power2.inOut",
            duration: 1,
          },
          0,
        );
      });

      timeline.to(labels, { opacity: 1, ease: "none", stagger: 0.03, duration: 0.3 }, 0.55);
      timeline.to(labels, { opacity: 0, ease: "none", duration: 0.25 }, 1.35);

      parts.forEach((part) => {
        timeline.to(
          part,
          { x: 0, y: 0, z: 0, rotate: 0, ease: "power2.inOut", duration: 1 },
          1.35,
        );
      });

      // The payoff: the machine's head becomes the logo.
      if (flat && head) {
        timeline.to(head, { opacity: 0, duration: 0.3, ease: "none" }, 2.5);
        timeline.to(flat, { opacity: 1, duration: 0.3, ease: "none" }, 2.5);
      }

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    // Phone: no pin, no depth. The parts stagger in as a labelled grid.
    onMotion("(max-width: 47.99rem)", () => {
      const parts = gsap.utils.toArray<HTMLElement>("[data-part-cell]", root);

      const tween = gsap.from(parts, {
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

  const view = `0 0 ${ROBOT.viewWidth} ${ROBOT.viewHeight}`;

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

      <div data-assembly-stage="" className="assembly-stage">
        {/*
          The head's face is Void, and on the assembled robot it is the ember
          behind the head that makes it read at all. Exploded, that glow flies
          away with nothing — so the section carries its own field.
        */}
        <span className="assembly-field" aria-hidden="true" />
        {/*
          Desktop: every part drawn in the figure's own coordinates, stacked as
          full-size SVG layers so a part's exploded position is a transform on
          the layer rather than a different drawing.
        */}
        <div className="assembly-figure">
          {PARTS.map((part, index) => (
            <div key={part.label} data-part={index} className="assembly-part">
              {/*
                The label is drawn inside the SVG, at the part's own
                coordinates. Positioned in the layer instead, it sat at the
                layer's bottom-centre and travelled with the transform but not
                with the part — seven captions bunched at the foot of the
                frame, none of them next to the thing they named.
              */}
              <svg viewBox={view} className="h-full w-full" aria-hidden="true">
                {index === 0 ? <RobotDefs /> : null}
                {part.content}
                <text
                  data-part-label=""
                  className="assembly-label"
                  x={ROBOT.cx}
                  y={part.labelY}
                  textAnchor="middle"
                >
                  {part.label}
                </text>
              </svg>
            </div>
          ))}

          <div data-flat-mark="" className="assembly-part">
            <svg viewBox={view} className="h-full w-full" aria-hidden="true">
              <FlatMark />
            </svg>
          </div>
        </div>

        {/* Phone: the same seven parts as a plain labelled grid. */}
        <ul className="assembly-grid">
          {PARTS.map((part, index) => (
            <li key={part.label} data-part-cell="" className="assembly-cell">
              <svg viewBox={view} className="h-full w-full" aria-hidden="true">
                {index === 0 ? <RobotDefs /> : null}
                {part.content}
              </svg>
              <span className="type-micro assembly-cell-label">{part.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
