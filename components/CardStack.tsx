"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Plate } from "./Plate";
import { useMotionAllowed } from "./useMotionPreference";
import type { WorkPlaceholder } from "@/lib/content";

/**
 * Move five of nine — the card stack.
 *
 * A perspective stack that cycles: the front card drops away, the rest
 * promote forward, and the dropped card returns to the back. CSS transforms
 * only, on a 1200px perspective, with an elastic settle.
 *
 * It stops when it should. Hovering pauses it, focus pauses it, and an
 * IntersectionObserver stops the timer entirely when the stack is off screen
 * so a background tab or a footer visit is not paying for a running loop.
 *
 * Every card is a real link, so tab reaches it and Enter follows it. Space is
 * handled explicitly because a link ignores it by default, and the brief asks
 * for both.
 *
 * On a phone it is not a stack at all — it is a horizontal snap-scroll row,
 * which is what a thumb expects.
 */

const INTERVAL_MS = 4500;

interface CardStackProps {
  items: readonly WorkPlaceholder[];
}

export function CardStack({ items }: CardStackProps) {
  const motionAllowed = useMotionAllowed();
  const [order, setOrder] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const advance = useCallback(() => {
    setOrder((value) => (value + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!motionAllowed || paused || !visible) return;
    const id = window.setInterval(advance, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [motionAllowed, paused, visible, advance]);

  return (
    <div
      ref={rootRef}
      className="card-stack"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul className="card-stack-list">
        {items.map((item, index) => {
          // Position in the stack, front first.
          const depth = (index - order + items.length) % items.length;

          return (
            <li
              key={item.slug}
              className="card-stack-item"
              data-depth={depth}
              style={
                {
                  "--depth": depth,
                  zIndex: items.length - depth,
                } as React.CSSProperties
              }
            >
              <Link
                href={`/work/${item.slug}`}
                className="hover-card block focus-visible:outline-offset-4"
                aria-label={`${item.discipline} — reserved slot`}
                onKeyDown={(event) => {
                  if (event.key === " ") {
                    event.preventDefault();
                    event.currentTarget.click();
                  }
                }}
              >
                <Plate
                  seed={item.slug}
                  ratio="3/2"
                  src={item.image}
                  alt=""
                  sizes="(max-width: 768px) 82vw, 42vw"
                />
                <span className="mt-step-2 flex items-baseline justify-between gap-step-2">
                  <span className="type-heading text-[clamp(1.125rem,2vw,1.5rem)]">
                    {item.discipline}
                  </span>
                  <span className="type-micro text-slate">{item.sector}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* The cycle is decorative; the same links live in the grid below. */}
      <div className="mt-step-3 flex items-center gap-step-2">
        <button
          type="button"
          onClick={advance}
          className="type-micro hover-line inline-flex min-h-11 items-center text-ink"
        >
          [ Next ]
        </button>
        <span className="type-micro text-slate" aria-live="off">
          {order + 1} / {items.length}
        </span>
      </div>
    </div>
  );
}
