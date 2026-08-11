import { ImageResponse } from "next/og";

import {
  APERTURE_INSET,
  MARK,
  MARK_ASPECT,
  pupilRadiusFor,
} from "@/lib/mark";

export const alt = "Loomie — clear, connected, complete";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card is the hero, reduced: void ground, a warm bloom, and the
 * visor bleeding off the right with ember eyes. Geometry
 * comes off the same constants the site uses, so the card cannot drift out of
 * spec either.
 */
export default function OpengraphImage() {
  const markWidth = 760;
  const markHeight = markWidth / MARK_ASPECT;
  const unit = markWidth / MARK.gridWidth;
  const aperture = MARK.apertureRadius * unit * 2;
  const pupil = pupilRadiusFor(markWidth) * unit * 2;
  const inset = APERTURE_INSET * unit;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0b0d",
          color: "#f2f3f4",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Warmth behind the mark, never inside it. */}
        <div
          style={{
            position: "absolute",
            right: -320,
            top: 630 / 2 - 460,
            width: 920,
            height: 920,
            borderRadius: 920,
            backgroundColor: "#2a2118",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -140,
            top: 630 / 2 - markHeight / 2,
            width: markWidth,
            height: markHeight,
            backgroundColor: "#1c1f23",
            borderRadius: markHeight / 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          {[inset, markWidth - inset].map((centre) => (
            <div
              key={centre}
              style={{
                position: "absolute",
                left: centre - aperture / 2,
                top: markHeight / 2 - aperture / 2,
                width: aperture,
                height: aperture,
                borderRadius: aperture,
                backgroundColor: "#f0b45a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: pupil,
                  height: pupil,
                  borderRadius: pupil,
                  backgroundColor: "#0a0b0d",
                  display: "flex",
                }}
              />
            </div>
          ))}
        </div>

        {/* Painted after the mark, so it sits above it — Satori has no z-index. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4 }}>
            LOOMIE — CREATIVE STUDIO
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 104,
                fontWeight: 700,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              Snow, river, lights.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 28,
                color: "#8a949b",
              }}
            >
              Clear. Connected. Complete.
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
