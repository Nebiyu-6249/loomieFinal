import {
  BASE_Y,
  CHEST,
  EYE_CY,
  EYE_LEFT_CX,
  EYE_R,
  EYE_RIGHT_CX,
  HEAD_X,
  HEAD_Y,
  NECK_Y,
  PUPIL_R,
  ROBOT,
  TORSO_Y,
} from "@/lib/robot";

/**
 * The robot's parts, drawn once and shared.
 *
 * The assembled robot and the exploded assembly both import from here, so
 * there is no second copy of the machine that can drift out of step with the
 * first. Each part is positioned in the figure's own coordinate space rather
 * than at its own origin, so an exploded part is the same path translated,
 * not a different drawing.
 *
 * Nothing here is a client component. The parts are inert SVG; only the
 * behaviour that drives them needs to run in the browser.
 *
 * The light rule is one gradient, not per-shape shading. A single source
 * upper-left means every form takes a Haze hairline along its upper-left edge
 * and falls into Void on the lower right, and `#robot-rim` does exactly that
 * as a stroke: opaque Haze at the top-left corner of each shape's bounding
 * box, gone by two thirds of the way across. Applying one consistent rule to
 * every form is what makes flat vector read as a solid object; shading each
 * shape by hand is what makes it read as a collage.
 */

export const ROBOT_GRADIENT_IDS = {
  rim: "robot-rim",
  lit: "robot-lit",
  deep: "robot-deep",
  glow: "robot-glow",
  pool: "robot-pool",
} as const;

/**
 * Two steps of Smoke over Void, as the brief asks. They are two-stop
 * gradients rather than flat fills because a flat fill on a 320px form reads
 * as a sticker; the contrast between stops is deliberately low, and the
 * page's grain sits over the whole thing and dithers what little banding two
 * stops could produce.
 */
