import { work } from "@/content/work";
import { BadgeList, Panel, Section, Tray } from "./primitives";

/** Where React runs in production today. Each line is a real, named surface. */
const REACT_IN_PRODUCTION = [
  { name: "PinDey website", note: "Next.js App Router, Tailwind, deployed to Cloudflare" },
  { name: "PinDey back office", note: "Next.js, server-only data access, two-factor sign-in" },
  { name: "Uplines web platform", note: "React, at Equivator" },
  { name: "Adduce", note: "React interface for an accessibility-compliance SaaS" },
  { name: "Job scraper", note: "Next.js dashboard over a Node.js and BullMQ backend" },
] as const;

/** What carries over to React Native. Three plain claims, each backed by work above or below. */
const CARRIES_OVER = [
  {
    title: "React and TypeScript, daily",
    body: "Components, hooks and typed API contracts are how I already build PinDey's web apps.",
  },
  {
    title: "Five years of shipped mobile",
    body: "Push, deep links, biometrics, offline networking and store releases, across banking, lending and health apps.",
  },
  {
    title: "Comfortable on the native side",
    body: "SwiftUI widgets, a Java card SDK behind a bridge, Kotlin when the platform needs it.",
  },
] as const;

export function ReactNative() {
  const ofinEko = work.find((w) => w.id === "ofin-eko");
  if (!ofinEko) return null;

  return (
    <Section
      id="react-native"
      title="React Native, and the React behind it"
      intro="I shipped Ofin Eko in React Native, and I write React and TypeScript every week on PinDey's web apps. The mobile instincts come from five years of shipping apps, most of them handling people's money."
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <Tray>
          <Panel className="grid h-full gap-6 p-5 sm:grid-cols-[1fr_auto] sm:p-7">
            <div className="min-w-0">
              <p className="text-[0.875rem] font-medium text-accent">Built in React Native</p>
              <h3 className="heading mt-2 text-[1.5rem] text-ink">{ofinEko.name}</h3>
              <p className="mt-1 text-[0.875rem] text-faint">
                {ofinEko.org}, {ofinEko.period}
              </p>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink">{ofinEko.what}</p>
              <p className="mt-3 text-[1rem] leading-relaxed text-dim">{ofinEko.body}</p>
              <BadgeList items={ofinEko.stack} className="mt-5" />
            </div>
            <OfinEkoPhone />
          </Panel>
        </Tray>

        <Tray>
          <Panel className="h-full p-5 sm:p-7">
            <h3 className="heading text-[1.125rem] text-ink">React in production</h3>
            <ul className="mt-4 divide-y divide-line">
              {REACT_IN_PRODUCTION.map((item) => (
                <li key={item.name} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-[1rem] font-medium text-ink">{item.name}</p>
                  <p className="mt-0.5 text-[0.9375rem] text-dim">{item.note}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </Tray>
      </div>

      <ul className="mt-5 grid gap-5 md:grid-cols-3">
        {CARRIES_OVER.map((item) => (
          <li key={item.title} className="rounded-[12px] border border-line p-5">
            <p className="text-[1rem] font-semibold text-ink">{item.title}</p>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-dim">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** A still of Ofin Eko's reading screen. Decorative; the card's text carries the meaning. */
function OfinEkoPhone() {
  return (
    <div aria-hidden="true" className="mx-auto w-[170px] shrink-0 rounded-[26px] border border-line-strong bg-surface p-2 shadow-float">
      <div className="rounded-[20px] bg-surface-2 p-3">
        <span className="mx-auto block h-1 w-9 rounded-full bg-line-strong" />
        <div className="mt-3 flex rounded-lg bg-surface p-0.5 text-[0.625rem] font-medium">
          <span className="flex-1 rounded-md bg-ink py-1 text-center text-bg">English</span>
          <span className="flex-1 py-1 text-center text-dim">Yorùbá</span>
        </div>
        <p className="mt-3 text-[0.6875rem] text-faint">Lagos State Laws</p>
        <p className="mt-0.5 text-[0.8125rem] font-semibold leading-snug text-ink">Part II, Section 4</p>
        <div className="mt-2 space-y-1.5">
          <span className="block h-1.5 w-full rounded bg-line-strong" />
          <span className="block h-1.5 w-11/12 rounded bg-line-strong" />
          <span className="block h-1.5 w-full rounded bg-line-strong" />
          <span className="block h-1.5 w-3/4 rounded bg-line-strong" />
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface p-2">
          <span className="grid size-6 place-items-center rounded-full bg-accent">
            <svg viewBox="0 0 10 10" className="ml-0.5 size-2.5" fill="white">
              <path d="M2 1 L9 5 L2 9 Z" />
            </svg>
          </span>
          <span className="h-1 flex-1 rounded-full bg-line-strong">
            <span className="block h-1 w-2/5 rounded-full bg-accent" />
          </span>
        </div>
        <p className="mt-2 text-center text-[0.625rem] text-faint">Works offline</p>
      </div>
    </div>
  );
}
