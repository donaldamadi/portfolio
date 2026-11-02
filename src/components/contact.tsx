import Link from "next/link";
import { profile } from "@/content/profile";
import { Panel, Shell, Tray, buttonClass } from "./primitives";

const linkedin = profile.links.find((link) => link.label === "LinkedIn")?.href ?? "";
const github = profile.links.find((link) => link.label === "GitHub")?.href ?? "";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 pb-24 pt-16 sm:pb-32 sm:pt-24">
      <Shell>
        <Tray>
          <Panel className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <h2 className="display text-[clamp(2rem,4.4vw,3rem)] text-ink">Let&rsquo;s talk.</h2>
              <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-dim">
                Need someone who can carry a product from the first screen to the database, on mobile, the web or the
                backend? Email is the quickest way to reach me, and LinkedIn works too.
              </p>
              <a href={`mailto:${profile.email}`} className="link mt-6 inline-block text-[1.25rem] font-medium text-ink">
                {profile.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-2.5 lg:justify-end">
              <a href={`mailto:${profile.email}`} className={buttonClass("primary")}>
                Email me
              </a>
              <a href={linkedin} target="_blank" rel="noreferrer noopener" className={buttonClass("outline")}>
                LinkedIn
              </a>
              <a href={github} target="_blank" rel="noreferrer noopener" className={buttonClass("outline")}>
                GitHub
              </a>
              <a href="/Donald-Amadi-CV.pdf" target="_blank" rel="noreferrer" className={buttonClass("outline")}>
                CV (PDF)
              </a>
            </div>
          </Panel>
        </Tray>
        <p className="mt-6 text-[0.9375rem] text-dim">
          Want the longer story first?{" "}
          <Link href="/about" className="link text-ink">
            Read about me
          </Link>
          .
        </p>
      </Shell>
    </section>
  );
}
