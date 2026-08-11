"use client";

import { useEffect, useRef, useState } from "react";

import { LightsMedia, RiverMedia, SnowMedia } from "./MeaningMedia";
import { useMotionAllowed } from "./useMotionPreference";
import { MEANINGS } from "@/lib/content";

/**
 * One name, three languages — and three states.
 *
 * The section was three words on a gradient. Now each word is a control: hover
 * or focus it and the whole section becomes that meaning. Snow drifts and the
 * field turns cold; the river runs and the field goes deep and neutral; the
 * lights come up and it turns warm. The media and the ambient field cross-fade
 * together over 800ms, so the temperature change and the picture change are
 * one event rather than two.
 *
 * The words are buttons, not divs with hover handlers. That is the whole
 * accessibility story here: focus does what hover does because focus is a real
 * state of a real control, arrow keys and tab work because the browser
 * provides them, and the change is announced through a live region rather than
 * being a purely visual event a screen reader never hears about.
 *
 * All three media stay mounted and cross-fade rather than swapping, because
 * mounting a canvas or a filter mid-transition drops frames exactly when
 * someone is looking. The inactive ones stop painting.
 */

const LIVE_LABEL: Record<string, string> = {
  snow: "Snow. Drifting, cold.",
  river: "River. Dark water, moving.",
  lights: "Lights. Warm, out of focus.",
};

export function Meanings({ origin }: { origin: string }) {
  const [active, setActive] = useState(0);
  const motionAllowed = useMotionAllowed();
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  /*
    Nothing here starts until the section has been on screen once. A canvas
    loop and an SVG turbulence filter running behind a fold nobody has reached
    are pure cost, and this is the section furthest down the hero's pin.
  */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || seen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [seen]);

  const activeWord = MEANINGS[active].word;

  return (
    <div
      ref={rootRef}
      className="meanings"
      data-meaning={activeWord}
      onMouseLeave={() => setActive(0)}
    >
      {/* The ambient field. Three grounds cross-fading, not one recoloured. */}
      <div className="meanings-ambient" aria-hidden="true">
        <span data-field="snow" />
        <span data-field="river" />
        <span data-field="lights" />
      </div>

      <div className="meanings-media" aria-hidden="true">
        <div data-state="snow">
          {seen ? <SnowMedia active={active === 0} /> : null}
        </div>
        <div data-state="river">
          {seen ? <RiverMedia animate={motionAllowed && active === 1} /> : null}
        </div>
        <div data-state="lights">{seen ? <LightsMedia /> : null}</div>
      </div>

      <div className="mx-auto flex h-full max-w-[100rem] flex-col justify-center px-step-2 py-step-4 md:px-step-3">
        <h2 className="type-micro text-field/70">One name, three languages</h2>

        <ul className="mt-step-3 flex flex-col gap-step-2 md:mt-step-4 md:flex-row md:gap-step-5">
          {MEANINGS.map((meaning, index) => (
            <li key={meaning.language}>
              <button
                type="button"
                aria-pressed={active === index}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="meaning-word"
              >
                <span className="type-display block text-[clamp(2.5rem,7vw,5.5rem)]">
                  {meaning.word}
                </span>
                <span className="type-micro mt-step-1 block text-field/70">
                  {meaning.language}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <p className="type-body measure-tight mt-step-4 text-field/85">{origin}</p>

        {/*
          Polite, not assertive: this fires on hover as well as focus, and an
          assertive region would interrupt a screen reader every time a pointer
          crossed a word.
        */}
        <p className="sr-only" aria-live="polite">
          {LIVE_LABEL[activeWord]}
        </p>
      </div>
    </div>
  );
}
