"use client";

import { useEffect, useMemo, useRef, type ElementType } from "react";
import gsap from "gsap";

import { loadScrollTrigger } from "./useScrollEffect";

/**
 * Move one of fourteen — the letter reveal.
 *
 * Per character: opacity 0→1, y 24px→0, blur 10px→0, stagger 0.03, power3.out.
 * Adapted from the Stagger List preset at the expo tier (400–700ms), which is
 * the database's character-split entry; its guidance is followed too — short
 * headlines only, and the split is undone on cleanup so assistive technology
 * and find-in-page see real text rather than a box of single letters.
 *
 * The text is split into spans that are hidden from the accessibility tree,
 * with the real string on an aria-label. Nothing is ever read out character by
 * character.
 *
 * Over the character cap it renders as one block and animates as one block —
 * a hundred separate elements to fade in a paragraph is a bad trade, and the
 * preset says the same.
 */

const MAX_CHARS = 60;

interface LetterRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Fire on mount rather than on scroll. Use for the hero only. */
  onMount?: boolean;
  id?: string;
}

export function LetterReveal({
  text,
  as: Tag = "span",
  className = "",
  onMount = false,
  id,
}: LetterRevealProps) {
  const rootRef = useRef<HTMLElement>(null);

  // Split on words first so a word never breaks across a line mid-animation.
  const words = useMemo(() => text.split(" "), [text]);
  const splittable = text.length <= MAX_CHARS;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let media: gsap.MatchMedia | null = null;
    let cancelled = false;

    const run = (ScrollTrigger: unknown) => {
      if (cancelled) return;
      void ScrollTrigger;

      media = gsap.matchMedia(root);
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = splittable
          ? root.querySelectorAll<HTMLElement>("[data-letter]")
          : [root];

        gsap.set(targets, { opacity: 0, y: 24, filter: "blur(10px)" });
        gsap.set(root, { willChange: "transform" });

        const tween = gsap.to(targets, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: splittable ? 0.03 : 0,
          ease: "power3.out",
          // will-change is a promise to the compositor, not a decoration; it
          // is expensive to leave set, so it is cleared the moment it is done.
          onComplete: () => gsap.set(root, { willChange: "auto" }),
          ...(onMount
            ? { delay: 0.05 }
            : {
                scrollTrigger: { trigger: root, start: "top 85%", once: true },
              }),
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    };

    if (onMount) {
      run(null);
    } else {
      loadScrollTrigger().then(run);
    }

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, [onMount, splittable, text]);

  const Element = Tag as ElementType;

  if (!splittable) {
    return (
      <Element ref={rootRef} className={className} id={id}>
        {text}
      </Element>
    );
  }

  return (
    <Element ref={rootRef} className={className} id={id} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
          {[...word].map((character, index) => (
            <span
              key={`${character}-${index}`}
              data-letter=""
              aria-hidden="true"
              className="inline-block will-change-auto"
            >
              {character}
            </span>
          ))}
          {wordIndex < words.length - 1 ? (
            <span aria-hidden="true" data-letter="" className="inline-block">
              &nbsp;
            </span>
          ) : null}
        </span>
      ))}
    </Element>
  );
}
