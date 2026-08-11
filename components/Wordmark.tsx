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
          width: `calc(var(--mark-w) + var(--mark-w) * ${CLEAR_SPACE_RATIO} * 2)`,
          paddingInline: `calc(var(--mark-w) * ${CLEAR_SPACE_RATIO})`,
        }}
      >
        <LoomieEyes className="w-full" track={track} renderWidth={renderWidth} />
      </span>
      <span aria-hidden="true">MIE</span>
      <span className="sr-only">Loomie</span>
    </span>
  );
}
