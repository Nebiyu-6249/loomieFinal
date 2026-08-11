import Link from "next/link";

import { SITE } from "@/lib/content";

/**
 * The call to action, lit rather than filled.
 *
 * On the light build this was a flat Thaw ground. The dark palette forbids a
 * flat ember fill — ember is light — so the section is Smoke with a large
 * ember bloom rising behind the headline from the lower left. Same job, and
 * it belongs to the same weather as the rest of the site.
 */
export function ContactCta({ className = "" }: { className?: string }) {
  return (
    <section
      className={`relative isolate overflow-hidden bg-smoke px-step-2 py-step-5 md:px-step-3 ${className}`}
    >
      <span aria-hidden="true" className="cta-bloom" />
      <div className="relative mx-auto max-w-[100rem]">
        <h2 className="type-display max-w-[18ch] text-[clamp(2.5rem,7vw,6rem)]">
          Tell us what you are building.
        </h2>

        <div className="mt-step-4 flex flex-col gap-step-2 md:flex-row md:items-center md:gap-step-4">
          <Link href="/contact" className="type-micro hover-line inline-flex min-h-11 items-center text-ember">
            [ Request a time ]
          </Link>
          <a
            href={`mailto:${SITE.email}`}
            className="type-micro hover-line inline-flex min-h-11 items-center text-field/75"
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </section>
  );
}
