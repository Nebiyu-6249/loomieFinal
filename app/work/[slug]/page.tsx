import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/ContactCta";
import { LineMask } from "@/components/LineMask";
import { Plate } from "@/components/Plate";
import { Reveal } from "@/components/Reveal";
import { ProcessReveal } from "@/components/SectionEffects";
import { ToneSection } from "@/components/ToneSection";
import { PROCESS, WORK } from "@/lib/content";

export function generateStaticParams() {
  return WORK.map((item) => ({ slug: item.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = WORK.find((entry) => entry.slug === slug);
  if (!item) return {};

  return {
    title: `${item.discipline} — ${item.sector}`,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
  };
}

export default async function WorkPiece({ params }: Params) {
  const { slug } = await params;
  const item = WORK.find((entry) => entry.slug === slug);
  if (!item) notFound();

  const index = WORK.indexOf(item);
  const next = WORK[(index + 1) % WORK.length];

  return (
    <>
      <section className="px-step-2 pt-step-5 md:px-step-3">
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <p className="type-micro text-slate">
              {item.sector} — {item.services.join(" · ")}
            </p>
            <h1 className="type-display mt-step-2 max-w-[16ch] text-[clamp(2.5rem,8vw,7rem)]">
              {item.discipline}
            </h1>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <LineMask className="type-lead measure text-slate">
              {item.summary}
            </LineMask>
          </Reveal>
        </div>
      </section>

      <section className="px-step-2 py-step-5 md:px-step-3">
        <div className="mx-auto max-w-[100rem]">
          {/*
            Offset past the four the index page uses, so a piece's own page
            does not open with the same composition its card just showed.
          */}
          <Plate
            seed={item.slug}
            ratio="16/9"
            src={item.image}
            alt=""
            priority
            index={index + 4}
            sizes="(max-width: 768px) 100vw, 92vw"
          />
        </div>
      </section>

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="problem"
      >
        <div className="mx-auto grid max-w-[100rem] gap-step-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-step-5">
          <Reveal step={0} steps={2}>
            <h2 id="problem" className="type-micro text-slate">
              What this sector arrives with
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} rule={false}>
            <LineMask className="type-body measure text-field/85">
              {item.problem}
            </LineMask>
          </Reveal>
        </div>
      </section>

      <ToneSection labelledBy="approach">
        <Reveal step={0} steps={2}>
          <h2 id="approach" className="type-micro text-ember">
            How the five steps meet it
          </h2>
        </Reveal>

        <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
          <ProcessReveal>
            <div className="process-run">
              <span data-process-line="" className="process-line" aria-hidden="true" />

              <ol className="flex flex-col">
                {item.approach.map((line, step) => (
                  <li
                    key={line}
                    data-process-step=""
                    className="flex flex-col gap-step-2 border-t border-haze py-step-3 md:flex-row md:gap-step-4"
                  >
                    <p className="type-micro shrink-0 text-ember md:w-40">
                      {String(step + 1).padStart(2, "0")} {PROCESS[step]?.title}
                    </p>
                    <p className="type-body measure text-field/80">{line}</p>
                  </li>
                ))}
              </ol>
            </div>
          </ProcessReveal>
        </Reveal>
      </ToneSection>

      <section
        className="px-step-2 py-step-5 md:px-step-3"
        aria-labelledby="delivered"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="delivered" className="type-micro text-slate">
              What you receive
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <ul className="flex flex-col">
              {item.delivered.map((line) => (
                <li
                  key={line}
                  className="type-heading border-t border-haze py-step-2 text-[clamp(1.0625rem,2vw,1.375rem)]"
                >
                  {line}
                </li>
              ))}
            </ul>

            <p className="mt-step-4">
              <Link
                href={`/work/${next.slug}`}
                className="type-micro hover-line inline-flex min-h-11 items-center text-field"
              >
                [ Next — {next.discipline} ]
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
