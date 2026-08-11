import type { Metadata } from "next";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { WorkCard } from "@/components/WorkCard";
import { WORK_PLACEHOLDERS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Identity, marketing and website projects from Loomie. The index is live and the project slots are reserved while the studio's first published work is prepared.",
  alternates: { canonical: "/work" },
};

export default function WorkIndex() {
  return (
    <>
      <PageIntro
        eyebrow="Work"
        title="Four slots, held open."
        lede="The studio's published projects are being prepared. Each slot below shows the kind of work it is reserved for, and nothing here is presented as a project that has happened."
      />

      <section className="px-step-2 pb-step-5 md:px-step-3">
        <div className="mx-auto max-w-[100rem]">
          <ul className="grid grid-cols-1 gap-step-4 sm:grid-cols-2 md:gap-step-3">
            {WORK_PLACEHOLDERS.map((item, index) => (
              <li key={item.slug}>
                <WorkCard
                  item={item}
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, 48vw"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-step-2 pb-step-5 md:px-step-3">
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 className="type-micro text-slate">Working with the studio</h2>
          </Reveal>
          <Reveal step={1} steps={2} className="mt-step-3">
            <p className="type-heading measure text-[clamp(1.25rem,2.8vw,2rem)] leading-[1.3]">
              Every project runs the same five steps, on a four-week timeline,
              and ends with editable files rather than a single export.
            </p>
          </Reveal>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
