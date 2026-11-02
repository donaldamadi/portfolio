/**
 * The career run's engine. Pure and deterministic: no DOM, no timers, a seeded
 * random source. The component owns the loop and the drawing; this file owns
 * the rules, so they can be reasoned about (and tested) without a browser.
 *
 * Units are logical pixels in a world that is H tall and as wide as the
 * viewport needs. Time is in seconds.
 */
import type { Chapter } from "@/content/career-run";

export const WORLD_H = 320;
export const GROUND_Y = 262;
export const PLAYER = { x: 0.16, w: 26, h: 42 } as const;

const GRAVITY = 2700;
const JUMP_V = -860;
const DOUBLE_JUMP_V = -720;
const BASE_SPEED = 300;
const SPEED_PER_CHAPTER = 22;
const CHAPTER_SECONDS = 13;
const INVULNERABLE_S = 1.2;
const LIVES = 3;

export type Mode = "normal" | "relaxed";
export type Phase = "ready" | "running" | "paused" | "cleared" | "over" | "won";

export type Thing =
  | { kind: "bug"; x: number; y: number; w: number; h: number; label: string }
  | { kind: "token"; x: number; y: number; w: number; h: number; label: string; taken: boolean }
  | { kind: "shield"; x: number; y: number; w: number; h: number; label: string; taken: boolean };

export type RunEvent =
  | { type: "jump" }
  | { type: "token"; label: string }
  | { type: "shield-picked"; label: string }
  | { type: "shield-used"; bug: string; fix: string }
  | { type: "hit"; bug: string; lives: number }
  | { type: "cleared"; chapter: number; clean: boolean }
  | { type: "over" }
  | { type: "won"; clean: boolean };

export type RunState = {
  phase: Phase;
  mode: Mode;
  chapter: number;
  /** Distance travelled in this chapter, and how long the chapter is. */
  travelled: number;
  length: number;
  /** Total scroll, for parallax and the ground pattern. */
  scroll: number;
  playerY: number;
  playerVY: number;
  jumpsLeft: number;
  lives: number;
  shield: string | null;
  invulnerable: number;
  hitsThisChapter: number;
  hitsTotal: number;
  /** Points from pickups. Distance points come from scroll; see scoreOf. */
  bonus: number;
  things: Thing[];
  spawnIn: number;
  shieldSpawned: boolean;
  seed: number;
  /** Seconds of running time, for animation. */
  clock: number;
};

