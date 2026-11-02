"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { unlock } from "@/lib/achievements";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- opening from anywhere */

export const OPEN_ASK_EVENT = "da:open-ask";

export function openAsk(question?: string): void {
  window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_ASK_EVENT, { detail: question }));
}

/** A button that opens the assistant. Used in the header and the hero. */
export function AskButton({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={() => openAsk()} className={className}>
      {children ?? (
        <>
          <Sparkle className="size-4" />
          Ask my AI
        </>
      )}
    </button>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2.5c.5 3.6 1.9 5 5.5 5.5-3.6.5-5 1.9-5.5 5.5-.5-3.6-1.9-5-5.5-5.5 3.6-.5 5-1.9 5.5-5.5Z" />
      <path d="M15.5 13.5c.2 1.3.7 1.8 2 2-1.3.2-1.8.7-2 2-.2-1.3-.7-1.8-2-2 1.3-.2 1.8-.7 2-2Z" />
    </svg>
  );
}

/* ---------------------------------------------------------------- the dialog */

type Source = { title: string; url: string | null; kind: string };
type Message = { role: "user" | "assistant"; content: string; sources?: Source[]; error?: string };

const SUGGESTIONS = [
  "What has Donald built with React Native?",
  "Tell me about PinDey",
  "What's his backend experience?",
  "How does he make payments safe to retry?",
  "Is he open to relocation?",
  "How can I contact him?",
] as const;

const STORE_KEY = "da-ask-v1";
const MAX_QUESTION = 600;

function loadHistory(): Message[] {
  try {
    const raw = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "[]") as unknown;
    return Array.isArray(raw) ? (raw as Message[]).filter((m) => m && (m.role === "user" || m.role === "assistant")) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]): void {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {
    /* private mode */
  }
}

/**
 * "Ask my AI": a retrieval-backed assistant that answers from Donald's CVs,
 * case studies, GitHub and articles (see /api/ask). Mounted once in the layout
 * and opened from anywhere through openAsk().
 */
