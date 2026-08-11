import { ImageResponse } from "next/og";

import { MARK, MARK_ASPECT, PUPIL_INSET } from "@/lib/mark";

export const alt = "Loomie — clear, connected, complete";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card is the hero, reduced: Field ground, the mark bleeding off the
 * right in Drift with Thaw apertures. Geometry comes off the same constants
 * the site uses, so the card cannot drift out of spec either.
 */
export default function OpengraphImage() {
  const markWidth = 760;
  const markHeight = markWidth / MARK_ASPECT;
  const unit = markWidth / MARK.gridWidth;
  const pupil = MARK.pupilRadius * unit * 2;
  const inset = PUPIL_INSET * unit;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#f2f3f4",
          color: "#0e1113",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -140,
            top: 630 / 2 - markHeight / 2,
            width: markWidth,
            height: markHeight,
            backgroundColor: "#dde3e6",
            borderRadius: markHeight / 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: inset - pupil / 2,
              width: pupil,
              height: pupil,
              borderRadius: pupil,
              backgroundColor: "#efd9b4",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: markWidth - inset - pupil / 2,
              width: pupil,
              height: pupil,
              borderRadius: pupil,
              backgroundColor: "#efd9b4",
            }}
          />
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
                color: "#5f6b72",
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
