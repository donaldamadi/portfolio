import { articles, offTheClock, packages } from "@/content/work";
import { profile } from "@/content/profile";
import { ExternalLink, Panel, Section, Tray } from "./primitives";

const SHOWN_ARTICLES = 3;

/** Open source and writing, side by side: the two things I make outside of work. */
export function OpenSource() {
  const medium = profile.links.find((link) => link.label === "Medium");
  const poem = offTheClock.excerpts[0];

  return (
    <Section
      id="open-source"
      title="Open source and writing"
      intro="Two Flutter packages on pub.dev, a handful of articles, and the poetry I write when I'm not building."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {packages.map((pkg) => (
          <Tray key={pkg.name}>
            <Panel className="flex h-full flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-mono text-[1rem] font-medium text-ink">{pkg.name}</h3>
                <p className="text-[0.8125rem] text-faint">
                  {pkg.language}, {pkg.license}, since {pkg.since}
                </p>
              </div>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink">{pkg.tagline}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-dim">{pkg.description}</p>
              <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5">
                {pkg.links.map((link) => (
                  <li key={link.href}>
                    <ExternalLink href={link.href} className="text-[0.9375rem]">
                      {link.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </Panel>
          </Tray>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Tray>
          <Panel className="h-full p-5 sm:p-6">
            <h3 className="heading text-[1.125rem] text-ink">Articles</h3>
            <ul className="mt-3 divide-y divide-line">
              {articles.slice(0, SHOWN_ARTICLES).map((article) => (
                <li key={article.href} className="py-3">
                  <a href={article.href} target="_blank" rel="noreferrer noopener" className="group block">
                    <span className="text-[1rem] font-medium text-ink group-hover:text-accent">{article.title}</span>
                    <span className="mt-0.5 block text-[0.875rem] text-faint">
                      {article.publication}, {article.date}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {medium ? (
              <ExternalLink href={medium.href} className="mt-2 text-[0.9375rem]">
                All articles on Medium
              </ExternalLink>
            ) : null}
          </Panel>
        </Tray>

        {poem ? (
          <figure className="flex flex-col justify-center rounded-2xl border border-line p-6 sm:p-8">
            <blockquote className="heading text-[1.25rem] leading-snug text-ink">{poem.body}</blockquote>
            <figcaption className="mt-4 text-[0.875rem] text-faint">From my poetry. {offTheClock.closer}</figcaption>
          </figure>
        ) : null}
      </div>
    </Section>
  );
}
