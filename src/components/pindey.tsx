import type { ReactNode } from "react";
import { pindey } from "@/content/pindey";
import { FinderDemo } from "./finder-demo";
import { Chapter, ExternalLink, Lines } from "./primitives";

/**
 * PinDey, told mostly in pictures. A card that says what it is, three short
 * beats of the problem, a Finder you can actually use, then the features as
 * small moving cards instead of a bullet list.
 *
 * House rule: PinDey is never described with "track" or any form of it.
 */
export function PinDey() {
  return (
    <Chapter id="pindey" eyebrow="The thing I'm building">
      {/* The card */}
      <article
        className="relative mt-8 overflow-hidden rounded-2xl border p-6 sm:p-10"
        style={{
          borderColor: "color-mix(in oklab, var(--accent-2) 45%, transparent)",
          background: "linear-gradient(135deg, var(--accent-2-soft), transparent 60%), var(--surface)",
        }}
        data-reveal
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-2 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-2" />
          </span>
          <p className="font-mono text-[0.6875rem] font-bold tracking-[0.16em] text-accent-2">
            {pindey.status.toUpperCase()}
          </p>
        </div>

        <h2 className="display mt-6 text-[clamp(3rem,9vw,5.5rem)] text-ink">{pindey.name}</h2>
        <p className="mt-3 text-[clamp(1.125rem,2.4vw,1.5rem)] text-ink">{pindey.oneLiner}</p>
        <p className="mt-2 text-[1.0625rem] italic text-accent-2">&ldquo;{pindey.tagline}&rdquo;</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={pindey.links.demo.href}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full px-4 py-2 text-[0.875rem] font-medium transition-opacity hover:opacity-85"
            style={{ background: "var(--accent-2)", color: "var(--bg)" }}
          >
            {pindey.links.demo.label} ↗
          </a>
          <ExternalLink href={pindey.links.site.href} className="px-2 text-[0.875rem]">
            {pindey.links.site.label}
          </ExternalLink>
        </div>
      </article>

      {/* The problem, in three beats */}
      <Lines lines={pindey.problem} className="mt-20" />

      {/* The Finder */}
      <div className="mt-12" data-reveal>
        <FinderDemo />
      </div>

      {/* The decision worth the most room */}
      <div
        className="mt-6 grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:gap-12"
        data-reveal
      >
        <HonestDial />
        <div>
          <h3 className="heading text-[clamp(1.5rem,3vw,2rem)] leading-tight text-ink">
            {pindey.finder.honest.title}
          </h3>
          <div className="mt-4 max-w-[52ch] space-y-3 text-[1.0625rem] leading-relaxed text-dim">
            {pindey.finder.honest.body.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-5 font-mono text-[0.75rem] text-accent-2">{pindey.finder.honest.tryIt}</p>
        </div>
      </div>

      {/* Features, as small moving cards */}
      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pindey.features.map((feature, index) => (
          <li
            key={feature.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface"
            data-reveal
            style={{ ["--reveal-delay" as string]: `${(index % 3) * 80}ms` }}
          >
            <div className="grid h-36 place-items-center border-b border-line bg-surface-2" aria-hidden="true">
              {FEATURE_ART[feature.id]}
            </div>
            <div className="p-5">
              <h3 className="heading text-[1.25rem] text-ink">{feature.name}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-dim">{feature.body}</p>
            </div>
          </li>
        ))}

        <li
          className="flex flex-col rounded-2xl border border-line bg-surface p-5"
          data-reveal
          style={{ ["--reveal-delay" as string]: "160ms" }}
        >
          <h3 className="heading text-[1.25rem] text-ink">And the small stuff</h3>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {pindey.extras.map((extra) => (
              <li
                key={extra}
                className="rounded-full border border-line px-2.5 py-1 text-[0.75rem] leading-snug text-dim"
              >
                {extra}
              </li>
            ))}
          </ul>
        </li>
      </ul>

      {/* Privacy */}
      <div
        className="mt-4 grid items-center gap-8 rounded-2xl border border-line bg-surface p-6 sm:p-10 md:grid-cols-[auto_1fr]"
        data-reveal
      >
        <Countdown />
        <ul className="grid gap-6 sm:grid-cols-3">
          {pindey.privacy.map((item) => (
            <li key={item.big}>
              <p className="display text-[2.25rem] text-ink">{item.big}</p>
              <p className="mt-1 text-[0.9375rem] text-dim">{item.small}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Where it's for */}
      <div className="mt-16 overflow-hidden" data-reveal>
        <div className="marquee" aria-label={`Built for ${pindey.places.join(", ")}.`} role="img">
          {[0, 1].map((copy) => (
            <div key={copy} className={copy ? "marquee-dup flex gap-3 pr-3" : "marquee-copy flex gap-3 pr-3"} aria-hidden="true">
              {pindey.places.map((place) => (
                <span
                  key={place}
                  className="heading whitespace-nowrap rounded-full border border-line-strong px-5 py-2 text-[clamp(1.125rem,2.4vw,1.5rem)] text-dim"
                >
                  {place}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="mt-6 text-[1.0625rem] text-ink">{pindey.reach}</p>
      </div>

      {/* Every layer, one person */}
      <div className="mt-16 border-t border-line pt-10" data-reveal>
        <p className="heading text-[clamp(1.375rem,3vw,2rem)] text-ink">{pindey.ownership}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {pindey.layers.map((layer, index) => (
            <li
              key={layer}
              className="rounded-lg border px-3 py-1.5 font-mono text-[0.75rem] text-ink"
              style={{
                borderColor: `color-mix(in oklab, var(--accent-2) ${Math.round((index / (pindey.layers.length - 1)) * 100)}%, var(--accent))`,
              }}
            >
              {layer}
            </li>
          ))}
        </ul>
        {pindey.stack.length ? (
          <p className="mt-4 font-mono text-[0.75rem] text-faint">{pindey.stack.join(" · ")}</p>
        ) : null}
      </div>
    </Chapter>
  );
}

/** A still Finder caught in its honest state, as the illustration for the decision. */
function HonestDial() {
  return (
    <div className="relative mx-auto grid size-[150px] place-items-center rounded-full border border-line-strong bg-bg" aria-hidden="true">
      <div className="relative grid size-[84px] place-items-center">
        <span className="ripple absolute inset-0 rounded-full border-2 border-accent-2" />
        <span className="ripple absolute inset-0 rounded-full border-2 border-accent" style={{ animationDelay: "1.5s" }} />
        <span className="size-4 rounded-full bg-accent-2" />
      </div>
      <span className="absolute bottom-4 font-mono text-[0.625rem] text-accent-2">look around</span>
    </div>
  );
}

function Countdown() {
  return (
    <div className="relative mx-auto grid size-[120px] place-items-center" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--line)" strokeWidth="3" />
        <circle
          className="countdown"
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
        />
      </svg>
      <span className="font-mono text-[0.875rem] text-ink">2:00</span>
    </div>
  );
}

const FEATURE_ART: Record<string, ReactNode> = {
  spaces: (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1 font-mono text-[1.375rem] font-bold text-ink">
        {"HSE-234".split("").map((ch, i) => (
          <span
            key={i}
            className="pop grid h-10 w-7 place-items-center rounded-md border border-line-strong bg-surface"
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            {ch}
          </span>
        ))}
      </div>
      <span className="rounded-full bg-accent-2-soft px-3 py-1 text-[0.6875rem] text-accent-2">or tap the WhatsApp invite</span>
    </div>
  ),
  crews: (
    <div className="flex items-end gap-6">
      {[
        { n: 3, c: "var(--accent)", on: true },
        { n: 4, c: "var(--accent-2)", on: true },
        { n: 2, c: "var(--faint)", on: false },
      ].map((crew, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className="flex -space-x-1.5">
            {Array.from({ length: crew.n }, (_, j) => (
              <span key={j} className="size-5 rounded-full border-2 border-surface-2" style={{ background: crew.c }} />
            ))}
          </div>
          <span className="font-mono text-[0.625rem] text-faint">{crew.on ? "sharing" : "not shared"}</span>
        </div>
      ))}
    </div>
  ),
  ghost: (
    <div className="flex items-center gap-4">
      <span className="ghost relative grid size-14 place-items-center rounded-full border-2 border-dashed border-accent">
        <span className="size-4 rounded-full bg-accent" />
      </span>
      <span className="font-mono text-[0.75rem] text-dim">findable: paused</span>
    </div>
  ),
  flare: (
    <div className="flex items-center gap-5">
      <span className="flare grid h-24 w-14 place-items-center rounded-xl border-2 border-line-strong">
        <span className="font-mono text-[0.5625rem] text-faint">beacon</span>
      </span>
      <span className="spin relative size-10">
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-accent-2" />
      </span>
    </div>
  ),
  radar: (
    <div className="relative size-28 overflow-hidden rounded-full border border-line-strong">
      <span className="absolute inset-[22%] rounded-full border border-line" />
      <span className="absolute inset-[42%] rounded-full border border-line" />
      <span
        className="spin absolute inset-0 rounded-full"
        style={{ background: "conic-gradient(from 0deg, transparent 0 300deg, var(--accent-2-soft) 330deg, color-mix(in oklab, var(--accent-2) 55%, transparent) 360deg)" }}
      />
      {[
        { x: 30, y: 28, l: "8m" },
        { x: 70, y: 40, l: "15m" },
        { x: 45, y: 74, l: "4m" },
      ].map((dot) => (
        <span key={dot.l} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${dot.x}%`, top: `${dot.y}%` }}>
          <span className="block size-2 rounded-full bg-accent-2" />
          <span className="absolute left-2.5 top-[-3px] font-mono text-[0.5rem] text-dim">{dot.l}</span>
        </span>
      ))}
      <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
    </div>
  ),
};
