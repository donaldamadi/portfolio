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
  tagline: "I used to build the part of software you hold in your hand. Now I build the whole thing.",

  /** The hero, after the headline. Two short paragraphs that hand off to the about section. */
  intro: [
    "I'm Donald. I spent most of my career as a mobile engineer, mostly in fintech, writing Flutter, Swift and Kotlin for apps that had to feel fast on a three-year-old phone with two bars of signal. Mobile is still the thing I know best.",
    "These days I work as a product engineer. I sit with a problem until the system around it comes into view, then build whatever that system needs, on whichever layer it lives. PinDey is where you can see that for yourself.",
  ],

  /**
   * The longer version of the story. Rendered as connected paragraphs, in
   * order, so each one should lead into the next rather than stand alone.
   */
  about: [
    "I came into software through the screen. For years that was the whole world: a release train, a store review queue, and the quiet satisfaction of an animation that holds sixty frames on a cheap Android. Most of those years were spent where money moves, at a bank, a lender, a wallet, a payments company, and money teaches you things that tutorials don't. A rounding error ruins someone's whole day. A retry that isn't idempotent charges them twice. \u201cIt works on my machine\u201d has never once saved anybody.",
    "The thing is, the bugs that mattered rarely stopped at the screen. I kept following them past the API call, then past the server, into the database and the queue and the cron job nobody remembered writing. Somewhere in there I looked up and realised I wasn't really a mobile engineer anymore. I was an engineer who happened to know mobile very well, and who had started caring more about the shape of the whole system than about any one layer of it.",
    "So that's how I work now. I start with the problem, properly, before anyone opens an editor. Then I look for the system that problem lives inside, the data, the failure modes, the people on either end of it. Only then do I decide what to build and where. Sometimes the answer is a Flutter screen. Sometimes it's a migration, a background job, a change to how something is deployed. I enjoy all of it, which is lucky, because a product doesn't care which layer you were hired for.",
    "AI sits in the middle of all this. I use it the way I used to use a good IDE, except the conversation goes both ways now. It's in how I sketch an architecture, how I read a codebase I've never seen, how I test and ship. It's also the honest reason one person can now carry a product that used to need a small team. I don't think that makes engineering smaller. I think the craft moves up a level, toward understanding the problem, choosing the right shape for the system, and knowing which parts deserve your own hands. The other half of the job is preparing a codebase so an agent can work in it without making a mess, which is where flutter_skill_gen came from.",
    "What I care about hasn't really changed through any of it. The work I like best is still the work nobody notices: the empty state, the offline path, the retry that doesn't double-charge anyone, the release that doesn't page you at 3am. Good software should feel quiet.",
    "Right now my time is split between the day job, PinDey, a few side projects that may or may not see daylight, and writing, which is the other thing I can't stop doing. Poetry, prose, and the occasional long thought about software. It turns out finding the right word and finding the right abstraction are pretty much the same muscle.",
  ],

  /** The about section's last line, set apart. */
  coda: "Think about the problem, see the system, build the thing. Then make it quiet.",

  /**
   * Logistics, kept for anyone who needs them. One paragraph, not a checklist.
   * TODO(donald): confirm this is still true and still something you want on
   * the site. It was a deliberate filter in the last version, but the new
   * positioning is less of a job pitch, so it may belong on the CV instead.
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
