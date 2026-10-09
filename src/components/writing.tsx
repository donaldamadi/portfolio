import { articles, offTheClock } from "@/content/work";
import { profile } from "@/content/profile";
import { ArrowOut, Chapter, ExternalLink, Lines } from "./primitives";

const LEAD = [
  "When I'm not building, I'm writing.",
  "Poetry, prose, long thoughts on software.",
  "Finding the right word and finding the right abstraction are pretty much the same muscle.",
] as const;

/** The newest few. Everything else is a click away on Medium. */
const SHOWN = 3;

export function Writing() {
  const medium = profile.links.find((link) => link.label === "Medium");

  return (
    <Chapter id="writing" eyebrow="Writing">
      <Lines lines={LEAD} />

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {offTheClock.excerpts.map((excerpt, index) => (
          <blockquote
            key={excerpt.body}
            className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 90}ms` }}
          >
            <span aria-hidden="true" className="display block text-[3rem] leading-none text-accent">
              &ldquo;
            </span>
            <p className="heading mt-2 text-[1.25rem] leading-snug text-ink sm:text-[1.5rem]">{excerpt.body}</p>
          </blockquote>
        ))}
      </div>
      <p className="mt-4 text-[0.875rem] text-faint" data-reveal>
        {offTheClock.closer}
      </p>

      <p className="mt-16 font-mono text-[0.75rem] text-faint" data-reveal>
        and on software, lately
      </p>
      <ul className="mt-4 border-t border-line">
        {articles.slice(0, SHOWN).map((article, index) => (
          <li key={article.href} data-reveal style={{ ["--reveal-delay" as string]: `${index * 45}ms` }}>
            <a
              href={article.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group grid gap-1 border-b border-line py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span className="rail-index">{article.date}</span>
              <span className="text-[1.0625rem] text-ink transition-colors group-hover:text-accent">{article.title}</span>
              <span className="hidden items-center gap-1.5 font-mono text-[0.625rem] text-faint sm:flex">
                {article.publication}
                <ArrowOut />
              </span>
            </a>
          </li>
        ))}
      </ul>
      {medium ? (
        <ExternalLink href={medium.href} className="mt-6 text-[0.875rem] text-dim">
          Everything else on Medium
        </ExternalLink>
      ) : null}
    </Chapter>
  );
}
