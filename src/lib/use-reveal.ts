"use client";

import { useEffect } from "react";

/**
 * One observer for the whole document, attached once. Every element carrying
 * `data-reveal` is flipped to `data-reveal="shown"` the first time it crosses
 * the threshold and is then unobserved, so the cost is bounded by the number
 * of elements, not by scroll events.
 *
 * Deliberately not a per-component hook: N components meant N observers, and
 * on a page this long that was measurable on mid-range Android.
 */
export function useRevealObserver(): void {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const show = (el: Element) => el.setAttribute("data-reveal", "shown");

    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const attach = () => {
      document
        .querySelectorAll('[data-reveal]:not([data-reveal="shown"])')
        .forEach((el) => observer.observe(el));
    };

    attach();

    // Case-study routes mount their content after navigation.
    const mutation = new MutationObserver(attach);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);
}
