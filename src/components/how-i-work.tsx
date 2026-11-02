import { Section } from "./primitives";

/**
 * How I work, kept short. AI is one line of four, because that's roughly the
 * share of the job it is: useful every day, never the point.
 */
const STEPS = [
  {
    title: "Start with the problem",
    body: "Who it's for, what breaks for them today, and what done looks like, before anyone opens an editor.",
  },
  {
    title: "See the whole system",
    body: "The screen, the API, the data and how it's deployed. Most bugs that matter live between those layers.",
  },
  {
    title: "Build it, with help",
    body: "I use AI coding tools the way I use a good IDE. Tests and my own review still decide what ships.",
  },
  {
    title: "Ship, then watch",
    body: "Feature flags, crash reporting and real users. The failure states are the product as much as the happy path.",
  },
] as const;

export function HowIWork() {
  return (
    <Section id="how" title="How I work" intro="Four steps, in this order, on every project.">
      <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="border-t border-line pt-5">
            <p className="rail-index">Step {i + 1}</p>
            <p className="mt-2 text-[1.0625rem] font-semibold text-ink">{step.title}</p>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-dim">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
