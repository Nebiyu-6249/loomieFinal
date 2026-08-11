import Link from "next/link";

import { SITE } from "@/lib/content";

/**
 * Thaw's second and last appearance as a surface. If a third one turns up,
 * one of the first two was wrong.
 */
export function ContactCta({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-thaw px-step-2 py-step-5 md:px-step-3 ${className}`}>
      <div className="mx-auto max-w-[100rem]">
        <h2 className="type-display max-w-[16ch] text-[clamp(2.25rem,7vw,6rem)]">
          Tell us what you are building.
        </h2>

        <div className="mt-step-4 flex flex-col gap-step-2 md:flex-row md:items-center md:gap-step-4">
          <Link href="/contact" className="type-micro hover-line text-ink">
            [ Request a time ]
          </Link>
          <a
            href={`mailto:${SITE.email}`}
            className="type-micro hover-line text-ink/70"
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}
