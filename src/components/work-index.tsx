import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { ArrowOut, Section } from "./primitives";
import { ordinal } from "@/lib/utils";

export function WorkIndex() {
  return (
    <Section
      id="work"
      index="01"
      label="Selected work"
      title={
        <>
          Four problems, and the
          <br />
          options I turned down.
        </>
      }
      lede={
        <p>
          Anyone can list what they built. These are the calls I made, why I made them, and the credible
          alternative I rejected in each case — because the rejected option is where the reasoning actually
          lives.
        </p>
      }
    >
      <ul className="border-t border-line">
        {caseStudies.map((study, index) => (
          <li key={study.slug} data-reveal style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}>
            <Link
              href={`/work/${study.slug}`}
              className="group grid gap-4 border-b border-line py-8 transition-colors sm:grid-cols-[3.5rem_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span className="rail-index pt-1.5">{ordinal(index)}</span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-[1.75rem] leading-tight text-ink transition-colors group-hover:text-accent sm:text-[2rem]">
                    {study.title}
                  </h3>
                </div>
                <p className="mt-2 font-mono text-[0.6875rem] tracking-wide text-faint">
                  {study.kicker} · {study.company} · {study.period}
                </p>
                <p className="measure mt-4 text-[0.9375rem] leading-relaxed text-dim">{study.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.6875rem] text-faint">
                  {study.stack.slice(0, 5).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <span className="flex items-center gap-1.5 self-start pt-2 font-mono text-[0.6875rem] text-faint transition-colors group-hover:text-ink">
                Read
                <ArrowOut />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
