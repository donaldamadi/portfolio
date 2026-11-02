/**
 * The career run's soundtrack and sound effects, synthesised with Web Audio:
 * no audio files to download. A short loop in A minor pentatonic over a
 * four-chord bass (Am, F, C, G), with a light hi-hat.
 *
 * Browsers only allow sound after a click or a key press, so the context is
 * created from the game's Start button, never on page load.
 */

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
  private muted = false;

  /** Call from a user gesture. Safe to call repeatedly. */
  unlock(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
      this.music = this.ctx.createGain();
      this.music.gain.value = 0.55;
      this.music.connect(this.master);
      const len = Math.floor(this.ctx.sampleRate * 0.05);
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.02);
  }

  startMusic(): void {
    if (!this.ctx || this.timer) return;
    this.nextTime = this.ctx.currentTime + 0.05;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stopMusic(): void {
    window.clearInterval(this.timer);
    this.timer = 0;
  }

  close(): void {
    this.stopMusic();
    void this.ctx?.close();
    this.ctx = null;
  }

  sfx(kind: Sfx): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.muted) return;
    const t = ctx.currentTime;
    const blip = (freq: number, at: number, dur: number, type: OscillatorType, vol: number, endFreq?: number) =>
      this.tone(this.master!, freq, at, dur, type, vol, endFreq);
    switch (kind) {
      case "jump":
        blip(440, t, 0.12, "square", 0.05, 880);
        break;
      case "token":
        blip(988, t, 0.07, "square", 0.05);
        blip(1319, t + 0.07, 0.1, "square", 0.05);
        break;
      case "shield":
        [523, 659, 784, 1047].forEach((f, i) => blip(f, t + i * 0.06, 0.1, "triangle", 0.09));
        break;
      case "hit":
        blip(180, t, 0.28, "sawtooth", 0.08, 55);
        break;
      case "cleared":
        [523, 659, 784, 1047, 1319].forEach((f, i) => blip(f, t + i * 0.09, 0.16, "square", 0.05));
        break;
      case "over":
        [392, 330, 262, 196].forEach((f, i) => blip(f, t + i * 0.14, 0.2, "triangle", 0.09));
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
      if (note != null) this.tone(music, hz(note), this.nextTime, STEP * 0.9, "square", 0.045);
      if (i % 4 === 0) {
        const root = BASS_ROOTS[Math.floor(i / 8) % BASS_ROOTS.length] ?? 45;
        this.tone(music, hz(root), this.nextTime, STEP * 1.8, "triangle", 0.16);
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

  private tone(dest: AudioNode, freq: number, at: number, dur: number, type: OscillatorType, vol: number, endFreq?: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g).connect(dest);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }
}
