"use client";

import { useEffect, useRef } from "react";

/**
 * Reading progress. Driven by rAF-throttled scroll and written straight to a
 * transform, so it never triggers layout — the naive version of this component
 * animates `width` and jitters on long pages.
 */
export function ProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = barRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      el.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-px">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{ background: "var(--accent)", transform: "scaleX(0)" }}
      />
    </div>
  );
}
