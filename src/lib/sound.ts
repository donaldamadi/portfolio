/**
 * The site's sound: one shared Web Audio context, synthesised tones (no audio
 * files), and one on/off preference that covers both the interface and the
 * career run.
 *
 * Browsers only allow audio after a click or a key press, so the context is
 * created lazily from inside those handlers. Nothing here ever plays on page
 * load, hover or scroll.
 */

const KEY = "da-sound";
const EVENT = "da:sound";

/* ---------------------------------------------------------------- preference */

export function soundEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* private mode */
  }
  if (master && ctx) master.gain.setTargetAtTime(on ? MASTER_VOL : 0, ctx.currentTime, 0.02);
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeSound(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

/* ---------------------------------------------------------------- engine */

const MASTER_VOL = 0.5;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;

/** The shared context and master bus. Call from a user gesture; returns null if audio is unavailable. */
export function audioBus(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    master = ctx.createGain();
    master.gain.value = soundEnabled() ? MASTER_VOL : 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return master ? { ctx, master } : null;
}

/** One enveloped oscillator note on the given bus. */
export function tone(
  dest: AudioNode,
  freq: number,
  at: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  endFreq?: number,
): void {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, at + dur);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(g).connect(dest);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

/* ---------------------------------------------------------------- interface sounds */

export type UiSound =
  | "tap"
  | "toggle-on"
  | "toggle-off"
  | "open"
  | "close"
  | "unlock"
  | "answer"
  | "error"
  | "found"
  | "warmer"
  | "colder";

/**
 * Quiet, short and pitched in the same A-minor world as the game's music, so
 * the interface and the game sound like one place.
 */
export function playUi(name: UiSound, detail = 0): void {
  if (!soundEnabled()) return;
  const bus = audioBus();
  if (!bus) return;
  const { ctx: c, master: out } = bus;
  const t = c.currentTime + 0.005;
  switch (name) {
    case "tap":
      tone(out, 1180, t, 0.045, "triangle", 0.035, 880);
      break;
    case "toggle-on":
      tone(out, 660, t, 0.06, "triangle", 0.05);
      tone(out, 990, t + 0.06, 0.08, "triangle", 0.05);
      break;
    case "toggle-off":
      tone(out, 990, t, 0.06, "triangle", 0.05);
      tone(out, 660, t + 0.06, 0.08, "triangle", 0.05);
      break;
    case "open":
      tone(out, 440, t, 0.16, "sine", 0.06, 880);
      break;
    case "close":
      tone(out, 880, t, 0.14, "sine", 0.05, 440);
      break;
    case "unlock":
      [784, 988, 1175, 1568].forEach((f, i) => tone(out, f, t + i * 0.07, 0.14, "triangle", 0.06));
      break;
    case "answer":
      tone(out, 880, t, 0.08, "sine", 0.05);
      tone(out, 1319, t + 0.08, 0.12, "sine", 0.05);
      break;
    case "error":
      tone(out, 220, t, 0.2, "triangle", 0.06, 165);
      break;
    case "found":
      // PinDey plays a sound when you find your friend; so does the demo.
      [1047, 1319, 1568, 2093].forEach((f, i) => tone(out, f, t + i * 0.08, 0.18, "sine", 0.07));
      break;
    case "warmer":
      // Pitch rises as you close in: detail is 0 (far) to 1 (right there).
      tone(out, 520 + detail * 900, t, 0.05, "sine", 0.04);
      break;
    case "colder":
      tone(out, 330, t, 0.06, "sine", 0.03, 260);
      break;
  }
}
