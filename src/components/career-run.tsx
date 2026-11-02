"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CHAPTERS } from "@/content/career-run";
import { profile } from "@/content/profile";
import {
  GROUND_Y,
  PLAYER,
  WORLD_H,
  advance,
  createRun,
  jump,
  scoreOf,
  setMode,
  step,
  type Mode,
  type Phase,
  type RunEvent,
  type RunState,
} from "@/lib/career-run";
import { unlock } from "@/lib/achievements";
import { Chiptune, type Sfx } from "@/lib/chiptune";
import { soundEnabled, subscribeSound } from "@/lib/sound";
import { toggleSound as toggleSiteSound } from "./sound-layer";
import { Panel, Section, Tray, buttonClass } from "./primitives";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- best score */

const BEST_KEY = "da-career-run-best";
const BEST_EVENT = "da:career-best";

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}
function saveBest(score: number): void {
  if (score <= readBest()) return;
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(BEST_EVENT));
}
function subscribeBest(cb: () => void): () => void {
  window.addEventListener(BEST_EVENT, cb);
  return () => window.removeEventListener(BEST_EVENT, cb);
}

/* ---------------------------------------------------------------- colours */

type Palette = Record<"bg" | "tray" | "line" | "lineStrong" | "ink" | "dim" | "faint" | "accent" | "accentSoft" | "green" | "greenSoft" | "danger", string> & {
  font: string;
};

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string) => css.getPropertyValue(name).trim();
  return {
    bg: v("--surface"),
    tray: v("--surface-2"),
    line: v("--line"),
    lineStrong: v("--line-strong"),
    ink: v("--ink"),
    dim: v("--dim"),
    faint: v("--faint"),
    accent: v("--accent"),
    accentSoft: v("--accent-soft"),
    green: v("--accent-2"),
    greenSoft: v("--accent-2-soft"),
    danger: v("--danger"),
    font: getComputedStyle(document.body).fontFamily,
  };
}

/* ---------------------------------------------------------------- drawing */

