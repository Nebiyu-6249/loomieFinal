"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LetterReveal } from "./LetterReveal";
import { subscribeToPointerFrame } from "./pointerStore";
import { useMotionAllowed } from "./useMotionPreference";
import { MEANINGS, SITE } from "@/lib/content";
import {
  APERTURE_CY,
  APERTURE_INSET,
  CAPSULE_RADIUS,
  MARK,
  pupilRadiusFor,
} from "@/lib/mark";

gsap.registerPlugin(ScrollTrigger);

/**
 * Move two of fourteen. The signature scroll moment, homepage only.
 *
 * The mark sits at the right of the hero at enormous scale in Ink — the
 * darkest thing on the page apart from the headline, so the two are in
 * tension. Warmth sits behind it as a glow rather than inside its eyes.
 * Scroll, and the apertures open: the warmth spills out from behind them and
 * floods the screen, and the three meanings arrive inside it.
 *
 * The flood is two circles scaled with transforms — compositor work, no
 * per-frame repaint of a viewport-sized mask. The apertures track the cursor
 * from the same pointer store and the same lerp as LoomieEyes, so this is the
 * eyes' one idle behaviour at a different size, not a sixth move.
 *
 * The pinned structure is applied by script. Server-rendered, with JavaScript
 * off, or under reduced motion, the two layers are ordinary stacked sections
 * and every word is readable.
 */

/** Matches LoomieEyes: five percent of the mark's own width. */
const MAX_OFFSET_RATIO = 0.05;

/** The hero is always large, so the pupil uses the full-size ratio. */
const HERO_PUPIL_R = pupilRadiusFor(Number.MAX_SAFE_INTEGER);
const SATURATION_DISTANCE = 300;
const LERP = 0.12;

interface Geometry {
  /** Pupil centres, in pixels, relative to the sticky viewport. */
  leftX: number;
  rightX: number;
  centreY: number;
  radius: number;
  /** Scale that takes an aperture from its own size to covering the viewport. */
  coverScale: number;
}

