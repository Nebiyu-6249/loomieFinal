"use client";

import Link from "next/link";
import gsap from "gsap";
import { useRef, useState } from "react";

import { LetterReveal } from "./LetterReveal";
import { Plate } from "./Plate";
import { subscribeToPointerFrame } from "./pointerStore";
import { useScrollEffect } from "./useScrollEffect";
import type { WorkPlaceholder } from "@/lib/content";

/**
 * The work corridor. Replaces the card stack.
 *
 * Four plates arranged in depth along Z, and scroll drives the camera forward
 * through them. As a plate approaches it grows, sharpens and its title
 * resolves; as it passes it drifts off-axis and blurs out. One plate is
 * dominant at any moment and its title is the only one on screen.
 *
 * Why a corridor beats a stack: a stack shows you four things at once and
 * asks you to read the front one. A corridor shows you one thing and takes
 * you to the next. It is also the only arrangement where the depth is real —
 * the plates are at genuinely different Z, so the parallax between them is a
 * consequence rather than an effect.
 *
 * The camera flow is scoped to this section. It is one of exactly three
 * places on the site that hijacks scroll semantics, because applying it
 * everywhere would break anchor links and reading order for everyone.
 *
 * Keyboard: each plate is a real link, tab reaches them in document order,
 * and focusing one scrolls it to dominance rather than leaving the reader
 * focused on something the camera is nowhere near.
 *
 * Mobile gets none of it. A horizontal snap-scroll row of the same four
 * plates is what a thumb expects, and pinning a viewport-height section on a
 * touch device to hijack its scroll is how you trap someone mid-page.
 */

/** Distance between plates, in the stage's own Z units. */
const SPACING = 900;
/** How far past the nearest plate the camera travels before the section ends. */
const RUN_OUT = 700;
/** Lateral sway from the pointer, in degrees. */
const SWAY = 2.4;

interface WorkCorridorProps {
  items: readonly WorkPlaceholder[];
}

export function WorkCorridor({ items }: WorkCorridorProps) {
  const [dominant, setDominant] = useState(0);
  const dominantRef = useRef(0);

  const rootRef = useScrollEffect<HTMLDivElement>(({ root, onMotion }) => {
    onMotion("(min-width: 48rem)", () => {
      const stage = root.querySelector<HTMLElement>("[data-corridor-stage]");
      const dolly = root.querySelector<HTMLElement>("[data-corridor-dolly]");
      const plates = gsap.utils.toArray<HTMLElement>("[data-corridor-plate]", root);
      if (!stage || !dolly || plates.length === 0) return;

      // Laid out once. Only the dolly moves after this.
      plates.forEach((plate, index) => {
        gsap.set(plate, {
          z: -index * SPACING,
          // Alternating either side of the axis, so the camera weaves through
          // them rather than running down a straight tube.
          xPercent: index % 2 === 0 ? -64 : -36,
          yPercent: -50,
        });
      });

      const travel = (plates.length - 1) * SPACING + RUN_OUT;
      const state = { z: 0, sway: 0 };

      const write = () => {
        dolly.style.transform = `rotateY(${state.sway.toFixed(2)}deg) translate3d(0,0,${state.z.toFixed(1)}px)`;
      };

      const tween = gsap.to(state, {
        z: travel,
        ease: "none",
        onUpdate: () => {
          write();

          /*
            Dominance is decided by which plate the camera is nearest, not by
            a scroll fraction. They are the same number today; they stop being
            the same the moment a plate is added or the spacing changes, and
            the title on screen has to be the plate you are looking at.
          */
          const nearest = Math.min(
            plates.length - 1,
            Math.max(0, Math.round(state.z / SPACING)),
          );
          if (nearest !== dominantRef.current) {
            dominantRef.current = nearest;
            setDominant(nearest);
          }

          plates.forEach((plate, index) => {
            // Signed distance: negative once the plate is behind the camera.
            const ahead = -index * SPACING + state.z;
            const near = Math.abs(ahead) / SPACING;

            /*
              A flat zone either side of dead centre, then falloff. Without it
              the dominant plate was never actually sharp — it only hit full
              opacity and zero blur at the single frame where the camera was
              exactly on it, so the thing you were meant to be looking at was
              always slightly soft.
            */
            const past = Math.max(0, near - 0.45);
            plate.style.opacity = `${Math.max(0, 1 - past * 1.5)}`;
            plate.style.filter = past > 0 ? `blur(${Math.min(past * 12, 16)}px)` : "none";
          });
        },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${travel * 0.9}`,
          scrub: 0.6,
          pin: stage,
          anticipatePin: 1,
          pinType: "transform",
          invalidateOnRefresh: true,
        },
      });

      // The pointer nudges the camera sideways. Lerped, so it trails.
      const unsubscribe = subscribeToPointerFrame((_time, pointer) => {
        const target = pointer.seen && pointer.fine
          ? ((pointer.x / window.innerWidth) * 2 - 1) * SWAY
          : 0;
        state.sway += (target - state.sway) * 0.06;
        write();
      });

      return () => {
        unsubscribe();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
  });

  const current = items[Math.min(dominant, items.length - 1)];

  return (
    <div ref={rootRef} className="corridor">
      <div data-corridor-stage="" className="corridor-stage">
        <div data-corridor-dolly="" className="corridor-dolly">
          {items.map((item, index) => (
            <div key={item.slug} data-corridor-plate="" className="corridor-plate">
              <Link
                href={`/work/${item.slug}`}
                className="hover-card block"
                aria-label={`${item.discipline} — ${item.sector}`}
                onFocus={(event) => {
                  // Tabbing to a plate brings the camera to it, so focus and
                  // the picture are never in two different places.
                  event.currentTarget.scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  });
                }}
              >
                <Plate
                  seed={item.slug}
                  ratio="3/2"
                  src={item.image}
                  alt=""
                  index={index}
                  parallax={false}
                  sizes="(max-width: 768px) 82vw, 46vw"
                />
              </Link>
            </div>
          ))}
        </div>

        {/*
          The caption is fixed to the stage rather than travelling with its
          plate. A title that recedes with the picture is unreadable for most
          of its life, and only one is ever on screen — which is the fault the
          card stack had and the reason it went.
        */}
        <div className="corridor-caption">
          <LetterReveal
            key={current.slug}
            as="p"
            text={current.discipline}
            className="type-display block text-[clamp(2rem,4.6vw,4rem)]"
          />
          <p className="type-micro corridor-meta mt-step-2 text-slate">
            {current.sector} — {current.scope.join(" · ")}
          </p>
        </div>

        <p className="type-micro corridor-counter text-slate" aria-hidden="true">
          {String(dominant + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
