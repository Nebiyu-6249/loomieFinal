"use client";

import gsap from "gsap";

import { useScrollEffect } from "./useScrollEffect";

/**
 * The per-section treatments, in one place.
 *
 * Every one of them is a wrapper that finds its own targets by data attribute
 * and animates them. That shape is deliberate: the page markup stays readable
 * as markup, and a section that loses its wrapper degrades to plain content
 * rather than to a blank box — every animated property starts at its final
 * value and is only moved away from it by script, after the reduced-motion
 * check has passed.
 *
 * No two adjacent sections use the same one.
 */

/**
 * Services. Each rule draws left to right as it enters, the number counts up,
 * and the copy line-masks in behind it.
 */
export function ServiceReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]", root);

      const context = gsap.context(() => {
        rows.forEach((row) => {
          const rule = row.querySelector<HTMLElement>("[data-service-rule]");
          const number = row.querySelector<HTMLElement>("[data-service-number]");

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 86%", once: true },
          });

          if (rule) {
            timeline.fromTo(
              rule,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
              0,
            );
          }

          if (number) {
            const target = Number(number.dataset.serviceNumberTarget ?? "0");
            const counter = { value: 0 };
            timeline.to(
              counter,
              {
                value: target,
                duration: 0.7,
                ease: "power2.out",
                onUpdate: () => {
                  number.textContent = String(Math.round(counter.value)).padStart(2, "0");
                },
              },
              0.1,
            );
          }
        });
      }, root);

      return () => context.revert();
    });
  });

  return <div ref={rootRef}>{children}</div>;
}

/**
 * Process. The connecting line draws between steps as you scroll, and each
 * step arrives as the line reaches it — so the sequence is drawn rather than
 * asserted.
 */
export function ProcessReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const line = root.querySelector<HTMLElement>("[data-process-line]");
      const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]", root);

      const context = gsap.context(() => {
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top 70%",
                end: "bottom 80%",
                scrub: 0.5,
              },
            },
          );
        }

        steps.forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0.25, x: -12 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: step, start: "top 78%", once: true },
            },
          );
        });
      }, root);

      return () => context.revert();
    });
  });

  return <div ref={rootRef}>{children}</div>;
}

/**
 * Packages. Cards rise on Z with their contents staggering in, and an ember
 * edge-light sweeps the tier the studio leads with.
 */
export function PackageReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-package-card]", root);

      const context = gsap.context(() => {
        cards.forEach((card, index) => {
          const items = card.querySelectorAll("[data-package-item]");

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 84%", once: true },
          });

          timeline.fromTo(
            card,
            { z: -220, opacity: 0 },
            { z: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: index * 0.08 },
            0,
          );

          timeline.fromTo(
            items,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" },
            0.25,
          );
        });
      }, root);

      return () => context.revert();
    });
  });

  return <div ref={rootRef}>{children}</div>;
}

/**
 * Principles and values. Each scales up from 0.94 with its hairline drawing
 * outward from the centre rather than in from an edge — the only rule on the
 * site that opens both ways, which is what marks these as statements.
 */
export function PrincipleReveal({ children }: { children: React.ReactNode }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-principle]", root);

      const context = gsap.context(() => {
        items.forEach((item) => {
          const rule = item.querySelector<HTMLElement>("[data-principle-rule]");

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: item, start: "top 86%", once: true },
          });

          timeline.fromTo(
            item,
            { scale: 0.94, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
            0,
          );

          if (rule) {
            timeline.fromTo(
              rule,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.7, ease: "power3.out" },
              0.05,
            );
          }
        });
      }, root);

      return () => context.revert();
    });
  });

  return <div ref={rootRef}>{children}</div>;
}

/**
 * Clients. Sector labels type in, one character at a time, fast.
 *
 * The full string is in the DOM from the server and is only emptied once the
 * animation is about to run, so the text is readable to a crawler, to a
 * reader with the preference set, and in the moment before the script lands.
 */
export function TypeIn({ children }: { children: React.ReactNode }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const labels = gsap.utils.toArray<HTMLElement>("[data-type-in]", root);

      const context = gsap.context(() => {
        labels.forEach((label, index) => {
          const full = label.textContent ?? "";
          const state = { count: 0 };

          gsap.to(state, {
            count: full.length,
            duration: Math.min(full.length * 0.028, 1.1),
            ease: "none",
            delay: index * 0.07,
            onStart: () => {
              label.textContent = "";
            },
            onUpdate: () => {
              label.textContent = full.slice(0, Math.round(state.count));
            },
            onComplete: () => {
              label.textContent = full;
            },
            scrollTrigger: { trigger: label, start: "top 90%", once: true },
          });
        });
      }, root);

      return () => context.revert();
    });
  });

  return <div ref={rootRef}>{children}</div>;
}

/**
 * The page's weather. The ambient field shifts position and temperature
 * between sections, scrubbed against the whole document, so descending the
 * page moves the light rather than repainting it.
 */
export function AmbientField({ tone = "neutral" }: { tone?: "warm" | "cold" | "neutral" }) {
  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion(null, () => {
      const context = gsap.context(() => {
        gsap.fromTo(
          root,
          { "--field-y": "18%", "--field-x": "22%" },
          {
            "--field-y": "84%",
            "--field-x": "72%",
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          },
        );
      }, root);

      return () => context.revert();
    });
  });

  return (
    <div ref={rootRef} className="ambient-field" data-tone={tone} aria-hidden="true" />
  );
}
