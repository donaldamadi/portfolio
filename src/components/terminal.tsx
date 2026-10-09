"use client";

import { useEffect, useRef, useState } from "react";
import { now } from "@/content/story";
import { packages } from "@/content/work";
import { pindey } from "@/content/pindey";
import { profile } from "@/content/profile";
import { Chapter } from "./primitives";

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "out"; text: string; tone?: "dim" | "ok" | "note" }
  | { kind: "link"; text: string; href: string };

const PROMPT = "donald@earth:~$";
const SUGGESTIONS = ["help", "ls pub.dev", "open pindey", "cat contact", "sudo make coffee"] as const;

function ps(): Line[] {
  const pad = (s: string, n: number) => s.padEnd(n, " ");
  return [
    { kind: "out", text: `${pad("PROCESS", 15)}STATUS`, tone: "dim" },
    ...now.processes.map(
      (p): Line => ({ kind: "out", text: `${pad(p.name, 15)}${pad("running", 10)}${p.note}`, tone: "ok" }),
    ),
  ];
}

const INITIAL: readonly Line[] = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", text: now.whoami },
  { kind: "cmd", text: "ps" },
  ...ps(),
];

function run(input: string): Line[] {
  const cmd = input.trim().replace(/\s+/g, " ");
  const echo: Line = { kind: "cmd", text: cmd };
  switch (cmd.toLowerCase()) {
    case "":
      return [];
    case "help":
      return [echo, { kind: "out", text: `try: ${["whoami", "ps", ...SUGGESTIONS.slice(1), "clear"].join("  ")}`, tone: "dim" }];
    case "whoami":
      return [echo, { kind: "out", text: now.whoami }];
    case "ps":
      return [echo, ...ps()];
    case "ls pub.dev":
    case "ls":
      return [echo, ...packages.map((p): Line => ({ kind: "link", text: p.name, href: p.links[0]?.href ?? "#" }))];
    case "open pindey":
    case "open pindey.app":
      return [
        echo,
        { kind: "out", text: `${pindey.oneLiner.toLowerCase()} live in prod.`, tone: "note" },
        { kind: "link", text: pindey.links.site.href, href: pindey.links.site.href },
        { kind: "link", text: pindey.links.demo.href, href: pindey.links.demo.href },
      ];
    case "cat contact":
    case "contact":
      return [
        echo,
        { kind: "link", text: profile.email, href: `mailto:${profile.email}` },
        { kind: "link", text: "linkedin.com/in/donald-amadi", href: "https://www.linkedin.com/in/donald-amadi-7b95b817a/" },
      ];
    case "sudo make coffee":
      return [echo, { kind: "out", text: "permission denied. it's Lagos, it's warm enough already.", tone: "note" }];
    default:
      return [echo, { kind: "out", text: `command not found: ${cmd}. try help`, tone: "dim" }];
  }
}

/**
 * "What I'm doing now", as the README's terminal joke, except this one takes
 * commands. It renders the same two commands on the server, so it reads fine
 * with JavaScript off; the prompt is the bonus.
 */
export function Terminal() {
  const [lines, setLines] = useState<readonly Line[]>(INITIAL);
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (input: string) => {
    if (input.trim().toLowerCase() === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [...prev, ...run(input)]);
    }
    setValue("");
  };

  return (
    <Chapter id="now" eyebrow="Right now">
      <p className="heading mt-6 text-[clamp(1.375rem,3.2vw,2.125rem)] text-ink" data-reveal>
        {now.lead}
      </p>

      <div
        className="mt-10 overflow-hidden rounded-2xl border border-line-strong bg-[#05070d] text-[#e6edf5] shadow-2xl"
        data-reveal
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-3 font-mono text-[0.6875rem] text-white/45">donald@earth: ~</span>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[420px] overflow-y-auto px-4 py-5 font-mono text-[0.75rem] leading-[1.7] sm:px-6 sm:text-[0.8125rem]"
          aria-live="polite"
        >
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {line.kind === "cmd" ? (
                <p className={i ? "mt-3" : undefined}>
                  <span className="text-[#34d399]">{PROMPT}</span> {line.text}
                </p>
              ) : line.kind === "link" ? (
                <a
                  href={line.href}
                  target={line.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  className="text-[#38bdf8] underline decoration-white/20 underline-offset-4 hover:decoration-[#38bdf8]"
                >
                  {line.text}
                </a>
              ) : (
                <p
                  className={
                    line.tone === "dim"
                      ? "text-white/45"
                      : line.tone === "note"
                        ? "text-[#fbbf24]"
                        : line.tone === "ok"
                          ? "text-[#e6edf5]"
                          : "text-[#a5d8ff]"
                  }
                >
                  {line.text}
                </p>
              )}
            </div>
          ))}

          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submit(value);
            }}
          >
            <label htmlFor="terminal-input" className="shrink-0 text-[#34d399]">
              {PROMPT}
            </label>
            <input
              id="terminal-input"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="type help"
              className="min-w-0 flex-1 bg-transparent text-[#e6edf5] caret-[#38bdf8] outline-none placeholder:text-white/30"
            />
          </form>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3 sm:px-6">
          {SUGGESTIONS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => submit(cmd)}
              className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[0.6875rem] text-white/70 transition-colors hover:border-[#38bdf8] hover:text-white"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </Chapter>
  );
}
