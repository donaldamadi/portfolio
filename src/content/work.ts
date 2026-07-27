import type { Article, Package, Project } from "./types";

export const packages: readonly Package[] = [
  {
    name: "flutter_skill_gen",
    tagline: "Context scaffolding for AI agents working inside a real codebase",
    description:
      "A CLI that scans a Flutter project and produces SKILL.md context files describing its architecture, state management, navigation, dependency injection, data layer and conventions, so an assistant arrives already knowing how the codebase is meant to be written, instead of guessing from whichever file it opened first.",
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
    tagline: "Responsive multi-media layouts without doing the layout maths",
    description:
      "A Flutter package for arranging multiple images, videos and audio in adaptive gallery layouts: single, grouped or grid, network or local, with optional captions. Maintained across successive releases since 2022.",
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
      "Architected and built solo: a bilingual (English / Yorùbá) app for reading and listening to Lagos State law. Offline-first with an aggressive cache so it works without a connection, text-to-speech and audio streaming for every statute, and deep links straight to a specific law or bookmark. Shipped and maintained on both the App Store and Google Play.",
    period: "Jan 2025 - Jul 2025",
    stack: ["Flutter", "Offline-first caching", "Text-to-speech", "Deep linking", "App Store + Play Store"],
  },
  {
    name: "Job scraper platform",
    tagline: "The backend half of the transition, built in public",
    description:
      "A TypeScript service I’m building to learn the other side of the wire properly rather than by reading about it: Express and Prisma over PostgreSQL on Supabase, Redis and BullMQ for the scraping queue, JWT auth, and a typed API surface consumed by a separate frontend.",
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
      "A Kotlin Multiplatform notes app sharing a domain layer across a Jetpack Compose Android UI and a SwiftUI iOS one, written to understand where KMM’s seam actually falls in practice, rather than where the marketing says it does.",
    period: "2023",
    stack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI"],
    links: [{ label: "Source", href: "https://github.com/donaldamadi/kmm-notes-app", external: true }],
  },
  {
    name: "Fluid level monitor",
    tagline: "Final-year project: hardware to phone, in real time",
    description:
      "A hardware device measuring the level and temperature of a fluid, streaming to a Flutter application that renders it live. My first properly end-to-end system: sensor, transport, and interface.",
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
 * The AI practice section. Three named disciplines, because "I use AI" is not
 * a differentiator in 2026 and "here is how I make it safe in a live codebase" is.
 */
export const aiPractice = {
  lede:
    "I run agentic engineering workflows end to end, model-agnostic and platform-agnostic. Not autocomplete. A loop with guardrails, and a codebase prepared to be worked in.",
  disciplines: [
    {
      id: "prompt",
      name: "Prompt engineering",
      body:
        "Structured, role-scoped, context-bounded instructions that produce output a reviewer can actually review. The goal isn’t a clever answer, it’s a reproducible one.",
    },
    {
      id: "loop",
      name: "Loop engineering",
      body:
        "Plan, act, verify, correct. With explicit guardrails and, the part most people skip, explicit stopping conditions, so the loop terminates on a definition of done rather than on the model running out of enthusiasm.",
    },
    {
      id: "harness",
      name: "Harness engineering",
      body:
        "Decomposing a large production codebase into composable, on-demand context files so an agent loads only what a task needs and operates inside real conventions. This is what makes the difference between a demo and something you’d point at a live fintech app.",
    },
  ],
  proof: [
    "Published flutter_skill_gen on pub.dev, a CLI that generates these context files from a Flutter project’s actual structure.",
    "Applied it to SnapPay, a live fintech app, by splitting the codebase into modular, feature-scoped skill documents agents could safely load.",
  ],
} as const;

/**
 * Two lines of his own prose. Deliberately unlabelled and deliberately short,
 * enough to say a person wrote this site, not enough to make it the subject.
 */
export const offTheClock = {
  intro:
    "When I’m away from the editor I’m usually still writing: poetry, mostly, and prose that never quite becomes anything. It keeps a different kind of syntax sharp, and it’s where I learned that the second draft is where the thinking actually happens.",
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
