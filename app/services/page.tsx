import type { Metadata } from "next";

import { ContactCta } from "@/components/ContactCta";
import { DarkSection } from "@/components/DarkSection";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { PROCESS, SERVICES, TIMELINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Logo design, web brand identity, marketing design and website design — with the studio's five-step process and its four-week timeline.",
  alternates: { canonical: "/services" },
};

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
            Not numbered. Four services are a set, not a sequence — the process
            below is the only ordered thing on this page, so it gets the numbers.
          */}
          <ul className="flex flex-col">
            {SERVICES.map((service, index) => (
              <li key={service.slug}>
                <Reveal
                  step={index}
                  steps={SERVICES.length}
                  className="py-step-3"
                >
                  <div className="grid gap-step-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-step-4">
                    <h3 className="type-heading text-[clamp(1.5rem,3.6vw,2.75rem)]">
                      {service.title}
                    </h3>
                    <p className="type-body measure self-end text-slate">
                      {service.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* A real sequence, which is why it is the one thing here that counts. */}
      <DarkSection labelledBy="process">
        <Reveal step={0} steps={2}>
          <h2 id="process" className="type-micro text-thaw">
            How the work runs — five steps
          </h2>
        </Reveal>

        <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
          <ol className="grid gap-px bg-field/20 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-step-2 bg-ink p-step-3 lg:min-h-64"
              >
                <span className="type-micro text-thaw">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-heading text-[1.25rem]">{step.title}</h3>
                <p className="type-body text-field/70">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </DarkSection>

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="timeline"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="timeline" className="type-micro text-slate">
              Typical timeline — four weeks
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <dl className="flex flex-col">
              {TIMELINE.map((entry) => (
                <div
                  key={entry.week}
                  className="flex flex-col gap-step-1 border-t border-drift py-step-2 sm:flex-row sm:gap-step-4"
                >
                  <dt className="type-micro shrink-0 text-slate sm:w-40">
                    {entry.week}
                  </dt>
                  <dd className="type-heading text-[clamp(1.125rem,2.4vw,1.625rem)]">
                    {entry.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
