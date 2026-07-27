import { EmberField } from "./ember-field";
import { Shell } from "./primitives";
import { profile } from "@/content/profile";

const proof = [
  "First Bank of Nigeria",
  "Zedcrest",
  "MAX",
  "Platnova",
  "Creative Advanced Technologies",
  "MedPal",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
      <EmberField className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[880px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.14] blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 62%)" }}
      />

      <Shell>
        <div className="flex items-center gap-3" data-reveal>
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-70"
              style={{ backgroundColor: "var(--accent)", animationDuration: "2.4s" }}
            />
            <span className="relative inline-flex size-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          </span>
          <p className="eyebrow">{profile.availability.status}</p>
        </div>

        <h1
          className="display mt-8 max-w-[19ch] text-[clamp(2.5rem,5.6vw,4.5rem)] text-ink"
          data-reveal
          style={{ ["--reveal-delay" as string]: "70ms" }}
        >
          I build the software that lives in your pocket.{" "}
          <span style={{ color: "var(--accent)" }}>Mostly for money that has to arrive.</span>
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-20">
          <div
            className="measure space-y-4 text-[1.0625rem] leading-relaxed text-dim"
            data-reveal
            style={{ ["--reveal-delay" as string]: "140ms" }}
          >
            {profile.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <dl
            className="grid w-full shrink-0 grid-cols-2 gap-x-10 gap-y-5 border-l border-line pl-6 font-mono text-[0.6875rem] lg:w-auto lg:grid-cols-1 lg:gap-y-4"
            data-reveal
            style={{ ["--reveal-delay" as string]: "210ms" }}
          >
            {[
              ["Based", profile.location],
              ["Hours", profile.timezone],
              ["Focus", "Fintech · Flutter · Native"],
              ["Next", "Backend & systems"],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-faint">{term}</dt>
                <dd className="mt-1 text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-20 border-t border-line pt-6" data-reveal style={{ ["--reveal-delay" as string]: "280ms" }}>
          <p className="eyebrow">Shipped for</p>
          <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-2 text-[0.8125rem] text-dim">
            {proof.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </Shell>
    </section>
  );
}
