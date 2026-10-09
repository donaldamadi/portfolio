"use client";

import { useEffect, useRef, useState } from "react";

/** One layout per image count, the way multi_image_layout picks them. */
const LAYOUTS: readonly { label: string; cols: string; rows: string; areas: readonly string[]; more?: number }[] = [
  { label: "1", cols: "1fr", rows: "1fr", areas: ["1 / 1 / 2 / 2"] },
  { label: "2", cols: "1fr 1fr", rows: "1fr", areas: ["1 / 1 / 2 / 2", "1 / 2 / 2 / 3"] },
  { label: "3", cols: "1.4fr 1fr", rows: "1fr 1fr", areas: ["1 / 1 / 3 / 2", "1 / 2 / 2 / 3", "2 / 2 / 3 / 3"] },
  { label: "4", cols: "1fr 1fr", rows: "1fr 1fr", areas: ["1 / 1 / 2 / 2", "1 / 2 / 2 / 3", "2 / 1 / 3 / 2", "2 / 2 / 3 / 3"] },
  {
    label: "4+",
    cols: "1fr 1fr",
    rows: "1fr 1fr",
    areas: ["1 / 1 / 2 / 2", "1 / 2 / 2 / 3", "2 / 1 / 3 / 2", "2 / 2 / 3 / 3"],
    more: 3,
  },
];

const FILLS = [
  "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 40%, var(--surface)))",
  "linear-gradient(135deg, var(--accent-2), color-mix(in oklab, var(--accent-2) 40%, var(--surface)))",
  "linear-gradient(135deg, color-mix(in oklab, var(--accent) 50%, var(--accent-2)), var(--surface-2))",
  "linear-gradient(135deg, var(--line-strong), var(--accent-soft))",
];

/**
 * The package, illustrated by doing what it does: the grid re-lays itself as
 * the image count goes up. Cycles only while on screen; under reduced motion
 * it simply sits on the busiest layout.
 */
export function ImageGridArt() {
  const [index, setIndex] = useState(LAYOUTS.length - 1);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      timer = 0;
      if (entry?.isIntersecting) {
        timer = window.setInterval(() => setIndex((i) => (i + 1) % LAYOUTS.length), 1600);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const layout = LAYOUTS[index] ?? LAYOUTS[0]!;

  return (
    <div ref={ref} className="flex items-center gap-4" aria-hidden="true">
      <div
        className="grid h-24 w-32 gap-1 overflow-hidden rounded-lg"
        style={{ gridTemplateColumns: layout.cols, gridTemplateRows: layout.rows }}
      >
        {layout.areas.map((area, i) => (
          <span
            key={`${layout.label}-${i}`}
            className="relative grid place-items-center rounded-[3px]"
            style={{ gridArea: area, background: FILLS[i % FILLS.length] }}
          >
            {layout.more && i === layout.areas.length - 1 ? (
              <span className="font-mono text-[0.875rem] font-bold text-ink">+{layout.more}</span>
            ) : null}
          </span>
        ))}
      </div>
      <span className="w-8 font-mono text-[0.75rem] text-faint">{layout.label}</span>
    </div>
  );
}