function pill(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function draw(ctx: CanvasRenderingContext2D, s: RunState, W: number, c: Palette, still: boolean) {
  const chapter = CHAPTERS[s.chapter];
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, WORLD_H);

  // Skyline: the city drifts behind you (held still under reduced motion).
  const drift = still ? 0 : s.scroll * 0.25;
  ctx.fillStyle = c.tray;
  for (let i = -1; i < W / 70 + 2; i++) {
    const n = i + Math.floor(drift / 70);
    const h = 40 + ((n * 37) % 5) * 18 + ((n * 13) % 3) * 9;
    const x = i * 70 - (drift % 70);
    ctx.fillRect(x, GROUND_Y - h, 52, h);
  }

  // Ground.
  ctx.strokeStyle = c.lineStrong;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 1);
  ctx.lineTo(W, GROUND_Y + 1);
  ctx.stroke();
  ctx.fillStyle = c.line;
  const dash = s.scroll % 48;
  for (let x = -dash; x < W; x += 48) ctx.fillRect(x, GROUND_Y + 18, 22, 3);

  // Things.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const t of s.things) {
    if (t.kind === "bug" && t.air) {
      // A flyer: wings instead of legs, and it hovers just above head height.
      const cx = t.x + t.w / 2;
      const cy = t.y + t.h / 2;
      const flap = still ? 0.6 : 0.35 + Math.abs(Math.sin(s.clock * 18 + t.x * 0.05)) * 0.65;
      ctx.fillStyle = c.line;
      ctx.beginPath();
      ctx.ellipse(cx - 9, cy - 9 * flap, 9, 5 * flap + 1, -0.5, 0, Math.PI * 2);
      ctx.ellipse(cx + 9, cy - 9 * flap, 9, 5 * flap + 1, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.danger;
      ctx.globalAlpha = 0.85;
      pill(ctx, t.x + 4, t.y + 4, t.w - 8, t.h - 6, 9);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.bg;
      ctx.beginPath();
      ctx.arc(cx - 5, cy, 2.2, 0, Math.PI * 2);
      ctx.arc(cx + 5, cy, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.dim;
      ctx.font = `13px ${c.font}`;
      ctx.fillText(t.label, cx, t.y - 14);
    } else if (t.kind === "bug") {
      const cx = t.x + t.w / 2;
      ctx.fillStyle = c.danger;
      pill(ctx, t.x, t.y + 6, t.w, t.h - 6, 8);
      ctx.fill();
      ctx.strokeStyle = c.danger;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 6, t.y + 7);
      ctx.lineTo(cx - 10, t.y);
      ctx.moveTo(cx + 6, t.y + 7);
      ctx.lineTo(cx + 10, t.y);
      ctx.stroke();
      ctx.fillStyle = c.bg;
      ctx.beginPath();
      ctx.arc(cx - 6, t.y + 15, 2.5, 0, Math.PI * 2);
      ctx.arc(cx + 6, t.y + 15, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = c.dim;
      ctx.font = `13px ${c.font}`;
      ctx.fillText(t.label, cx, t.y - 12);
    } else if (!t.taken) {
      const bob = still ? 0 : Math.sin(s.clock * 4 + t.x * 0.02) * 3;
      const shield = t.kind === "shield";
      ctx.fillStyle = shield ? c.greenSoft : c.accentSoft;
      ctx.strokeStyle = shield ? c.green : c.accent;
      ctx.lineWidth = 1.5;
      pill(ctx, t.x, t.y + bob, t.w, t.h, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = shield ? c.green : c.accent;
      ctx.font = `13px ${c.font}`;
      ctx.fillText(t.label, t.x + t.w / 2, t.y + bob + t.h / 2 + 1);
    }
  }

  // You.
  const px = W * PLAYER.x;
  const py = s.playerY;
  // Just hit: flicker, or under reduced motion a steady fade instead of a flash.
  const hurt = s.invulnerable > 0;
  ctx.globalAlpha = hurt ? (still ? 0.45 : Math.floor(s.invulnerable * 10) % 2 === 0 ? 0.35 : 1) : 1;
  if (s.shield) {
    ctx.strokeStyle = c.green;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px + PLAYER.w / 2, py + PLAYER.h / 2, 30, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = c.ink;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  const onGround = py >= GROUND_Y - PLAYER.h - 0.5;
  const stride = onGround && !still ? Math.sin(s.clock * 16) * 7 : 4;
  ctx.beginPath();
  ctx.moveTo(px + 13, py + 30);
  ctx.lineTo(px + 13 + stride, py + PLAYER.h);
  ctx.moveTo(px + 13, py + 30);
  ctx.lineTo(px + 13 - stride, py + PLAYER.h);
  ctx.stroke();
  ctx.fillStyle = c.ink;
  pill(ctx, px + 5, py + 11, 16, 21, 6);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(px + 13, py + 6, 6.5, 0, Math.PI * 2);
  ctx.fill();
  // The laptop he never puts down.
  ctx.fillStyle = c.accent;
  pill(ctx, px + 17, py + 18, 13, 9, 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // HUD.
  if (chapter) {
    const progress = Math.min(s.travelled / s.length, 1);
    ctx.fillStyle = c.line;
    ctx.fillRect(0, 0, W, 4);
    ctx.fillStyle = c.green;
    ctx.fillRect(0, 0, W * progress, 4);

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = c.ink;
    ctx.font = `17px ${c.font}`;
    ctx.fillText(`${chapter.who}`, 18, 34);
    ctx.fillStyle = c.faint;
    ctx.font = `13px ${c.font}`;
    ctx.fillText(`${chapter.when}, ${chapter.where}. Chapter ${s.chapter + 1} of ${CHAPTERS.length}`, 18, 54);

    ctx.textAlign = "right";
    ctx.fillStyle = c.ink;
    ctx.font = `17px ${c.font}`;
    ctx.fillText(String(scoreOf(s)), W - 18, 34);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < s.lives ? c.danger : c.line;
      ctx.beginPath();
      ctx.arc(W - 22 - i * 16, 50, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (s.shield) {
      ctx.fillStyle = c.green;
      ctx.font = `13px ${c.font}`;
      ctx.fillText(`Shield: ${s.shield}`, W - 18, 76);
    }
  }
}

/* ---------------------------------------------------------------- component */

type Ui = { phase: Phase; chapter: number; lives: number; score: number; clean: boolean; mode: Mode };

const SEED = 20210601;

/**
 * "Ship it": my career as a side-scroller. Eight chapters, 2021 to 2026, each
 * a real job with the bugs I actually met there. Jump them, grab the stack,
 * and the fix for each chapter is a shield that takes one hit.
 *
 * Accessibility: playable with Space or the up arrow alone, pause any time
 * (P or Escape), a relaxed speed, no time limits outside a running chapter,
 * auto-pause when the tab or the game leaves view, still backgrounds under
 * reduced motion, and a live region that narrates what happens.
 */
export function CareerRun() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const runRef = useRef<RunState>(createRun(SEED));
  const sizeRef = useRef({ W: 960, scale: 1 });
  const paletteRef = useRef<Palette | null>(null);
  const stillRef = useRef(false);
  const visibleRef = useRef(false);
  const primaryRef = useRef<HTMLButtonElement | null>(null);

  const [ui, setUi] = useState<Ui>({ phase: "ready", chapter: 0, lives: 3, score: 0, clean: false, mode: "normal" });
  const [message, setMessage] = useState("");
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);
  const soundOn = useSyncExternalStore(subscribeSound, soundEnabled, () => true);
  const audioRef = useRef<Chiptune | null>(null);
  const play = useCallback((kind: Sfx) => audioRef.current?.sfx(kind), []);

  /** Audio can only start from a click or key press, so this runs inside those handlers. */
  const wakeAudio = useCallback(() => {
    if (!audioRef.current) audioRef.current = new Chiptune();
    audioRef.current.unlock();
  }, []);

  const sync = useCallback((clean = false) => {
    const s = runRef.current;
    setUi({ phase: s.phase, chapter: s.chapter, lives: s.lives, score: scoreOf(s), clean, mode: s.mode });
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!paletteRef.current) paletteRef.current = readPalette();
    const { W, scale } = sizeRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
    draw(ctx, runRef.current, W, paletteRef.current, stillRef.current);
  }, []);

  const handle = useCallback(
    (events: RunEvent[]) => {
      for (const e of events) {
        const chapter = CHAPTERS[runRef.current.chapter];
        if (e.type === "token") {
          play("token");
        } else if (e.type === "hit") {
          play("hit");
          setMessage(`Hit by ${e.bug}. ${e.lives} ${e.lives === 1 ? "life" : "lives"} left.`);
          sync();
        } else if (e.type === "shield-used") {
          play("shield");
          setMessage(`${e.bug}, fixed with ${e.fix}.`);
        } else if (e.type === "shield-picked") {
          play("shield");
          setMessage(`Picked up ${e.label}. It takes the next hit.`);
        } else if (e.type === "cleared") {
          if (e.chapter === 0) unlock("first-ship");
          if (e.clean) unlock("clean-release");
          play("cleared");
          setMessage(`Chapter ${e.chapter + 1} cleared. Shipped: ${chapter?.shipped ?? ""}.`);
          sync(e.clean);
        } else if (e.type === "over") {
          play("over");
          saveBest(scoreOf(runRef.current));
          setMessage("Out of lives. Run it again when you're ready.");
          sync();
        } else if (e.type === "won") {
          unlock("full-career");
          saveBest(scoreOf(runRef.current));
          setMessage("You shipped the whole career.");
          sync(e.clean);
        }
      }
    },
    [sync, play],
  );

  // Music plays only while a chapter is running; it stops for pauses, chapter
  // cards and the end screens, and when the component goes away.
  useEffect(() => {
    if (ui.phase === "running") audioRef.current?.startMusic();
    else audioRef.current?.stopMusic();
  }, [ui.phase]);
  useEffect(() => () => audioRef.current?.stopMusic(), []);

  // Size the canvas to its box, keep the palette in step with the theme, and
  // respect reduced motion.
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    stillRef.current = motion.matches;
    const resize = () => {
      const cssW = wrap.clientWidth;
      const cssH = cssW < 640 ? 260 : 300;
      const scale = cssH / WORLD_H;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { W: cssW / scale, scale };
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.height = `${cssH}px`;
      paint();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const theme = new MutationObserver(() => {
      paletteRef.current = null;
      paint();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const onMotion = () => {
      stillRef.current = motion.matches;
    };
    motion.addEventListener("change", onMotion);
    // Fonts arriving late change text metrics; repaint once they land.
    void document.fonts?.ready.then(() => {
      paletteRef.current = null;
      paint();
    });
    return () => {
      ro.disconnect();
      theme.disconnect();
      motion.removeEventListener("change", onMotion);
    };
  }, [paint]);

  // The loop runs only while a chapter is running.
  useEffect(() => {
    if (ui.phase !== "running") return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      handle(step(runRef.current, dt, sizeRef.current.W, CHAPTERS));
      paint();
      if (runRef.current.phase === "running") frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ui.phase, handle, paint]);

  const pause = useCallback(() => {
    const s = runRef.current;
    if (s.phase !== "running") return;
    s.phase = "paused";
    setMessage("Paused.");
    sync();
  }, [sync]);

  const go = useCallback(() => {
    wakeAudio();
    const s = runRef.current;
    if (s.phase === "over" || s.phase === "won") {
      runRef.current = createRun(SEED + Math.floor(performance.now()), s.mode);
    }
    const r = runRef.current;
    const starting = r.phase === "ready" || r.phase === "cleared";
    advance(r);
    if (starting) {
      const c = CHAPTERS[r.chapter];
      if (c) setMessage(`Chapter ${r.chapter + 1}: ${c.who}, ${c.when}.`);
    }
    sync();
    canvasRef.current?.focus({ preventScroll: true });
  }, [sync, wakeAudio]);

  const toggleSound = () => {
    wakeAudio();
    toggleSiteSound(soundOn);
  };

  const toggleMode = () => {
    const s = runRef.current;
    setMode(s, s.mode === "normal" ? "relaxed" : "normal");
    sync(ui.clean);
  };

  // Keyboard. Space and the up arrow only belong to the game while it runs,
  // so the page still scrolls normally the rest of the time.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const s = runRef.current;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [role=dialog]")) return;
      if (s.phase === "running") {
        if (event.key === " " || event.key === "ArrowUp" || event.key === "w") {
          event.preventDefault();
          const events: RunEvent[] = [];
          jump(s, events);
          if (events.length) audioRef.current?.sfx("jump");
        } else if (event.key === "p" || event.key === "Escape") {
          event.preventDefault();
          pause();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pause]);

  // Auto-pause when the game scrolls away or the tab is hidden.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = Boolean(entry && entry.intersectionRatio > 0.35);
      if (!visibleRef.current) pause();
    }, { threshold: [0, 0.35, 1] });
    io.observe(wrap);
    const onHidden = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [pause]);

  // Put focus on the overlay's main button when one appears.
  useEffect(() => {
    if (ui.phase !== "running" && ui.phase !== "ready") primaryRef.current?.focus({ preventScroll: true });
  }, [ui.phase]);

  const chapter = CHAPTERS[ui.chapter];
  const next = CHAPTERS[ui.chapter + 1];

  return (
    <Section
      id="play"
      title="Ship it: my career, as a game"
      intro="Eight chapters, 2021 to 2026, each a real job. Jump the bugs I actually met there, grab the stack I used, and pick up the fix that got me through."
    >
      <Tray>
        <Panel className="overflow-hidden p-0">
          <div ref={wrapRef} className="relative">
            <canvas
              ref={canvasRef}
              tabIndex={-1}
              role="img"
              aria-label={
                chapter
                  ? `Career run, chapter ${ui.chapter + 1} of ${CHAPTERS.length}: ${chapter.who}. ${ui.lives} lives left. Score ${ui.score}.`
                  : "Career run"
              }
              onPointerDown={(event) => {
                if (runRef.current.phase !== "running") return;
                event.preventDefault();
                const events: RunEvent[] = [];
                jump(runRef.current, events);
                if (events.length) play("jump");
              }}
              className="block w-full touch-none select-none outline-none"
            />

            {ui.phase !== "running" ? (
              <div className="absolute inset-0 grid place-items-center bg-surface/80 p-4 backdrop-blur-[2px]">
                <div className="w-full max-w-[26rem] rounded-[12px] border border-line bg-surface p-5 text-center shadow-float sm:p-6">
                  {ui.phase === "ready" ? (
                    <>
                      <p className="text-[1.25rem] text-ink">Eight chapters, 2021 to 2026.</p>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-dim">
                        Jump the bugs on the ground. Stay down for the ones flying overhead. The fix for each chapter is a
                        shield that takes one hit. Three lives.
                      </p>
                      <p className="mt-2 text-[0.8125rem] text-faint">
                        Space, up arrow or tap to jump, twice for a double jump. P pauses.
                      </p>
                    </>
                  ) : null}
                  {ui.phase === "paused" ? <p className="text-[1.25rem] text-ink">Paused</p> : null}
                  {ui.phase === "cleared" && chapter ? (
                    <>
                      <p className="text-[0.875rem] text-accent-2">
                        Chapter {ui.chapter + 1} of {CHAPTERS.length} cleared{ui.clean ? ", without a single hit" : ""}
                      </p>
                      <p className="mt-2 text-[1.25rem] leading-snug text-ink">Shipped: {chapter.shipped}.</p>
                      <p className="mt-1 text-[0.875rem] text-faint">
                        {chapter.who}, {chapter.where}, {chapter.when}
                      </p>
                      {chapter.caseStudy ? (
                        <Link href={`/work/${chapter.caseStudy}`} className="link mt-2 inline-block text-[0.875rem] text-ink">
                          Read the real story
                        </Link>
                      ) : null}
                    </>
                  ) : null}
                  {ui.phase === "over" ? (
                    <>
                      <p className="text-[1.25rem] text-ink">Three incidents in one chapter.</p>
                      <p className="mt-2 text-[0.9375rem] text-dim">
                        It happens to the best release trains. You scored {ui.score}.
                      </p>
                    </>
                  ) : null}
                  {ui.phase === "won" ? (
                    <>
                      <p className="text-[1.25rem] text-ink">You shipped the whole career.</p>
                      <p className="mt-2 text-[0.9375rem] text-dim">
                        Score {ui.score}
                        {ui.clean ? ", with zero incidents" : ""}. The real one is open to senior product engineering roles,
                        on whatever layer the work needs.
                      </p>
                      <a href={`mailto:${profile.email}`} className="link mt-2 inline-block text-[0.9375rem] text-ink">
                        Email the real Donald
                      </a>
                    </>
                  ) : null}

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <button ref={primaryRef} type="button" onClick={go} className={buttonClass("primary")}>
                      {ui.phase === "ready"
                        ? "Start the run"
                        : ui.phase === "paused"
                          ? "Resume"
                          : ui.phase === "cleared"
                            ? next
                              ? `Next: ${next.who}`
                              : "Finish"
                            : "Run it again"}
                    </button>
                    {ui.phase === "ready" || ui.phase === "paused" || ui.phase === "over" ? (
                      <button
                        type="button"
                        aria-pressed={ui.mode === "relaxed"}
                        onClick={toggleMode}
                        className={buttonClass("outline", ui.mode === "relaxed" ? "border-accent-2 text-accent-2" : undefined)}
                      >
                        Relaxed speed{ui.mode === "relaxed" ? ": on" : ""}
                      </button>
                    ) : null}
                  </div>
                  {best > 0 ? <p className="mt-3 text-[0.8125rem] tabular-nums text-faint">Your best: {best}</p> : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
            <p className="text-[0.8125rem] text-faint">
              {ui.phase === "running" ? "Space, up arrow or tap to jump. P to pause." : "Every bug in here is one I actually met."}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                data-sound="none"
                aria-pressed={soundOn}
                onClick={toggleSound}
                className={cn(buttonClass("quiet"), "h-8 px-3 text-[0.875rem]")}
              >
                {soundOn ? "Sound on" : "Sound off"}
              </button>
              <button
                type="button"
                onClick={ui.phase === "running" ? pause : go}
                disabled={ui.phase === "cleared" || ui.phase === "won" || ui.phase === "over"}
                className={cn(buttonClass("quiet"), "h-8 px-3 text-[0.875rem] disabled:opacity-40")}
              >
                {ui.phase === "running" ? "Pause" : ui.phase === "paused" ? "Resume" : "Play"}
              </button>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">
            {message}
          </p>
        </Panel>
      </Tray>
    </Section>
  );
}
