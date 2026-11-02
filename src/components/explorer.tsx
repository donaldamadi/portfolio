"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  ACHIEVEMENTS,
  UNLOCK_EVENT,
  getServerUnlocked,
  getUnlocked,
  resetAchievements,
  subscribe,
  type AchievementId,
} from "@/lib/achievements";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

const TOAST_MS = 3800;

/**
 * The explorer layer: a small chip in the corner that counts what you've found,
 * a panel that lists every badge (with a hint for the ones still locked), and a
 * toast when something unlocks. It sits on top of the page and never moves the
 * layout underneath.
 */
export function Explorer() {
  const unlocked = useSyncExternalStore(subscribe, getUnlocked, getServerUnlocked);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<AchievementId | null>(null);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const total = ACHIEVEMENTS.length;
  const found = ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).length;
  const complete = found === total;

  // Toast on unlock.
  useEffect(() => {
    let timer = 0;
    const onUnlock = (event: Event) => {
      const id = (event as CustomEvent<AchievementId>).detail;
      window.clearTimeout(timer);
      setToast(id);
      timer = window.setTimeout(() => setToast(null), TOAST_MS);
    };
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => {
      window.removeEventListener(UNLOCK_EVENT, onUnlock);
      window.clearTimeout(timer);
    };
  }, []);

  // Close on Escape or a click outside; give focus back to the chip.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const close = () => {
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const toastTitle = ACHIEVEMENTS.find((a) => a.id === toast)?.title;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-auto rounded-[12px] border border-line bg-surface px-4 py-3 text-[0.9375rem] text-ink shadow-float transition-all duration-300",
          toastTitle ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        {toastTitle ? (
          <>
            <span className="text-accent-2">Found:</span> {toastTitle}
            <span className="ml-2 tabular-nums text-faint">
              {found} of {total}
            </span>
          </>
        ) : null}
      </p>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Things to find on this site"
          tabIndex={-1}
          className="pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-2xl bg-surface-2 p-1.5 shadow-float outline-none"
        >
          <div className="rounded-[12px] border border-line bg-surface p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[1.0625rem] text-ink">Things to find</p>
              <p className="text-[0.875rem] tabular-nums text-faint">
                {found} of {total}
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              <div
                className="h-full rounded-full bg-accent-2 transition-[width] duration-500"
                style={{ width: `${(found / total) * 100}%` }}
              />
            </div>

            <ul className="mt-3 max-h-[min(50vh,22rem)] divide-y divide-line overflow-y-auto">
              {ACHIEVEMENTS.map((a) => {
                const done = unlocked.has(a.id);
                return (
                  <li key={a.id} className="flex gap-3 py-2.5">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border text-[0.6875rem]",
                        done ? "border-accent-2 bg-accent-2 text-surface" : "border-line-strong text-transparent",
                      )}
                    >
                      ✓
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-[0.9375rem]", done ? "text-ink" : "text-dim")}>
                        {a.title}
                        <span className="sr-only">{done ? ", found" : ", not found yet"}</span>
                      </span>
                      {done ? null : <span className="block text-[0.8125rem] text-faint">{a.hint}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>

            {complete ? (
              <p className="mt-3 rounded-lg bg-accent-2-soft px-3 py-2 text-[0.875rem] text-accent-2">
                You found everything. That&rsquo;s the kind of curiosity I like working with.{" "}
                <a href={`mailto:${profile.email}`} className="underline underline-offset-2">
                  Say hello
                </a>
                .
              </p>
            ) : null}

            {found > 0 ? (
              <button
                type="button"
                onClick={resetAchievements}
                className="mt-3 text-[0.8125rem] text-faint underline-offset-2 hover:text-ink hover:underline"
              >
                Start over
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface pl-2 pr-3.5 text-[0.875rem] text-ink shadow-float transition-colors hover:border-line-strong"
      >
        <ProgressRing value={found / total} />
        <span className="tabular-nums">
          {found} of {total} found
        </span>
      </button>
    </div>
  );
}

function ProgressRing({ value }: { value: number }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6 -rotate-90" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--line)" strokeWidth="3" />
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="var(--accent-2)"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray={`${Math.max(value * 100, 0.01)} 100`}
        style={{ transition: "stroke-dasharray 500ms ease" }}
      />
    </svg>
  );
}
