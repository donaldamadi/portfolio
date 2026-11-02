import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.shortName}, ${profile.role.toLowerCase()}`;
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
          background: "#fafafa",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#0a0a0a",
              color: "#fafafa",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            DA
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#0a0a0a", fontWeight: 600 }}>{profile.shortName}</div>
        </div>

        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.08, color: "#0a0a0a", letterSpacing: -2, maxWidth: 1000 }}>
          {profile.hero.title}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["React Native", "React", "Flutter", "TypeScript", "Node.js"].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: 10,
                background: "#f4f4f5",
                border: "1px solid #e5e5e5",
                fontSize: 22,
                color: "#525252",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
