"use client";

import { useEffect, useRef } from "react";

type Tone = "accent" | "accent-2" | "faint";

type Spark = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  a: number;
  phase: number;
  tone: Tone;
};

/**
 * A sparse, slow drift of sparks behind the hero.
 *
 * Written by hand rather than pulled from a particle library for three reasons:
 * it's ~100 lines instead of ~40kB, it pauses when the tab is hidden or the
 * element scrolls away, and it renders exactly one static frame for anyone who
 * has asked their OS for reduced motion.
 *
 * Density scales with area, capped, so a 4K monitor doesn't get 3,000 draws
 * per frame and a phone doesn't get four.
 */
export function SparkField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let sparks: Spark[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    // Read straight off the document so the field re-tints itself the moment
    // the theme toggle swaps the custom properties.
    const token = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

    const seed = () => {
      const target = Math.min(90, Math.max(24, Math.round((width * height) / 16000)));
      sparks = Array.from({ length: target }, () => {
        const r = Math.random() * 1.15 + 0.35;
        // Size decides the voice: the biggest sparks carry sky blue, a thin
        // slice of the mid-sized ones answer in green, the rest stay neutral
        // so the whole thing reads as texture rather than as decoration.
        const roll = Math.random();
        const tone: Tone = r > 1.15 ? "accent" : roll > 0.88 ? "accent-2" : "faint";
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          vy: -(Math.random() * 0.16 + 0.03),
          vx: (Math.random() - 0.5) * 0.05,
          a: Math.random() * 0.5 + 0.12,
          phase: Math.random() * Math.PI * 2,
          tone,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const palette: Record<Tone, string> = {
        accent: token("--accent", "#38bdf8"),
        "accent-2": token("--accent-2", "#34d399"),
        faint: token("--faint", "#667e97"),
      };

      for (const s of sparks) {
        const twinkle = reduced ? 1 : 0.65 + 0.35 * Math.sin(t / 1400 + s.phase);
        ctx.fillStyle = palette[s.tone];
        ctx.globalAlpha = s.a * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (t: number) => {
      if (!running) return;
      for (const s of sparks) {
        s.y += s.vy;
        s.x += s.vx;
        if (s.y < -4) {
          s.y = height + 4;
          s.x = Math.random() * width;
        }
        if (s.x < -4) s.x = width + 4;
        if (s.x > width + 4) s.x = -4;
      }
      draw(t);
      raf = requestAnimationFrame(step);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Only burn frames while the hero is actually on screen and the tab is visible.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        const onScreen = entry?.isIntersecting ?? false;
        if (onScreen && !reduced && document.visibilityState === "visible") {
          if (!raf) raf = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    visibility.observe(canvas);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
