import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { ToneSection } from "@/components/ToneSection";
import { PACKAGES, PACKAGES_INTRO, PROCESS, TIMELINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Five steps from discovery to final delivery, on a four-week timeline, and three identity packages to choose from.",
  alternates: { canonical: "/process" },
};

export default function Process() {
  return (
    <>
      <PageIntro
        eyebrow="Process"
        title="Five steps, four weeks."
        lede="The same sequence every time, so you always know which part of it you are in."
      />

      {/* A real sequence, which is the only thing on the site that is numbered. */}
      <ToneSection labelledBy="steps">
        <Reveal step={0} steps={2}>
          <h2 id="steps" className="type-micro text-ember">
            How the work runs
          </h2>
        </Reveal>

        <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
          <ol className="grid gap-px bg-haze sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-step-2 bg-smoke p-step-3 lg:min-h-64"
              >
                <span className="type-micro text-ember">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="type-heading text-[1.25rem]">{step.title}</h3>
                <p className="type-body text-field/70">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </ToneSection>

      <section
        className="px-step-2 py-step-5 md:px-step-3"
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
                  className="flex flex-col gap-step-1 border-t border-haze py-step-2 sm:flex-row sm:gap-step-4"
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

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="packages"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="packages" className="type-micro text-slate">
              Packages
            </h2>
            <p className="type-lead measure mt-step-2">{PACKAGES_INTRO}</p>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
            <ul className="grid gap-step-2 lg:grid-cols-3">
              {PACKAGES.map((pack) => (
                <li
                  key={pack.slug}
                  className="flex flex-col border border-haze bg-smoke p-step-3"
                >
                  <h3 className="type-display text-[clamp(2.5rem,3vw,2.75rem)]">
                    {pack.name}
                  </h3>

                  {pack.builtOn ? (
                    <p className="type-micro mt-step-2 text-ember">
                      Everything in {pack.builtOn}, plus
                    </p>
                  ) : null}

                  <ul className="mt-step-2 flex flex-col gap-step-1">
                    {pack.includes.map((line) => (
                      <li
                        key={line}
                        className="type-body border-t border-haze pt-step-1 text-field/75"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>

                  {/*
                    No pricing anywhere. It is not in the founder's material
                    and is not going to be invented, so every package asks.
                  */}
                  <p className="mt-step-3 pt-step-2">
                    <Link
                      href="/contact"
                      className="type-micro hover-line inline-flex min-h-11 items-center text-ember"
                    >
                      [ Request pricing ]
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
