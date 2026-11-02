"use client";

import { useEffect, useRef, useState } from "react";

const PX_PER_METRE = 22;
const HONEST_UNDER = 3; // metres

type Reading = { angle: number; metres: number; following: boolean };

/**
 * The hero phone's Finder, pointed at you. On a device with a mouse or
 * trackpad, the arrow turns toward the cursor and the distance counts down as
 * you approach; get close enough and it does what the real Finder does, and
 * stops pretending to know the direction. It listens only while the hero is on
 * screen, and on touch-only devices it stays a still picture.
 */
export function HeroFinder() {
  const dialRef = useRef<HTMLDivElement | null>(null);
  const [reading, setReading] = useState<Reading>({ angle: 38, metres: 24, following: false });

  useEffect(() => {
    const dial = dialRef.current;
    if (!dial || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let visible = false;
    let last: { x: number; y: number } | null = null;

    const update = () => {
      frame = 0;
      if (!last) return;
      const r = dial.getBoundingClientRect();
      const dx = last.x - (r.left + r.width / 2);
      const dy = last.y - (r.top + r.height / 2);
      setReading({
        angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
        metres: Math.max(0, Math.round(Math.hypot(dx, dy) / PX_PER_METRE)),
        following: true,
      });
    };
    const onMove = (event: PointerEvent) => {
      if (!visible) return;
      last = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    io.observe(dial);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const honest = reading.following && reading.metres < HONEST_UNDER;

  return (
    <>
      <p className="mt-3 text-center text-[0.6875rem] text-faint">{reading.following ? "Finding you" : "Finding Tolu"}</p>
      <div
        ref={dialRef}
        className="relative mx-auto mt-2 grid size-[92px] place-items-center rounded-full border border-line-strong bg-surface sm:size-[108px]"
      >
        <svg
          viewBox="-60 -60 120 120"
          className="absolute inset-[16%] transition-opacity duration-200"
          style={{ transform: `rotate(${reading.angle}deg)`, opacity: honest ? 0 : 1 }}
        >
          <path d="M0 -50 L24 4 L7 -3 L7 44 L-7 44 L-7 -3 L-24 4 Z" fill="var(--accent-2)" />
        </svg>
        {honest ? (
          <span className="relative grid size-10 place-items-center">
            <span className="ripple absolute inset-0 rounded-full border-2 border-accent-2" />
            <span className="size-3 rounded-full bg-accent-2" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-center text-[1.25rem] tabular-nums text-ink">
        {reading.metres}
        <span className="ml-0.5 text-[0.75rem] text-faint">m</span>
      </p>
      <p className="text-center text-[0.75rem] text-accent-2">
        {honest ? "very close, look around" : reading.following ? "move closer" : "warmer"}
      </p>
    </>
  );
}
