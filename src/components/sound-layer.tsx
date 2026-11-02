"use client";

import { useEffect, useSyncExternalStore } from "react";
import { UNLOCK_EVENT } from "@/lib/achievements";
import { playUi, setSoundEnabled, soundEnabled, subscribeSound, type UiSound } from "@/lib/sound";

const CLICKABLE = '[data-sound], button, a[href], [role="tab"], [role="option"], summary';

/**
 * Interface sounds for the whole site, from one delegated listener: a soft tap
 * for anything clickable, or the sound an element names in data-sound
 * (data-sound="none" opts out). Achievements chime when they unlock. Clicks and
 * key presses only; nothing sounds on hover or scroll. Renders nothing.
 */
export function SoundLayer() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const el = (event.target as Element | null)?.closest(CLICKABLE);
      if (!el || el.closest('[data-sound="none"]')) return;
      if (el instanceof HTMLButtonElement && el.disabled) return;
      playUi((el.getAttribute("data-sound") as UiSound | null) ?? "tap");
    };
    const onUnlock = () => playUi("unlock");
    document.addEventListener("click", onClick, true);
    window.addEventListener(UNLOCK_EVENT, onUnlock);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(UNLOCK_EVENT, onUnlock);
    };
  }, []);
  return null;
}

/** Header toggle for every sound on the site, the game's music included. */
export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, soundEnabled, () => true);
  return (
    <button
      type="button"
      data-sound="none"
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Sound on" : "Sound off"}
      onClick={() => toggleSound(on)}
      className="grid size-8 place-items-center rounded-[9px] border border-line bg-surface text-dim shadow-card transition-colors hover:border-line-strong hover:text-ink"
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.5 7.5h3l4-3.5v12l-4-3.5h-3z" fill="currentColor" fillOpacity="0.15" />
        {on ? (
          <path d="M13.5 7.2a4 4 0 0 1 0 5.6M15.6 5.1a7 7 0 0 1 0 9.8" />
        ) : (
          <path d="M13.5 7.5l4 5M17.5 7.5l-4 5" />
        )}
      </svg>
    </button>
  );
}

/** Turning sound on confirms with a chirp after it's on; turning it off chirps before it goes quiet. */
export function toggleSound(currentlyOn: boolean): void {
  if (currentlyOn) {
    playUi("toggle-off");
    setSoundEnabled(false);
  } else {
    setSoundEnabled(true);
    playUi("toggle-on");
  }
}
