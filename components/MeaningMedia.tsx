"use client";

import { useEffect, useRef } from "react";

/**
 * The three procedural states behind the meanings.
 *
 * These are not placeholders. There is no footage and no date for it, so each
 * state is built to ship as it is: a canvas snowfield, a displaced water
 * surface, and a bokeh field. When real footage arrives each one takes a
 * `<video>` in the same slot and nothing else changes.
 *
 * Each is deliberately a different technique, because each subject wants a
 * different one — particles for snow, a displacement filter for water, and
 * blurred light for light. Doing all three with the same trick is what would
 * make them read as placeholders.
 */

/**
 * Snow. A canvas field of slow crystalline drift, seeded once and animated on
 * the compositor's own clock rather than a React state loop.
 *
 * It renders a still field under reduced motion rather than an empty box: the
 * snow is the picture, and only the falling is the animation.
 */
export function SnowMedia({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = 0;
    let height = 0;

    const flakes = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 2.1,
      // Slower for the larger flakes, so the field reads as having depth.
      speed: 0.00006 + Math.random() * 0.00016,
      drift: (Math.random() - 0.5) * 0.00008,
      alpha: 0.16 + Math.random() * 0.5,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (elapsed: number) => {
      context.clearRect(0, 0, width, height);

      for (const flake of flakes) {
        const y = ((flake.y + elapsed * flake.speed) % 1.08) - 0.04;
        const x = (flake.x + Math.sin(elapsed * 0.0004 + flake.y * 12) * 0.012 +
          elapsed * flake.drift) % 1;

        context.beginPath();
        context.arc(
          (x < 0 ? x + 1 : x) * width,
          y * height,
          flake.r,
          0,
          Math.PI * 2,
        );
        // Frost, not white: the cold state should read as a temperature.
        context.fillStyle = `rgba(191, 217, 227, ${flake.alpha})`;
        context.fill();
      }
    };

    const tick = (time: number) => {
      // Painting a hidden state is work nobody can see.
      if (activeRef.current) paint(time);
      frame = requestAnimationFrame(tick);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    if (reduce.matches) {
      paint(0);
    } else {
      frame = requestAnimationFrame(tick);
    }

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="meaning-media" aria-hidden="true" />;
}

/**
 * River. A dark surface pushed around by an animated displacement map.
 *
 * The turbulence is animated in SMIL rather than script — it is the one thing
 * here the browser can run entirely on its own, and a JS loop writing filter
 * attributes sixty times a second would be the most expensive thing on the
 * page. SMIL ignores prefers-reduced-motion, so the animate elements are not
 * rendered at all when the preference is set; the still displaced surface
 * that remains is a photograph of water rather than a blank panel.
 */
export function RiverMedia({ animate }: { animate: boolean }) {
  return (
    <svg
      className="meaning-media"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="river-displace" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.03"
            numOctaves="3"
            seed="7"
            result="noise"
          >
            {animate ? (
              <animate
                attributeName="baseFrequency"
                dur="26s"
                values="0.008 0.03; 0.013 0.022; 0.008 0.03"
                repeatCount="indefinite"
              />
            ) : null}
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="58"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <linearGradient id="river-body" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#0a0b0d" />
          <stop offset="0.45" stopColor="#2b3339" />
          <stop offset="0.62" stopColor="#4a565e" />
          <stop offset="0.78" stopColor="#151a1e" />
          <stop offset="1" stopColor="#0a0b0d" />
        </linearGradient>
      </defs>

      <g filter="url(#river-displace)">
        <rect x="-60" y="-60" width="720" height="520" fill="url(#river-body)" />
        {/* Highlights on the surface, which is what makes it read as moving. */}
        {[70, 150, 232, 310].map((y, index) => (
          <rect
            key={y}
            x="-60"
            y={y}
            width="720"
            height={2 + (index % 2)}
            fill="var(--color-frost)"
            opacity={0.12 + index * 0.03}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Lights. Bokeh points at shallow depth: a few large soft discs, out of focus,
 * pulsing on periods that do not divide into each other.
 *
 * Pure CSS. Blurred radial gradients are exactly what an out-of-focus point
 * source is, so there is nothing here a canvas would do better.
 */
const BOKEH = [
  { x: 18, y: 30, r: 20, delay: 0, period: 7.5 },
  { x: 62, y: 22, r: 13, delay: -2.4, period: 9.1 },
  { x: 78, y: 58, r: 24, delay: -4.8, period: 6.4 },
  { x: 34, y: 70, r: 16, delay: -1.2, period: 8.3 },
  { x: 50, y: 44, r: 9, delay: -3.6, period: 5.7 },
  { x: 88, y: 34, r: 11, delay: -5.9, period: 10.2 },
  { x: 8, y: 62, r: 14, delay: -0.8, period: 7.9 },
];

export function LightsMedia() {
  return (
    <div className="meaning-media meaning-bokeh" aria-hidden="true">
      {BOKEH.map((point, index) => (
        <span
          key={index}
          className="meaning-bokeh-point"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.r}%`,
            aspectRatio: "1",
            animationDelay: `${point.delay}s`,
            animationDuration: `${point.period}s`,
          }}
        />
      ))}
    </div>
  );
}
