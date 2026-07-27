import { articles, offTheClock, volunteering } from "@/content/work";
import { profile } from "@/content/profile";
import { ArrowOut, Section } from "./primitives";

export function Writing() {
  return (
    <Section
      id="writing"
      index="05"
      label="Writing"
      title={
        <>
          I write to find out
          <br />
          what I actually think.
        </>
      }
      lede={
        <p>
          Six pieces on Medium, mostly in Level Up Coding, mostly about the parts of Flutter that only bite
          you in production.
        </p>
      }
    >
      <ul className="border-t border-line">
        {articles.map((article, index) => (
          <li key={article.href} data-reveal style={{ ["--reveal-delay" as string]: `${index * 45}ms` }}>
            <a
              href={article.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group grid gap-2 border-b border-line py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span className="rail-index">{article.date}</span>
              <span>
                <span className="block text-[1.0625rem] text-ink transition-colors group-hover:text-accent">
                  {article.title}
                </span>
                <span className="mt-1.5 block text-[0.875rem] leading-relaxed text-faint">{article.blurb}</span>
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.625rem] text-faint transition-colors group-hover:text-dim">
                {article.publication}
                <ArrowOut />
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Off the clock — quiet on purpose. */}
      <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div data-reveal>
          <p className="eyebrow">Off the clock</p>
          <p className="measure-tight mt-5 text-[0.9375rem] leading-relaxed text-dim">{offTheClock.intro}</p>
          <p className="mt-6 text-[0.875rem] text-faint">{offTheClock.closer}</p>
        </div>

        <div className="space-y-10" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {offTheClock.excerpts.map((excerpt) => (
            <blockquote
              key={excerpt.body}
              className="border-l pl-6 font-display text-[1.375rem] leading-snug text-ink sm:text-[1.625rem]"
              style={{ borderColor: "var(--accent)" }}
            >
              {excerpt.body}
            </blockquote>
          ))}
        </div>
      </div>

      <div className="mt-24 grid gap-10 border-t border-line pt-12 sm:grid-cols-[1fr_1fr] lg:gap-20">
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
          <p className="eyebrow">Also</p>
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
    </Section>
  );
}
