import type { Metadata, Viewport } from "next";
import {
  Familjen_Grotesk,
  Instrument_Serif,
  Martian_Mono,
} from "next/font/google";

import "./globals.css";
import { AmbientField } from "@/components/SectionEffects";
import { Blink } from "@/components/Blink";
import { CursorLight } from "@/components/CursorLight";
import { Grain } from "@/components/Grain";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE, TAGLINE } from "@/lib/content";

/*
  Three registers, three jobs.

  Instrument Serif carries display only, at 400 and never below 40px — its
  thin strokes need the size, and holding it above that keeps it a voice
  rather than a texture. Familjen Grotesk runs everything from 15px to 32px.
  Martian Mono is the chrome: counters, labels, annotations, at 10 to 11px.

  A high-contrast serif against a neutral grotesque against a technical mono
  reads as three voices. One grotesque doing all three jobs is what made the
  earlier build read as competent and nothing else.
*/
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument",
});

const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-familjen",
});

const martian = Martian_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-martian",
});

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loomiestudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Loomie — Creative studio",
    template: "%s — Loomie",
  },
  description: TAGLINE,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_AE",
    title: "Loomie — Creative studio",
    description: SITE.specLine,
  },
  twitter: {
    card: "summary_large_image",
    title: "Loomie — Creative studio",
    description: SITE.specLine,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${familjen.variable} ${martian.variable}`}
    >
      <body className="min-h-svh">
        <a
          href="#main"
          className="type-micro sr-only focus:not-sr-only focus:fixed focus:left-step-2 focus:top-step-2 focus:z-[60] focus:bg-void focus:px-step-2 focus:py-step-1 focus:text-field"
        >
          Skip to content
        </a>

        {/*
          The page's weather, below everything. Its position is scrubbed
          against the whole document, so descending a route moves the light
          rather than swapping one gradient for another at each boundary.
        */}
        <AmbientField />

        {/*
          The light and the grain are root-level siblings on purpose. They
          blend against the page, and any wrapper around them — even one
          carrying nothing but a z-index — would make a stacking context and
          isolate the blend group, which turns the grain into a flat grey
          sheet.

          Order matters as much as nesting: the light is z-39 and the grain
          z-40, so the grain develops inside the lit area.
        */}
        <Blink />
        <CursorLight />
        <Grain />

        <SiteHeader />

        {/* Clears the fixed header, which is a fixed 4rem at every width. */}
        <div className="h-16" aria-hidden="true" />

        {/*
          No wrapper. The old transition animated a transform here, which made
          this element the containing block for every fixed descendant while
          it ran and sent the pinned sections thousands of pixels off-screen.
          The blink lives in its own fixed siblings above, so the content tree
          is plain again.
        */}
        <main id="main">{children}</main>

        <SiteFooter />
      </body>
    </html>
  );
}
