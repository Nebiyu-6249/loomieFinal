import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/ContactCta";
import { Plate } from "@/components/Plate";
import { Reveal } from "@/components/Reveal";
import { PROCESS, WORK_PLACEHOLDERS } from "@/lib/content";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return WORK_PLACEHOLDERS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = WORK_PLACEHOLDERS.find((entry) => entry.slug === slug);

  if (!item) return { title: "Not found" };

  return {
    title: `${item.discipline} — reserved slot`,
    description: item.reservedFor,
    alternates: { canonical: `/work/${item.slug}` },
    // Nothing here is a real project, so it should not be indexed as one.
    robots: { index: false, follow: true },
  };
}

export default async function CaseStudy({ params }: Params) {
  const { slug } = await params;
  const item = WORK_PLACEHOLDERS.find((entry) => entry.slug === slug);

  if (!item) notFound();

  const index = WORK_PLACEHOLDERS.indexOf(item);
  const next = WORK_PLACEHOLDERS[(index + 1) % WORK_PLACEHOLDERS.length];

  return (
    <>
      <section className="px-step-2 pb-step-4 pt-step-4 md:px-step-3 md:pt-step-5">
        <div className="mx-auto max-w-[100rem]">
          <Reveal rule={false}>
            <p className="type-micro text-slate">
              {item.sector} — reserved slot
            </p>
            <h1 className="type-display mt-step-2 max-w-[14ch] text-[clamp(2.5rem,8vw,7rem)]">
              {item.discipline}
            </h1>
          </Reveal>
        </div>
      </section>

      {/*
        The plate is the page's one large visual. Swapping in real photography
        is a single prop: src={item.image} already reads from the data.
      */}
      <section className="px-step-2 pb-step-5 md:px-step-3">
        <div className="mx-auto max-w-[100rem]">
          <Plate
            seed={item.slug}
            ratio="16/9"
            src={item.image}
            alt=""
            priority
            sizes="(max-width: 768px) 100vw, 92vw"
          />
        </div>
      </section>

      <section className="px-step-2 pb-step-5 md:px-step-3">
        <div className="mx-auto grid max-w-[100rem] gap-step-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-step-5">
          <div>
            <Reveal step={0} steps={3}>
              <h2 className="type-micro text-slate">What this slot is for</h2>
            </Reveal>

            <Reveal step={1} steps={3} className="mt-step-3">
              <p className="type-body measure">{item.reservedFor}</p>
            </Reveal>

            <Reveal step={2} steps={3} className="mt-step-4">
              <h3 className="type-micro text-slate">Scope</h3>
              <ul className="mt-step-2 flex flex-col gap-step-1">
                {item.scope.map((entry) => (
                  <li key={entry} className="type-body">
                    {entry}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <Reveal step={0} steps={2}>
              <h2 className="type-micro text-slate">
                How the work would run — five steps
              </h2>
            </Reveal>

            <Reveal step={1} steps={2} className="mt-step-3">
              <ol className="flex flex-col">
                {PROCESS.map((step, stepIndex) => (
                  <li
                    key={step.title}
                    className="flex gap-step-3 border-t border-haze py-step-2"
                  >
                    <span className="type-micro shrink-0 text-slate">
                      {String(stepIndex + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="type-heading block text-[1.0625rem]">
                        {step.title}
                      </span>
                      <span className="type-body measure mt-1 block text-slate">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-step-2 pb-step-5 md:px-step-3">
        <div className="mx-auto flex max-w-[100rem] flex-wrap gap-step-3">
          <Link href="/work" className="type-micro hover-line text-field">
            [ All work ]
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="type-micro hover-line text-slate"
          >
            Next — {next.discipline}
          </Link>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