/** mulberry32: small, fast, good enough for obstacle placement. */
function nextRandom(state: RunState): number {
  let t = (state.seed = (state.seed + 0x6d2b79f5) | 0);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** One point per 40px run, plus pickups. Derived, so per-frame rounding can't lose points. */
export function scoreOf(state: RunState): number {
  return Math.floor(state.scroll / 40) + state.bonus;
}

export function speedOf(state: RunState): number {
  const s = BASE_SPEED + state.chapter * SPEED_PER_CHAPTER;
  return state.mode === "relaxed" ? s * 0.72 : s;
}

export function createRun(seed = 1, mode: Mode = "normal"): RunState {
  const state: RunState = {
    phase: "ready",
    mode,
    chapter: 0,
    travelled: 0,
    length: 0,
    scroll: 0,
    playerY: GROUND_Y - PLAYER.h,
    playerVY: 0,
    jumpsLeft: 2,
    lives: LIVES,
    shield: null,
    invulnerable: 0,
    hitsThisChapter: 0,
    hitsTotal: 0,
    bonus: 0,
    things: [],
    spawnIn: 1.2,
    shieldSpawned: false,
    seed,
    clock: 0,
  };
  state.length = speedOf(state) * CHAPTER_SECONDS;
  return state;
}

/** Start or continue: from ready, from a cleared chapter, or out of pause. */
export function advance(state: RunState): void {
  if (state.phase === "ready" || state.phase === "paused") {
    state.phase = "running";
  } else if (state.phase === "cleared") {
    state.chapter += 1;
    state.travelled = 0;
    state.things = [];
    state.spawnIn = 1.2;
    state.shieldSpawned = false;
    state.hitsThisChapter = 0;
    state.length = speedOf(state) * CHAPTER_SECONDS;
    state.phase = "running";
  }
}

export function setMode(state: RunState, mode: Mode): void {
  state.mode = mode;
  const progress = state.length ? state.travelled / state.length : 0;
  state.length = speedOf(state) * CHAPTER_SECONDS;
  state.travelled = progress * state.length;
}

export function jump(state: RunState, events: RunEvent[]): void {
  if (state.phase !== "running" || state.jumpsLeft <= 0) return;
  state.playerVY = state.jumpsLeft === 2 ? JUMP_V : DOUBLE_JUMP_V;
  state.jumpsLeft -= 1;
  events.push({ type: "jump" });
}

function overlaps(ax: number, ay: number, aw: number, ah: number, t: Thing, inset: number): boolean {
  return ax + inset < t.x + t.w && ax + aw - inset > t.x && ay + inset < t.y + t.h && ay + ah - inset > t.y;
}

function spawn(state: RunState, chapter: Chapter, width: number): void {
  const r = nextRandom(state);
  const x = width + 40;
  const halfway = state.travelled > state.length * 0.45;
  if (!state.shieldSpawned && halfway) {
    state.shieldSpawned = true;
    state.things.push({ kind: "shield", x, y: GROUND_Y - 120, w: 20 + chapter.fix.length * 7, h: 26, label: chapter.fix, taken: false });
    state.spawnIn = 0.9;
    return;
  }
  if (r < 0.3) {
    const label = chapter.stack[Math.floor(nextRandom(state) * chapter.stack.length)] ?? "Flutter";
    const high = nextRandom(state) < 0.5;
    state.things.push({ kind: "token", x, y: GROUND_Y - (high ? 140 : 96), w: 18 + label.length * 7, h: 24, label, taken: false });
    state.spawnIn = 0.55 + nextRandom(state) * 0.4;
    return;
  }
  const label = chapter.bugs[Math.floor(nextRandom(state) * chapter.bugs.length)] ?? "bug";
  const w = 28 + Math.floor(nextRandom(state) * 3) * 10;
  const h = 26 + Math.floor(nextRandom(state) * 3) * 8;
  state.things.push({ kind: "bug", x, y: GROUND_Y - h, w, h, label });
  // Gaps shrink a little each chapter, but always leave room for a jump.
  const minGap = Math.max(0.62, 1.05 - state.chapter * 0.05);
  state.spawnIn = minGap + nextRandom(state) * 0.75;
}

/**
 * Advance the world by dt seconds in a viewport `width` logical pixels wide.
 * Returns what happened, for the renderer and the screen-reader announcer.
 */
export function step(state: RunState, dt: number, width: number, chapters: readonly Chapter[]): RunEvent[] {
  const events: RunEvent[] = [];
  if (state.phase !== "running") return events;
  const chapter = chapters[state.chapter];
  if (!chapter) return events;

  dt = Math.min(dt, 1 / 30);
  state.clock += dt;
  const v = speedOf(state);
  const dx = v * dt;
  state.travelled += dx;
  state.scroll += dx;
  state.invulnerable = Math.max(0, state.invulnerable - dt);

  // Player physics.
  state.playerVY += GRAVITY * dt;
  state.playerY += state.playerVY * dt;
  const floor = GROUND_Y - PLAYER.h;
  if (state.playerY >= floor) {
    state.playerY = floor;
    state.playerVY = 0;
    state.jumpsLeft = 2;
  }

  // World.
  for (const t of state.things) t.x -= dx;
  state.things = state.things.filter((t) => t.x + t.w > -20);
  const ending = state.travelled > state.length - v * 1.6;
  state.spawnIn -= dt;
  if (state.spawnIn <= 0 && !ending) spawn(state, chapter, width);

  // Collisions.
  const px = width * PLAYER.x;
  for (const t of state.things) {
    if (t.kind !== "bug") {
      if (!t.taken && overlaps(px, state.playerY, PLAYER.w, PLAYER.h, t, 0)) {
        t.taken = true;
        if (t.kind === "token") {
          state.bonus += 25;
          events.push({ type: "token", label: t.label });
        } else {
          state.shield = t.label;
          events.push({ type: "shield-picked", label: t.label });
        }
      }
      continue;
    }
    if (state.invulnerable > 0 || !overlaps(px, state.playerY, PLAYER.w, PLAYER.h, t, 5)) continue;
    state.invulnerable = INVULNERABLE_S;
    if (state.shield) {
      events.push({ type: "shield-used", bug: t.label, fix: state.shield });
      state.shield = null;
    } else {
      state.lives -= 1;
      state.hitsThisChapter += 1;
      state.hitsTotal += 1;
      events.push({ type: "hit", bug: t.label, lives: state.lives });
      if (state.lives <= 0) {
        state.phase = "over";
        events.push({ type: "over" });
        return events;
      }
    }
  }

  if (state.travelled >= state.length) {
    const clean = state.hitsThisChapter === 0;
    if (state.chapter >= chapters.length - 1) {
      state.phase = "won";
      events.push({ type: "cleared", chapter: state.chapter, clean });
      events.push({ type: "won", clean: state.hitsTotal === 0 });
    } else {
      state.phase = "cleared";
      events.push({ type: "cleared", chapter: state.chapter, clean });
    }
  }
  return events;
}
