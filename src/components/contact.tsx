import { profile } from "@/content/profile";
import { ExternalLink, Shell } from "./primitives";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-24 sm:py-32">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-[9rem_1fr] lg:gap-16">
          <div>
            <div className="flex items-baseline gap-3 lg:block" data-reveal>
              <span className="rail-index">06</span>
              <span className="eyebrow block lg:mt-2">Contact</span>
            </div>
          </div>

          <div>
            <h2 className="display max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)] text-ink" data-reveal>
              If any of this sounds like your kind of thing, say hello.
            </h2>

            <div className="measure mt-8 space-y-4 text-[1.0625rem] leading-relaxed text-dim" data-reveal>
              <p>
                Email is the quickest way to reach me, and I&rsquo;m always happy to talk on LinkedIn too. A
                product you&rsquo;re trying to get off the ground, a system that&rsquo;s grown stranger than anyone
                meant it to, something you read here and want to argue with. Any of those is a good reason to write.
              </p>
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div data-reveal style={{ ["--reveal-delay" as string]: "70ms" }}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-baseline gap-3 heading text-[clamp(1.5rem,3.4vw,2.25rem)] text-ink"
                >
                  <span className="link">{profile.email}</span>
                </a>

                <div className="mt-8">
                  <a
                    href="/Donald-Amadi-CV.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.875rem] text-ink transition-colors hover:border-line-strong"
                  >
                    Download CV
                    <span className="font-mono text-[0.625rem] text-faint">PDF</span>
                  </a>
                </div>

                <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
                  {profile.links.map((link) => (
                    <li key={link.href}>
                      <ExternalLink href={link.href} className="text-[0.9375rem] text-dim">
                        {link.label}
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-lg border border-line bg-surface p-6 sm:p-7"
                data-reveal
                style={{ ["--reveal-delay" as string]: "140ms" }}
              >
                <p className="eyebrow">Practicalities</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-dim">{profile.practicalities}</p>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    </section>
  );
}
