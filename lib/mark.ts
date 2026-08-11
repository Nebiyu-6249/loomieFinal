/**
 * The Infinity-Eyes mark, as construction rules rather than as a drawing.
 *
 * Three tones, not two. The capsule is Ink, the aperture inside it is Field —
 * the white of the eye — and a smaller concentric pupil in Ink sits inside
 * that. The pupil is the part that tracks the cursor, and it has to be the
 * dark one or there is no gaze: a light dot on a dark ground reads as a hole,
 * not as an eye looking back.
 *
 * Thaw never appears inside the mark. Warmth belongs behind it, as light
 * falling on the capsule — snow becomes a river under the warmth of the sun,
 * and the sun is behind the snow rather than mixed into it.
 *
 * Everything the site draws from the mark derives from the constants below,
 * so the mark cannot be scaled, spaced or coloured wrong by editing a
 * component in isolation.
 */

export const MARK = {
  /**
   * The construction grid. Every other value is expressed in these units, so
   * the system rescales by changing the render width and nothing else.
   */
  gridWidth: 70,
  gridHeight: 36,

  /** The white of the eye. Equal for both, and the unit the spec measures in. */
  apertureRadius: 9,

  /**
   * The pupil, as a fraction of the aperture. Just over half reads as an eye;
   * much smaller reads as a dot, much larger closes the white up entirely.
   */
  pupilRatio: 0.52,

  /**
   * Below roughly this width the pupil stops resolving at 1x, so small
   * renders draw it proportionally larger rather than letting the mark
   * collapse into an infinity symbol.
   */
  compactBelowWidth: 96,
  compactPupilRatio: 0.62,

  /**
   * The 1:2.5 rule. An aperture centre sits 2.5 aperture-radii in from the
   * nearer outer edge, which is what fixes the eyes horizontally.
   */
  apertureInsetRatio: 2.5,

  /** Minimum clear space on every side, as a multiple of the aperture radius. */
  clearSpaceRatio: 1.5,

  /** Below this the mark stops reading at all. */
  minRenderWidth: 24,
} as const;

/** Aperture centre, in grid units, measured from the nearer outer edge. */
export const APERTURE_INSET =
  MARK.apertureRadius * MARK.apertureInsetRatio; // 22.5

/** Both eyes sit on the horizontal centreline. */
export const APERTURE_CY = MARK.gridHeight / 2; // 18

/** The outer silhouette is a stadium: corner radius is half the height. */
export const CAPSULE_RADIUS = MARK.gridHeight / 2; // 18

/** Clear space in grid units. */
export const CLEAR_SPACE = MARK.apertureRadius * MARK.clearSpaceRatio; // 13.5

/** 70 : 36 — the silhouette's proportion, not the 1:2.5 construction rule. */
export const MARK_ASPECT = MARK.gridWidth / MARK.gridHeight;

/**
 * Pupil radius in grid units for a mark rendered at `width` pixels. Small
 * renders get the compact ratio so the gaze survives a 38px navbar lockup.
 */
export function pupilRadiusFor(width: number): number {
  const ratio =
    width < MARK.compactBelowWidth ? MARK.compactPupilRatio : MARK.pupilRatio;
  return MARK.apertureRadius * ratio;
}

/**
 * The mark as supplied places the aperture centre at 22 grid units rather
 * than the 22.5 the ratio produces — a half unit, 0.7% of the width. The
 * construction rule is treated as authoritative here; reconcile the artwork
 * when the founder confirms the spec sheet.
 */
export const ARTWORK_APERTURE_INSET = 22;

/** Clear space in CSS pixels for a mark rendered at `width` pixels. */
export function clearSpaceFor(width: number): number {
  return (width / MARK.gridWidth) * CLEAR_SPACE;
}

/** Never smaller than the point where the mark stops reading. */
export function safeMarkWidth(width: number): number {
  return Math.max(width, MARK.minRenderWidth);
}

/** Height for a mark rendered at `width` pixels, holding the silhouette's ratio. */
export function markHeightFor(width: number): number {
  return safeMarkWidth(width) / MARK_ASPECT;
}
