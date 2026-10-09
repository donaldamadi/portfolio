"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A working, browser-sized PinDey Finder.
 *
 * The party is a 40 × 28 m room with five bars in it, and Tolu is "by the bar".
 * You can drag yourself around, tap anywhere to step there, or use the arrow
 * keys. The dial points the way, the distance counts down, warmer or colder
 * tells you how you're doing, and the beat around the dial speeds up as you
 * close in. Get close enough and the arrow steps aside for the honest answer.
 *
 * Nothing here is the app's real logic. It's a toy that behaves like the
 * product so the idea lands without a paragraph.
 *
 * When nobody's touching it, it walks itself, but only while it's on screen,
 * and never for anyone who has asked their OS for reduced motion.
 */

type Point = { x: number; y: number };
type Phase = "far" | "close" | "found";
type Trend = "keep walking" | "warmer" | "colder";

const W = 40;
const H = 28;
const FOUND_AT = 1.5;
const HONEST_AT = 4;
const HYSTERESIS = 1.5;
const WALK_SPEED = 3; // metres per second, a brisk party shuffle

const START: Point = { x: 5, y: 4 };
const FRIEND: Point = { x: 32.4, y: 21.4 };
const BARS: readonly Point[] = [
  { x: 6, y: 9 },
  { x: 31, y: 5 },
  { x: 20, y: 13 },
  { x: 8, y: 23 },
  { x: 34.5, y: 23.5 },
];
/** A short walk with one wrong turn in it, so "colder" gets a moment too. */
const ROUTE: readonly Point[] = [START, { x: 14, y: 9 }, { x: 10, y: 4.5 }, { x: 22, y: 16 }, { x: 29.6, y: 20.2 }, { x: 31.6, y: 21 }];

