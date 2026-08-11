"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LetterReveal } from "./LetterReveal";
import { Meanings } from "./Meanings";
import { Robot } from "./Robot";
import { useMotionAllowed } from "./useMotionPreference";
import { SITE } from "@/lib/content";
import { EYE_CY, EYE_LEFT_CX, PUPIL_R, ROBOT } from "@/lib/robot";

gsap.registerPlugin(ScrollTrigger);

/**
 * Move two of fourteen — the camera push. Homepage only.
 *
 * The robot stands centre-right at mid-distance with the headline held to the
 * left. Scroll, and the camera pushes toward its face: the head fills the
 * frame, then one eye fills the frame, then the pupil opens and the three
 * meanings are inside it.
 *
 * This replaces a flood of two circles scaling out of a static mark. Same
 * mechanic — an aperture opening onto the next section — but now it is
 * motivated: you are not watching a shape grow, you are moving toward
 * something that is looking back at you.
 *
 * The whole push is one scale on one element, with the transform origin set
 * to the left eye. That is what makes it a camera rather than an animation:
 * everything in frame grows from the same point at the same rate, which is
 * what moving toward a thing actually looks like. A second element carries
 * the eye to the centre of the frame as the push begins, because a camera
 * that pushes in also re-aims.
 *
 * The pinned structure is applied by script. Server-rendered, with JavaScript
 * off, or under reduced motion, the hero and the meanings are two ordinary
 * stacked sections and every word is readable.
 */

/** Fractions of the scroll: push, then hold on the pupil, then the meanings. */
const PUSH_START = 0.04;
const PUSH_END = 0.56;
const HEADLINE_OUT = [0.06, 0.26] as const;
const MEANINGS_IN = [0.58, 0.72] as const;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const between = (value: number, from: number, to: number) =>
  clamp01((value - from) / (to - from));

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Camera {
  /** Where the machine stands at rest, in the drawing's own coordinates. */
  rest: Box;
  /** Inside the pupil. */
  target: Box;
}

export function HeroAperture() {
  const stageRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const veilContentRef = useRef<HTMLDivElement>(null);
  const meaningsRef = useRef<HTMLDivElement>(null);

  const cameraRef = useRef<Camera | null>(null);
  const views = useRef<SVGSVGElement[]>([]);
  const motionOn = useMotionAllowed();

  const measure = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    if (rect.width === 0) return;

    /*
      The SVG fills the frame and preserveAspectRatio is `meet`, so a viewBox
      cut to the frame's own aspect maps one to one and nothing letterboxes.
      Every number below is in the drawing's coordinates.
    */
    const aspect = rect.width / rect.height;

    // At rest: the figure at mid-distance, standing right of centre with the
    // left half of the frame clear for the headline. On a phone there is no
    // left half to keep clear, so it comes back toward the middle.
    const restHeight = ROBOT.viewHeight * (aspect > 1 ? 1.28 : 1.1);
    const restWidth = restHeight * aspect;
    const across = aspect > 1 ? 0.72 : 0.5;

    const rest: Box = {
      x: ROBOT.cx - restWidth * across,
      y: ROBOT.viewHeight / 2 - restHeight / 2,
      w: restWidth,
      h: restHeight,
    };

    // Inside the pupil: a box whose half-diagonal fits within the pupil's
    // radius, so the Void of the pupil covers every corner of the frame.
    const targetHeight = (PUPIL_R * 2) / Math.hypot(aspect, 1) / 1.08;
    const target: Box = {
      x: EYE_LEFT_CX - (targetHeight * aspect) / 2,
      y: EYE_CY - targetHeight / 2,
      w: targetHeight * aspect,
      h: targetHeight,
    };

    cameraRef.current = { rest, target };
  }, []);

  useLayoutEffect(() => {
    if (!motionOn) return;
    measure();

    const observer = new ResizeObserver(measure);
    if (frameRef.current) observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, [motionOn, measure]);

  useEffect(() => {
    if (!motionOn) return;
    const stage = stageRef.current;
    const robot = robotRef.current;
    if (!stage || !robot) return;

    // All three of the robot's layers move together, or they come apart.
    views.current = Array.from(
      robot.querySelectorAll<SVGSVGElement>("[data-robot-view]"),
    );

    const root = document.documentElement;

    // The header drops its own ground while the hero owns the viewport.
    const setHero = (open: boolean) => {
      const value = open ? "open" : "closed";
      if (root.dataset.hero !== value) root.dataset.hero = value;
    };

    const apply = (progress: number) => {
      const camera = cameraRef.current;
      if (!camera) return;

      const { rest, target } = camera;

      /*
        Size and aim run on separate curves, and they have to.

        Apparent size is the inverse of the box's width, so a linear box
        interpolation reads as a violent lunge that then crawls. Interpolating
        geometrically — each frame a constant fraction closer — is what a
        constant approach speed actually looks like, and `t` cubed on top of
        that holds the machine still for a beat before the move begins.

        The aim finishes in the first fifth. Tied to the same curve as the
        size it lagged hopelessly: the eye had filled the frame while still
        sitting in the corner of it. A camera aims, then moves.
      */
      const push = between(progress, PUSH_START, PUSH_END) ** 3;
      const aim = between(progress, PUSH_START, PUSH_START + 0.2) ** 0.7;

      const zoom = (from: number, to: number) => from * (to / from) ** push;
      const w = zoom(rest.w, target.w);
      const h = zoom(rest.h, target.h);

      const cx = rest.x + rest.w / 2 + (target.x + target.w / 2 - rest.x - rest.w / 2) * aim;
      const cy = rest.y + rest.h / 2 + (target.y + target.h / 2 - rest.y - rest.h / 2) * aim;

      const box = `${(cx - w / 2).toFixed(2)} ${(cy - h / 2).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`;
      for (const svg of views.current) svg.setAttribute("viewBox", box);

      // The headline leaves before the head fills the frame, so the two are
      // never fighting for the same space.
      if (veilContentRef.current) {
        veilContentRef.current.style.opacity = `${
          1 - between(progress, HEADLINE_OUT[0], HEADLINE_OUT[1])
        }`;
      }

      if (meaningsRef.current) {
        const appear = between(progress, MEANINGS_IN[0], MEANINGS_IN[1]);
        meaningsRef.current.style.opacity = `${appear}`;
        meaningsRef.current.style.visibility = appear > 0 ? "visible" : "hidden";
      }
    };

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          apply(self.progress);
          setHero(true);
        },
        onEnter: () => setHero(true),
        onEnterBack: () => setHero(true),
        onLeave: () => setHero(false),
        onLeaveBack: () => setHero(false),
      });
    }, stage);

    setHero(window.scrollY < window.innerHeight);
    apply(0);

    return () => {
      context.revert();
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
        <div className="hero-layer hero-veil bg-void">
          <div ref={robotRef} className="hero-robot">
            <Robot fill label="The Loomie robot" />
          </div>

          <div ref={veilContentRef} className="hero-veil-content">
            <div className="mx-auto flex h-full max-w-[100rem] flex-col justify-start px-step-2 pb-step-5 pt-step-5 md:justify-center md:px-step-3 md:pt-step-4">
              {/* Held to the left half so the robot can never crowd it. */}
              <div className="md:w-[46%]">
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

        {/* What the pupil opens onto. */}
        <div ref={meaningsRef} className="hero-layer hero-meanings">
          <Meanings origin={SITE.origin} />
        </div>
      </div>
    </section>
  );
}
