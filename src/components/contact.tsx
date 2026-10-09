import Link from "next/link";
import { profile } from "@/content/profile";
import { pindey } from "@/content/pindey";
import { Shell } from "./primitives";

const linkedin = profile.links.find((link) => link.label === "LinkedIn")?.href ?? "";
const github = profile.links.find((link) => link.label === "GitHub")?.href ?? "";

/** The README's badge row, as real buttons. */
const BADGES = [
  { name: "LinkedIn", verb: "say hi", href: linkedin, tone: "var(--accent)" },
  { name: "Email", verb: "drop a line", href: `mailto:${profile.email}`, tone: "var(--accent-2)" },
  { name: "pindey.app", verb: "live", href: pindey.links.site.href, tone: "var(--accent-2)" },
  { name: "GitHub", verb: "poke around", href: github, tone: "var(--accent)" },
] as const;

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <Shell>
        <p className="eyebrow" data-reveal>
          Contact
        </p>
        <h2 className="display mt-6 max-w-[16ch] text-[clamp(2.5rem,7vw,5rem)] text-ink" data-reveal>
          If any of this sounds like your kind of thing, say hi.
        </h2>

        <ul className="mt-12 flex flex-wrap gap-3" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
          {BADGES.map((badge) => {
            const mail = badge.href.startsWith("mailto:");
            return (
              <li key={badge.name}>
                <a
                  href={badge.href}
                  target={mail ? undefined : "_blank"}
                  rel={mail ? undefined : "noreferrer noopener"}
                  className="group flex items-stretch overflow-hidden rounded-lg border border-line-strong font-mono text-[0.75rem] uppercase tracking-wider transition-transform hover:-translate-y-0.5"
                >
                  <span className="bg-surface-2 px-3 py-2 text-ink">{badge.name}</span>
                  <span className="px-3 py-2 font-bold" style={{ background: badge.tone, color: "var(--bg)" }}>
                    {badge.verb}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href={`mailto:${profile.email}`}
          className="link mt-10 inline-block heading text-[clamp(1.25rem,3.4vw,2rem)] text-ink"
          data-reveal
        >
          {profile.email}
        </a>

        <p className="mt-8 text-[1rem] text-dim" data-reveal>
          Want the whole story first?{" "}
          <Link href="/about" className="link-static text-ink">
            Got five minutes? The long version.
          </Link>
        </p>

        <p className="mt-20 text-center text-[1rem] italic text-faint" data-reveal>
          {profile.coda}
        </p>
      </Shell>
    </section>
  );
}