export function RobotDefs() {
  return (
    <defs>
      {/*
        The first stop is lifted toward Field. Pure Haze is 1.9:1 on Void and
        only 1.4:1 on the lit fill it has to sit against, so a hairline in
        flat Haze is a rule you can prove is there and cannot see. The stop
        it fades through is Haze proper, and the far side is nothing.
      */}
      <linearGradient id={ROBOT_GRADIENT_IDS.rim} x1="0" y1="0" x2="0.78" y2="1">
        <stop
          offset="0"
          stopColor="color-mix(in oklab, var(--color-haze) 62%, var(--color-field))"
        />
        <stop offset="0.4" stopColor="var(--color-haze)" stopOpacity="0.62" />
        <stop offset="0.86" stopColor="var(--color-haze)" stopOpacity="0" />
      </linearGradient>

      <linearGradient id={ROBOT_GRADIENT_IDS.lit} x1="0" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#24282e" />
        <stop offset="1" stopColor="#14171a" />
      </linearGradient>

      <linearGradient id={ROBOT_GRADIENT_IDS.deep} x1="0" y1="0" x2="0.9" y2="1">
        <stop offset="0" stopColor="#1a1d21" />
        <stop offset="1" stopColor="#0d0f11" />
      </linearGradient>

      <radialGradient id={ROBOT_GRADIENT_IDS.glow}>
        <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.5" />
        <stop offset="0.42" stopColor="var(--color-ember)" stopOpacity="0.16" />
        <stop offset="1" stopColor="var(--color-ember)" stopOpacity="0" />
      </radialGradient>

      <radialGradient id={ROBOT_GRADIENT_IDS.pool}>
        <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.34" />
        <stop offset="1" stopColor="var(--color-ember)" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

const RIM = `url(#${ROBOT_GRADIENT_IDS.rim})`;
const LIT = `url(#${ROBOT_GRADIENT_IDS.lit})`;
const DEEP = `url(#${ROBOT_GRADIENT_IDS.deep})`;

/**
 * The ember behind the head. Not a light on the face — a light bleeding out
 * from behind the whole head and strongest behind the eyes, so the face reads
 * as lit from within rather than painted.
 */
export function HeadGlow() {
  return (
    <ellipse
      cx={ROBOT.cx}
      cy={EYE_CY}
      rx={ROBOT.headWidth * 0.92}
      ry={ROBOT.headHeight * 1.35}
      fill={`url(#${ROBOT_GRADIENT_IDS.glow})`}
    />
  );
}

/** The Loomie capsule, at the mark's own aspect. Its face is Void. */
export function HeadShell() {
  return (
    <rect
      x={HEAD_X}
      y={HEAD_Y}
      width={ROBOT.headWidth}
      height={ROBOT.headHeight}
      rx={ROBOT.headHeight / 2}
      fill="var(--color-void)"
      stroke={RIM}
      strokeWidth="2"
    />
  );
}

interface EyeProps {
  side: "left" | "right";
  /** The blink squashes the whole eye; the pupil keeps its own translation. */
  eyeRef?: React.Ref<SVGGElement>;
  pupilRef?: React.Ref<SVGGElement>;
}

export function Eye({ side, eyeRef, pupilRef }: EyeProps) {
  const cx = side === "left" ? EYE_LEFT_CX : EYE_RIGHT_CX;

  return (
    <g ref={eyeRef} style={{ transformOrigin: `${cx}px ${EYE_CY}px` }}>
      <circle cx={cx} cy={EYE_CY} r={EYE_R} fill="var(--color-field)" />
      <g ref={pupilRef}>
        <circle cx={cx} cy={EYE_CY} r={PUPIL_R} fill="var(--color-void)" />
      </g>
    </g>
  );
}

/**
 * Three stacked rings, each narrower than the one below, separated by Haze
 * hairlines. The only visible mechanical repetition on the machine, and it
 * exists so the head reads as something that can turn.
 */
export function NeckRings() {
  const ringHeight = ROBOT.neckHeight / ROBOT.neckRingWidths.length;

  return (
    <g>
      {ROBOT.neckRingWidths.map((width, index) => {
        // Drawn bottom-up: the widest ring sits lowest.
        const fromBottom = ROBOT.neckRingWidths.length - 1 - index;
        const y = NECK_Y + fromBottom * ringHeight;

        return (
          <rect
            key={width}
            x={ROBOT.cx - width / 2}
            y={y}
            width={width}
            height={ringHeight}
            rx={ringHeight / 2}
            fill={DEEP}
            stroke={RIM}
            strokeWidth="1.6"
          />
        );
      })}
    </g>
  );
}

/** Wider at the shoulders than at the waist, every corner heavily radiused. */
export function Torso() {
  const half = ROBOT.shoulders / 2;
  const halfWaist = ROBOT.waist / 2;
  const top = TORSO_Y;
  const bottom = TORSO_Y + ROBOT.torsoHeight;
  const rt = ROBOT.torsoTopRadius;
  const rb = ROBOT.torsoBottomRadius;

  const d = [
    `M ${ROBOT.cx - half + rt} ${top}`,
    `H ${ROBOT.cx + half - rt}`,
    `A ${rt} ${rt} 0 0 1 ${ROBOT.cx + half} ${top + rt}`,
    `L ${ROBOT.cx + halfWaist} ${bottom - rb}`,
    `A ${rb} ${rb} 0 0 1 ${ROBOT.cx + halfWaist - rb} ${bottom}`,
    `H ${ROBOT.cx - halfWaist + rb}`,
    `A ${rb} ${rb} 0 0 1 ${ROBOT.cx - halfWaist} ${bottom - rb}`,
    `L ${ROBOT.cx - half} ${top + rt}`,
    `A ${rt} ${rt} 0 0 1 ${ROBOT.cx - half + rt} ${top}`,
    "Z",
  ].join(" ");

  return <path d={d} fill={LIT} stroke={RIM} strokeWidth="2" />;
}

/**
 * A recessed slot, left of centre, with three indicators. The pulse is the
 * only thing on the robot that moves without being asked, and it is what
 * makes the machine read as switched on rather than switched off.
 */
export function ChestPanel({ pulse = true }: { pulse?: boolean }) {
  const dotY = CHEST.y + CHEST.height / 2;
  const spacing = CHEST.width / 4;

  return (
    <g>
      <rect
        x={CHEST.x}
        y={CHEST.y}
        width={CHEST.width}
        height={CHEST.height}
        rx={CHEST.height / 2}
        fill="var(--color-void)"
        stroke={RIM}
        strokeWidth="1.6"
      />

      {[0, 1, 2].map((index) => (
        <circle
          key={index}
          cx={CHEST.x + spacing * (index + 1)}
          cy={dotY}
          r={CHEST.dotR}
          fill="var(--color-ember)"
          className={pulse ? `robot-dot robot-dot-${index + 1}` : undefined}
          opacity={pulse ? undefined : 0.55}
        />
      ))}
    </g>
  );
}

/**
 * Three segments to a rounded paddle. Deliberately low detail — an arm here
 * is silhouette, and anything that read as capable of gripping would make the
 * machine a manipulator rather than a companion.
 */
export function Arm({ side }: { side: "left" | "right" }) {
  const cx = side === "left" ? ROBOT.cx - ROBOT.armOffset : ROBOT.cx + ROBOT.armOffset;
  const top = TORSO_Y + ROBOT.torsoHeight * 0.1;

  const segments = [
    { h: ROBOT.torsoHeight * 0.32, w: ROBOT.armWidth },
    { h: ROBOT.torsoHeight * 0.28, w: ROBOT.armWidth - 4 },
    // The paddle. Slightly wider than the forearm above it, and that is the
    // whole of the hand — anything articulated would make this a manipulator.
    { h: ROBOT.torsoHeight * 0.16, w: ROBOT.armWidth + 2 },
  ];

  let y = top;

  return (
    <g>
      {segments.map((segment, index) => {
        const thisY = y;
        y += segment.h + 6;

        return (
          <rect
            key={index}
            x={cx - segment.w / 2}
            y={thisY}
            width={segment.w}
            height={segment.h}
            rx={segment.w / 2}
            fill={index === 2 ? LIT : DEEP}
            stroke={RIM}
            strokeWidth="1.6"
          />
        );
      })}
    </g>
  );
}

/** A plinth, wider at the bottom, with a fully rounded bottom edge. */
export function Base() {
  const halfTop = ROBOT.baseTopWidth / 2;
  const halfBottom = ROBOT.baseBottomWidth / 2;
  const top = BASE_Y;
  const bottom = BASE_Y + ROBOT.baseHeight;
  const r = 64;

  const d = [
    `M ${ROBOT.cx - halfTop} ${top}`,
    `H ${ROBOT.cx + halfTop}`,
    `L ${ROBOT.cx + halfBottom} ${bottom - r}`,
    // One arc across the whole bottom rather than two corner radii: it is
    // what makes the plinth read as rolling rather than standing.
    `Q ${ROBOT.cx + halfBottom} ${bottom} ${ROBOT.cx + halfBottom - r} ${bottom}`,
    `H ${ROBOT.cx - halfBottom + r}`,
    `Q ${ROBOT.cx - halfBottom} ${bottom} ${ROBOT.cx - halfBottom} ${bottom - r}`,
    "Z",
  ].join(" ");

  return <path d={d} fill={LIT} stroke={RIM} strokeWidth="2" />;
}

/** The light on the ground. Without it the machine floats. */
export function GroundPool() {
  return (
    <ellipse
      cx={ROBOT.cx}
      cy={BASE_Y + ROBOT.baseHeight + 14}
      rx={ROBOT.baseBottomWidth * 0.86}
      ry={30}
      fill={`url(#${ROBOT_GRADIENT_IDS.pool})`}
    />
  );
}
