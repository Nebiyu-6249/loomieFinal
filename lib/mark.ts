/**
 * The Infinity-Eyes mark, as construction rules rather than as a drawing.
 *
 * Everything the site draws from the mark — the wordmark lockup, the clear
 * space around every instance, the plate compositions that stand in for
 * photography — is derived from the constants below. Nothing re-states a
 * measurement by hand, so the mark cannot be scaled or spaced wrong by
 * editing a component in isolation.
 */

export const MARK = {
  /**
   * The construction grid. Every other value on this object is expressed in
   * these units, so the whole system scales by changing the render width and
   * nothing else.
   */
  gridWidth: 70,
  gridHeight: 36,

  /** Equal for both apertures. The unit the rest of the spec is measured in. */
  pupilRadius: 9,

  /**
   * The 1:2.5 rule. A pupil centre sits 2.5 pupil-radii in from the nearer
   * outer edge, which is what fixes the apertures horizontally.
   */
  pupilInsetRatio: 2.5,

  /** Minimum clear space on every side, as a multiple of the pupil radius. */
  clearSpaceRatio: 1.5,

  /** Below this the apertures close up and the mark stops reading. */
  minRenderWidth: 24,
} as const;

/** Pupil centre, in grid units, measured from the nearer outer edge. */
export const PUPIL_INSET = MARK.pupilRadius * MARK.pupilInsetRatio; // 22.5

/** Both pupils sit on the horizontal centreline. */
export const PUPIL_CY = MARK.gridHeight / 2; // 18

/** The outer silhouette is a stadium: corner radius is half the height. */
export const CAPSULE_RADIUS = MARK.gridHeight / 2; // 18

/** Clear space in grid units. */
export const CLEAR_SPACE = MARK.pupilRadius * MARK.clearSpaceRatio; // 13.5

/** 70 : 36 — the silhouette's own proportion, not the 1:2.5 construction rule. */
export const MARK_ASPECT = MARK.gridWidth / MARK.gridHeight;

/**
 * The mark as supplied in `LoomieEyes.tsx` and the two brand SVGs places the
 * pupil centre at 22 grid units rather than the 22.5 the ratio produces — a
 * half-unit, 0.7% of the mark's width, invisible at every size the mark is
 * used at. `LoomieEyes` is shipped exactly as delivered, so it keeps 22;
 * everything generated here is built from the rule above. Reconcile the two
 * when the founder confirms the spec sheet.
 */
export const ARTWORK_PUPIL_INSET = 22;

/** Clear space in CSS pixels for a mark rendered at `width` pixels. */
export function clearSpaceFor(width: number): number {
  return (width / MARK.gridWidth) * CLEAR_SPACE;
}

/**
 * Guards the minimum. Returns the width the mark should actually render at,
 * never smaller than the point where the apertures stop reading.
 */
export function safeMarkWidth(width: number): number {
  return Math.max(width, MARK.minRenderWidth);
}

/** Height for a mark rendered at `width` pixels, holding the silhouette's ratio. */
export function markHeightFor(width: number): number {
  return safeMarkWidth(width) / MARK_ASPECT;
}
