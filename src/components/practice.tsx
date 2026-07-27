import { aiPractice } from "@/content/work";
import { profile, stack } from "@/content/profile";
import { ExternalLink, Section } from "./primitives";

export function Practice() {
  return (
    <Section
      id="practice"
      index="03"
      label="AI practice"
      title={
        <>
          Agents can write code.
          <br />
          Keeping them safe in yours
          <br />
          is the engineering.
        </>
      }
      lede={<p>{aiPractice.lede}</p>}
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {aiPractice.disciplines.map((discipline, index) => (
          <article
            key={discipline.id}
            className="bg-bg p-6 sm:p-7"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
          >
            <p className="rail-index">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 font-display text-[1.375rem] text-ink">{discipline.name}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-dim">{discipline.body}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 grid gap-8 rounded-lg border border-line bg-surface p-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-10 sm:p-8" data-reveal>
        <p className="eyebrow sm:pt-1">Evidence</p>
        <ul className="space-y-3">
          {aiPractice.proof.map((item) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-dim">
              <span className="mt-2 size-1 shrink-0 rounded-full" style={{ background: "var(--accent)" }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
          <li className="pt-1">
            <ExternalLink href="https://thatmandonald.medium.com/your-ai-coding-assistant-is-brilliant-but-also-has-amnesia-42e2e8a4db0b" className="text-[0.9375rem]">
              Read the argument in full
            </ExternalLink>
          </li>
        </ul>
      </div>

      <div className="mt-20">
        <h3 className="eyebrow" data-reveal>
          What I reach for
        </h3>
        <dl className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((group, index) => (
            <div key={group.label} data-reveal style={{ ["--reveal-delay" as string]: `${index * 50}ms` }}>
              <dt className="border-b border-line pb-2 font-mono text-[0.6875rem] tracking-wide text-faint">
                {group.label}
              </dt>
              <dd className="mt-3 text-[0.9375rem] leading-relaxed text-dim">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {profile.principles.map((principle, index) => (
          <div key={principle.title} data-reveal style={{ ["--reveal-delay" as string]: `${index * 60}ms` }}>
            <h3 className="font-display text-[1.375rem] text-ink">{principle.title}</h3>
            <p className="measure-tight mt-2.5 text-[0.9375rem] leading-relaxed text-dim">{principle.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
