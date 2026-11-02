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

  const eyebrow = `Case study: ${study?.kicker ?? "Work"}`;
  const footnote = [study?.company, study?.period].filter(Boolean).join(", ");

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
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: "#2563eb" }} />
          <div style={{ display: "flex", fontSize: 24, color: "#525252" }}>{eyebrow}</div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 66,
            lineHeight: 1.06,
            color: "#0a0a0a",
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {study?.title ?? "Selected work"}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#0a0a0a" }}>{profile.name}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#6b6b6b" }}>{footnote}</div>
        </div>
      </div>
    ),
    size,
  );
}
