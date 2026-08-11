import Link from "next/link";

import { Plate } from "./Plate";
import type { CapabilityPiece } from "@/lib/content";

interface WorkCardProps {
  item: CapabilityPiece;
  /** At most one per page. */
  priority?: boolean;
  sizes?: string;
  /** Position in the page's run of slots; sets the reveal's opening edge. */
  index?: number;
}

export function WorkCard({
  item,
  priority = false,
  sizes,
  index = 0,
}: WorkCardProps) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="hover-card group block"
      aria-label={`${item.discipline} — ${item.sector}`}
    >
      <span className="relative block">
        <Plate
          seed={item.slug}
          ratio="4/5"
          src={item.image}
          alt=""
          priority={priority}
          sizes={sizes}
          index={index}
        />

      </span>

      <span
        aria-hidden="true"
        className="mt-step-2 block h-px w-full bg-field"
        data-card-rule=""
      />

      <span className="type-heading mt-step-2 block text-[clamp(1.125rem,2vw,1.5rem)]">
        {item.discipline}
      </span>

      <span className="type-micro mt-step-1 block text-slate">
        {item.sector}
      </span>
    </Link>
  );
}
