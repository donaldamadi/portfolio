"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  a: number;
  phase: number;
};

/**
 * A sparse, slow field of embers behind the hero.
 *
 * Written by hand rather than pulled from a particle library for three reasons:
 * it's ~90 lines instead of ~40kB, it pauses when the tab is hidden or the
 * element scrolls away, and it renders exactly one static frame for anyone who
 * has asked their OS for reduced motion.
 *
 * Density scales with area, capped, so a 4K monitor doesn't get 3,000 draws
 * per frame and a phone doesn't get four.
 */
export function EmberField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let embers: Ember[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e9a23b";
    const inkFaint = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--faint").trim() || "#6d6a64";

    const seed = () => {
      const target = Math.min(90, Math.max(24, Math.round((width * height) / 16000)));
      embers = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.15 + 0.35,
        vy: -(Math.random() * 0.16 + 0.03),
        vx: (Math.random() - 0.5) * 0.05,
        a: Math.random() * 0.5 + 0.12,
        phase: Math.random() * Math.PI * 2,
      }));
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
      const hot = accent();
      const cool = inkFaint();

      for (const e of embers) {
        const twinkle = reduced ? 1 : 0.65 + 0.35 * Math.sin(t / 1400 + e.phase);
        // The few largest embers get the accent; the rest stay neutral, so the
        // effect reads as texture rather than as decoration.
        ctx.fillStyle = e.r > 1.15 ? hot : cool;
        ctx.globalAlpha = e.a * twinkle;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (t: number) => {
      if (!running) return;
      for (const e of embers) {
        e.y += e.vy;
        e.x += e.vx;
        if (e.y < -4) {
          e.y = height + 4;
          e.x = Math.random() * width;
        }
        if (e.x < -4) e.x = width + 4;
        if (e.x > width + 4) e.x = -4;
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
