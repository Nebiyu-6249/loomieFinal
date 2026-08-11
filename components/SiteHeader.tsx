"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Wordmark } from "./Wordmark";
import { SITE } from "@/lib/content";

/**
 * Micro-typographic chrome, taken from the reference: a two-line descriptor
 * set beside the logotype, nav items at eleven pixels, and a bracketed call to
 * action rather than a filled button.
 *
 * No section counter. The homepage's sections are not a sequence, and
 * numbering them would be a decoration pretending to be information.
 */

const NAV = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/studio", label: "Studio" },
  { href: "/clients", label: "Clients" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navigatedFrom, setNavigatedFrom] = useState(pathname);

  // Route change closes the panel; the transition would otherwise leave it up.
  // Adjusted during render rather than in an effect, so there is no extra pass.
  if (navigatedFrom !== pathname) {
    setNavigatedFrom(pathname);
    setOpen(false);
  }

  // A panel that covers the page should not leave the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 bg-void transition-colors duration-200">
      {/*
        A fixed 4rem so the spacer in the layout can match it exactly at every
        width. A header whose height depends on its contents leaves a gap that
        is right at one breakpoint and wrong at the others.
      */}
      <div className="mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-step-3 px-step-2 md:px-step-3">
        <div className="flex items-center gap-step-2">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center hover:opacity-70"
            aria-label="Loomie — home"
          >
            <Wordmark />
          </Link>

          {/* The descriptor, set at the size the reference sets it. */}
          <span
            className="type-micro hidden text-slate sm:block"
            aria-hidden="true"
          >
            Clear. Connected.
            <br />
            Complete.
          </span>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-step-3 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`type-micro hover-line hover:text-field ${
                isActive(item.href) ? "text-field" : "text-field/75"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            aria-current={isActive("/contact") ? "page" : undefined}
            className="type-micro hover-line text-field"
          >
            [ Contact ]
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="type-micro -m-step-1 flex min-h-11 min-w-11 items-center justify-end p-step-1 text-field md:hidden"
        >
          {open ? "[ Close ]" : "[ Menu ]"}
        </button>
      </div>

      <span
        aria-hidden="true"
        className="site-header-rule block h-px w-full bg-smoke transition-opacity duration-200"
      />

      {/*
        The mobile panel is a plain full-height list, not a drawer that slides.
        A transform here would be a sixth motion move for no gain.
      */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto bg-void px-step-2 pb-step-4 pt-step-3 md:hidden"
      >
        <nav aria-label="Primary" className="flex flex-col">
          {[...NAV, { href: "/contact", label: "Contact" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="type-heading flex min-h-14 items-center border-b border-haze text-[clamp(1.75rem,9vw,2.5rem)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="type-micro mt-step-3 text-slate">{SITE.origin}</p>
      </div>
    </header>
  );
}
