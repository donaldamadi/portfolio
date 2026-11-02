/**
 * The career run's soundtrack and sound effects, synthesised with Web Audio:
 * no audio files to download. A short loop in A minor pentatonic over a
 * four-chord bass (Am, F, C, G), with a light hi-hat.
 *
 * It plays through the site's shared audio bus (src/lib/sound.ts), so the
 * header's sound toggle mutes it too. The bus is woken from the Start button.
 */

import { audioBus, preferPlayback, soundEnabled, tone } from "./sound";

const BPM = 118;
const STEP = 60 / BPM / 2; // eighth notes
const LOOKAHEAD_S = 0.15;

// 32 eighth notes. MIDI numbers; null is a rest.
const LEAD: readonly (number | null)[] = [
  69, null, 72, 74, 76, null, 74, 72,
  69, null, 67, 69, 72, null, null, null,
  69, null, 72, 74, 76, null, 79, 76,
  74, 72, 69, null, 67, null, 69, null,
];
const BASS_ROOTS = [45, 41, 48, 43]; // A2, F2, C3, G2: one chord per bar

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export type Sfx = "jump" | "token" | "shield" | "hit" | "cleared" | "over";

export class Chiptune {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private music: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer = 0;
  private nextTime = 0;
  private step = 0;

  /** Call from a user gesture. Safe to call repeatedly. Uses the site's shared audio bus and mute. */
  unlock(): void {
    const bus = audioBus();
    if (!bus) return;
    if (this.ctx === bus.ctx) return;
    this.ctx = bus.ctx;
    this.master = bus.master;
    this.music = this.ctx.createGain();
    this.music.gain.value = 0.55;
    this.music.connect(this.master);
    const len = Math.floor(this.ctx.sampleRate * 0.05);
    this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  startMusic(): void {
    if (!this.ctx || this.timer) return;
    preferPlayback(true);
    this.nextTime = this.ctx.currentTime + 0.05;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stopMusic(): void {
    if (this.timer) preferPlayback(false);
    window.clearInterval(this.timer);
    this.timer = 0;
  }

  sfx(kind: Sfx): void {
    const ctx = this.ctx;
    const out = this.master;
    if (!ctx || !out || !soundEnabled()) return;
    const t = ctx.currentTime;
    switch (kind) {
      case "jump":
        tone(out, 440, t, 0.12, "square", 0.05, 880);
        break;
      case "token":
        tone(out, 988, t, 0.07, "square", 0.05);
        tone(out, 1319, t + 0.07, 0.1, "square", 0.05);
        break;
      case "shield":
        [523, 659, 784, 1047].forEach((f, i) => tone(out, f, t + i * 0.06, 0.1, "triangle", 0.09));
        break;
      case "hit":
        tone(out, 180, t, 0.28, "sawtooth", 0.08, 55);
        break;
      case "cleared":
        [523, 659, 784, 1047, 1319].forEach((f, i) => tone(out, f, t + i * 0.09, 0.16, "square", 0.05));
        break;
      case "over":
        [392, 330, 262, 196].forEach((f, i) => tone(out, f, t + i * 0.14, 0.2, "triangle", 0.09));
        break;
    }
  }

  private schedule(): void {
    const ctx = this.ctx;
    const music = this.music;
    if (!ctx || !music) return;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD_S) {
      const i = this.step % LEAD.length;
      const note = LEAD[i];
      if (note != null) tone(music, hz(note), this.nextTime, STEP * 0.9, "square", 0.045);
      if (i % 4 === 0) {
        const root = BASS_ROOTS[Math.floor(i / 8) % BASS_ROOTS.length] ?? 45;
        tone(music, hz(root), this.nextTime, STEP * 1.8, "triangle", 0.16);
      }
      if (i % 2 === 1 && this.noise) {
        const src = ctx.createBufferSource();
        src.buffer = this.noise;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.025, this.nextTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.nextTime + 0.04);
        src.connect(g).connect(music);
        src.start(this.nextTime);
      }
      this.nextTime += STEP;
      this.step += 1;
    }
  }
}
