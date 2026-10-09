import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { flagship } from "@/content/work";
import { ArrowOut, ExternalLink, Section } from "./primitives";
import { ordinal } from "@/lib/utils";

export function WorkIndex() {
  return (
    <Section
      id="work"
      index="02"
      label="Work"
      title={
        <>
          The thing I&rsquo;m building now,
          <br />
          and the years that taught me how.
        </>
      }
    >
      {/* PinDey leads, on its own, because it's the one piece of work where every layer is mine. */}
      <article className="rounded-lg border border-line bg-surface p-6 sm:p-10" data-reveal>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex size-1.5 rounded-full" style={{ backgroundColor: "var(--accent-2)" }} aria-hidden="true" />
          <p className="eyebrow">{flagship.status}</p>
        </div>

        <h3 className="display mt-5 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">{flagship.name}</h3>
        {flagship.whatItIs ? (
          <p className="measure mt-3 text-[1.125rem] leading-relaxed text-ink">{flagship.whatItIs}</p>
        ) : null}

        <div className="measure mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-dim">
          {flagship.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {flagship.stack.length ? (
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.6875rem] text-faint">
            {flagship.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}

        <ExternalLink href={flagship.href} className="mt-8 text-[0.9375rem]">
          Go and poke at it on pindey.app
        </ExternalLink>
      </article>

      <div className="measure mt-20 text-[1.0625rem] leading-relaxed text-dim" data-reveal>
        <p>
          Before PinDey there were years of building inside other people&rsquo;s products, mostly where money
          moves. These four are the ones I still think about. Each is written around the decisions rather than
          the features, including the option I turned down, because that&rsquo;s usually where the real reasoning
          lives.
        </p>
      </div>

      <ul className="mt-10 border-t border-line">
        {caseStudies.map((study, index) => (
          <li key={study.slug} data-reveal style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}>
            <Link
              href={`/work/${study.slug}`}
              className="group grid gap-4 border-b border-line py-8 transition-colors sm:grid-cols-[3.5rem_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span className="rail-index pt-1.5">{ordinal(index)}</span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="heading text-[1.75rem] leading-tight text-ink transition-colors group-hover:text-accent sm:text-[2rem]">
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
