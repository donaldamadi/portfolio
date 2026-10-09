import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { ArrowOut, Chapter, Lines } from "./primitives";
import { ordinal } from "@/lib/utils";

const LEAD = [
  "Before PinDey, years inside other people's products, mostly where money moves.",
  "Four I still think about, each told through the call I made and the one I turned down.",
] as const;

export function WorkIndex() {
  return (
    <Chapter id="work" eyebrow="Earlier work">
      <Lines lines={LEAD} />

      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {caseStudies.map((study, index) => (
          <li key={study.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(index % 2) * 80}ms` }}>
            <Link
              href={`/work/${study.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong sm:p-7"
            >
              <span
                aria-hidden="true"
                className="block h-0.5 w-10 rounded-full transition-[width] duration-500 group-hover:w-20"
                style={{ background: index % 2 ? "var(--accent-2)" : "var(--accent)" }}
              />
              <p className="mt-5 font-mono text-[0.6875rem] tracking-wide text-faint">
                {ordinal(index)} · {study.kicker} · {study.company}
              </p>
              <h3 className="heading mt-3 text-[1.5rem] leading-tight text-ink transition-colors group-hover:text-accent">
                {study.title}
              </h3>
              <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 pt-6 font-mono text-[0.6875rem] text-faint">
                {study.stack.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="mt-5 flex items-center gap-1.5 font-mono text-[0.6875rem] text-faint transition-colors group-hover:text-ink">
                Read the story
                <ArrowOut />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}
