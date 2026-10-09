import type { Article, Package, Project } from "./types";

/**
 * The flagship. Kept separate from the case studies because it isn't one yet:
 * it's a live product, and everything said about it here has to be true today.
 *
 * TODO(donald): pindey.app couldn't be reached from the environment this copy
 * was written in, so nothing below describes what PinDey actually does. Fill in:
 *   1. `whatItIs`: one plain sentence on what PinDey is and who it's for.
 *   2. `stack`: the real stack per layer (app, backend, infra), if you want it shown.
 *   3. Any number you're happy to stand behind (users, launch date). Leave it out otherwise.
 */
export const flagship = {
  name: "PinDey",
  href: "https://pindey.app",
  status: "Live in production",
  whatItIs: "",
  story: [
    "PinDey is mine from end to end: the app, the backend, the infrastructure, the decisions nobody sees and the ones everybody does. It's live in production with real people using it, which is the only test I've ever fully trusted.",
    "Building it alone changed how I think about product. When you own every layer there's nobody to hand the hard part to, so you learn fast which problems belong in the client, which belong on the server, and which shouldn't exist at all. It's also where working AI-native stopped being an idea and became the only reason the whole thing fits inside one person's week.",
  ],
  stack: [] as readonly string[],
} as const;

export const packages: readonly Package[] = [
  {
    name: "flutter_skill_gen",
    tagline: "A CLI that writes SKILL.md files for AI assistants",
    description:
      "Point it at a Flutter project and it reads the pubspec, the lib folder and the Dart sources, works out how the codebase is put together, and writes SKILL.md context files so an assistant shows up already knowing the architecture and conventions instead of guessing from whichever file it opened first. It writes for Claude Code, Cursor, Copilot, Windsurf and a few others, splits big projects into a core file plus smaller domain files, and can keep everything current through watch mode, git hooks or CI. Good tooling should teach the robots too.",
    language: "Dart",
    license: "MIT",
    since: "2025",
    links: [
      { label: "pub.dev", href: "https://pub.dev/packages/flutter_skill_gen", external: true },
      { label: "Source", href: "https://github.com/donaldamadi/flutter-skill-gen", external: true },
      {
        label: "Write-up",
        href: "https://thatmandonald.medium.com/your-ai-coding-assistant-is-brilliant-but-also-has-amnesia-42e2e8a4db0b",
        external: true,
      },
    ],
  },
  {
    name: "multi_image_layout",
    tagline: "Image grids, without doing the maths by hand",
    description:
      "It exists because I got tired of working out image grid layouts by hand. Give it one image or a dozen, network or local, and it picks a sensible layout for the count. Over the years it has grown video in the same grid, a fullscreen viewer you can swipe and zoom through, loading placeholders and optional captions. It's been on pub.dev since 2022 and is now on its second major version.",
    language: "Dart",
    license: "MIT",
    since: "2022",
    links: [
      { label: "pub.dev", href: "https://pub.dev/packages/multi_image_layout", external: true },
      { label: "Source", href: "https://github.com/donaldamadi/multi-image-viewer", external: true },
    ],
  },
];

export const projects: readonly Project[] = [
  {
    name: "Ofin Eko",
    tagline: "Every law of Lagos State, offline, in two languages, read aloud",
    description:
      "I built this one alone, start to finish. It lets people read and listen to Lagos State law in English or Yorùbá, and it keeps working without a connection. Every statute can be read aloud, any law or bookmark can be opened from a link, and it's live on both the App Store and Google Play.",
    period: "Jan 2025 - Jul 2025",
    stack: ["Flutter", "Offline-first caching", "Text-to-speech", "Deep linking", "App Store + Play Store"],
  },
  {
    name: "Job scraper platform",
    tagline: "Queues, scrapers and a database, for the fun of it",
    description:
      "A TypeScript service that scrapes job listings and serves them through a typed API to a separate frontend. Express and Prisma sit over PostgreSQL on Supabase, and Redis with BullMQ runs the scraping queue. It's mostly an excuse to spend time with the parts of a system that don't have a screen.",
    period: "2026 - present",
    stack: ["TypeScript", "Express", "Prisma", "PostgreSQL", "Redis / BullMQ", "JWT"],
    links: [
      { label: "Backend source", href: "https://github.com/donaldamadi/job-scraper-backend", external: true },
    ],
  },
  {
    name: "kmm-notes-app",
    tagline: "One domain, two native UIs",
    description:
      "A small notes app with one shared Kotlin domain layer and two fully native interfaces, Jetpack Compose on Android and SwiftUI on iOS. I wrote it to find out where the Kotlin Multiplatform seam really falls once you build something, rather than where the docs say it does.",
    period: "2023",
    stack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI"],
    links: [{ label: "Source", href: "https://github.com/donaldamadi/kmm-notes-app", external: true }],
  },
  {
    name: "Fluid level monitor",
    tagline: "Final-year project: hardware to phone, in real time",
    description:
      "A device that measures the level and temperature of a fluid and streams both to a Flutter app in real time. Looking back, it was the first time I built a whole system rather than a screen: sensor, transport and interface, all mine. It took me a few more years to notice that was the part I liked.",
    period: "2023",
    stack: ["Flutter", "Embedded hardware", "Real-time telemetry"],
  },
];