/** A seeded crowd, so server and client render the same dots without lining them up. */
const CROWD: readonly Point[] = (() => {
  let seed = 7;
  const next = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 46 }, () => ({ x: 1.5 + next() * 37, y: 1.5 + next() * 25 }));
})();

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
/** Screen-up is "north". 0° points up, clockwise positive. */
const bearing = (a: Point, b: Point) => (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
const phaseOf = (d: number): Phase => (d <= FOUND_AT ? "found" : d < HONEST_AT ? "close" : "far");

export function FinderDemo() {
  const [you, setYou] = useState<Point>(START);
  const [trend, setTrend] = useState<Trend>("keep walking");
  const [angle, setAngle] = useState(() => bearing(START, FRIEND));
  const [smooth, setSmooth] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const refDistance = useRef(dist(START, FRIEND));
  const angleRef = useRef(bearing(START, FRIEND));
  const phaseRef = useRef<Phase>("far");
  const dragging = useRef(false);

  const d = dist(you, FRIEND);
  const phase = phaseOf(d);

  const moveTo = useCallback((next: Point, byHand: boolean) => {
    const p = { x: clamp(next.x, 0.5, W - 0.5), y: clamp(next.y, 0.5, H - 0.5) };
    const nd = dist(p, FRIEND);

    if (nd < refDistance.current - HYSTERESIS) {
      refDistance.current = nd;
      setTrend("warmer");
    } else if (nd > refDistance.current + HYSTERESIS) {
      refDistance.current = nd;
      setTrend("colder");
    }

    // Keep the arrow's rotation continuous, so it never spins the long way round.
    const target = bearing(p, FRIEND);
    const delta = ((((target - angleRef.current) % 360) + 540) % 360) - 180;
    angleRef.current += delta;
    setAngle(angleRef.current);

    const nextPhase = phaseOf(nd);
    if (byHand && nextPhase === "found" && phaseRef.current !== "found") {
      navigator.vibrate?.([30, 50, 30]);
    }
    phaseRef.current = nextPhase;
    setYou(p);
  }, []);

  const reset = useCallback(() => {
    refDistance.current = dist(START, FRIEND);
    setTrend("keep walking");
    moveTo(START, false);
  }, [moveTo]);

  // The self-walking loop. Runs only while visible, motion is allowed, and
  // nobody has taken the controls.
  useEffect(() => {
    if (!autoplay) return;
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let visible = false;
    let last = 0;
    let leg = 0;
    let along = 0;
    let holdUntil = 0;

    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      if (holdUntil) {
        if (now >= holdUntil) {
          holdUntil = 0;
          leg = 0;
          along = 0;
          reset();
        }
      } else {
        const from = ROUTE[leg];
        const to = ROUTE[leg + 1];
        if (from && to) {
          const length = dist(from, to);
          along += WALK_SPEED * dt;
          if (along >= length) {
            along -= length;
            leg += 1;
          }
          const t = Math.min(along / length, 1);
          moveTo({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }, false);
          if (leg >= ROUTE.length - 1) holdUntil = now + 3200;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    });
    io.observe(root);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [autoplay, moveTo, reset]);

  const takeControl = () => {
    if (autoplay) setAutoplay(false);
  };

  const pointFromEvent = (event: { clientX: number; clientY: number }): Point | null => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((event.clientX - rect.left) / rect.width) * W, y: ((event.clientY - rect.top) / rect.height) * H };
  };

  // Click rather than pointerdown, so a thumb scrolling past on a phone
  // doesn't teleport you across the room.
  const onFieldClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const p = pointFromEvent(event);
    if (!p) return;
    takeControl();
    setSmooth(true);
    moveTo(p, true);
  };

  const onHandlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    takeControl();
    dragging.current = true;
    setSmooth(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onHandlePointerMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragging.current) return;
    const p = pointFromEvent(event);
    if (p) moveTo(p, true);
  };

  const onHandlePointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 3 : 1;
    const moves: Record<string, Point> = {
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    };
    const m = moves[event.key];
    if (!m) return;
    event.preventDefault();
    takeControl();
    setSmooth(true);
    moveTo({ x: you.x + m.x, y: you.y + m.y }, true);
  };

  // The beat: slow and sparse far away, quick and tight up close.
  const beatSeconds = clamp(0.45 + (d / 34) * 1.9, 0.45, 2.35);
  const metres = d < 10 ? d.toFixed(1) : Math.round(d).toString();

  const status =
    phase === "found" ? "There they are." : phase === "close" ? "very close, look around" : trend;
  const announce = phase === "found" ? "Found Tolu." : phase === "close" ? "Very close, look around." : "";

  return (
    <div ref={rootRef} className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
      {/* The party */}
      <div>
        <div
          ref={fieldRef}
          role="application"
          aria-label="A party with five bars. You and your friend Tolu are somewhere in it. Use the arrow keys to walk, hold Shift to walk faster."
          tabIndex={0}
          onKeyDown={onKeyDown}
          onClick={onFieldClick}
          className="relative aspect-[40/28] w-full select-none overflow-hidden rounded-2xl border border-line bg-surface-2"
        >
          {CROWD.map((p, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-line-strong"
              style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
            />
          ))}

          {BARS.map((bar, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-line-strong bg-surface px-1.5 py-0.5 font-mono text-[0.5625rem] uppercase tracking-wider text-faint sm:text-[0.625rem]"
              style={{ left: `${(bar.x / W) * 100}%`, top: `${(bar.y / H) * 100}%` }}
            >
              bar
            </span>
          ))}

          {/* Tolu */}
          <span
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${(FRIEND.x / W) * 100}%`, top: `${(FRIEND.y / H) * 100}%` }}
          >
            <span className="absolute -inset-2 animate-ping rounded-full bg-accent-2 opacity-40" style={{ animationDuration: "2.2s" }} />
            <span className="relative block size-3.5 rounded-full border-2 border-bg bg-accent-2" />
            <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg rounded-br-sm bg-surface px-2 py-1 text-[0.6875rem] text-ink shadow-lg sm:text-[0.75rem]">
              Tolu: &ldquo;I&rsquo;m by the bar&rdquo;
            </span>
          </span>

          {/* You */}
          <span
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
            onPointerCancel={onHandlePointerUp}
            aria-hidden="true"
            className={cn(
              "absolute grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none place-items-center active:cursor-grabbing",
              smooth && "transition-[left,top] duration-300 ease-out",
            )}
            style={{ left: `${(you.x / W) * 100}%`, top: `${(you.y / H) * 100}%` }}
          >
            <span className="block size-4 rounded-full border-2 border-bg bg-accent shadow-[0_0_0_6px_var(--accent-soft)]" />
            <span className="absolute top-full -mt-1 font-mono text-[0.625rem] text-accent">you</span>
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.8125rem] text-faint">
            Drag yourself around, or tap anywhere to step there.
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              setSmooth(false);
              setAutoplay(true);
            }}
            className="rounded-full border border-line px-3 py-1 font-mono text-[0.6875rem] text-dim transition-colors hover:border-line-strong hover:text-ink"
          >
            {autoplay ? "walking by itself" : "let it walk"}
          </button>
        </div>
      </div>

      {/* The Finder */}
      <div
        className={cn(
          // Side by side with the room on desktop; a compact row on phones, so the
          // dial stays on screen while your thumb is in the room.
          "flex items-center gap-5 rounded-2xl border p-4 transition-colors duration-500 sm:p-8 lg:flex-col lg:justify-center lg:gap-0",
          phase === "found" ? "border-accent-2 bg-accent-2-soft" : "border-line bg-surface",
        )}
      >
        <p className="eyebrow hidden lg:block">Finding Tolu</p>

        <div className="relative grid size-[124px] shrink-0 place-items-center rounded-full border border-line-strong bg-bg sm:size-[160px] lg:mt-6 lg:size-[200px]">
          <span
            aria-hidden="true"
            className="beat absolute inset-0 rounded-full border-[3px] border-accent-2"
            style={{ animationDuration: `${beatSeconds}s` }}
          />
          <span aria-hidden="true" className="absolute inset-[18%] rounded-full border border-line" />

          {/* The arrow, while the phone knows which way. */}
          <svg
            viewBox="-60 -60 120 120"
            aria-hidden="true"
            className="absolute inset-[12%] transition-[opacity,transform] duration-300 ease-out"
            style={{ transform: `rotate(${angle}deg)`, opacity: phase === "far" ? 1 : 0 }}
          >
            <defs>
              <linearGradient id="finder-arrow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--accent-2)" />
                <stop offset="1" stopColor="var(--accent)" />
              </linearGradient>
            </defs>
            <path d="M0 -50 L24 4 L7 -3 L7 44 L-7 44 L-7 -3 L-24 4 Z" fill="url(#finder-arrow)" />
          </svg>

          {/* The honest answer, when it doesn't. */}
          <span
            aria-hidden="true"
            className="absolute inset-[22%] grid place-items-center transition-opacity duration-300"
            style={{ opacity: phase === "far" ? 0 : 1 }}
          >
            <span className="ripple absolute inset-0 rounded-full border-2 border-accent-2" />
            <span className="ripple absolute inset-0 rounded-full border-2 border-accent" style={{ animationDelay: "1.5s" }} />
            <span className="size-5 rounded-full bg-accent-2" />
          </span>
        </div>

        <div className="min-w-0 lg:text-center">
          <p className="eyebrow lg:hidden">Finding Tolu</p>
          <p className="mt-2 font-mono text-[2rem] leading-none text-ink tabular-nums lg:mt-6">
            {metres}
            <span className="ml-1 text-[1rem] text-faint">m</span>
          </p>
          <p
            className={cn(
              "mt-2 font-mono text-[0.875rem]",
              phase !== "far" || trend === "warmer" ? "text-accent-2" : trend === "colder" ? "text-accent" : "text-dim",
            )}
          >
            {status}
          </p>
        </div>

        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </div>
  );
}