export function AskAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState("");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const loaded = useRef(false);

  const ask = useCallback(
    async (question: string, base: Message[]) => {
      const q = question.trim().slice(0, MAX_QUESTION);
      if (!q) return;
      unlock("asked-ai");
      const history: Message[] = [...base, { role: "user", content: q }];
      const pending: Message = { role: "assistant", content: "" };
      setMessages([...history, pending]);
      setDraft("");
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;

      let answer: Message = { ...pending };
      const update = () => setMessages([...history, answer]);
      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            messages: history.filter((m) => !m.error && m.content).map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });
        if (!res.body) throw new Error("no body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const l of lines) {
            if (!l.trim()) continue;
            const event = JSON.parse(l) as { type: string; text?: string; message?: string; sources?: Source[] };
            if (event.type === "sources") answer = { ...answer, sources: event.sources };
            else if (event.type === "text" && event.text) answer = { ...answer, content: answer.content + event.text };
            else if (event.type === "error") answer = { ...answer, error: event.message };
            update();
          }
        }
      } catch {
        if (!controller.signal.aborted) answer = { ...answer, error: "Couldn't reach the AI. Check your connection and try again." };
      }
      if (controller.signal.aborted && !answer.content) answer = { ...answer, error: "Stopped." };
      const final = [...history, answer];
      setMessages(final);
      saveHistory(final);
      setBusy(false);
      setAnnounce(answer.error ?? answer.content);
      abortRef.current = null;
      inputRef.current?.focus();
    },
    [],
  );

  // Open from anywhere; restore this session's conversation the first time.
  useEffect(() => {
    const onOpen = (event: Event) => {
      returnTo.current = document.activeElement as HTMLElement | null;
      const base = loaded.current ? null : loadHistory();
      loaded.current = true;
      if (base) setMessages(base);
      setOpen(true);
      const question = (event as CustomEvent<string | undefined>).detail;
      if (question) void ask(question, base ?? []);
    };
    window.addEventListener(OPEN_ASK_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASK_EVENT, onOpen);
  }, [ask]);

  const close = useCallback(() => {
    abortRef.current?.abort();
    setOpen(false);
    returnTo.current?.focus();
  }, []);

  // While open: focus the input, lock page scroll, Escape closes, Tab stays inside.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    document.documentElement.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "Tab" && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea")];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (!open) return null;

  const submit = () => {
    if (!busy && draft.trim()) void ask(draft, messages.filter((m) => !m.error));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={close} className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[92dvh] w-full max-w-[46rem] flex-col rounded-t-2xl bg-surface-2 p-1.5 shadow-float sm:h-[min(46rem,88dvh)] sm:rounded-2xl"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px] border border-line bg-surface">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id={titleId} className="flex items-center gap-2 text-[1.375rem] leading-tight text-ink">
                <Sparkle className="size-5 text-accent-2" />
                Ask my AI
              </h2>
              <p className="mt-1 text-[0.875rem] text-faint">
                It has read my CVs, case studies, GitHub and articles. Ask it anything about my work.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="grid size-9 shrink-0 place-items-center rounded-[9px] border border-line text-dim transition-colors hover:border-line-strong hover:text-ink"
            >
              <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M2 2l8 8M10 2l-8 8" />
              </svg>
            </button>
          </div>

          {/* Conversation */}
          <div ref={logRef} role="log" aria-label="Conversation" aria-busy={busy} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            <Bubble role="assistant">
              Hi, I&rsquo;m Donald&rsquo;s AI. I&rsquo;ve read his CVs, case studies, GitHub and articles, so ask me anything
              about his work.
            </Bubble>

            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} pending={busy && i === messages.length - 1 && m.role === "assistant" && !m.content}>
                {m.content}
                {m.error ? <span className="block text-[0.875rem] text-dim">{m.error}</span> : null}
                {m.role === "assistant" && m.sources?.length && !(busy && i === messages.length - 1) ? (
                  <span className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
                    <span className="text-[0.75rem] text-faint">Sources:</span>
                    {m.sources.map((s) =>
                      s.url ? (
                        <a
                          key={s.title}
                          href={s.url}
                          target={s.url.startsWith("https://donaldamadi.dev") ? undefined : "_blank"}
                          rel="noreferrer noopener"
                          className="rounded-md bg-surface px-2 py-0.5 text-[0.75rem] text-dim shadow-card transition-colors hover:text-ink"
                        >
                          {s.title}
                        </a>
                      ) : (
                        <span key={s.title} className="rounded-md bg-surface px-2 py-0.5 text-[0.75rem] text-dim">
                          {s.title}
                        </span>
                      ),
                    )}
                  </span>
                ) : null}
              </Bubble>
            ))}

            {messages.length === 0 ? (
              <div className="pt-2">
                <p className="text-[0.8125rem] text-faint">Try one of these</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => void ask(q, [])}
                        className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.875rem] text-dim shadow-card transition-colors hover:border-line-strong hover:text-ink"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <div className="border-t border-line px-4 pb-3 pt-3 sm:px-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
              className="flex items-end gap-2 rounded-[14px] border border-line-strong bg-surface px-3 py-2 focus-within:border-accent"
            >
              <label htmlFor={`${titleId}-q`} className="sr-only">
                Your question
              </label>
              <textarea
                id={`${titleId}-q`}
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value.slice(0, MAX_QUESTION))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask about Donald's experience, projects, skills..."
                className="max-h-32 min-h-[2.25rem] flex-1 resize-none bg-transparent py-1.5 text-[1rem] text-ink outline-none placeholder:text-faint [field-sizing:content]"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="h-9 shrink-0 rounded-[10px] border border-line-strong px-3 text-[0.875rem] text-ink"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Send"
                  className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink text-bg transition-opacity disabled:opacity-30"
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
                  </svg>
                </button>
              )}
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 text-[0.75rem] text-faint">
              <span>
                AI can get things wrong. Check the sources, or email{" "}
                <a href={`mailto:${profile.email}`} className="underline underline-offset-2 hover:text-ink">
                  Donald
                </a>
                .
              </span>
              {messages.length ? (
                <button
                  type="button"
                  onClick={() => {
                    abortRef.current?.abort();
                    setMessages([]);
                    saveHistory([]);
                    inputRef.current?.focus();
                  }}
                  className="shrink-0 hover:text-ink"
                >
                  Clear chat
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </div>
  );
}

function Bubble({ role, pending, children }: { role: "user" | "assistant"; pending?: boolean; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={cn("flex gap-3", mine && "justify-end")}>
      {!mine ? (
        <span aria-hidden="true" className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-accent-2-soft text-accent-2">
          <Sparkle className="size-4" />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed",
          mine ? "rounded-br-md bg-ink text-bg" : "rounded-tl-md bg-surface-2 text-ink",
        )}
      >
        <span className="sr-only">{mine ? "You: " : "Donald's AI: "}</span>
        {pending ? <Thinking /> : children}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-pulse rounded-full bg-faint" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </span>
  );
}
