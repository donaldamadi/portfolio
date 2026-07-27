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
            SENIOR MOBILE ENGINEER
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 76,
            lineHeight: 1.04,
            color: "#f3f8fd",
            letterSpacing: -2,
            maxWidth: 990,
          }}
        >
          <span style={{ marginRight: 18 }}>I build the software that lives in your pocket.</span>
          <span style={{ color: "#38bdf8" }}>Mostly for money that has to arrive.</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#f3f8fd" }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 20, color: "#667e97" }}>Flutter · Swift · Kotlin · Lagos</div>
        </div>
      </div>
    ),
    size,
  );
}
