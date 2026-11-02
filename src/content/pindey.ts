/**
 * PinDey, the flagship. Everything here is verified product context.
 *
 * House rules for this file, because they're product rules, not style:
 *   - Never describe PinDey with the word "track" or any form of it. People
 *     find, share and point to each other. That's the whole product stance.
 *   - Name only the technologies confirmed on the CV (Nov 2026): the Flutter app,
 *     the Next.js web apps, the NestJS/Fastify services and their data stores.
 *   - No store availability and no user numbers until they're confirmed.
 *
 * TODO(donald): what powers precise mode, if you want it named.
 * TODO(donald): App Store and Google Play links. Add them to `links` once you're
 * happy to claim store availability.
 */
export const pindey = {
  name: "PinDey",
  oneLiner: "Find your friends in a crowd, phone to phone.",
  tagline: "Where you dey? We go find you.",

  links: {
    site: { label: "pindey.app", href: "https://pindey.app" },
    demo: { label: "Try the walkthrough", href: "https://pindey.app/try" },
  },

  /** The problem, as three beats. Read top to bottom like a short scene. */
  problem: [
    "You're at an owambe. Your people are “by the bar”.",
    "There are five bars.",
    "Calls drop, and a pin on a map is tens of metres off and won't tell you which way to walk. So PinDey gives you an arrow.",
  ],

  /** The Finder demo's caption, and the decision worth the most room. */
  finder: {
    honest: {
      title: "My favourite decision: the Finder is honest.",
      body: [
        "When the phone can't tell which way to point, it doesn't guess. The arrow steps aside and it says “very close, look around”.",
        "Always showing an arrow would look better in a demo. But a confident arrow pointing the wrong way is worse than no arrow, because people follow it.",
      ],
    },
  },

  features: [
    {
      id: "spaces",
      name: "Spaces",
      body: "One gathering, one Space. Join with a six-character code, or tap a WhatsApp invite that signs you in and drops you straight inside.",
    },
    {
      id: "crews",
      name: "Crews",
      body: "Smaller groups inside a Space. You choose who can find you, crew by crew.",
    },
    {
      id: "ghost",
      name: "Ghost mode",
      body: "Need a minute? Pause being findable.",
    },
    {
      id: "flare",
      name: "Flare",
      body: "Rings a friend's phone and turns your screen into a bright beacon.",
    },
    {
      id: "radar",
      name: "Radar",
      body: "Your crew around you, with rough distances.",
    },
  ],

  /** The small things, shown as chips rather than paragraphs. */
  extras: [
    "Hints like “Table 5, near the DJ”",
    "“I'm here” arrival pings",
    "Meet points",
    "Precise mode on supported iPhones",
    "Keeps searching in the background",
    "Lock-screen updates",
    "Sign in with Apple, Google or an email code",
    "Report a problem or a person",
    "Delete your account in the app",
  ],

  privacy: [
    { big: "No", small: "location history." },
    { big: "~2 min", small: "after your last update, your position is gone." },
    { big: "Nothing", small: "sold. Ever." },
  ],

  /**
   * The four surfaces, shown as tabs. One product, one TypeScript monorepo,
   * one OpenAPI contract that every client is built against.
   */
  monorepo:
    "One pnpm and Turborepo monorepo. Every client is built against one shared OpenAPI contract, and Playwright, axe-core and Testcontainers-backed tests gate changes across web and API.",
  surfaces: [
    {
      id: "app",
      name: "Mobile app",
      stack: ["Flutter", "iOS", "Android"],
      summary:
        "The Finder, Spaces, Crews, Flare and Radar. Searching keeps going in the background, with lock-screen updates, and sign-in is Apple, Google or an email code.",
    },
    {
      id: "web",
      name: "Website",
      stack: ["React", "Next.js App Router", "Tailwind", "Cloudflare via OpenNext"],
      summary:
        "pindey.app: the landing page, an interactive walkthrough, and invite links that survive the app install. Plus browser tools that need no install, like dropping a meet point, where the location lives only in the URL fragment and never reaches the server.",
    },
    {
      id: "admin",
      name: "Back office",
      stack: ["React", "Next.js", "Server-only data access", "Two-factor sign-in"],
      summary:
        "Users, Spaces, reports and moderation, testers, remote config, analytics, admin roles and an audit log, behind authenticator-app sign-in.",
    },
    {
      id: "api",
      name: "API and realtime",
      stack: ["Node.js", "NestJS on Fastify", "PostgreSQL + PostGIS", "Redis", "BullMQ", "WebSockets"],
      summary:
        "A REST API, a WebSocket gateway for live presence and a BullMQ worker for push. State changes and their events commit in one transaction through an outbox, and every write takes an idempotency key, so a retry on a flaky network replays the answer instead of applying twice.",
    },
  ],
} as const;
