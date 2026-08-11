"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

/**
 * One place where scroll-driven motion is set up.
 *
 * ScrollTrigger is imported dynamically, so it is not in the critical path —
 * the page paints and becomes interactive before the animation code arrives,
 * and a reader who never scrolls never pays for it.
 *
 * Everything runs inside gsap.matchMedia() under
 * (prefers-reduced-motion: no-preference). That is not decoration: matchMedia
 * reverts every tween and trigger it created if the query stops matching, so
 * a reader who turns reduced motion on mid-session gets the final visible
 * state without a reload, and the elements are left exactly as authored. The
 * same mechanism gives effects a clean desktop/mobile split — cross the
 * breakpoint and the wrong branch is reverted rather than left behind.
 */

type ScrollTriggerStatic = typeof ScrollTriggerType;

let pending: Promise<ScrollTriggerStatic> | null = null;

export function loadScrollTrigger(): Promise<ScrollTriggerStatic> {
  if (!pending) {
    pending = import("gsap/ScrollTrigger").then((module) => {
      gsap.registerPlugin(module.ScrollTrigger);
      return module.ScrollTrigger;
    });
  }
  return pending;
}

interface SetupArgs<T extends HTMLElement> {
  root: T;
  ScrollTrigger: ScrollTriggerStatic;
  /**
   * Registers a branch that only runs when motion is allowed. Pass a media
   * query to narrow it further; it is combined with the reduced-motion
   * condition rather than replacing it.
   */
  onMotion: (
    query: string | null,
    build: () => void | (() => void),
  ) => void;
}

/**
 * Returns a ref to attach to the effect's root element. `setup` runs once the
 * plugin has loaded.
 */
export function useScrollEffect<T extends HTMLElement = HTMLDivElement>(
  setup: (args: SetupArgs<T>) => void,
): RefObject<T | null> {
  const rootRef = useRef<T>(null);
  const setupRef = useRef(setup);

  // Kept current in an effect rather than during render — a ref write in the
  // render phase is not safe under concurrent rendering.
  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let media: gsap.MatchMedia | null = null;
    let cancelled = false;

    loadScrollTrigger().then((ScrollTrigger) => {
      if (cancelled) return;

      media = gsap.matchMedia(root);

      const onMotion = (
        query: string | null,
        build: () => void | (() => void),
      ) => {
        const condition = query
          ? `(prefers-reduced-motion: no-preference) and ${query}`
          : "(prefers-reduced-motion: no-preference)";
        media?.add(condition, build);
      };

      setupRef.current({ root, ScrollTrigger, onMotion });
    });

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, []);

  return rootRef;
}
