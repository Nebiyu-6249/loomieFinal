import type { Metadata } from "next";

import { BookingForm } from "@/components/BookingForm";
import { DarkSection } from "@/components/DarkSection";
import { DubaiClock } from "@/components/DubaiClock";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { proposedSlots } from "@/lib/booking";
import { FAQ, SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a call with Loomie. Times are shown in your timezone and in Dubai, and the studio replies by email.",
  alternates: { canonical: "/contact" },
};

/**
 * The offered times have to be real, so this page is built per request rather
 * than at deploy time. It also means the slot list works without JavaScript.
 */
export const dynamic = "force-dynamic";

export default function Contact() {
  const slots = proposedSlots();

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Ask for a time."
        lede="Pick one that suits you and the studio will confirm it by email. Nothing books itself."
      />

      <section className="px-step-2 pb-step-5 md:px-step-3">
        <div className="mx-auto grid max-w-[100rem] gap-step-4 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-step-5">
          <div>
            <Reveal step={0} steps={2}>
              <h2 className="type-micro text-slate">The studio</h2>
              <p className="type-heading mt-step-2 text-[clamp(1.5rem,3vw,2rem)]">
                <a href={`mailto:${SITE.email}`} className="hover-line">
                  {SITE.email}
                </a>
              </p>
            </Reveal>

            <Reveal step={1} steps={2} className="mt-step-4">
              <h3 className="type-micro text-slate">
                Local time — {SITE.timezone.label} (UTC+
                {SITE.timezone.offsetHours})
              </h3>
              <p className="type-heading mt-step-2 text-[clamp(2.5rem,6vw,4rem)]">
                <DubaiClock />
              </p>
              <p className="type-meta mt-step-2">
                Dubai does not observe daylight saving, so this offset holds all
                year.
              </p>
              <p className="type-meta mt-step-3">{SITE.origin}</p>
            </Reveal>
          </div>

          <div className="border-t border-ink pt-step-3">
            <h2 className="type-micro text-slate">Request a call</h2>
            <div className="mt-step-3">
              <BookingForm slots={slots} />
            </div>
          </div>
        </div>
      </section>

      <DarkSection labelledBy="faq">
          <Reveal step={0} steps={2}>
            <h2 id="faq" className="type-micro text-thaw">
              Questions people ask first
            </h2>
          </Reveal>

          {/*
            A list of details elements rather than a scripted accordion: open
            and close work from the keyboard, on first paint, and with the
            browser's own find-in-page. A definition list would have been the
            tempting markup, but a dd cannot live inside a details.
          */}
          <Reveal step={1} steps={2} className="mt-step-3" rule={false}>
            <ul>
              {FAQ.map((item) => (
                <li key={item.question} className="border-t border-field/25">
                  <details className="group">
                    <summary className="type-heading flex min-h-16 cursor-pointer list-none items-center justify-between gap-step-2 py-step-2 text-[clamp(1.0625rem,2.2vw,1.375rem)] [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span
                        aria-hidden="true"
                        className="type-micro shrink-0 text-thaw"
                      >
                        <span className="group-open:hidden">[ + ]</span>
                        <span className="hidden group-open:inline">[ − ]</span>
                      </span>
                    </summary>
                    <p className="type-body measure pb-step-3 text-field/75">
                      {item.answer}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
      </DarkSection>
    </>
  );
}
