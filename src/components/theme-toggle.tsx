"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* private mode, the choice just won't persist */
    }
    setTheme(next);
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
