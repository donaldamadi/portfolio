import type { Link } from "./types";

export const SITE_URL = "https://donaldamadi.dev";

export const profile = {
  name: "Donald Obinna Amadi",
  shortName: "Donald Amadi",
  role: "Product Engineer",
  location: "Lagos, Nigeria",
  timezone: "WAT · UTC+1",
  email: "donaldamadi15@gmail.com",
  phone: "+234 814 564 0723",

  /** One sentence. Feeds the manifest and anywhere a single line is all there's room for. */
  tagline: "I started on the screen, kept zooming out, and now I build the whole thing.",

  /** The hero. Short on purpose: the visuals below carry the rest. */
  hero: {
    prompt: "~/donald $ cat intro.md",
    hello: "Hey, I'm Donald.",
    /** Cycled one at a time. The last one is what shows when motion is reduced. */
    lines: ["I started on the screen.", "Then I kept zooming out.", "Now I build the whole thing."],
    signature: "product engineer · mobile at heart · AI in the loop",
  },

  /**
   * The long version, on /about, for anyone who chooses to open it. Connected
   * paragraphs, in order, so each should lead into the next.
   */
  longVersion: [
    "I started out building the part of software you hold in your hand. For years that was the whole world: Flutter, Swift, Kotlin, a release train, and a phone somewhere with two bars of signal that the app still had to feel fast on. Most of those years were in fintech, at a bank, a lender, a wallet, a payments company, where a rounding error ruins someone's whole day and \u201cworks on my machine\u201d has never once saved anybody. I still love that work. I still think the empty states and the offline path are where you find out who really cared.",
    "Somewhere along the way the job got bigger than the screen. I kept following the bug past the API call, then past the server, then into the database and the queue and the cron job nobody remembered writing, and at some point I looked up and realised I wasn't really a mobile engineer anymore. I was an engineer who happened to know mobile very well, the kind who sits with a problem until the whole system around it comes into view, and then builds whatever that system needs, on whatever layer it lives.",
    "That is how PinDey happened. It started with a very Lagos problem: you're at a party, your people are \u201cby the bar\u201d, and there are five bars. Calls drop. A pin on a map is tens of metres off and doesn't tell you which way to walk. So PinDey gives you an arrow, a distance, and the old warmer or colder game, with haptics that speed up as you close in and a sound when you finally find them.",
    "My favourite decision in the whole thing is that the Finder is honest. When the phone genuinely can't tell which way to point, it says \u201cvery close, look around\u201d instead of confidently sending you the wrong way. It would have been easy to always show an arrow, and it would have looked more impressive in a demo. But a confident arrow pointing the wrong way is worse than no arrow at all, because people follow it. The privacy side got the same care: there's no location history, positions disappear about two minutes after the last update, and nothing gets sold.",
    "It is mine from end to end, the iOS and Android apps, the backend, the infrastructure, the website, the back office, the product decisions nobody sees and the ones everybody does. Building it taught me more about product than any title ever did, mostly because when you own every layer there's nobody to hand the hard part to. Honestly, that's the fun bit.",
    "I build with AI the way I used to build with a good IDE, except the conversation goes both ways now. It sits in how I sketch architectures, how I read unfamiliar code, how I ship. It's the reason one engineer can carry what used to take a small team. The craft moves up a level, toward understanding the problem properly, choosing the right shape for the system, and knowing which parts deserve your own hands. The other half is preparing a codebase so an agent can work in it without making a mess, which is where flutter_skill_gen came from.",
    "These days my time is split between the day job, PinDey, a handful of side projects that may or may not see daylight, and writing, which is the other thing I can't stop doing. Poetry, prose, the occasional long thought about software. It turns out finding the right word and finding the right abstraction are pretty much the same muscle.",
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
