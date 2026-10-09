/**
 * PinDey, the flagship. Everything here is verified product context.
 *
 * House rules for this file, because they're product rules, not style:
 *   - Never describe PinDey with the word "track" or any form of it. People
 *     find, share and point to each other. That's the whole product stance.
 *   - No named technologies, frameworks or cloud providers until they're confirmed.
 *   - No store availability and no user numbers until they're confirmed.
 *
 * TODO(donald): the stack per layer (app, backend, infra, and what powers precise
 * mode). Add it to `stack` below if and when you want it public.
 * TODO(donald): App Store and Google Play links. Add them to `links` once you're
 * happy to claim store availability.
 */
export const pindey = {
  name: "PinDey",
  status: "Live in production",
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
    caption: "Drag yourself around the party, or tap anywhere. Use the arrow keys if you'd rather.",
    honest: {
      title: "My favourite decision: the Finder is honest.",
      body: [
        "When the phone can't tell which way to point, it doesn't guess. The arrow steps aside and it says “very close, look around”.",
        "Always showing an arrow would look better in a demo. But a confident arrow pointing the wrong way is worse than no arrow, because people follow it.",
      ],
      tryIt: "Walk right up to Tolu in the demo and you'll see it.",
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

  /** Where it's for. Rendered as a slow marquee. */
  places: ["owambes", "house parties", "concerts", "festivals", "markets", "campuses", "weddings", "church"],
  reach: "Lagos first. Built for anywhere people gather.",

  /** Every layer, one person. */
  layers: ["iOS app", "Android app", "Backend", "Infra", "pindey.app", "Admin back office", "Product"],
  ownership: "Every ring from earlier, one person.",

  stack: [] as readonly string[],
} as const;
