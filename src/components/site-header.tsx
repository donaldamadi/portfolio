"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";
import { Shell } from "./primitives";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Practice", href: "/#practice" },
  { label: "Writing", href: "/#writing" },
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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        lifted ? "border-b border-line backdrop-blur-xl" : "border-b border-transparent",
      )}
      style={lifted ? { backgroundColor: "var(--bg-veil)" } : undefined}
    >
      <Shell>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="group flex items-baseline gap-2.5" aria-label="Donald Amadi — home">
            <span className="font-display text-lg tracking-tight text-ink">Donald Amadi</span>
            <span className="hidden font-mono text-[0.625rem] tracking-[0.14em] text-faint sm:inline">
              MOBILE ENGINEER
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-[0.8125rem] text-dim transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <CommandPalette />
            <ThemeToggle />

            <Link
              href="/#contact"
              className="rounded-full bg-ink px-3.5 py-1.5 text-[0.8125rem] font-medium transition-opacity hover:opacity-85"
              style={{ color: "var(--bg)" }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </Shell>
    </header>
  );
}
