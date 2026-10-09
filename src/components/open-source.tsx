import type { ReactNode } from "react";
import { packages, projects } from "@/content/work";
import { ImageGridArt } from "./image-grid-art";
import { Chapter, ExternalLink } from "./primitives";

export function OpenSource() {
  return (
    <Chapter id="open-source" eyebrow="Open source">
      <p className="heading mt-6 max-w-[30ch] text-[clamp(1.375rem,3.2vw,2.125rem)] leading-[1.2] text-ink" data-reveal>
        A few things I&rsquo;ve left lying around on pub.dev.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {packages.map((pkg, index) => (
          <article
            key={pkg.name}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 80}ms` }}
          >
            <div className="grid h-40 place-items-center border-b border-line bg-surface-2">{PACKAGE_ART[pkg.name]}</div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-mono text-[1rem] text-ink">{pkg.name}</h3>
                <span className="font-mono text-[0.625rem] text-faint">
                  {pkg.language} · {pkg.license} · since {pkg.since}
                </span>
              </div>
              <p className="mt-3 text-[1rem] leading-relaxed text-dim">{pkg.tagline}</p>
              <details className="group mt-4 flex-1">
                <summary className="cursor-pointer font-mono text-[0.6875rem] text-faint transition-colors hover:text-ink">
                  <span className="group-open:hidden">more</span>
                  <span className="hidden group-open:inline">less</span>
                </summary>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-faint">{pkg.description}</p>
              </details>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                {pkg.links.map((link) => (
                  <li key={link.href}>
                    <ExternalLink href={link.href} className="text-[0.8125rem] text-dim">
                      {link.label}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-20 font-mono text-[0.75rem] text-faint" data-reveal>
        side projects, some shipped, some just for finding out
      </p>
      <ul className="mt-4 border-t border-line">
        {projects.map((project, index) => (
          <li
            key={project.name}
            className="border-b border-line py-5"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${index * 50}ms` }}
          >
            <details className="group">
              <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span>
                  <span className="text-[1.0625rem] text-ink">{project.name}</span>
                  <span className="ml-3 text-[0.9375rem] text-dim">{project.tagline}</span>
                </span>
                <span className="font-mono text-[0.625rem] text-faint">
                  {project.period}
                  <span aria-hidden="true" className="ml-3 inline-block transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-faint">{project.description}</p>
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
            </details>
          </li>
        ))}
      </ul>
    </Chapter>
  );
}

const PACKAGE_ART: Record<string, ReactNode> = {
  flutter_skill_gen: (
    <div className="w-[260px] rounded-lg border border-line-strong bg-bg p-3 font-mono text-[0.6875rem] leading-[1.7]" aria-hidden="true">
      <p className="text-dim">
        <span className="text-accent-2">$</span> flutter_skill_gen analyze
      </p>
      {["reading pubspec.yaml", "scanning lib/", "spotting the conventions"].map((line, i) => (
        <p key={line} className="pop text-faint" style={{ animationDelay: `${0.4 + i * 0.5}s` }}>
          <span className="text-accent-2">✓</span> {line}
        </p>
      ))}
      <p className="pop text-ink" style={{ animationDelay: "1.9s" }}>
        <span className="text-accent">→</span> wrote SKILL.md
      </p>
    </div>
  ),
  multi_image_layout: <ImageGridArt />,
};
