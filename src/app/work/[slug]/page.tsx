import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { Shell } from "@/components/primitives";
import { profile } from "@/content/profile";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: `${study.kicker} · ${study.title}`,
    description: study.summary,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      type: "article",
      title: `${study.kicker} · ${study.title}`,
      description: study.summary,
      url: `/work/${study.slug}`,
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((item) => item.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  // Each study leans one of the two accents, so four pages in a row don't all
  // read as the same page. Alternating off accentIndex keeps it deterministic.
  const accent = study.accentIndex % 2 === 0 ? "var(--accent)" : "var(--accent-2)";

  return (
    <article className="pb-24 pt-32 sm:pt-40" style={{ ["--study-accent" as string]: accent }}>
      <Shell>
        <Link href="/#work" className="link inline-flex items-center gap-2 font-mono text-[0.6875rem] text-faint">
          <span aria-hidden="true">←</span> Selected work
        </Link>

        <header className="mt-10 border-b border-line pb-14">
          <p className="eyebrow" data-reveal>
            {study.kicker} · {study.company}
          </p>
          <h1
            className="display mt-6 max-w-[18ch] text-[clamp(2.5rem,6.6vw,5rem)] text-ink"
            data-reveal
            style={{ ["--reveal-delay" as string]: "60ms" }}
          >
            {study.title}
          </h1>
          <p
            className="measure mt-8 text-[1.125rem] leading-relaxed text-dim"
            data-reveal
            style={{ ["--reveal-delay" as string]: "120ms" }}
          >
            {study.summary}
          </p>

          <dl
            className="mt-12 grid grid-cols-2 gap-x-10 gap-y-6 font-mono text-[0.6875rem] sm:grid-cols-4"
            data-reveal
            style={{ ["--reveal-delay" as string]: "180ms" }}
          >
            {[
              ["Role", study.role],
              ["Organisation", study.company],
              ["Period", study.period],
              ["Surface", study.stack[0] ?? "Mobile"],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-faint">{term}</dt>
                <dd className="mt-1.5 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <Block index="01" label="The problem">
          {study.problem.map((paragraph) => (
            <p key={paragraph} className="measure text-[1.0625rem] leading-relaxed text-dim">
              {paragraph}
            </p>
          ))}
        </Block>

        <Block index="02" label="Constraints">
          <ul className="space-y-4">
            {study.constraints.map((item) => (
              <li key={item} className="measure flex gap-4 text-[1.0625rem] leading-relaxed text-dim">
                <span className="mt-2.5 size-1 shrink-0 rounded-full bg-line-strong" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block index="03" label="Decisions">
          <div className="space-y-14">
            {study.decisions.map((decision, i) => (
              <div key={decision.title} data-reveal>
                <div className="flex items-baseline gap-4">
                  <span className="rail-index">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="heading text-[1.625rem] leading-tight text-ink sm:text-[1.875rem]">
                    {decision.title}
                  </h3>
                </div>
                <p className="measure mt-4 pl-0 text-[1.0625rem] leading-relaxed text-dim sm:pl-11">
                  {decision.body}
                </p>
                <div
                  className="mt-5 rounded-lg border-l-2 bg-surface p-5 sm:ml-11"
                  style={{ borderColor: "var(--study-accent)" }}
                >
                  <p className="eyebrow" style={{ color: "var(--study-accent)" }}>
                    What I rejected
                  </p>
                  <p className="measure mt-2.5 text-[0.9375rem] leading-relaxed text-dim">{decision.rejected}</p>
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block index="04" label="Where it landed">
          <ul className="space-y-4">
            {study.outcome.map((item) => (
              <li key={item} className="measure flex gap-4 text-[1.0625rem] leading-relaxed text-dim">
                <span
                  className="mt-2.5 size-1 shrink-0 rounded-full"
                  style={{ background: "var(--study-accent)" }}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-10 flex flex-wrap gap-2">
            {study.stack.map((item) => (
              <li
                key={item}
                className="rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] text-dim"
              >
                {item}
              </li>
            ))}
          </ul>
        </Block>

        <nav className="mt-24 border-t border-line pt-10" aria-label="Next case study">
          <p className="eyebrow">Next</p>
          <Link href={`/work/${next?.slug ?? ""}`} className="group mt-4 block">
            <h2 className="display max-w-[20ch] text-[clamp(1.75rem,4vw,3rem)] text-ink transition-colors group-hover:text-accent">
              {next?.title}
            </h2>
            <p className="mt-3 font-mono text-[0.6875rem] text-faint">
              {next?.kicker} · {next?.company}
            </p>
          </Link>
        </nav>

        <div className="mt-20 rounded-lg border border-line bg-surface p-6 sm:p-8">
          <p className="eyebrow">Working on something like this?</p>
          <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-dim">
            I’m open to senior mobile and full-stack roles, and I’m relocation-ready.
          </p>
          <a href={`mailto:${profile.email}`} className="link mt-5 inline-block heading text-[1.5rem] text-ink">
            {profile.email}
          </a>
        </div>
      </Shell>
    </article>
  );
}

function Block({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 border-b border-line py-14 lg:grid-cols-[9rem_1fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-baseline gap-3 lg:block" data-reveal>
          <span className="rail-index">{index}</span>
          <h2 className="eyebrow block lg:mt-2">{label}</h2>
        </div>
      </div>
      <div className="min-w-0 space-y-5" data-reveal>
        {children}
      </div>
    </section>
  );
}
