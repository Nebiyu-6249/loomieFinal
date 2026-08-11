import type { Metadata } from "next";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { Plate } from "@/components/Plate";
import { Reveal } from "@/components/Reveal";
import {
  MEANINGS,
  MISSION,
  PILLARS,
  SITE,
  STORY,
  TAGLINE,
  VALUES,
  VISION,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Loomie means snow in Finnish, river in Albanian and lights in Italian. Born in India, raised in Saudi Arabia, developed in the UAE.",
  alternates: { canonical: "/studio" },
};

export default function Studio() {
  return (
    <>
      <PageIntro
        eyebrow="Studio"
        title="One pronunciation, three meanings."
        lede={SITE.origin}
      />

      {/* The measure widens from here down: 42ch, then 58ch, then full. */}
      <section className="px-step-2 pb-step-5 md:px-step-3" aria-labelledby="story">
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={3}>
            <h2 id="story" className="type-micro text-slate">
              The story
            </h2>
          </Reveal>

          <Reveal step={1} steps={3} className="mt-step-3">
            <p className="type-display measure text-[clamp(2.5rem,3.8vw,3.5rem)]">
              {STORY}
            </p>
          </Reveal>

          <Reveal step={2} steps={3} className="mt-step-4">
            <p className="type-lead measure text-slate">{TAGLINE}</p>
          </Reveal>
        </div>
      </section>

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="meanings"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="meanings" className="type-micro text-slate">
              The name
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
            <div className="grid gap-step-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-step-5">
              <dl className="grid gap-step-3 sm:grid-cols-3">
                {MEANINGS.map((meaning) => (
                  <div key={meaning.language} className="border-t border-drift pt-step-2">
                    <dt className="type-display text-[clamp(2.5rem,5vw,3.5rem)]">
                      {meaning.word}
                    </dt>
                    <dd className="type-micro mt-step-1 text-slate">
                      {meaning.language}
                    </dd>
                  </div>
                ))}
              </dl>

              <Plate seed="studio-name" ratio="3/2" sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
          </Reveal>
        </div>
      </section>

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
            <dl className="grid gap-step-3 md:grid-cols-3 md:gap-step-4">
              {VALUES.map((value) => (
                <div key={value.name} className="border-t border-ink pt-step-2">
                  <dt className="type-heading text-[clamp(1.375rem,2.8vw,2rem)]">
                    {value.name}
                  </dt>
                  <dd className="type-body mt-step-2 text-slate">{value.detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="pillars"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="pillars" className="type-micro text-slate">
              Pillars
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <dl className="flex flex-col">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.name}
                  className="flex flex-col gap-step-1 border-t border-drift py-step-3 md:flex-row md:gap-step-4"
                >
                  <dt className="type-heading shrink-0 text-[clamp(1.5rem,3.4vw,2.5rem)] md:w-72">
                    {pillar.name}
                  </dt>
                  <dd className="type-body measure self-end text-slate">
                    {pillar.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
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
