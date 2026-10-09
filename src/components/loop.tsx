import { loop } from "@/content/story";
import { Chapter, Lines } from "./primitives";

const STEP_SECONDS = 2;

/**
 * The README's workflow loop, drawn as an actual loop: five steps round a
 * circle, a comet running round, and each step lighting up as it passes.
 * Pure CSS, so it costs nothing when it's off screen.
 */
export function Loop() {
  const n = loop.steps.length;

  return (
    <Chapter id="how" eyebrow="How I work">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <Lines lines={loop.lead} />

        <div className="relative mx-auto aspect-square w-full max-w-[460px]" data-reveal>
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="36" fill="none" stroke="var(--line-strong)" strokeWidth="0.5" />
            <circle
              className="comet"
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="5 95"
              style={{ animationDuration: `${n * STEP_SECONDS}s` }}
            />
          </svg>

          <ol aria-label="The loop">
            {loop.steps.map((step, i) => {
              const a = ((-90 + (360 / n) * i) * Math.PI) / 180;
              return (
                <li
                  key={step}
                  className="loop-step absolute w-[104px] border-line-strong bg-surface text-dim -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-2 text-center text-[0.75rem] leading-snug sm:w-[128px] sm:text-[0.875rem]"
                  style={{
                    left: `${50 + 36 * Math.cos(a)}%`,
                    top: `${50 + 36 * Math.sin(a)}%`,
                    // Negative delays start every step mid-cycle, so only one is lit at a time from the first frame.
                    animationDelay: `${(i - n) * STEP_SECONDS}s`,
                    animationDuration: `${n * STEP_SECONDS}s`,
                  }}
                >
                  {step}
                </li>
              );
            })}
          </ol>

          <p className="absolute inset-0 grid place-items-center text-center font-mono text-[0.75rem] text-faint">
            <span>
              <span aria-hidden="true" className="block text-[1.25rem] text-accent">
                ↻
              </span>
              {loop.back}
            </span>
          </p>
        </div>
      </div>
    </Chapter>
  );
}
