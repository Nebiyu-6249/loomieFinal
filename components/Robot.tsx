"use client";

import { useEffect, useRef } from "react";

import { subscribeToPointerFrame } from "./pointerStore";
import {
  Arm,
  Base,
  ChestPanel,
  Eye,
  GroundPool,
  HeadGlow,
  HeadShell,
  NeckRings,
  RobotDefs,
  Torso,
} from "./RobotParts";
import { EYE_CY, PUPIL_TRAVEL, ROBOT } from "@/lib/robot";

/**
 * Move thirteen of fourteen — the robot.
 *
 * Three layers at three depths inside one perspective, rather than one flat
 * drawing: the ember field furthest back, the body in the middle, the head
 * nearest the camera. That separation costs nothing standing still and is
 * what makes the hero's camera push read as movement through space rather
 * than as a picture being scaled up.
 *
 * Behaviour, all of it from the same pointer store the mark uses, so however
 * many things on the page are watching the cursor there is still one listener
 * and one frame loop:
 *
 *   Breathe    the torso rises and falls 1.5% over four seconds — CSS, since
 *              nothing needs to know about it
 *   Look       the eyes track; the head follows slower and much less far,
 *              capped at 6°, and arrives after them
 *   Blink      irregular, 120ms, both eyes together
 *   Glance     eight seconds of a still pointer and the eyes drift away and
 *              back over two
 *   Indicators three chest dots on 3.4, 4.1 and 4.8 second cycles, so they
 *              never fall into step
 *
 * Under reduced motion none of it runs and the robot renders assembled, lit
 * and looking straight ahead. It is a picture of a machine rather than a
 * machine that has been switched off.
 */

/** The eyes lead. */
const EYE_LERP = 0.11;
/** The head follows, at less than half the speed, which is what damps it. */
const HEAD_LERP = 0.045;
/** Maximum head rotation on either axis. */
const HEAD_DEGREES = 6;
/** The forward tilt that makes a machine read as attentive rather than blank. */
const HEAD_TILT = 4;
/** Cursor distance at which the gaze reaches full deflection. */
const SATURATION = 460;

const IDLE_AFTER_MS = 8000;
const GLANCE_PERIOD_MS = 6400;

/**
 * Blink timing. Irregular by construction: the gap is redrawn after each
 * blink, so it never settles into a rhythm a reader can predict.
 */
const BLINK_MIN_MS = 2600;
const BLINK_MAX_MS = 7200;
const BLINK_MS = 120;

interface RobotProps {
  className?: string;
  /** Announced where the robot is content rather than decoration. */
  label?: string;
  /** Damps the gaze for the small instance beside the booking form. */
  intensity?: number;
  /**
   * Fills its container instead of holding the figure's aspect, and lets
   * something outside drive the viewBox. The hero's camera push needs both:
   * the drawing has to cover the frame, and the push has to be a viewBox
   * change rather than a CSS scale or it rasterises and smears.
   */
  fill?: boolean;
  /**
   * A point in viewport coordinates to look at instead of the pointer. The
   * booking form aims it at the slot you chose, which is the whole reason the
   * machine is standing there.
   */
  lookAt?: { x: number; y: number } | null;
  /**
   * Increment to make it acknowledge something: the three chest indicators
   * fire in sequence and it blinks once. A counter rather than a boolean, so
   * two acknowledgements in a row both land.
   */
  signal?: number;
}

