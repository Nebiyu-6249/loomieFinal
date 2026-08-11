import { LoomieEyes } from "./LoomieEyes";
import { CLEAR_SPACE, MARK, MARK_ASPECT } from "@/lib/mark";

/**
 * LOOMIE, with the mark standing in for the double O.
 *
 * The whole lockup is driven by one length — the mark's rendered width — and
 * the height, the wordmark's type size and the clear space held around the
 * mark are all derived from the construction constants at render. Nothing
 * here can be nudged out of spec by editing a margin, and because the derived
 * values are ratios rather than pixels, the caller can pass a responsive
 * length and the whole lockup rescales correctly.
 */

/** Cap height of the wordmark relative to the mark's height. */
const TYPE_TO_MARK_HEIGHT = 1.42;

const CLEAR_SPACE_RATIO = CLEAR_SPACE / MARK.gridWidth;

/**
 * The lockup uses optical kerning, not the standalone clear-space rule.
 *
 * Clear space governs the mark standing alone against other content. Inside a
 * word it is the wrong rule twice over: the capsule already carries 13.5 grid
 * units of its own dark between its outer edge and the first aperture, and
 * the apertures — not the capsule — are what the eye reads as the two O's.
 * Applying the full 1.5r on top of that put 27 units between the L and the
 * first "O", 38.6% of the mark's own width and visibly wider than the gap
 * between the M and the I.
 *
 * The value is negative because the correction has to cancel part of the
 * capsule's own margin: the L overlaps the capsule's rounded end slightly,
 * which is invisible because that end is a curve and the L's stem is
 * straight. It brings the perceived L-to-O gap from 11.5px to 7.6px at a
 * 46px mark.
 *
 * Set by eye at 46px and at 200px against the word's own letter gaps rather
 * than derived — 0.3 still read loose and -0.45 collided with the letters.
 * That judgement is what optical kerning is; there is no formula here.
 */
const LOCKUP_KERN = -0.15;

interface WordmarkProps {
  /**
   * Any CSS length for the mark's width. Keep the lower bound of a clamp at or
   * above MARK.minRenderWidth — below it the apertures close up.
   */
  markWidth?: string;
  className?: string;
  /** The mark tracks the cursor unless this lockup is decorative repetition. */
  track?: boolean;
  /** Approximate rendered width in px — decides whether the pupil goes compact. */
  renderWidth?: number;
}

export function Wordmark({
  markWidth = `clamp(34px, 7vw, 46px)`,
  renderWidth = 46,
  className = "",
  track = true,
}: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-center type-heading leading-none ${className}`}
      style={
        {
          "--mark-w": markWidth,
          fontSize: `calc(var(--mark-w) / ${MARK_ASPECT} * ${TYPE_TO_MARK_HEIGHT})`,
        } as React.CSSProperties
      }
    >
      <span aria-hidden="true">L</span>
      <span
        aria-hidden="true"
        className="inline-flex"
        style={{
          // A negative margin, not negative padding: padding cannot go below
          // zero, so the browser dropped it and shrank the mark instead of
          // tucking the letters in. Margin keeps the mark at its full width.
          width: `var(--mark-w)`,
          marginInline: `calc(var(--mark-w) * ${CLEAR_SPACE_RATIO * LOCKUP_KERN})`,
        }}
      >
        <LoomieEyes className="w-full" track={track} renderWidth={renderWidth} />
      </span>
      <span aria-hidden="true">MIE</span>
      <span className="sr-only">Loomie</span>
    </span>
  );
}
