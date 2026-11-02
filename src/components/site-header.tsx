"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";
import { Shell } from "./primitives";
import { cn } from "@/lib/utils";
import { AskButton, Sparkle } from "./ask-ai";
import { SoundToggle } from "./sound-layer";

const nav = [
  { label: "PinDey", href: "/#pindey" },
  { label: "React Native", href: "/#react-native" },
  { label: "Work", href: "/#work" },
  { label: "Play", href: "/#play" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        lifted ? "border-b border-line backdrop-blur-xl" : "border-b border-transparent",
      )}
      style={lifted ? { backgroundColor: "var(--bg-veil)" } : undefined}
    >
      <Shell>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Donald Amadi, home">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-[0.8125rem] font-semibold text-bg">DA</span>
            <span className="heading text-[1rem] text-ink">Donald Amadi</span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            <nav aria-label="Sections" className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 text-[0.875rem] text-dim transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <AskButton className="inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-line bg-surface px-2.5 text-[0.875rem] text-ink shadow-card transition-colors hover:border-line-strong">
              <Sparkle className="size-4 text-accent-2" />
              <span className="hidden sm:inline">Ask AI</span>
              <span className="sr-only sm:hidden">Ask my AI</span>
            </AskButton>
            <CommandPalette />
            <SoundToggle />
            <ThemeToggle />

            <Link
              href="/#contact"
              className="rounded-[9px] bg-ink px-3.5 py-1.5 text-[0.875rem] font-medium text-bg transition-opacity hover:opacity-90"
            >
              Contact
            </Link>
          </div>
        </div>
      </Shell>
    </header>
  );
}