export function HeroAperture() {
  const stageRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const leftFloodRef = useRef<HTMLDivElement>(null);
  const rightFloodRef = useRef<HTMLDivElement>(null);
  const veilContentRef = useRef<HTMLDivElement>(null);
  const meaningsRef = useRef<HTMLDivElement>(null);

  const geometryRef = useRef<Geometry | null>(null);
  const progressRef = useRef(0);
  const offsetRef = useRef({ x: 0, y: 0 });

  const motionOn = useMotionAllowed();

  const measure = useCallback(() => {
    const mark = markRef.current;
    const frame = frameRef.current;
    if (!mark || !frame) return;

    const markRect = mark.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    if (markRect.width === 0) return;

    const unit = markRect.width / MARK.gridWidth;
    const radius = MARK.apertureRadius * unit;
    const centreY = markRect.top - frameRect.top + markRect.height / 2;
    const leftX = markRect.left - frameRect.left + APERTURE_INSET * unit;
    const rightX =
      markRect.left - frameRect.left + markRect.width - APERTURE_INSET * unit;

    // The furthest corner from either aperture, so the flood always finishes.
    const corners = [
      [0, 0],
      [frameRect.width, 0],
      [0, frameRect.height],
      [frameRect.width, frameRect.height],
    ];
    const reach = Math.max(
      ...corners.flatMap(([cx, cy]) => [
        Math.hypot(cx - leftX, cy - centreY),
        Math.hypot(cx - rightX, cy - centreY),
      ]),
    );

    geometryRef.current = {
      leftX,
      rightX,
      centreY,
      radius,
      coverScale: (reach / radius) * 1.05,
    };

    for (const [node, x] of [
      [leftFloodRef.current, leftX],
      [rightFloodRef.current, rightX],
    ] as const) {
      if (!node) continue;
      node.style.width = `${radius * 2}px`;
      node.style.height = `${radius * 2}px`;
      node.style.left = `${x - radius}px`;
      node.style.top = `${centreY - radius}px`;
    }
  }, []);

  useLayoutEffect(() => {
    if (!motionOn) return;
    measure();

    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);

    return () => observer.disconnect();
  }, [motionOn, measure]);

  // Scroll drives the flood; the pointer drives where it starts from.
  useEffect(() => {
    if (!motionOn) return;
    const stage = stageRef.current;
    if (!stage) return;

    const root = document.documentElement;

    // The header drops its own ground while the hero owns the viewport.
    const setHero = (open: boolean) => {
      const value = open ? "open" : "closed";
      if (root.dataset.hero !== value) root.dataset.hero = value;
    };

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          setHero(true);
        },
        onEnter: () => setHero(true),
        onEnterBack: () => setHero(true),
        onLeave: () => setHero(false),
        onLeaveBack: () => setHero(false),
      });
    }, stage);

    setHero(window.scrollY < window.innerHeight);

    const unsubscribe = subscribeToPointerFrame((_time, pointer) => {
      const geometry = geometryRef.current;
      const frame = frameRef.current;
      if (!geometry || !frame) return;

      const maxOffset =
        geometry.radius *
        (MAX_OFFSET_RATIO / (MARK.apertureRadius / MARK.gridWidth));

      let targetX = 0;
      let targetY = 0;

      if (pointer.seen && pointer.fine) {
        const rect = frame.getBoundingClientRect();
        const originX = rect.left + (geometry.leftX + geometry.rightX) / 2;
        const originY = rect.top + geometry.centreY;
        const dx = pointer.x - originX;
        const dy = pointer.y - originY;
        const distance = Math.hypot(dx, dy);

        if (distance > 0.001) {
          const strength = Math.min(distance / SATURATION_DISTANCE, 1);
          targetX = (dx / distance) * maxOffset * strength;
          targetY = (dy / distance) * maxOffset * strength;
        }
      }

      offsetRef.current.x += (targetX - offsetRef.current.x) * LERP;
      offsetRef.current.y += (targetY - offsetRef.current.y) * LERP;

      const { x, y } = offsetRef.current;
      const progress = progressRef.current;

      // The apertures hold at rest, then open. Done by the halfway mark, so
      // the meanings have the back half of the stage to sit still and be read.
      const eased = Math.min(Math.max((progress - 0.06) / 0.46, 0), 1) ** 3;
      const scale = 1 + eased * (geometry.coverScale - 1);

      if (pupilsRef.current) {
        pupilsRef.current.setAttribute(
          "transform",
          `translate(${(x / geometry.radius) * MARK.apertureRadius} ${
            (y / geometry.radius) * MARK.apertureRadius
          })`,
        );
      }

      const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      const floodIn = `${Math.min(Math.max((progress - 0.04) / 0.08, 0), 1)}`;

      for (const node of [leftFloodRef.current, rightFloodRef.current]) {
        if (!node) continue;
        node.style.transform = transform;
        node.style.opacity = floodIn;
      }

      // The hero recedes before the meanings arrive, so the two never overlap.
      if (veilContentRef.current) {
        const recede = Math.min(Math.max((progress - 0.18) / 0.22, 0), 1);
        veilContentRef.current.style.opacity = `${1 - recede}`;
      }

      // Arrives once the flood has landed, then holds for the rest of the stage.
      if (meaningsRef.current) {
        const appear = Math.min(Math.max((progress - 0.44) / 0.14, 0), 1);
        meaningsRef.current.style.opacity = `${appear}`;
        meaningsRef.current.style.visibility = appear > 0 ? "visible" : "hidden";
      }
    });

    return () => {
      context.revert();
      unsubscribe();
      delete root.dataset.hero;
    };
  }, [motionOn]);

  return (
    <section
      ref={stageRef}
      data-stage={motionOn ? "motion" : "static"}
      className="hero-stage"
      aria-label="Loomie"
    >
      <div ref={frameRef} className="hero-frame">
        {/* The hero itself. */}
        <div className="hero-layer hero-veil bg-void">
          {/* Warmth behind the mark, not inside it. The sun is behind the snow. */}
          <div className="hero-glow" aria-hidden="true" />

          {/*
            Ink on Field, bleeding off the right and bottom. The darkest thing
            on the page apart from the headline, so the two are in tension
            rather than the mark dissolving into the ground.
          */}
          <svg
            ref={markRef}
            viewBox={`0 0 ${MARK.gridWidth} ${MARK.gridHeight}`}
            className="hero-mark"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              width={MARK.gridWidth}
              height={MARK.gridHeight}
              rx={CAPSULE_RADIUS}
              fill="var(--color-smoke)"
            />

            {/* The white of the eye. Static — an aperture does not wander. */}
            <circle cx={APERTURE_INSET} cy={APERTURE_CY} r={MARK.apertureRadius} fill="var(--color-field)" />
            <circle
              cx={MARK.gridWidth - APERTURE_INSET}
              cy={APERTURE_CY}
              r={MARK.apertureRadius}
              fill="var(--color-field)"
            />

            {/* The pupil. Dark, concentric, and the part that tracks. */}
            <g ref={pupilsRef}>
              <circle
                cx={APERTURE_INSET}
                cy={APERTURE_CY}
                r={HERO_PUPIL_R}
                fill="var(--color-void)"
              />
              <circle
                cx={MARK.gridWidth - APERTURE_INSET}
                cy={APERTURE_CY}
                r={HERO_PUPIL_R}
                fill="var(--color-void)"
              />
            </g>
          </svg>

          {/* Everything the reader reads, so it can recede as one thing. */}
          <div ref={veilContentRef} className="hero-veil-content">
            {/*
              Phone: the headline sits in the upper third and the mark takes
              the lower half. Desktop: the headline is optically centred and
              the mark bleeds off the right.
            */}
            <div className="mx-auto flex h-full max-w-[100rem] flex-col justify-start px-step-2 pb-step-5 pt-step-5 md:justify-center md:px-step-3 md:pt-step-4">
              {/* Held to the left half so the mark can never crowd it. */}
              <div className="md:w-[50%]">
                <LetterReveal
                  as="h1"
                  text="Snow, river, lights."
                  onMount
                  className="type-display block text-[clamp(3rem,8.4vw,8.5rem)]"
                />
                <p className="type-meta mt-step-3 max-w-[42ch]">
                  One pronunciation. Three meanings. One identity.
                </p>
              </div>
            </div>

            <p className="type-micro hero-scroll text-slate">
              <span aria-hidden="true" className="block h-8 w-px bg-smoke" />
              Scroll
            </p>
          </div>
        </div>

        {/* The warmth the apertures let out. */}
        <div className="hero-flood" aria-hidden="true">
          <div ref={leftFloodRef} className="hero-flood-circle" />
          <div ref={rightFloodRef} className="hero-flood-circle" />
        </div>

        {/* What the apertures open onto. */}
        <div ref={meaningsRef} className="hero-layer hero-meanings">
          <div className="mx-auto flex h-full max-w-[100rem] flex-col justify-center px-step-2 py-step-4 md:px-step-3">
            <h2 className="type-micro text-field/70">One name, three languages</h2>

            <dl className="mt-step-3 flex flex-col gap-step-3 md:mt-step-4 md:flex-row md:gap-step-5">
              {MEANINGS.map((meaning) => (
                <div key={meaning.language}>
                  <dt className="type-display text-[clamp(2.5rem,7vw,5.5rem)]">
                    {meaning.word}
                  </dt>
                  <dd className="type-micro mt-step-1 text-field/70">
                    {meaning.language}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="type-body mt-step-4 measure-tight text-field/85">
              {SITE.origin}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
