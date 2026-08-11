import Link from "next/link";

import { ContactCta } from "@/components/ContactCta";
import { HeroAperture } from "@/components/HeroAperture";
import { Reveal } from "@/components/Reveal";
import { WorkCard } from "@/components/WorkCard";
import { SERVICES, STORY, WORK_PLACEHOLDERS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <HeroAperture />

      {/* What the studio does. The founder's copy, word for word. */}
      <section className="px-step-2 py-step-5 md:px-step-3" aria-labelledby="what">
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={5}>
            <h2 id="what" className="type-micro text-slate">
              What we do
            </h2>
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
            <Link href="/services" className="type-micro hover-line text-ink">
              [ How the work runs ]
            </Link>
          </p>
        </div>
      </section>

      {/* Selected work. Every slot is reserved, and says so. */}
      <section className="px-step-2 py-step-5 md:px-step-3" aria-labelledby="work">
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="work" className="type-micro text-slate">
              Selected work
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
            <ul className="grid grid-cols-2 gap-step-2 md:grid-cols-4 md:gap-step-3">
              {WORK_PLACEHOLDERS.map((item, index) => (
                <li key={item.slug}>
                  <WorkCard
                    item={item}
                    priority={index === 0}
                    sizes="(max-width: 768px) 50vw, 23vw"
                  />
                </li>
              ))}
            </ul>
          </Reveal>

          <p className="mt-step-4">
            <Link href="/work" className="type-micro hover-line text-ink">
              [ All work ]
            </Link>
          </p>
        </div>
      </section>

      {/* The story, in the founder's words. */}
      <section
        className="px-step-2 py-step-5 md:px-step-3"
        aria-labelledby="studio"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="studio" className="type-micro text-slate">
              The studio
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3">
            <p className="type-heading measure text-[clamp(1.375rem,3.2vw,2.25rem)] leading-[1.25]">
              {STORY}
            </p>
            <p className="mt-step-3">
              <Link href="/studio" className="type-micro hover-line text-ink">
                [ Read the studio ]
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
