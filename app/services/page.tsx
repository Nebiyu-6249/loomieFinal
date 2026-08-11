import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { LineMask } from "@/components/LineMask";
import { ServiceReveal } from "@/components/SectionEffects";
import { SERVICES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Logo design, web brand identity, marketing design and website design.",
  alternates: { canonical: "/services" },
};

/**
 * Four services and nothing else. The process, the timeline and the packages
 * moved to /process — a short page that says one thing beats a long page that
 * says four.
 */
export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Four things, done properly."
        lede="Each one produces a system you can hand to someone else and have them use correctly."
      />

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="services"
      >
        <div className="mx-auto max-w-[100rem]">
          <h2 id="services" className="sr-only">
            What the studio offers
          </h2>

          {/*
            Not numbered. Four services are a set, not a sequence — the only
            ordered thing on the site is the process, and it lives elsewhere.
          */}
          {/*
            Not a Reveal here. The services get their own treatment — a rule
            drawing left to right, a number counting up, and the copy rising
            out from behind a mask — because two adjacent sections should not
            arrive the same way, and this is the page's whole content.
          */}
          <ServiceReveal>
            <ul className="flex flex-col">
              {SERVICES.map((service, index) => (
                <li key={service.slug} data-service-row="" className="py-step-3">
                  <span
                    data-service-rule=""
                    aria-hidden="true"
                    className="block h-px w-full origin-left bg-haze"
                  />

                  <div className="mt-step-2 grid gap-step-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-step-4">
                    <div className="flex items-baseline gap-step-2">
                      <span
                        data-service-number=""
                        data-service-number-target={index + 1}
                        className="type-micro text-ember"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="type-heading text-[clamp(1.5rem,3.6vw,2.75rem)]">
                        {service.title}
                      </h3>
                    </div>
                    <LineMask className="type-body measure self-end text-slate" delay={0.12}>
                      {service.body}
                    </LineMask>
                  </div>
                </li>
              ))}
            </ul>
          </ServiceReveal>

          <p className="mt-step-4">
            <Link
              href="/process"
              className="type-micro hover-line inline-flex min-h-11 items-center text-field"
            >
              [ How the work runs ]
            </Link>
          </p>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
