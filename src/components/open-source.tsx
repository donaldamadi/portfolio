import { packages, projects } from "@/content/work";
import { ExternalLink, Section } from "./primitives";

export function OpenSource() {
  return (
    <Section
      id="open-source"
      index="03"
      label="Open source & side projects"
      title={
        <>
          Small things I gave away,
          <br />
          and things I built because I wanted to.
        </>
      }
      lede={
        <p>
          Some of the curiosity spills out as open source. Two packages live on pub.dev, both born from
          getting annoyed at the same problem one too many times. The rest are side projects, a few shipped,
          a few that exist mostly so I could find out how something really works.
        </p>
      }
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {packages.map((pkg, index) => (
          <article
            key={pkg.name}
            className="flex flex-col bg-bg p-6 sm:p-8"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-mono text-[0.9375rem] text-ink">{pkg.name}</h3>
              <span className="font-mono text-[0.625rem] text-faint">
                {pkg.language} · {pkg.license} · since {pkg.since}
              </span>
            </div>
            <p className="mt-3 text-[0.9375rem] text-dim">{pkg.tagline}</p>
            <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-faint">{pkg.description}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {pkg.links.map((link) => (
                <li key={link.href}>
                  <ExternalLink href={link.href} className="text-[0.8125rem] text-dim">
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <ul className="mt-16 border-t border-line">
        {projects.map((project, index) => (
          <li
            key={project.name}
            className="grid gap-3 border-b border-line py-7 sm:grid-cols-[1fr_1.6fr] sm:gap-10"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 55}ms` }}
          >
            <div>
              <h3 className="text-[1.0625rem] text-ink">{project.name}</h3>
              <p className="mt-1 font-mono text-[0.625rem] tracking-wide text-faint">{project.period}</p>
              {project.links?.length ? (
                <ul className="mt-3 flex flex-wrap gap-4">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <ExternalLink href={link.href} className="text-[0.8125rem] text-dim">
                        {link.label}
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div>
              <p className="text-[0.9375rem] text-dim">{project.tagline}</p>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-faint">{project.description}</p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[0.625rem] text-faint">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
