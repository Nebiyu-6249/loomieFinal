import Link from "next/link";

import { Plate } from "./Plate";
import type { WorkPlaceholder } from "@/lib/content";

interface WorkCardProps {
  item: WorkPlaceholder;
  /** At most one per page. */
  priority?: boolean;
  sizes?: string;
}

export function WorkCard({ item, priority = false, sizes }: WorkCardProps) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="hover-card group block"
      aria-label={`${item.discipline} — reserved slot`}
    >
      <span className="relative block">
        <Plate
          seed={item.slug}
          ratio="4/5"
          src={item.image}
          alt=""
          priority={priority}
          sizes={sizes}
        />

        {/*
          The provisional marker sits on the plate rather than in the caption,
          so a long sector name can never push it onto a second line and knock
          the row out of alignment with its neighbours.
        */}
        {item.image ? null : (
          <span className="type-micro absolute left-step-2 top-step-2 text-field/70">
            Reserved
          </span>
        )}
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
