import type { Metadata, Viewport } from "next";
import {
  Familjen_Grotesk,
  Instrument_Serif,
  Martian_Mono,
} from "next/font/google";

import "./globals.css";
import { Grain } from "@/components/Grain";
import { PageTransition } from "@/components/PageTransition";
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

        <Grain />

        <SiteHeader />

        {/* Clears the fixed header, which is a fixed 4rem at every width. */}
        <div className="h-16" aria-hidden="true" />

        <PageTransition>
          <main id="main">{children}</main>
        </PageTransition>

        <SiteFooter />
      </body>
    </html>
  );
}
