"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";

import { loadScrollTrigger } from "./useScrollEffect";

/**
 * The line mask. Body copy rises out from behind a mask, never fades.
 *
 * A paragraph's lines are not elements, so they have to be made into some
 * first. This splits on rendered line boxes rather than on words or on a
 * character count: it measures where the browser actually broke the text and
 * wraps each run in its own overflow-hidden span. That is the only way the
 * mask edge lands on the real line, and it means the split survives a resize,
 * a font swap, and a language with different word lengths.
 *
 * Text is only ever split after the reduced-motion check has passed, and the
 * original text node is restored on cleanup, so a reader with the preference
 * set, a failed chunk, or no JavaScript at all gets an ordinary paragraph.
 * Nothing here is load-bearing for reading the page.
 */

const STAGGER = 0.08;

interface LineMaskProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Delay before the first line, for a block that follows a heading. */
  delay?: number;
}

export function LineMask({
  children,
  as: Tag = "p",
  className = "",
  delay = 0,
}: LineMaskProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const original = element.innerHTML;
    let context: gsap.Context | null = null;
    let cancelled = false;

    /**
     * Wrap every word, measure which line box each landed on, then group the
     * words back into one masked span per line.
     */
    const split = () => {
      const text = element.textContent ?? "";
      element.textContent = "";

      const words = text.split(/(\s+)/).filter(Boolean);
      const spans = words.map((word) => {
        const span = document.createElement("span");
        span.textContent = word;
        element.appendChild(span);
        return span;
      });

      const lines: HTMLSpanElement[][] = [];
      let lastTop: number | null = null;

      for (const span of spans) {
        const top = span.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 1) {
          lines.push([]);
          lastTop = top;
        }
        lines[lines.length - 1].push(span);
      }

      element.textContent = "";

      return lines.map((line) => {
        const mask = document.createElement("span");
        mask.className = "line-mask";
        const inner = document.createElement("span");
        inner.className = "line-mask-inner";
        inner.textContent = line.map((span) => span.textContent).join("");
        mask.appendChild(inner);
        element.appendChild(mask);
        return inner;
      });
    };

    // After fonts, or the measurement is of the fallback's line breaks.
    const run = () => {
      if (cancelled) return;
      const inners = split();

      loadScrollTrigger().then(() => {
        if (cancelled) return;
        context = gsap.context(() => {
          gsap.fromTo(
            inners,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: STAGGER,
              delay,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        }, element);
      });
    };

    if (document.fonts?.status === "loaded") run();
    else void document.fonts?.ready.then(run).catch(run);

    return () => {
      cancelled = true;
      context?.revert();
      element.innerHTML = original;
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
