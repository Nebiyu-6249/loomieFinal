import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="px-step-2 py-step-5 md:px-step-3">
      <div className="mx-auto max-w-[100rem]">
        <p className="type-micro text-slate">404</p>
        <h1 className="type-display mt-step-2 max-w-[14ch] text-[clamp(2.5rem,8vw,7rem)]">
          Nothing here.
        </h1>
        <p className="type-body measure-tight mt-step-3 text-slate">
          The page you asked for does not exist. It may have been a reserved
          project slot that has since been replaced.
        </p>

        <div className="mt-step-4 flex flex-wrap gap-step-3">
          <Link href="/" className="type-micro hover-line text-field">
            [ Home ]
          </Link>
          <Link href="/work" className="type-micro hover-line text-slate">
            Work
          </Link>
          <Link href="/contact" className="type-micro hover-line text-slate">
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
