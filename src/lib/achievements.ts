/**
 * Explorer achievements: small rewards for finding the interactive parts of
 * the site. Everything lives in the visitor's own browser (localStorage); no
 * server, no analytics, nothing leaves the page.
 *
 * The store is a plain external store so components read it with
 * useSyncExternalStore: the server renders "nothing unlocked", the client
 * catches up after hydration, and there's never a mismatch.
 */

export type AchievementId =
  | "found-tolu"
  | "pindey-tour"
  | "platform-filter"
  | "read-record"
  | "case-study"
  | "night-shift"
  | "shortcut"
  | "first-ship"
  | "clean-release"
  | "full-career"
  | "asked-ai";

export type Achievement = {
  readonly id: AchievementId;
  readonly title: string;
  /** Shown while locked. Says exactly what to do, without spoiling the reward. */
  readonly hint: string;
};

export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: "found-tolu", title: "Found Tolu", hint: "Walk right up to Tolu in the PinDey Finder." },
  { id: "pindey-tour", title: "Saw every layer", hint: "Open all four PinDey tabs." },
  { id: "platform-filter", title: "Picked a platform", hint: "Filter the work list by platform." },
  { id: "read-record", title: "Read the record", hint: "Open an older role in Experience." },
  { id: "case-study", title: "Went deeper", hint: "Read one of the case studies." },
  { id: "night-shift", title: "Night shift", hint: "Switch between light and dark." },
  { id: "shortcut", title: "Keyboard first", hint: "Open search with Ctrl K or ⌘K." },
  { id: "first-ship", title: "First ship", hint: "Clear the first chapter of the career run." },
  { id: "clean-release", title: "Clean release", hint: "Clear a career-run chapter without a single hit." },
  { id: "full-career", title: "Whole career", hint: "Play the career run to the end." },
  { id: "asked-ai", title: "Asked my AI", hint: "Ask my AI a question about my work." },
];

export const UNLOCK_EVENT = "da:achievement";

const KEY = "da-achievements-v1";
const EMPTY: ReadonlySet<AchievementId> = new Set();
const VALID = new Set<string>(ACHIEVEMENTS.map((a) => a.id));

let snapshot: ReadonlySet<AchievementId> | null = null;
const listeners = new Set<() => void>();

function load(): ReadonlySet<AchievementId> {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown;
    if (!Array.isArray(raw)) return EMPTY;
    return new Set(raw.filter((id): id is AchievementId => typeof id === "string" && VALID.has(id)));
  } catch {
    return EMPTY;
  }
}

export function getUnlocked(): ReadonlySet<AchievementId> {
  if (snapshot === null) snapshot = load();
  return snapshot;
}

export function getServerUnlocked(): ReadonlySet<AchievementId> {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab unlocking something keeps this tab honest.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    snapshot = load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Idempotent: unlocking twice is a no-op, so call sites never need to check first. */
export function unlock(id: AchievementId): void {
  if (typeof window === "undefined") return;
  const current = getUnlocked();
  if (current.has(id)) return;
  const next = new Set(current);
  next.add(id);
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    /* private mode: the badge still shows for this visit */
  }
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new CustomEvent<AchievementId>(UNLOCK_EVENT, { detail: id }));
}

export function resetAchievements(): void {
  snapshot = EMPTY;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
  listeners.forEach((listener) => listener());
}
