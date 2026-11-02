import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { projects, volunteering } from "@/content/work";
import { BadgeList, ExternalLink, Panel, Section, Shell, Tray, buttonClass } from "@/components/primitives";

const description =
  "About Donald Amadi: from fintech mobile engineer to product engineer, React Native and React, why PinDey exists, and the rest of the record.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", title: `About, ${profile.shortName}`, description, url: "/about" },
};

/** The longer story, for anyone who chooses to read it. The home page stays scannable. */
export default function AboutPage() {
  return (
    <>
      <article className="pb-8 pt-28 sm:pt-36">
        <Shell>
          <Link href="/" className="link text-[0.9375rem] text-dim">
            Back to the home page
          </Link>

          <h1 className="display mt-8 text-[clamp(2.5rem,6vw,4rem)] text-ink">About me</h1>
          <p className="mt-3 text-[1.0625rem] text-dim">The longer story, in about five minutes.</p>

          <div className="measure mt-10 space-y-6 text-[1.125rem] leading-[1.75] text-dim">
            {profile.longVersion.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="measure mt-10 border-l-2 border-accent pl-5 text-[1.25rem] font-medium leading-snug text-ink">
            {profile.coda}
          </p>
        </Shell>
      </article>

      <Section id="record" title="The rest of the record" intro="Education, teaching, and a few smaller projects.">
        <div className="grid gap-5 md:grid-cols-2">
          <Tray>
            <Panel className="h-full p-5 sm:p-6">
              <h3 className="heading text-[1.125rem] text-ink">{profile.education.school}</h3>
              <p className="mt-1 text-[0.9375rem] text-dim">
                {profile.education.degree}, class of {profile.education.graduated}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-dim">{profile.education.note}</p>
            </Panel>
          </Tray>

          <Tray>
            <Panel className="h-full p-5 sm:p-6">
              <h3 className="heading text-[1.125rem] text-ink">Teaching and hackathons</h3>
              <ul className="mt-3 space-y-4">
                {volunteering.map((item) => (
                  <li key={item.org}>
                    <p className="text-[1rem] font-medium text-ink">
                      {item.org}, {item.role.toLowerCase()} ({item.period})
                    </p>
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-dim">{item.body}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </Tray>

          {projects.map((project) => (
            <Tray key={project.name}>
              <Panel className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="heading text-[1.125rem] text-ink">{project.name}</h3>
                  <p className="text-[0.8125rem] text-faint">{project.period}</p>
                </div>
                <p className="mt-1 text-[0.9375rem] text-dim">{project.tagline}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-dim">{project.description}</p>
                <BadgeList items={project.stack} className="mt-4" />
                {project.links?.length ? (
                  <div className="mt-auto pt-4">
                    {project.links.map((link) => (
                      <ExternalLink key={link.href} href={link.href} className="text-[0.9375rem]">
                        {link.label}
                      </ExternalLink>
                    ))}
                  </div>
                ) : null}
              </Panel>
            </Tray>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-line p-5 sm:p-7">
          <h3 className="heading text-[1.125rem] text-ink">Practicalities</h3>
          <p className="measure mt-2 text-[1rem] leading-relaxed text-dim">{profile.practicalities}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <a href={`mailto:${profile.email}`} className={buttonClass("primary")}>
              Email me
            </a>
            <a href="/Donald-Amadi-CV.pdf" target="_blank" rel="noreferrer" className={buttonClass("outline")}>
              Download CV
            </a>
            <Link href="/#experience" className={buttonClass("quiet")}>
              See my experience
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
