"use client";

import { useRevealObserver } from "@/lib/use-reveal";

/** Mounts the single document-wide reveal observer. Renders nothing. */
export function RevealRoot() {
  useRevealObserver();
  return null;
}