export const articles: readonly Article[] = [
  {
    title: "Your AI coding assistant is brilliant, but also has amnesia",
    blurb:
      "Why an assistant that can write any function still can’t write yours, and what a codebase has to hand it before it can.",
    date: "Apr 2026",
    publication: "Level Up Coding",
    href: "https://thatmandonald.medium.com/your-ai-coding-assistant-is-brilliant-but-also-has-amnesia-42e2e8a4db0b",
  },
  {
    title: "Debugging your Flutter applications remotely",
    blurb: "Finding, prioritising and fixing errors you can’t reproduce, on devices you’ll never hold.",
    date: "Apr 2023",
    publication: "Level Up Coding",
    href: "https://thatmandonald.medium.com/debugging-your-flutter-applications-remotely-6ded44d46bc",
  },
  {
    title: "Implementing Firebase dynamic linking in your Flutter app",
    blurb: "Smart URLs that put a user exactly where they meant to be, on either platform.",
    date: "Jul 2022",
    publication: "Level Up Coding",
    href: "https://thatmandonald.medium.com/implementing-firebase-dynamic-linking-in-your-flutter-app-3e9290dd3bc0",
  },
  {
    title: "Flutter: a new perspective",
    blurb: "Different angles reveal different worlds.",
    date: "Aug 2021",
    publication: "Level Up Coding",
    href: "https://thatmandonald.medium.com/flutter-a-new-perspective-3976401674cc",
  },
  {
    title: "Orbit animation with Flutter",
    blurb: "Two widgets, one orbit: a small lesson in how much motion you get from very little.",
    date: "Aug 2021",
    publication: "Level Up Coding",
    href: "https://thatmandonald.medium.com/orbit-animation-with-flutter-5f59ef136f13",
  },
  {
    title: "A fancy height picker with CupertinoPicker and TextField",
    blurb: "Taking a design apart to find out what it was actually made of.",
    date: "Jan 2021",
    publication: "Medium",
    href: "https://thatmandonald.medium.com/using-cupertinopicker-and-textfield-to-create-a-fancy-height-picker-with-flutter-da03e990e9e5",
  },
];

/**
 * The other writing. Two fragments of his own prose, deliberately short:
 * enough to say a person wrote this site, not enough to make it the subject.
 */
export const offTheClock = {
  intro:
    "Most of what I write has nothing to do with software. Poetry, mostly, and prose that sometimes becomes something and sometimes doesn't. Every so often a longer piece about software turns up too, usually because I couldn't stop thinking about something until I'd written it down. It's all the same habit, really. You keep rearranging the thing until it says exactly what you meant, and the second draft is where the thinking actually happens.",
  excerpts: [
    {
      body:
        "I have always lived with the misconception that a star shines. But I have come to learn that it burns, with every moment of burn bringing it closer to its end...",
    },
    {
      body:
        "I stared into the Sea today and it stared back into me. It felt like a minute but was twenty...",
    },
  ],
  closer: "Both of those took longer to get right than most functions I’ve written.",
} as const;

export const volunteering = [
  {
    org: "Melodia Academy",
    role: "Lead Tutor",
    period: "2022",
    body: "Mentored three engineers through Flutter and ran code review on their projects. The first time I found out I liked the teaching part.",
  },
  {
    org: "Andela Hackathon for Justice",
    role: "Participant",
    period: "2021",
    body: "Built a prison record-keeping app addressing overcrowding and lost paperwork.",
  },
] as const;
