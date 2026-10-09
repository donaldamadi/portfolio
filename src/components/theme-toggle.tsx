"use client";

import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

/**
 * The theme lives on <html data-theme>, set before first paint by the bootstrap
 * script. This component reads it as an external store rather than copying it
 * into state, so there is one source of truth and no effect to sync it.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

/** Unknown on the server; the icon settles on the client's first render. */
const getServerTheme = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, getServerTheme);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode, the choice just won't persist */
    }
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Dark" : "Light"}
      className="grid size-8 place-items-center rounded-full border border-line text-dim transition-colors hover:border-line-strong hover:text-ink"
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
        {isLight ? (
          /* sun */
          <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 2.4v1.8M10 15.8v1.8M17.6 10h-1.8M4.2 10H2.4M15.37 4.63l-1.27 1.27M5.9 14.1l-1.27 1.27M15.37 15.37l-1.27-1.27M5.9 5.9L4.63 4.63" />
          </g>
        ) : (
          /* moon */
          <path
            d="M16.2 12.3A6.9 6.9 0 0 1 7.7 3.8a6.9 6.9 0 1 0 8.5 8.5Z"
            fill="currentColor"
          />
        )}
      </svg>
    </button>
  );
}
