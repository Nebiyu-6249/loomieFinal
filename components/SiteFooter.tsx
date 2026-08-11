import Link from "next/link";

import { LoomieEyes } from "./LoomieEyes";
import { SITE } from "@/lib/content";
import { clearSpaceFor } from "@/lib/mark";

const FOOTER_NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/studio", label: "Studio" },
  { href: "/clients", label: "Clients" },
  { href: "/contact", label: "Contact" },
] as const;

const MARK_WIDTH = 96;

export function SiteFooter() {
  return (
    <footer className="border-t border-drift px-step-2 pb-step-3 pt-step-4 md:px-step-3">
      <div className="mx-auto max-w-[100rem]">
        <div className="flex flex-col gap-step-4 md:flex-row md:justify-between">
          <div>
            <div
              style={{
                width: MARK_WIDTH + clearSpaceFor(MARK_WIDTH) * 2,
                padding: clearSpaceFor(MARK_WIDTH),
              }}
            >
              <LoomieEyes
                className="w-full"
                track={false}
                label="Loomie"
                renderWidth={MARK_WIDTH}
              />
            </div>
            <p className="type-micro mt-step-2 text-slate">{SITE.specLine}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-step-1">
            {FOOTER_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="type-micro hover-line inline-flex min-h-11 items-center text-slate hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="max-w-[22rem]">
            <p className="type-micro text-slate">Contact</p>
            <a
              href={`mailto:${SITE.email}`}
              className="type-heading hover-line mt-step-1 inline-flex min-h-11 items-center text-[clamp(1.125rem,2.6vw,1.5rem)]"
            >
              {SITE.email}
            </a>
            <p className="type-micro mt-step-3 text-slate">{SITE.origin}</p>
          </div>
        </div>

        <p className="type-micro mt-step-5 text-slate">
          © {new Date().getFullYear()} Loomie
        </p>
      </div>
    </footer>
  );
}
