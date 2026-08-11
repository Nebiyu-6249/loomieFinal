import type { Metadata } from "next";

import { ContactCta } from "@/components/ContactCta";
import { PageIntro } from "@/components/PageIntro";
import { PlaceholderWordmark } from "@/components/PlaceholderWordmark";
import { Reveal } from "@/components/Reveal";
import { AUDIENCE, PLACEHOLDER_WORDMARKS, VALUES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "Loomie works with startups, small and medium businesses and growing brands that want a strong, consistent visual identity.",
  alternates: { canonical: "/clients" },
};

export default function Clients() {
  return (
    <>
      <PageIntro
        eyebrow="Clients"
        title="Who the studio works with."
        lede="Brands at the point where the identity has to hold together across more places than one person can keep in their head."
      />

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="audience"
      >
        <div className="mx-auto max-w-[100rem]">
          <h2 id="audience" className="sr-only">
            Who Loomie works with
          </h2>

          <ul className="flex flex-col">
            {AUDIENCE.map((entry, index) => (
              <li key={entry}>
                <Reveal step={index} steps={AUDIENCE.length} className="py-step-3">
                  <p className="type-heading measure text-[clamp(1.375rem,3.4vw,2.5rem)] leading-[1.25]">
                    {entry}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*
        Invented names, drawn in the site's own type as inline SVG. Labelled in
        the interface rather than only in the source, so a visitor is not left
        to guess whether these are real.
      */}
      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="placeholders"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="placeholders" className="type-micro text-slate">
              Placeholder wordmarks — invented names, not clients
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-4" rule={false}>
            <ul className="grid grid-cols-2 gap-px bg-drift sm:grid-cols-3">
              {PLACEHOLDER_WORDMARKS.map((name) => (
                <li
                  key={name}
                  className="flex min-h-32 items-center justify-center bg-field p-step-2 text-slate"
                >
                  <PlaceholderWordmark name={name} />
                </li>
              ))}
            </ul>
            <p className="type-micro mt-step-2 text-slate">
              These six names are inventions standing in for a real client list.
              They will be replaced when the founder supplies one.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        className="px-step-2 pb-step-5 md:px-step-3"
        aria-labelledby="expect"
      >
        <div className="mx-auto max-w-[100rem]">
          <Reveal step={0} steps={2}>
            <h2 id="expect" className="type-micro text-slate">
              What you get either way
            </h2>
          </Reveal>

          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <dl className="grid gap-step-3 md:grid-cols-3 md:gap-step-4">
              {VALUES.map((value) => (
                <div key={value.name} className="border-t border-ink pt-step-2">
                  <dt className="type-heading text-[clamp(1.375rem,2.8vw,2rem)]">
                    {value.name}
                  </dt>
                  <dd className="type-body mt-step-2 text-slate">
                    {value.detail}
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
