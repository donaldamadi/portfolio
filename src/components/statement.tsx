import { Shell } from "./primitives";
import { profile } from "@/content/profile";

/**
 * One paragraph, no heading, no rail number. It sits between the hero and the
 * case studies as a beat of silence, which is the only reason it earns the
 * vertical space: a second "about" section here would just repeat the hero.
 */
export function Statement() {
  return (
    <section className="border-t border-line pb-16 pt-20 sm:pb-20 sm:pt-24" aria-label="How I think about the work">
      <Shell>
        <div className="grid gap-8 lg:grid-cols-[9rem_1fr] lg:gap-16">
          <p className="eyebrow lg:pt-4" data-reveal>
            In short
          </p>
          <p
            className="display max-w-[24ch] text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] text-ink sm:max-w-[34ch]"
            data-reveal
            style={{ ["--reveal-delay" as string]: "60ms" }}
          >
            {profile.statement}
          </p>
        </div>
      </Shell>
    </section>
  );
}
