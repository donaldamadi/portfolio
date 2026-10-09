/**
 * The short lines and diagram data for the home page. The home page is meant
 * to be looked at more than read, so nothing in here should run past a breath.
 */

export const zoomOut = {
  lead: [
    "For years my whole world was the thing in your hand.",
    "Flutter, Swift, Kotlin, mostly fintech, where a rounding error ruins someone's day.",
    "Then I kept following bugs past the screen, and the map got bigger.",
  ],
  title: "How the job got bigger than the screen",
  aside: "// follow one bug far enough and you meet the whole system",
  /** Innermost first. */
  rings: [
    { label: "the screen", note: "Flutter, Swift, Kotlin. Years of fintech polish." },
    { label: "the API", note: "Contracts, auth, every handshake in between." },
    { label: "the data", note: "Schemas, queues, the cron job nobody remembers." },
    { label: "the infra", note: "Deploys, cloud, the pager that never rings." },
    { label: "the problem", note: "The reason any of it should exist. Start here now." },
  ],
  footnote: "started in the middle. still love the middle.",
} as const;

export const loop = {
  lead: [
    "AI is part of how I work every day.",
    "Not a party trick. More like a very fast pair who never gets tired of my questions.",
    "It's why one engineer can carry what used to take a small team.",
  ],
  steps: ["a real problem", "see the whole system", "build with AI in the loop", "ship it", "watch real people use it"],
  back: "learn something",
} as const;

export const now = {
  lead: "And right now, on any given day:",
  whoami: "product engineer · mobile at heart · AI in the loop",
  processes: [
    { name: "day-job", note: "" },
    { name: "pindey", note: "# in prod. go look." },
    { name: "side-projects", note: "# some may never see daylight" },
    { name: "writing", note: "# poetry, prose, long thoughts on software" },
  ],
} as const;
