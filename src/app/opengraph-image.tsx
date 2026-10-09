import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.shortName} · ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Satori (which renders this) supports a deliberate subset of CSS: every element
 * with more than one child needs an explicit display. Hence the flex everywhere.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#05070d",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#34d399" }} />
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#667e97" }}>
            PRODUCT ENGINEER
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 64,
            lineHeight: 1.04,
            color: "#f3f8fd",
            letterSpacing: -2,
            maxWidth: 1040,
          }}
        >
          <span style={{ marginRight: 18 }}>Hey, I&apos;m Donald. I started on the screen, kept zooming out,</span>
          <span style={{ color: "#38bdf8" }}>and now I build the whole thing.</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#f3f8fd" }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 20, color: "#667e97" }}>product engineer · mobile at heart · AI in the loop</div>
        </div>
      </div>
    ),
    size,
  );
}
