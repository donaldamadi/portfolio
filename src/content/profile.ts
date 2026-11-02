import type { Link } from "./types";

export const SITE_URL = "https://donaldamadi.dev";

export const profile = {
  name: "Donald Obinna Amadi",
  shortName: "Donald Amadi",
  role: "Product Engineer",
  location: "Lagos, Nigeria",
  timezone: "WAT, UTC+1",
  email: "donaldamadi15@gmail.com",
  phone: "+234 814 564 0723",

  /** One sentence. Feeds the manifest and anywhere a single line is all there's room for. */
  tagline: "Product engineer. Mobile and web apps in React Native, React, Flutter and TypeScript, and the Node services behind them.",

  /** The hero. Plain and specific: who, what, and the one thing to look at next. */
  hero: {
    title: "I build mobile and web products, from the first screen to the server behind it.",
    intro:
      "I'm a product engineer with five years of shipping products people use for their money, their health and their weekends. On mobile I work in React Native, Flutter, Swift and Kotlin; on the web in React, Next.js and TypeScript; and on the server in Node.js, NestJS and PostgreSQL.",
    /**
     * Rendered after "Building PinDey." with PinDey linked to pindey.app. Says
     * what kind of role, not which stack: the range is the point.
     */
    status: "Open to senior product engineering roles, whether the work lives on mobile, the web, the backend, or all three.",
  },

  /**
   * The long version, on /about, for anyone who chooses to open it. Connected
   * paragraphs, in order, so each should lead into the next.
   */
  longVersion: [
    "I started out building the part of software you hold in your hand. For years that was the whole world: a release train, a store review queue, and a phone somewhere with two bars of signal that the app still had to feel fast on. Most of those years were in fintech, at a bank, a lender, a wallet, a payments company, where a rounding error ruins someone's whole day and \u201cworks on my machine\u201d has never once saved anybody. I still love that work. I still think the empty states and the offline path are where you find out who really cared.",
    "The tools changed more than once along the way. Most of my mobile years were in Flutter, with native Swift and Kotlin whenever the platform needed it: iOS widgets in SwiftUI, a card reader SDK in Java behind a platform channel. Ofin Eko, an app for reading and listening to Lagos State law, I built alone in React Native. On the web I live in React, Next.js and TypeScript, which is also what makes React Native feel like home: same components, same hooks, same way of thinking about state.",
    "Somewhere along the way the job got bigger than the screen. I kept following the bug past the API call, then past the server, into the database and the queue and the cron job nobody remembered writing, and at some point I realised I was an engineer who happened to know mobile very well, the kind who sits with a problem until the whole system around it comes into view, and then builds whatever that system needs, on whatever layer it lives.",
    "That is how PinDey happened. It started with a very Lagos problem: you're at a party, your people are \u201cby the bar\u201d, and there are five bars. Calls drop. A pin on a map is tens of metres off and doesn't tell you which way to walk. So PinDey gives you an arrow, a distance, and the old warmer or colder game, with haptics that speed up as you close in and a sound when you finally find them. My favourite decision in it is that the Finder is honest: when the phone can't tell which way to point, it says \u201cvery close, look around\u201d instead of confidently sending you the wrong way.",
    "It is mine from end to end: the Flutter app, the Next.js website and back office, the NestJS services, PostgreSQL and Redis underneath, all in one TypeScript monorepo built against a single OpenAPI contract. Building it taught me more about product than any title ever did, mostly because when you own every layer there's nobody to hand the hard part to.",
    "I use AI the way I used to use a good IDE. It helps me read unfamiliar code faster and get through the boring parts, and tests and my own review still decide what ships. The part I care about is preparing a codebase so a coding agent can work in it without making a mess, which is where flutter_skill_gen came from.",
    "These days my time is split between the day job, PinDey, a handful of side projects, and writing, which is the other thing I can't stop doing. Poetry, prose, the occasional long thought about software. It turns out finding the right word and finding the right abstraction are pretty much the same muscle.",
  ],

  coda: "Think about the problem, see the system, build the thing. Then make it quiet.",

  /**
   * Logistics, kept for anyone who needs them. One paragraph, not a checklist.
   * Lives on /about only, so the home page stays an introduction rather than a pitch.
   * TODO(donald): confirm this is still true and still something you want on the site.
   */
  practicalities:
    "If you're hiring: I'm open to remote work, and to relocating to Ireland, the Netherlands, Denmark, Germany, France, Canada or the UK. That would need visa sponsorship, since I hold a Nigerian passport. I've been working fully remote across Lagos, Dubai, Riyadh and the US for years, so overlapping with GMT, CET or EST is normal for me.",

  links: [
    { label: "GitHub", href: "https://github.com/donaldamadi", external: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/donald-amadi-7b95b817a/", external: true },
    { label: "Medium", href: "https://thatmandonald.medium.com", external: true },
    { label: "pub.dev", href: "https://pub.dev/publishers/donaldamadi/packages", external: true },
    { label: "Email", href: "mailto:donaldamadi15@gmail.com", external: true },
  ] satisfies readonly Link[],

  education: {
    school: "University of Lagos",
    degree: "B.Sc. Computer Engineering",
    location: "Lagos, Nigeria",
    graduated: "2023",
    note: "Five-year engineering degree. Final-year project: a hardware/Flutter system streaming fluid level and temperature in real time.",
  },
} as const;
