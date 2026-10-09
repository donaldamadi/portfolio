import Link from "next/link";
import { SparkField } from "./spark-field";
import { Shell } from "./primitives";
import { profile } from "@/content/profile";

/**
 * The same hero as the GitHub README, with room to breathe: a prompt with a
 * blinking caret, a hello, three lines that take turns, and a phone with rings
 * rippling out of it, because that's the whole story in one picture.
 */
export function Hero() {
  const { hero } = profile;

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <SparkField className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[42%] top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.16] blur-[110px]"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 62%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[68%] top-24 -z-10 h-[420px] w-[620px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--accent-2), transparent 64%)" }}
      />

      <Shell>
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div className="min-w-0">
            <p className="font-mono text-[0.8125rem] text-faint" data-reveal>
              {hero.prompt}
              <span className="caret ml-1 text-accent" aria-hidden="true">
                ▍
              </span>
            </p>

            <h1
              className="display mt-6 text-[clamp(2.75rem,8vw,5.5rem)] text-ink"
              data-reveal
              style={{ ["--reveal-delay" as string]: "70ms" }}
            >
              {hero.hello}
              <span className="sr-only"> {hero.lines.join(" ")}</span>
            </h1>

            <p
              className="cycler heading mt-5 text-[clamp(1.25rem,4.4vw,2.25rem)]"
              aria-hidden="true"
              data-reveal
              style={{ ["--reveal-delay" as string]: "140ms" }}
            >
              {hero.lines.map((line) => (
                <span key={line} className="text-gradient">
                  {line}
                </span>
              ))}
            </p>

            <p
              className="mt-8 font-mono text-[0.75rem] text-dim sm:text-[0.8125rem]"
              data-reveal
              style={{ ["--reveal-delay" as string]: "210ms" }}
            >
              {hero.signature}
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-3"
              data-reveal
              style={{ ["--reveal-delay" as string]: "280ms" }}
            >
              <Link
                href="/#pindey"
                className="rounded-full bg-ink px-4 py-2 text-[0.875rem] font-medium transition-opacity hover:opacity-85"
                style={{ color: "var(--bg)" }}
              >
                See what I&rsquo;m building
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-line-strong px-4 py-2 text-[0.875rem] text-ink transition-colors hover:border-accent"
              >
                Got five minutes? The long version
              </Link>
            </div>
          </div>

          <PhoneRings />
        </div>
      </Shell>
    </section>
  );
}

function PhoneRings() {
  const rings = [
    { delay: "0s", color: "var(--accent)" },
    { delay: "1.5s", color: "color-mix(in oklab, var(--accent) 50%, var(--accent-2))" },
    { delay: "3s", color: "var(--accent-2)" },
  ];

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto grid size-[220px] place-items-center sm:size-[300px]"
      data-reveal
      style={{ ["--reveal-delay" as string]: "200ms", ["--reveal-shift" as string]: "0px" }}
    >
      {rings.map((ring) => (
        <span
          key={ring.delay}
          className="ripple absolute inset-0 rounded-full border-2"
          style={{ borderColor: ring.color, animationDelay: ring.delay }}
        />
      ))}
      <div className="relative flex h-[132px] w-[74px] flex-col gap-2 rounded-[16px] border-2 border-accent bg-surface p-2.5 shadow-2xl">
        <span className="mx-auto h-1.5 w-6 rounded-full bg-line-strong" />
        <span className="mt-1 h-2.5 w-full rounded bg-accent opacity-80" />
        <span className="h-2 w-2/3 rounded bg-line-strong" />
        <span className="h-2 w-5/6 rounded bg-line-strong" />
        <span className="mt-auto h-7 w-full rounded-md opacity-60" style={{ background: "var(--accent-2)" }} />
      </div>
    </div>
  );
}
