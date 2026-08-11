"use client";

import { useEffect, useRef } from "react";

/**
 * A video in an image slot.
 *
 * Muted, looping, inline, and playing only while it is actually on screen —
 * an IntersectionObserver starts it on entry and pauses it on exit, so a
 * video three sections down the page is not decoding frames nobody is
 * looking at.
 *
 * It carries no controls and no sound, because it is a texture rather than a
 * thing to watch. That is also why it needs no accessible name: it is
 * decorative, marked aria-hidden, and every slot it can appear in has a
 * caption beside it that carries the meaning.
 *
 * Under reduced motion it never plays. The poster frame stands in, which is
 * why a poster is required rather than optional — without one, a reader with
 * the preference set would get an empty box.
 */
export function SlotVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!motion.matches) return;
        if (entry.isIntersecting) {
          // A rejected play() is not an error worth surfacing: an OS-level
          // power saver refusing autoplay is a legitimate answer, and the
          // poster is already showing.
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);

    const onPreferenceChange = () => {
      if (!motion.matches) video.pause();
    };
    motion.addEventListener("change", onPreferenceChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
