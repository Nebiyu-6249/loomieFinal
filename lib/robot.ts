import { MARK, MARK_ASPECT, APERTURE_INSET, pupilRadiusFor } from "./mark";

/**
 * The robot's construction, as numbers.
 *
 * A domestic service machine in the late-seventies idiom: a well-made
 * appliance with a face. Every dimension here derives from either the brief's
 * proportions or from lib/mark.ts, because the head *is* the Loomie capsule —
 * not a shape resembling it, the same geometry at the same aspect with the
 * apertures at the same insets.
 *
 * One deliberate divergence from the brief, and why:
 *
 * The brief gives head width as 34% of total height, and vertical shares of
 * 8% neck, 38% torso, 20% base. Those cannot all hold at once. The capsule's
 * aspect fixes head height at width / 1.944, so a 34% width means a 17.5%
 * height, and the four parts then sum to 83% of the figure rather than 100%.
 * Solving for a fixed point drives the figure to zero.
 *
 * So the four vertical shares are taken as shares of the drawn run and
 * normalised to tile it, which preserves every stated relationship between
 * the parts. Head width then lands at 41% of the figure rather than 34% —
 * wider than asked, but in the direction the brief argues for twice over:
 * the face should dominate, and the head should be the widest element after
 * the shoulders. It still is.
 */

/** Vertical shares, normalised from the brief's 0.175 / 0.08 / 0.38 / 0.20. */
const SHARE = { head: 0.2094, neck: 0.0958, torso: 0.4552, base: 0.2396 };

/** The drawn figure, head-top to base-bottom. */
const RUN = 700;

const headHeight = Math.round(RUN * SHARE.head);
const headWidth = Math.round(headHeight * MARK_ASPECT);
const neckHeight = Math.round(RUN * SHARE.neck);
const torsoHeight = Math.round(RUN * SHARE.torso);
const baseHeight = RUN - headHeight - neckHeight - torsoHeight;

/** 2.2 : 1, taller than wide. The shoulders are the widest element. */
const shoulders = Math.round(RUN / 2.2);

export const ROBOT = {
  /** Room either side of the shoulders for the ember field to fall off in. */
  viewWidth: 460,
  viewHeight: 900,
  cx: 230,
  top: 60,

  headWidth,
  headHeight,
  neckHeight,
  torsoHeight,
  baseHeight,

  shoulders,
  /** Narrower than the shoulders, which is what gives the body a stance. */
  waist: Math.round(shoulders * 0.81),

  /*
    "Every corner radiused at half the local edge" is the capsule's own rule,
    and applying it literally to a 318-wide torso gives a 159 radius — a
    second capsule, with the body and the head no longer distinguishable.
    These are large enough that no corner reads as square and the family is
    obvious, and small enough that the torso stays a torso.
  */
  torsoTopRadius: 58,
  torsoBottomRadius: 46,

  /** Three rings, each narrower than the one below it. */
  neckRingWidths: [118, 104, 92] as const,

  /*
    Far enough out that the arms clear the torso's waist and read as hanging
    at the sides. At 132 they sat inside the body's own silhouette and the
    torso, drawn over them, reduced each one to a bump.
  */
  armWidth: 40,
  armOffset: 152,

  baseTopWidth: 210,
  baseBottomWidth: 290,
} as const;

export const HEAD_X = ROBOT.cx - headWidth / 2;
export const HEAD_Y = ROBOT.top;
export const NECK_Y = HEAD_Y + headHeight;
export const TORSO_Y = NECK_Y + neckHeight;
export const BASE_Y = TORSO_Y + torsoHeight;
export const FIGURE_BOTTOM = BASE_Y + baseHeight;

/** The capsule's own unit, so the apertures land exactly where the mark puts them. */
const UNIT = headWidth / MARK.gridWidth;

export const EYE_R = MARK.apertureRadius * UNIT;
export const PUPIL_R = pupilRadiusFor(headWidth) * UNIT;
export const EYE_CY = HEAD_Y + headHeight / 2;
export const EYE_LEFT_CX = HEAD_X + APERTURE_INSET * UNIT;
export const EYE_RIGHT_CX = HEAD_X + headWidth - APERTURE_INSET * UNIT;

/** How far a pupil may leave centre. Held inside the white of the eye. */
export const PUPIL_TRAVEL = (EYE_R - PUPIL_R) * 0.62;

/** The chest slot sits left of centre, so the body is not symmetrical. */
export const CHEST = {
  x: ROBOT.cx - 96,
  y: TORSO_Y + Math.round(ROBOT.torsoHeight * 0.34),
  width: 130,
  height: 44,
  dotR: 6,
} as const;
