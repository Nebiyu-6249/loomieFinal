import Image from "next/image";

import {
  APERTURE_INSET,
  CLEAR_SPACE,
  MARK,
  MARK_ASPECT,
  pupilRadiusFor,
} from "@/lib/mark";

/**
 * The image slot.
 *
 * There is no photography yet and no date for it, so a plate is not a
 * placeholder waiting to be rescued — it is a finished composition drawn from
 * the mark's own construction geometry, of the kind a brand manual would
 * print on a specimen page. Five compositions across three palettes, chosen
 * deterministically from the seed so the server and the client always agree
 * and a project keeps its plate.
 *
 * Every capsule here is the real three-tone construction: Ink shell, Field
 * aperture, Ink pupil. A plate is a specimen of the mark, so drawing it
 * wrongly here would undo the point of the specimen.
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

const VOID = "#0a0b0d";
const SMOKE = "#1c1f23";
const HAZE = "#3a4046";
const FIELD = "#f2f3f4";
const EMBER = "#f0b45a";

interface Palette {
  panel: string;
  capsule: string;
  aperture: string;
  pupil: string;
  /** Annotation rules and the dot field. */
  line: string;
  /** Two Drift weights, so the tonal field is not one flat value. */
  fieldOpacity: number;
}

/**
 * Four grounds, so a grid of plates is not four of the same tone. The third
 * gives the mark ember eyes, which ties the plates to the robot rather than
 * leaving them as an unrelated system of their own.
 */
const PALETTES: Palette[] = [
  { panel: SMOKE, capsule: VOID, aperture: FIELD, pupil: VOID, line: HAZE, fieldOpacity: 0.5 },
  { panel: VOID, capsule: SMOKE, aperture: FIELD, pupil: VOID, line: HAZE, fieldOpacity: 0.7 },
  { panel: SMOKE, capsule: VOID, aperture: EMBER, pupil: VOID, line: HAZE, fieldOpacity: 0.34 },
  { panel: VOID, capsule: SMOKE, aperture: FIELD, pupil: SMOKE, line: HAZE, fieldOpacity: 0.42 },
];

interface PlateProps {
  /** Stable identifier — the composition and palette are derived from it. */
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
  palette: Palette;
  opacity?: number;
}

/** One instance of the mark, at any size, in the correct three tones. */
function Capsule({ x, y, width, palette, opacity = 1 }: CapsuleProps) {
  const unit = width / MARK.gridWidth;
  const height = width / MARK_ASPECT;
  const apertureR = MARK.apertureRadius * unit;
  const pupilR = pupilRadiusFor(width) * unit;
  const inset = APERTURE_INSET * unit;
  const cy = y + height / 2;

  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={height / 2}
        fill={palette.capsule}
      />
      <circle cx={x + inset} cy={cy} r={apertureR} fill={palette.aperture} />
      <circle cx={x + inset} cy={cy} r={pupilR} fill={palette.pupil} />
      <circle
        cx={x + width - inset}
        cy={cy}
        r={apertureR}
        fill={palette.aperture}
      />
      <circle cx={x + width - inset} cy={cy} r={pupilR} fill={palette.pupil} />
    </g>
  );
}

function Composition({
  variant,
  palette,
  w,
  h,
}: {
  variant: number;
  palette: Palette;
  w: number;
  h: number;
}) {
  switch (variant) {
    /* An aperture field, with one mark resting across it. */
    case 0: {
      const unit = (w * 0.2) / MARK.gridWidth;
      const r = MARK.apertureRadius * unit;
      const gap = APERTURE_INSET * 2 * unit;
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
              fill={palette.line}
            />,
          );
        }
      }

      const markWidth = w * 0.8;

      return (
        <>
          <g opacity={palette.fieldOpacity}>{dots}</g>
          <Capsule
            x={(w - markWidth) / 2}
            y={h / 2 - markWidth / MARK_ASPECT / 2}
            width={markWidth}
            palette={palette}
          />
        </>
      );
    }

    /* A detail crop: the rounded cap, the field, and one eye. */
    case 1: {
      const markHeight = h * 0.9;
      const markWidth = markHeight * MARK_ASPECT;

      return (
        <Capsule
          x={w * 0.09}
          y={(h - markHeight) / 2}
          width={markWidth}
          palette={palette}
        />
      );
    }

    /* A scale chart, sized so the whole run fits the plate exactly. */
    case 2: {
      const steps = [1, 0.72, 0.52, 0.37];
      const gapRatio = (CLEAR_SPACE / MARK.gridWidth) * 1.5;

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
                palette={palette}
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
            stroke={palette.line}
            strokeWidth={1.5}
            opacity={0.55}
          />
          <rect
            x={x - pad * 2}
            y={y - pad * 2}
            width={markWidth + pad * 4}
            height={markHeight + pad * 4}
            fill="none"
            stroke={palette.line}
            strokeWidth={1.5}
            opacity={0.25}
          />
          <Capsule x={x} y={y} width={markWidth} palette={palette} />
        </>
      );
    }

    /* Two marks overlapping — the construction the silhouette comes from. */
    default: {
      const markWidth = w * 0.74;
      const markHeight = markWidth / MARK_ASPECT;
      const x = (w - markWidth) / 2;
      const y = (h - markHeight) / 2;
      const shiftX = markWidth * 0.14;
      const shiftY = markHeight * 0.34;

      return (
        <>
          <Capsule
            x={x - shiftX}
            y={y - shiftY}
            width={markWidth}
            palette={palette}
            opacity={0.62}
          />
          <Capsule
            x={x + shiftX}
            y={y + shiftY}
            width={markWidth}
            palette={palette}
            opacity={0.62}
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
        className={`relative overflow-hidden bg-smoke ${className}`}
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

  const key = hash(seed);
  const palette = PALETTES[key % PALETTES.length];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio.replace("/", " / "),
        backgroundColor: palette.panel,
      }}
    >
      <svg
        viewBox={`0 0 ${frame.w} ${frame.h}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <Composition
          variant={Math.floor(key / PALETTES.length) % 5}
          palette={palette}
          w={frame.w}
          h={frame.h}
        />
      </svg>
    </div>
  );
}

/** So a caption can pick a legible colour against whichever panel it drew. */
export function plateIsDark(seed: string): boolean {
  return PALETTES[hash(seed) % PALETTES.length].panel === VOID;
}
