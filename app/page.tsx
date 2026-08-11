import Link from "next/link";

import { CardStack } from "@/components/CardStack";
import { ContactCta } from "@/components/ContactCta";
import { ToneSection } from "@/components/ToneSection";
import { ExplodedAssembly } from "@/components/ExplodedAssembly";
import { HeroAperture } from "@/components/HeroAperture";
import { JourneyLine } from "@/components/JourneyLine";
import { LetterReveal } from "@/components/LetterReveal";
import { Reveal } from "@/components/Reveal";
import { Ticker } from "@/components/Ticker";
import { SERVICES, STORY, WORK_PLACEHOLDERS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <HeroAperture />

      {/*
        The drawn line spans the three sections between the hero and the
        ticker. It is behind everything, decorative, and never intercepts a
        pointer.
      */}
      <div className="relative">
        <JourneyLine />

        <ExplodedAssembly />

        {/* What the studio does. The founder's copy, word for word. */}
        <section className="px-step-2 py-step-5 md:px-step-3" aria-labelledby="what">
          <div className="mx-auto max-w-[100rem]">
            <Reveal step={0} steps={5}>
              <LetterReveal
                as="h2"
                id="what"
                text="What we do"
                className="type-micro text-slate"
              />
            </Reveal>

            <ul className="mt-step-4 grid gap-step-4 md:grid-cols-2 md:gap-x-step-5">
              {SERVICES.map((service, index) => (
                <li key={service.slug}>
                  <Reveal step={index + 1} steps={5}>
                    <h3 className="type-heading text-[clamp(1.5rem,3.4vw,2.5rem)]">
                      {service.title}
                    </h3>
                    <p className="type-body measure mt-step-2 text-slate">
                      {service.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>

            <p className="mt-step-4">
              <Link href="/services" className="type-micro hover-line text-field">
                [ How the work runs ]
              </Link>
            </p>
          </div>
        </section>

        {/*
          The stack is the featured view, and the only one. It used to sit
          above a four-up grid of the same six slots, which meant the homepage
          showed every reserved slot twice and neither presentation carried any
          weight. The full set lives on /work, one click away.
        */}
        <section className="px-step-2 py-step-5 md:px-step-3" aria-labelledby="work">
          <div className="mx-auto max-w-[100rem]">
            {/*
              The stack is this section's second block. It carries no hairline
              of its own, so the heading's measure stays short and the widening
              resumes in the section below.
            */}
            <Reveal step={0} steps={2}>
              <LetterReveal
                as="h2"
                id="work"
                text="Selected work"
                className="type-micro text-slate"
              />
            </Reveal>

            <div className="mt-step-4">
              <CardStack items={WORK_PLACEHOLDERS} />
            </div>

            <p className="mt-step-4">
              <Link href="/work" className="type-micro hover-line text-field">
                [ All work ]
              </Link>
            </p>
          </div>
        </section>
      </div>

      <Ticker />

      {/* The page's one tonal event. */}
      <ToneSection labelledBy="studio">
        <Reveal step={0} steps={2}>
          <LetterReveal
            as="h2"
            id="studio"
            text="The studio"
            className="type-micro text-ember"
          />
        </Reveal>

        <Reveal step={1} steps={2} className="mt-step-3">
          <p className="type-display measure text-[clamp(2.5rem,3.8vw,3.5rem)]">
            {STORY}
          </p>
          <p className="mt-step-4">
            <Link href="/studio" className="type-micro hover-line text-ember">
              [ Read the studio ]
            </Link>
          </p>
        </Reveal>
      </ToneSection>

      <ContactCta />
    </>
  );
}
