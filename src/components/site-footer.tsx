import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { profile } from "@/content/profile";
import { ExternalLink, Shell } from "./primitives";

const sections = [
  { label: "Zoom out", href: "/#story" },
  { label: "PinDey", href: "/#pindey" },
  { label: "How I work", href: "/#how" },
  { label: "Right now", href: "/#now" },
  { label: "Open source", href: "/#open-source" },
  { label: "Earlier work", href: "/#work" },
  { label: "Writing", href: "/#writing" },
  { label: "Contact", href: "/#contact" },
  { label: "The long version", href: "/about" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line pb-10 pt-16">
      <Shell>
        <div className="grid gap-10 sm:grid-cols-3">
          <nav aria-label="Sections">
            <p className="eyebrow">Sections</p>
            <ul className="mt-4 space-y-2">
              {sections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link text-[0.875rem] text-dim">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Case studies">
            <p className="eyebrow">Case studies</p>
            <ul className="mt-4 space-y-2">
              {caseStudies.map((study) => (
                <li key={study.slug}>
                  <Link href={`/work/${study.slug}`} className="link text-[0.875rem] text-dim">
                    {study.kicker}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {profile.links.map((link) => (
                <li key={link.href}>
                  <ExternalLink href={link.href} className="text-[0.875rem] text-dim">
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
              <li>
                <a
                  href="/Donald-Amadi-CV.pdf"
                  className="link text-[0.875rem] text-dim"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download CV (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.625rem] tracking-wide text-faint">
            © {new Date().getFullYear()} {profile.name} · Built with Next.js and rather too much care
          </p>
          <p className="font-mono text-[0.625rem] tracking-wide text-faint">
            {profile.location} · {profile.timezone}
          </p>
        </div>
      </Shell>
    </footer>
  );
}
