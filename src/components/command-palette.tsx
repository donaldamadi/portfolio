"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { caseStudies } from "@/content/case-studies";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: () => void;
};

/**
 * ⌘K navigation. Hand-rolled: a listbox, roving focus, Escape to dismiss, focus
 * returned to the trigger on close. It exists because a single-page site this
 * long is genuinely faster to navigate with a keyboard, not because palettes
 * are fashionable.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    restoreFocusTo.current?.focus();
  }, []);

  const goto = useCallback(
    (hash: string) => () => {
      close();
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else router.push(`/${hash}`);
    },
    [close, router],
  );

  const commands = useMemo<Command[]>(() => {
    const sections: Command[] = [
      { id: "work", label: "Selected work", group: "Navigate", run: goto("#work") },
      { id: "experience", label: "Experience", group: "Navigate", run: goto("#experience") },
      { id: "practice", label: "AI practice", group: "Navigate", run: goto("#practice") },
      { id: "open-source", label: "Open source", group: "Navigate", run: goto("#open-source") },
      { id: "writing", label: "Writing", group: "Navigate", run: goto("#writing") },
      { id: "contact", label: "Contact", group: "Navigate", run: goto("#contact") },
    ];

    const studies: Command[] = caseStudies.map((study) => ({
      id: `cs-${study.slug}`,
      label: study.kicker,
      hint: study.title,
      group: "Case studies",
      run: () => {
        close();
        router.push(`/work/${study.slug}`);
      },
    }));

    const links: Command[] = profile.links.map((link) => ({
      id: `link-${link.label}`,
      label: link.label,
      group: "Elsewhere",
      hint: link.href.replace(/^https?:\/\//, "").replace(/^mailto:/, ""),
      run: () => {
        close();
        window.open(link.href, link.href.startsWith("mailto:") ? "_self" : "_blank", "noreferrer");
      },
    }));

    return [...sections, ...studies, ...links];
  }, [close, goto, router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        restoreFocusTo.current = document.activeElement as HTMLElement | null;
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, open]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      document.documentElement.style.overflow = "hidden";
      return () => {
        window.clearTimeout(id);
        document.documentElement.style.overflow = "";
      };
    }
    return undefined;
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={(event) => {
          restoreFocusTo.current = event.currentTarget;
          setOpen(true);
        }}
        className="hidden items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] text-faint transition-colors hover:border-line-strong hover:text-dim sm:inline-flex"
      >
        <span>Jump to</span>
        <kbd className="rounded border border-line px-1 py-px text-[0.625rem]">⌘K</kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Jump to"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span className="font-mono text-xs text-faint">›</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((i) => (i + 1) % Math.max(results.length, 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                results[active]?.run();
              }
            }}
            placeholder="Search sections, case studies, links…"
            aria-label="Search"
            aria-controls="command-results"
            className="w-full bg-transparent py-3.5 text-sm text-ink outline-none placeholder:text-faint"
          />
        </div>

        <ul id="command-results" role="listbox" className="max-h-[52vh] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-faint">Nothing matches that.</li>
          ) : (
            results.map((command, index) => {
              const first = index === 0 || results[index - 1]?.group !== command.group;
              return (
                <li key={command.id}>
                  {first ? <div className="eyebrow px-4 pb-1 pt-3">{command.group}</div> : null}
                  <button
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={command.run}
                    className={cn(
                      "flex w-full items-baseline justify-between gap-4 px-4 py-2 text-left text-sm transition-colors",
                      index === active ? "bg-accent-soft text-ink" : "text-dim",
                    )}
                  >
                    <span>{command.label}</span>
                    {command.hint ? (
                      <span className="truncate font-mono text-[0.6875rem] text-faint">{command.hint}</span>
                    ) : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
