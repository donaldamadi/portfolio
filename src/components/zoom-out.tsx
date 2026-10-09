"use client";

import { useState } from "react";
import { zoomOut } from "@/content/story";
import { Chapter, Lines } from "./primitives";
import { cn } from "@/lib/utils";

const RADII = [32, 70, 110, 150, 190] as const;

/** Sky at the centre, green at the edge, mixed in between. */
function ringColor(index: number): string {
  const green = Math.round((index / (RADII.length - 1)) * 100);
  return `color-mix(in oklab, var(--accent-2) ${green}%, var(--accent))`;
}

/**
 * The README's ring diagram, made touchable. Rings draw in from the inside out
 * as the section scrolls into view; hovering or tapping a ring, or a row of the
 * legend, lights that layer up. It opens on "the problem", because that's where
 * the work starts now.
 */
export function ZoomOut() {
  const [active, setActive] = useState<number>(zoomOut.rings.length - 1);

  return (
    <Chapter id="story" eyebrow="Zoom out">
      <Lines lines={zoomOut.lead} />

      <div className="mt-16 overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-10">
        <p className="heading text-[1.25rem] text-ink sm:text-[1.5rem]">{zoomOut.title}</p>
        <p className="mt-1 font-mono text-[0.75rem] text-faint">{zoomOut.aside}</p>

        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <svg
            viewBox="-200 -200 400 400"
            className="mx-auto w-full max-w-[420px]"
            role="img"
            aria-label="Five rings, from the inside out: the screen, the API, the data, the infra, the problem."
          >
            {[...RADII].reverse().map((r, reversedIndex) => {
              const index = RADII.length - 1 - reversedIndex;
              const ring = zoomOut.rings[index];
              const on = index === active;
              const color = ringColor(index);
              return (
                <g
                  key={r}
                  data-reveal
                  style={{ ["--reveal-delay" as string]: `${index * 160}ms`, ["--reveal-shift" as string]: "0px" }}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="cursor-pointer"
                >
                  <circle
                    r={r}
                    fill={color}
                    fillOpacity={on ? 0.2 : 0.06}
                    stroke={color}
                    strokeOpacity={on ? 1 : 0.55}
                    strokeWidth={on ? 2.5 : 1.5}
                    style={{ transition: "fill-opacity 300ms, stroke-width 300ms, stroke-opacity 300ms" }}
                  />
                  {index > 0 && ring ? (
                    <text
                      y={-r + 22}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      letterSpacing="1.5"
                      fill={on ? "var(--ink)" : "var(--dim)"}
                      style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
                    >
                      {ring.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {/* the phone at the centre */}
            <g pointerEvents="none">
              <rect x="-11" y="-19" width="22" height="38" rx="5" fill="none" stroke="var(--ink)" strokeWidth="2" />
              <circle cy="13" r="1.8" fill="var(--ink)" />
            </g>
          </svg>

          <div>
            <ol className="space-y-2">
              {zoomOut.rings.map((ring, index) => {
                const on = index === active;
                return (
                  <li key={ring.label} data-reveal style={{ ["--reveal-delay" as string]: `${index * 160}ms` }}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onPointerEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setActive(index)}
                      className={cn(
                        "flex w-full items-start gap-4 rounded-xl border px-4 py-3 text-left transition-colors",
                        on ? "border-line-strong bg-surface-2" : "border-transparent",
                      )}
                    >
                      <span
                        className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full font-mono text-[0.75rem] font-bold"
                        style={{ background: ringColor(index), color: "var(--bg)" }}
                      >
                        {index + 1}
                      </span>
                      <span>
                        <span className={cn("block text-[1.0625rem]", on ? "text-ink" : "text-dim")}>{ring.label}</span>
                        <span className="mt-0.5 block text-[0.875rem] text-faint">{ring.note}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 pl-4 font-mono text-[0.8125rem] italic text-accent-2" data-reveal>
              {zoomOut.footnote}
            </p>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