export function Robot({
  className = "",
  label,
  intensity = 1,
  fill = false,
  lookAt = null,
  signal = 0,
}: RobotProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<SVGGElement>(null);
  const rightEyeRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);

  // Read inside the frame loop, so a new target does not restart it.
  const lookAtRef = useRef(lookAt);
  const blinkNowRef = useRef(false);

  useEffect(() => {
    lookAtRef.current = lookAt;
  }, [lookAt]);

  /*
    Acknowledgement. The indicator sequence is a CSS class the element carries
    for the length of the animation; the blink is a flag the frame loop picks
    up, so it goes through the same path as an ordinary blink instead of
    fighting it for control of the same elements.
  */
  useEffect(() => {
    if (signal === 0) return;
    const root = rootRef.current;
    if (!root) return;

    blinkNowRef.current = true;
    root.classList.remove("robot-acknowledge");
    // Reading offsetWidth restarts the animation; without it a second signal
    // inside the animation's own duration does nothing at all.
    void root.offsetWidth;
    root.classList.add("robot-acknowledge");

    const id = window.setTimeout(
      () => root.classList.remove("robot-acknowledge"),
      1400,
    );
    return () => window.clearTimeout(id);
  }, [signal]);

  useEffect(() => {
    const root = rootRef.current;
    const head = headRef.current;
    const eyes = [leftEyeRef.current, rightEyeRef.current];
    const pupils = [leftPupilRef.current, rightPupilRef.current];
    if (!root || !head || eyes.some((e) => !e) || pupils.some((p) => !p)) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let unsubscribe: (() => void) | null = null;

    const start = () => {
      const gaze = { x: 0, y: 0 };
      const headAngle = { x: 0, y: 0 };
      let blinkAt = performance.now() + BLINK_MIN_MS;
      let blinkUntil = 0;
      let closed = false;

      return subscribeToPointerFrame((time, pointer) => {
        let targetX = 0;
        let targetY = 0;

        const aim = lookAtRef.current;
        const tracking = pointer.seen && pointer.fine;
        const idleFor = tracking ? pointer.idleFor : 0;

        if (aim) {
          // An explicit target wins over both the pointer and the glance.
          const rect = root.getBoundingClientRect();
          const originX = rect.left + rect.width * (ROBOT.cx / ROBOT.viewWidth);
          const originY = rect.top + rect.height * (EYE_CY / ROBOT.viewHeight);
          const dx = aim.x - originX;
          const dy = aim.y - originY;
          const distance = Math.hypot(dx, dy);

          if (distance > 0.001) {
            const strength = Math.min(distance / SATURATION, 1) * intensity;
            targetX = (dx / distance) * strength;
            targetY = (dy / distance) * strength;
          }
        } else if (tracking && idleFor > IDLE_AFTER_MS) {
          /*
            Glance: the eyes drift away and back over about two seconds, on a
            cycle rather than once, so a reader who leaves the page open sees
            a machine waiting rather than a machine that stopped.
          */
          const phase =
            ((idleFor - IDLE_AFTER_MS) % GLANCE_PERIOD_MS) / GLANCE_PERIOD_MS;
          const away = Math.sin(Math.min(phase, 0.32) / 0.32 * Math.PI) ** 2;
          targetX = away * 0.85;
          targetY = away * -0.28;
        } else if (tracking) {
          // Measured from the head, not the figure: the eyes are what aim.
          const rect = root.getBoundingClientRect();
          const originX = rect.left + rect.width * (ROBOT.cx / ROBOT.viewWidth);
          const originY = rect.top + rect.height * (EYE_CY / ROBOT.viewHeight);
          const dx = pointer.x - originX;
          const dy = pointer.y - originY;
          const distance = Math.hypot(dx, dy);

          if (distance > 0.001) {
            const strength = Math.min(distance / SATURATION, 1) * intensity;
            targetX = (dx / distance) * strength;
            targetY = (dy / distance) * strength;
          }
        }

        gaze.x += (targetX - gaze.x) * EYE_LERP;
        gaze.y += (targetY - gaze.y) * EYE_LERP;

        const shift = `translate(${(gaze.x * PUPIL_TRAVEL).toFixed(2)} ${(
          gaze.y * PUPIL_TRAVEL
        ).toFixed(2)})`;
        pupils.forEach((pupil) => pupil?.setAttribute("transform", shift));

        // The head is chasing the eyes' target on a slower spring, which is
        // what makes it arrive after them rather than with them.
        headAngle.x += (targetY - headAngle.x) * HEAD_LERP;
        headAngle.y += (targetX - headAngle.y) * HEAD_LERP;
        head.style.transform =
          `translateZ(46px) rotateX(${(HEAD_TILT - headAngle.x * HEAD_DEGREES).toFixed(2)}deg)` +
          ` rotateY(${(headAngle.y * HEAD_DEGREES).toFixed(2)}deg)`;

        if (blinkNowRef.current && !closed) {
          blinkNowRef.current = false;
          blinkAt = time;
        }

        if (time >= blinkAt && !closed) {
          closed = true;
          blinkUntil = time + BLINK_MS;
          eyes.forEach((eye) => {
            if (eye) eye.style.transform = "scaleY(0.06)";
          });
        } else if (closed && time >= blinkUntil) {
          closed = false;
          // A fresh gap every time, so the rhythm never becomes a metronome.
          blinkAt =
            time + BLINK_MIN_MS + Math.random() * (BLINK_MAX_MS - BLINK_MIN_MS);
          eyes.forEach((eye) => {
            if (eye) eye.style.transform = "scaleY(1)";
          });
        }
      });
    };

    const sync = () => {
      unsubscribe?.();
      unsubscribe = null;

      if (motion.matches) {
        unsubscribe = start();
        return;
      }

      // Reduced motion: put everything back where it renders and leave it.
      head.style.transform = `translateZ(46px) rotateX(${HEAD_TILT}deg)`;
      pupils.forEach((pupil) => pupil?.setAttribute("transform", "translate(0 0)"));
      eyes.forEach((eye) => {
        if (eye) eye.style.transform = "scaleY(1)";
      });
    };

    sync();
    motion.addEventListener("change", sync);

    return () => {
      motion.removeEventListener("change", sync);
      unsubscribe?.();
    };
  }, [intensity]);

  const view = `0 0 ${ROBOT.viewWidth} ${ROBOT.viewHeight}`;

  return (
    <div
      ref={rootRef}
      className={`robot ${fill ? "robot-fill" : ""} ${className}`}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": "true" as const })}
    >
      {/*
        Furthest back: the field the machine is standing in. It also carries
        the only defs block — url(#id) resolves across the whole document, so
        one copy serves all three layers and three copies would be three sets
        of duplicate ids.
      */}
      <svg data-robot-view="" viewBox={view} className="robot-layer robot-field" aria-hidden="true">
        <RobotDefs />
        <HeadGlow />
        <GroundPool />
      </svg>

      {/* The body, at the stage's own depth. */}
      <svg data-robot-view="" viewBox={view} className="robot-layer robot-body" aria-hidden="true">
        <Arm side="left" />
        <Arm side="right" />
        <Base />
        <g className="robot-breathe">
          <Torso />
          <ChestPanel />
        </g>
        <NeckRings />
      </svg>

      {/* Nearest the camera, and the only layer that turns. */}
      <div ref={headRef} className="robot-layer robot-head">
        <svg data-robot-view="" viewBox={view} className="h-full w-full" aria-hidden="true">
          <HeadShell />
          <Eye side="left" eyeRef={leftEyeRef} pupilRef={leftPupilRef} />
          <Eye side="right" eyeRef={rightEyeRef} pupilRef={rightPupilRef} />
        </svg>
      </div>
    </div>
  );
}
