"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one tonal event on a page.
 *
 * Every route was Field on Field on Field, which is half of why the site read
 * as flat. Each page now gets exactly one full-bleed Ink section: Ink ground,
 * Field type, Thaw as the single accent.
 *
 * It arrives rather than fades. The ground is a separate layer that scales up
 * on its Y axis as the section approaches, so the black opens out from a band
 * into the full height — a transform, so it costs nothing and never reflows
 * the text sitting on top of it. The scrub is tied to the approach rather
 * than to a pin, so the page never stops scrolling for it.
 *
 * The arrival shares its trigger with the section opener's letter reveal, so
 * the two are one move rather than two.
 */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface DarkSectionProps {
  children: ReactNode;
  className?: string;
  /** Labels the section for assistive technology. */
  labelledBy?: string;
}

export function DarkSection({
  children,
  className = "",
  labelledBy,
}: DarkSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    const ground = root.querySelector<HTMLElement>("[data-dark-ground]");
    if (!ground) return;

    const context = gsap.context(() => {
      gsap.set(ground, { scaleY: 0.66 });

      gsap.to(ground, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "top 55%",
          scrub: 0.6,
        },
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby={labelledBy}
      className={`relative isolate overflow-hidden bg-field px-step-2 py-step-6 text-field md:px-step-3 ${className}`}
    >
      {/*
        A separate layer so the scale never touches the type. Origin at the
        centre, so the black opens from the middle outward.
      */}
      <span
        aria-hidden="true"
        data-dark-ground=""
        className="absolute inset-0 -z-10 block origin-center bg-ink"
      />
      <div className="mx-auto max-w-[100rem]">{children}</div>
    </section>
  );
}
