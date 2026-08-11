import Image from "next/image";

import {
  CLEAR_SPACE,
  MARK,
  MARK_ASPECT,
  PUPIL_INSET,
} from "@/lib/mark";

/**
 * The image slot.
 *
 * There is no photography yet and no date for it, so a plate is not a
 * placeholder waiting to be rescued — it is a finished composition drawn from
 * the mark's own construction geometry in Drift, of the kind a brand manual
 * would print on a specimen page. Five compositions, chosen deterministically
 * from the seed so the server and the client always agree, and so a given
 * project keeps the same plate for good.
 *
 * Real photography is an upgrade, and the swap is one line:
 *
 *   <Plate seed="identity-slot-01" ratio="4/5" />
 *   <Plate seed="identity-slot-01" ratio="4/5" src="/work/roastery.jpg" alt="…" />
 */

type Ratio = "1/1" | "4/5" | "3/2" | "16/9";

const FRAMES: Record<Ratio, { w: number; h: number }> = {
  "1/1": { w: 500, h: 500 },
  "4/5": { w: 400, h: 500 },
  "3/2": { w: 600, h: 400 },
  "16/9": { w: 640, h: 360 },
};

interface PlateProps {
  /** Stable identifier — the composition is derived from it. */
  seed: string;
  ratio?: Ratio;
  className?: string;
  /** Supply to replace the composition with real photography. */
  src?: string;
  alt?: string;
  /** At most one per page. */
  priority?: boolean;
  sizes?: string;
}

/** FNV-1a. Small, stable, and identical on both sides of the render. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface CapsuleProps {
  x: number;
  y: number;
  width: number;
  fill: string;
  apertureFill: string;
  opacity?: number;
}

/**
 * One instance of the silhouette, apertures included, at any size. Every
 * measurement comes off the construction constants rather than being drawn
 * by eye.
 */
function Capsule({
  x,
  y,
  width,
  fill,
  apertureFill,
  opacity = 1,
}: CapsuleProps) {
  const unit = width / MARK.gridWidth;
  const height = width / MARK_ASPECT;
  const r = MARK.pupilRadius * unit;
  const inset = PUPIL_INSET * unit;
  const cy = y + height / 2;

  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={width} height={height} rx={height / 2} fill={fill} />
      <circle cx={x + inset} cy={cy} r={r} fill={apertureFill} />
      <circle cx={x + width - inset} cy={cy} r={r} fill={apertureFill} />
    </g>
  );
}

/*
  A plate is a Drift panel with the mark's geometry knocked out of it in
  Field. Two tones, one shape family, and a solid block of tone on the page —
  which is what makes the composition read as a finished plate rather than as
  a faint drawing floating on the ground.
*/
const FIELD = "#f2f3f4";
const DRIFT = "#dde3e6";

function Composition({ variant, w, h }: { variant: number; w: number; h: number }) {
  switch (variant) {
    /* An aperture field, with one silhouette resting across it. */
    case 0: {
      const unit = (w * 0.2) / MARK.gridWidth;
      const r = MARK.pupilRadius * unit;
      const gap = PUPIL_INSET * 2 * unit;
      const cols = Math.ceil(w / gap) + 1;
      const rows = Math.ceil(h / gap) + 1;
      const dots: React.ReactNode[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          dots.push(
            <circle
              key={`${row}-${col}`}
              cx={col * gap + gap / 2}
              cy={row * gap + gap / 2}
              r={r}
              fill={FIELD}
            />,
          );
        }
      }

      const markWidth = w * 0.8;

      return (
        <>
          <g opacity={0.42}>{dots}</g>
          <Capsule
            x={(w - markWidth) / 2}
            y={h / 2 - markWidth / MARK_ASPECT / 2}
            width={markWidth}
            fill={FIELD}
            apertureFill={DRIFT}
          />
        </>
      );
    }

    /* A detail crop: the rounded cap, the field, and one aperture. */
    case 1: {
      const markHeight = h * 0.9;
      const markWidth = markHeight * MARK_ASPECT;

      return (
        <Capsule
          x={w * 0.09}
          y={(h - markHeight) / 2}
          width={markWidth}
          fill={FIELD}
          apertureFill={DRIFT}
        />
      );
    }

    /* A scale chart, sized so the whole run fits the plate exactly. */
    case 2: {
      const steps = [1, 0.72, 0.52, 0.37];
      const gapRatio = (CLEAR_SPACE / MARK.gridWidth) * 1.5;

      // Lay the run out at unit width, then scale it to the frame.
      const unitRun = steps.reduce(
        (total, step, index) =>
          total +
          step / MARK_ASPECT +
          (index < steps.length - 1 ? step * gapRatio : 0),
        0,
      );

      const base = Math.min(w * 0.76, (h * 0.86) / unitRun);
      const left = w * 0.12;
      let cursor = (h - base * unitRun) / 2;

      return (
        <>
          {steps.map((step, index) => {
            const width = base * step;
            const y = cursor;
            cursor += width / MARK_ASPECT + width * gapRatio;

            return (
              <Capsule
                key={step}
                x={left}
                y={y}
                width={width}
                fill={FIELD}
                apertureFill={DRIFT}
                opacity={1 - index * 0.16}
              />
            );
          })}
        </>
      );
    }

    /* The clear-space rule, drawn. */
    case 3: {
      const markWidth = w * 0.58;
      const markHeight = markWidth / MARK_ASPECT;
      const unit = markWidth / MARK.gridWidth;
      const pad = CLEAR_SPACE * unit;
      const x = (w - markWidth) / 2;
      const y = (h - markHeight) / 2;

      return (
        <>
          <rect
            x={x - pad}
            y={y - pad}
            width={markWidth + pad * 2}
            height={markHeight + pad * 2}
            fill="none"
            stroke={FIELD}
            strokeWidth={1.5}
          />
          <rect
            x={x - pad * 2}
            y={y - pad * 2}
            width={markWidth + pad * 4}
            height={markHeight + pad * 4}
            fill="none"
            stroke={FIELD}
            strokeWidth={1.5}
            opacity={0.45}
          />
          <Capsule
            x={x}
            y={y}
            width={markWidth}
            fill={FIELD}
            apertureFill={DRIFT}
          />
        </>
      );
    }

    /* Two silhouettes overlapping — the construction the mark comes from. */
    default: {
      const markWidth = w * 0.74;
      const markHeight = markWidth / MARK_ASPECT;
      const x = (w - markWidth) / 2;
      const y = (h - markHeight) / 2;
      const shiftX = markWidth * 0.14;
      const shiftY = markHeight * 0.34;

      // Held under full strength so the intersection reads as a third tone.
      return (
        <>
          <Capsule
            x={x - shiftX}
            y={y - shiftY}
            width={markWidth}
            fill={FIELD}
            apertureFill={DRIFT}
            opacity={0.58}
          />
          <Capsule
            x={x + shiftX}
            y={y + shiftY}
            width={markWidth}
            fill={FIELD}
            apertureFill={DRIFT}
            opacity={0.58}
          />
        </>
      );
    }
  }
}

export function Plate({
  seed,
  ratio = "4/5",
  className = "",
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 45vw",
}: PlateProps) {
  const frame = FRAMES[ratio];

  if (src) {
    return (
      <div
        className={`relative overflow-hidden bg-drift ${className}`}
        style={{ aspectRatio: ratio.replace("/", " / ") }}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-drift ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      <svg
        viewBox={`0 0 ${frame.w} ${frame.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <Composition
          variant={hash(seed) % 5}
          w={frame.w}
          h={frame.h}
        />
      </svg>
    </div>
  );
}
