import type { Metadata } from "next";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { ToneSection } from "@/components/ToneSection";
import { LineMask } from "@/components/LineMask";
import { PrincipleReveal } from "@/components/SectionEffects";
import { MISSION, PILLARS, VALUES, VISION } from "@/lib/content";

export const metadata: Metadata = {
  title: "Principles",
  description:
    "Clarity, connectivity and completeness; elegance, reliability and advancement; and the studio's mission and vision.",
  alternates: { canonical: "/studio/principles" },
};

export default function Principles() {
  return (
    <>
      <PageIntro
        eyebrow="Studio — principles"
        title="What the studio holds to."
        lede="Three values, three pillars, and the two sentences the whole thing answers to."
      />

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="values"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="values" className="type-micro text-slate">
              Core values
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            {/*
              Each value scales up from 0.94 with its hairline opening from
              the centre. It is the only rule on the site that draws both ways
              — everything else runs left to right — and that is what marks
              these as statements rather than as another sequence.
            */}
            <PrincipleReveal>
              <dl className="grid gap-step-3 md:grid-cols-3 md:gap-step-4">
                {VALUES.map((value) => (
                  <div key={value.name} data-principle="">
                    <span
                      data-principle-rule=""
                      aria-hidden="true"
                      className="block h-px w-full bg-slate"
                    />
                    <dt className="type-heading mt-step-2 text-[clamp(1.375rem,2.8vw,2rem)]">
                      {value.name}
                    </dt>
                    <dd className="type-body mt-step-2 text-slate">
                      {value.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </PrincipleReveal>
          </Reveal>
        </div>
      </section>

      <ToneSection labelledBy="pillars">
        <Reveal step={0} steps={2}>
          <h2 id="pillars" className="type-micro text-ember">
            Pillars
          </h2>
        </Reveal>

        <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
          <dl className="flex flex-col">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.name}
                className="flex flex-col gap-step-1 border-t border-haze py-step-3 md:flex-row md:gap-step-4"
              >
                <dt className="type-display shrink-0 text-[clamp(2.5rem,3.4vw,3rem)] md:w-96">
                  {pillar.name}
                </dt>
                <LineMask
                  as="dd"
                  className="type-body measure self-end text-field/75"
                >
                  {pillar.detail}
                </LineMask>
              </div>
            ))}
          </dl>
        </Reveal>
      </ToneSection>

      <section
        className="px-step-2 py-step-5 md:px-step-3"
        aria-labelledby="intent"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="intent" className="type-micro text-slate">
              Mission and vision
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <div className="grid gap-step-4 md:grid-cols-2 md:gap-step-5">
              <p className="type-heading text-[clamp(1.125rem,2.4vw,1.625rem)] leading-[1.35]">
                {MISSION}
              </p>
              <p className="type-heading text-[clamp(1.125rem,2.4vw,1.625rem)] leading-[1.35] text-slate">
                {VISION}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
