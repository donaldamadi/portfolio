import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { volunteering } from "@/content/work";
import { ExperienceLedger } from "@/components/experience-ledger";
import { Section, Shell } from "@/components/primitives";

const description =
  "The long version: from fintech mobile engineer to product engineer, why PinDey exists, how I work with AI, and the full record.";

export const metadata: Metadata = {
  title: "The long version",
  description,
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", title: `The long version · ${profile.shortName}`, description, url: "/about" },
};

/**
 * The deeper story lives here, for anyone who chooses to open it. The home
 * page stays visual; this page is allowed to be read.
 */
export default function AboutPage() {
  return (
    <>
      <article className="pb-20 pt-32 sm:pt-40">
        <Shell>
          <Link href="/" className="link inline-flex items-center gap-2 font-mono text-[0.6875rem] text-faint">
            <span aria-hidden="true">←</span> The short version
          </Link>

          <p className="eyebrow mt-10" data-reveal>
            The long version
          </p>
          <h1 className="display mt-6 text-[clamp(2.75rem,8vw,5.5rem)] text-ink" data-reveal>
            Got five minutes?
          </h1>

          <div className="measure mt-12 space-y-6 text-[1.125rem] leading-[1.75] text-dim">
            {profile.longVersion.map((paragraph) => (
              <p key={paragraph} data-reveal>
                {paragraph}
              </p>
            ))}
          </div>

          <p
            className="display mt-14 max-w-[30ch] border-l pl-6 text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.25] text-ink"
            style={{ borderColor: "var(--accent)" }}
            data-reveal
          >
            {profile.coda}
          </p>
        </Shell>
      </article>

      <ExperienceLedger />

      <Section id="also" index="03" label="Also" title="The rest of the record.">
        <div className="grid gap-12 sm:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow">Education</p>
            <h3 className="mt-5 text-[1.0625rem] text-ink">{profile.education.school}</h3>
            <p className="mt-1 text-[0.9375rem] text-dim">{profile.education.degree}</p>
            <p className="mt-1 font-mono text-[0.625rem] tracking-wide text-faint">
              {profile.education.location} · Class of {profile.education.graduated}
            </p>
            <p className="measure-tight mt-4 text-[0.875rem] leading-relaxed text-faint">{profile.education.note}</p>
          </div>

          <div data-reveal style={{ ["--reveal-delay" as string]: "70ms" }}>
            <p className="eyebrow">Teaching and hackathons</p>
            <ul className="mt-5 space-y-6">
              {volunteering.map((item) => (
                <li key={item.org}>
                  <h3 className="text-[1.0625rem] text-ink">{item.org}</h3>
                  <p className="mt-1 font-mono text-[0.625rem] tracking-wide text-faint">
                    {item.role} · {item.period}
                  </p>
                  <p className="measure-tight mt-2 text-[0.875rem] leading-relaxed text-faint">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 rounded-2xl border border-line bg-surface p-6 sm:p-8" data-reveal>
          <p className="eyebrow">Practicalities</p>
          <p className="measure mt-4 text-[1rem] leading-relaxed text-dim">{profile.practicalities}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="/Donald-Amadi-CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.875rem] text-ink transition-colors hover:border-line-strong"
            >
              Download CV
              <span className="font-mono text-[0.625rem] text-faint">PDF</span>
            </a>
            <a href={`mailto:${profile.email}`} className="link text-[0.9375rem] text-ink">
              {profile.email}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
