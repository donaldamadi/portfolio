import { ImageResponse } from "next/og";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { profile } from "@/content/profile";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export default async function CaseStudyOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  const eyebrow = `CASE STUDY · ${(study?.kicker ?? "Work").toUpperCase()}`;
  const footnote = [study?.company, study?.period].filter(Boolean).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0b",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#e9a23b" }} />
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: "#6d6a64" }}>{eyebrow}</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 66,
            lineHeight: 1.06,
            color: "#ece9e3",
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {study?.title ?? "Selected work"}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#ece9e3" }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 20, color: "#6d6a64" }}>{footnote}</div>
        </div>
      </div>
    ),
    size,
  );
}
