/**
 * PLACEHOLDER — an invented name set as inline SVG in the site's own type.
 *
 * No real company's mark appears anywhere on this site. These are drawn
 * rather than sourced precisely so that nobody mistakes them for clients, and
 * the array they come from is marked as placeholder data in lib/content.ts.
 */
export function PlaceholderWordmark({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 220 40"
      className="h-8 w-auto max-w-full"
      role="img"
      aria-label={`${name} — invented placeholder wordmark`}
    >
      <text
        x="0"
        y="28"
        fill="currentColor"
        fontFamily="var(--font-familjen)"
        fontSize="26"
        fontWeight="600"
        letterSpacing="-0.5"
      >
        {name}
      </text>
    </svg>
  );
}
