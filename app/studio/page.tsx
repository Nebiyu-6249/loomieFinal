import type { Metadata } from "next";
import Link from "next/link";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { Plate } from "@/components/Plate";
import { Reveal } from "@/components/Reveal";
import { ToneSection } from "@/components/ToneSection";
import { MEANINGS, SITE, STORY, TAGLINE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Loomie means snow in Finnish, river in Albanian and lights in Italian. Born in India, raised in Saudi Arabia, developed in the UAE.",
  alternates: { canonical: "/studio" },
};

/**
 * The story, the origin and the three meanings. The values, pillars, mission
 * and vision moved to /studio/principles — this page ran five sections on one
 * rhythm and the eye stopped being led.
 */
export default function Studio() {
  return (
    <>
      <PageIntro
        eyebrow="Studio"
        title="One pronunciation, three meanings."
        lede={SITE.origin}
      />

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

      <ToneSection labelledBy="meanings">
        <Reveal step={0} steps={2}>
          <h2 id="meanings" className="type-micro text-ember">
            The name
          </h2>
        </Reveal>

        <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
          <div className="grid gap-step-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:gap-step-5">
            <dl className="grid gap-step-3 sm:grid-cols-3">
              {MEANINGS.map((meaning) => (
                <div key={meaning.language} className="border-t border-haze pt-step-2">
                  <dt className="type-display text-[clamp(2.5rem,5vw,3.5rem)]">
                    {meaning.word}
                  </dt>
                  <dd className="type-micro mt-step-1 text-ember">
                    {meaning.language}
                  </dd>
                </div>
              ))}
            </dl>

            <Plate seed="studio-name" ratio="3/2" sizes="(max-width: 768px) 100vw, 40vw" />
          </div>
        </Reveal>
      </ToneSection>

      <section className="px-step-2 py-step-5 md:px-step-3">
        <div className="mx-auto max-w-[100rem]">
          <Reveal>
            <p className="type-lead measure text-slate">
              What the studio holds to — the values, the pillars, and the
              mission behind them — has a page of its own.
            </p>
            <p className="mt-step-3">
              <Link
                href="/studio/principles"
                className="type-micro hover-line inline-flex min-h-11 items-center text-field"
              >
                [ Principles ]
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
