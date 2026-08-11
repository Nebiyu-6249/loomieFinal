import { LoomieEyes } from "./LoomieEyes";
import { clearSpaceFor, markHeightFor, safeMarkWidth } from "@/lib/mark";

/**
 * LOOMIE, with the mark standing in for the double O.
 *
 * The mark's width, its height and the clear space held around it all come
 * off the construction constants, so the lockup cannot drift out of spec by
 * someone nudging a margin.
 */

interface WordmarkProps {
  /** Rendered width of the mark itself, in pixels. Clamped to the minimum. */
  markWidth?: number;
  className?: string;
  /** The mark tracks the cursor unless this lockup is decorative repetition. */
  track?: boolean;
}

export function Wordmark({
  markWidth = 46,
  className = "",
  track = true,
}: WordmarkProps) {
  const width = safeMarkWidth(markWidth);
  const height = markHeightFor(width);
  const clear = clearSpaceFor(width);

  return (
    <span
      className={`inline-flex items-center type-heading leading-none ${className}`}
      style={{ fontSize: height * 1.42 }}
    >
      <span aria-hidden="true">L</span>
      <span
        aria-hidden="true"
        className="inline-flex"
        style={{
          width: width + clear * 2,
          paddingInline: clear,
        }}
      >
        <LoomieEyes
          className="w-full"
          track={track}
        />
      </span>
      <span aria-hidden="true">MIE</span>
      <span className="sr-only">Loomie</span>
    </span>
  );
}
