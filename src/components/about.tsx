import { profile } from "@/content/profile";
import { Section } from "./primitives";

/**
 * The longer version of the story, as prose. It replaced a one-line statement
 * and a grid of skills: the range is easier to believe when it's told in the
 * order it happened than when it's listed.
 */
export function About() {
  return (
    <Section
      id="about"
      index="01"
      label="About"
      title={
        <>
          The screen was where I started.
          <br />
          It stopped being the whole job.
        </>
      }
    >
      <div className="measure space-y-6 text-[1.0625rem] leading-relaxed text-dim">
        {profile.about.map((paragraph, index) => (
          <p key={paragraph} data-reveal style={{ ["--reveal-delay" as string]: `${Math.min(index, 3) * 40}ms` }}>
            {paragraph}
          </p>
        ))}
      </div>

      <p
        className="display mt-14 max-w-[24ch] border-l pl-6 text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.25] text-ink sm:max-w-[34ch]"
        style={{ borderColor: "var(--accent)" }}
        data-reveal
      >
        {profile.coda}
      </p>
    </Section>
  );
}
