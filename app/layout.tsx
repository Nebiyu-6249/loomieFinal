import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";

import "./globals.css";
import { PageTransition } from "@/components/PageTransition";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE, TAGLINE } from "@/lib/content";

/*
  One family carries the whole site, from eleven pixels to a hundred and
  ninety. A second voice would contradict the thing the studio sells, so the
  only other face is the mono, and it is never allowed above thirteen pixels.
*/
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
  themeColor: "#f2f3f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${familjen.variable} ${martian.variable}`}>
      <body className="min-h-svh">
        <a
          href="#main"
          className="type-micro sr-only focus:not-sr-only focus:fixed focus:left-step-2 focus:top-step-2 focus:z-[60] focus:bg-field focus:px-step-2 focus:py-step-1 focus:text-ink"
        >
          Skip to content
        </a>

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
