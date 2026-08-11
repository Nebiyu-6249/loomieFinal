"use client";

import { useEffect, useState } from "react";

/**
 * Move ten of thirteen — the living grain.
 *
 * Two layers of procedurally generated noise over the whole viewport. Nothing
 * is committed to the repo: the frames are drawn into a canvas on first paint
 * and handed to CSS as a sprite.
 *
 * How it moves. Each layer is a vertical strip of four frames used as a
 * repeating background, cycled with `steps(4)` — so the animation is one
 * compositor-side background-position change and there is no per-frame
 * JavaScript at all. The two layers run at 8fps and 5.3fps on different tile
 * sizes, which stops them locking into a visible repeat.
 *
 * Why overlay, and why not at 0.06. Overlay resolves to roughly
 * 2 x backdrop x source below mid-grey, so on #0A0B0D it contributes about
 * 8% of the source and on a lit haze region about 45%. That is exactly the
 * behaviour film grain has — present in the light, almost gone in the deepest
 * black — but at the 0.06-0.10 opacity first specified it was invisible
 * everywhere. Tuned by eye against the real ground and landed at 0.42 for the
 * fine layer and 0.28 for the coarse one.
 *
 * The noise deviates either side of mid-grey rather than being additive,
 * because mid-grey is overlay's neutral: the grain therefore both lifts and
 * darkens, as real grain does, instead of only brightening.
 */

const TILE_FINE = 180;
const TILE_COARSE = 260;
const FRAMES = 4;

/** Deviation either side of overlay's neutral, 0-127. */
const AMPLITUDE_FINE = 42;
const AMPLITUDE_COARSE = 30;
/** Coarse grain is drawn in blocks so the two layers have different structure. */
const COARSE_BLOCK = 3;

function buildSprite(tile: number, amplitude: number, block: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = tile;
  canvas.height = tile * FRAMES;

  const context = canvas.getContext("2d", { willReadFrequently: false });
  if (!context) return "";

  const image = context.createImageData(tile, tile * FRAMES);
  const { data } = image;

  for (let frame = 0; frame < FRAMES; frame += 1) {
    for (let y = 0; y < tile; y += block) {
      for (let x = 0; x < tile; x += block) {
        // Centred on 128 — overlay's neutral — so grain darkens as well as lifts.
        const value = 128 + (Math.random() * 2 - 1) * amplitude;

        for (let dy = 0; dy < block && y + dy < tile; dy += 1) {
          for (let dx = 0; dx < block && x + dx < tile; dx += 1) {
            const offset =
              (((frame * tile + y + dy) * tile) + (x + dx)) * 4;
            data[offset] = value;
            data[offset + 1] = value;
            data[offset + 2] = value;
            data[offset + 3] = 255;
          }
        }
      }
    }
  }

  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
}

export function Grain() {
  const [sprites, setSprites] = useState<{ fine: string; coarse: string } | null>(
    null,
  );

  useEffect(() => {
    // Generated once, after paint, so it never blocks the first render.
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => {
          setSprites({
            fine: buildSprite(TILE_FINE, AMPLITUDE_FINE, 1),
            coarse: buildSprite(TILE_COARSE, AMPLITUDE_COARSE, COARSE_BLOCK),
          });
        })
      : window.setTimeout(() => {
          setSprites({
            fine: buildSprite(TILE_FINE, AMPLITUDE_FINE, 1),
            coarse: buildSprite(TILE_COARSE, AMPLITUDE_COARSE, COARSE_BLOCK),
          });
        }, 0);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  if (!sprites) return null;

  /*
    Two siblings, not a wrapper with two children. A blend group can only
    blend against its own stacking context's backdrop, and any positioned
    element with a z-index creates one — so a wrapper meant the layers
    composited against transparency and washed the page to mid-grey. As
    siblings they sit in the root context and see the page beneath them.
  */
  return (
    <>
      <span
        aria-hidden="true"
        className="grain-layer grain-fine"
        style={{
          backgroundImage: `url(${sprites.fine})`,
          backgroundSize: `${TILE_FINE}px ${TILE_FINE * FRAMES}px`,
          ["--grain-travel" as string]: `${TILE_FINE * FRAMES}px`,
        }}
      />
      <span
        aria-hidden="true"
        className="grain-layer grain-coarse"
        style={{
          backgroundImage: `url(${sprites.coarse})`,
          backgroundSize: `${TILE_COARSE}px ${TILE_COARSE * FRAMES}px`,
          ["--grain-travel" as string]: `${TILE_COARSE * FRAMES}px`,
        }}
      />
    </>
  );
}
