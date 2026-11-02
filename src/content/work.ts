import type { Article, Package, Project, Work } from "./types";

export const packages: readonly Package[] = [
  {
    name: "flutter_skill_gen",
    tagline: "Writes SKILL.md files for AI assistants, because good tooling should teach the robots too.",
    description:
      "Point it at a Flutter project and it reads the pubspec, the lib folder and the Dart sources, works out how the codebase is put together, and writes SKILL.md context files so an assistant shows up already knowing the architecture and conventions instead of guessing from whichever file it opened first. It writes for Claude Code, Cursor, Copilot, Windsurf and a few others, splits big projects into a core file plus smaller domain files, and can keep everything current through watch mode, git hooks or CI.",
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
    tagline: "Lays out image grids so you never do that maths by hand again.",
    description:
      "Give it one image or a dozen, network or local, and it picks a sensible layout for the count. Over the years it has grown video in the same grid, a fullscreen viewer you can swipe and zoom through, loading placeholders and optional captions. It's been on pub.dev since 2022 and is now on its second major version.",
    language: "Dart",
    license: "MIT",
    since: "2022",
    links: [
      { label: "pub.dev", href: "https://pub.dev/packages/multi_image_layout", external: true },
      { label: "Source", href: "https://github.com/donaldamadi/multi-image-viewer", external: true },
    ],
  },
];

/**
 * The work list on the home page, newest and most relevant first. Facts come
 * from the CV; anything not confirmed there is left out or marked TODO.
 */
export const work: readonly Work[] = [
  {
    id: "ofin-eko",
    name: "Ofin Eko",
    org: "Solo project",
    period: "Jan 2025 - Jul 2025",
    platforms: ["React Native"],
    what: "Every law of Lagos State, in English or Yorùbá, offline and read aloud.",
    body:
      "I built it alone, start to finish, in React Native, and shipped it to the App Store and Google Play. It caches aggressively so it works without a connection, reads every statute aloud, and opens any law or bookmark straight from a link.",
    // TODO(donald): Expo or bare React Native? Add it to the stack if you want it shown.
    // TODO(donald): store links, if you want them on the card.
    stack: ["React Native", "Offline-first caching", "Text-to-speech", "Deep linking", "iOS and Android"],
  },
  {
    id: "uplines",
    name: "Uplines",
    org: "Equivator",
    period: "Oct 2024 - May 2025",
    platforms: ["React", "Native"],
    what: "A web and mobile platform, where I worked on the React web app and native iOS widgets.",
    body:
      "As senior frontend developer I worked across the React web platform and the mobile app, and built native iOS widgets in SwiftUI that lifted daily active users by about 10%. I also wired up Firebase and CleverTap analytics, and ran crash triage through Sentry and Crashlytics.",
    stack: ["React", "Swift", "SwiftUI", "Firebase", "CleverTap", "Sentry"],
  },
  {
    id: "adduce",
    name: "Adduce",
    org: "Founding, early stage",
    period: "Aug 2026 - present",
    platforms: ["React", "Node.js"],
    what: "Signed, clause-mapped evidence that a product meets EN 301 549 and the European Accessibility Act.",
    body:
      "An early-stage SaaS I'm founding. I wrote the architecture, data model, API, security model and decision log, the interface is React, and Postgres is provisioned in the EU.",
    stack: ["React", "TypeScript", "PostgreSQL", "API design"],
  },
  {
    id: "extracash",
    name: "ExtraCash",
    org: "Zedcrest Group, Zedvance",
    period: "2024 - present",
    platforms: ["Flutter"],
    what: "Embedded lending inside a banking app people already used for their salary.",
    body:
      "Eligibility from open-banking statements, KYC tiers, instant disbursement and card repayment. The loan journey is a resumable state machine, so someone who drops off at statement consent comes back to exactly that step.",
    stack: ["Flutter", "Mono", "Flutterwave", "State machines", "Idempotent money flows"],
    caseStudy: "extracash-embedded-lending",
  },
  {
    id: "snappay",
    name: "Encrypted transport",
    org: "SnapPay",
    period: "Apr 2026 - Jun 2026",
    platforms: ["Flutter"],
    what: "A networking layer that loses its key mid-transfer and recovers without the user noticing.",
    body:
      "Every request and response encrypted on top of TLS with a server-issued key. When the key rotates, the first rejection refreshes it once and every waiting request replays, exactly once.",
    stack: ["Flutter", "AES", "MVVM", "Prembly KYC"],
    caseStudy: "aes-encrypted-transport",
  },
  {
    id: "medpal",
    name: "MedPal Provider",
    org: "MedPal",
    period: "2025 - present",
    platforms: ["Flutter"],
    what: "Video and voice consultations for doctors, in English and Spanish.",
    body:
      "Consultations on Agora with every call state handled, including the network going away, plus payouts and scheduling. All 480+ strings moved to gen-l10n, with CI failing the build if the two languages drift.",
    stack: ["Flutter", "Agora RTC", "Firebase AI", "Cubit", "gen-l10n"],
    caseStudy: "medpal-telemedicine",
  },
  {
    id: "pos",
    name: "Card-present POS",
    org: "Zedcrest Group",
    period: "2024 - 2025",
    platforms: ["Flutter", "Native"],
    what: "A Flutter screen in front of a vendor's card reader SDK written in Java.",
    body:
      "Commands go down a method channel and the terminal's own timeline comes back up an event channel, so the screen always knows whether it's safe to remove the card.",
    stack: ["Flutter", "Kotlin", "Java", "Platform Channels"],
    caseStudy: "pos-platform-channels",
  },
  {
    id: "job-scraper",
    name: "Job scraper",
    org: "Side project",
    period: "2026 - present",
    platforms: ["React", "Node.js"],
    what: "A job aggregator with a Next.js dashboard and a queue of scrapers behind it.",
    body:
      "Dashboard, filters, CV and document pages in Next.js and React. Behind it, an Express and Prisma API on PostgreSQL, with Redis and BullMQ running scheduled scraping jobs with retries.",
    stack: ["Next.js", "React", "Express", "Prisma", "PostgreSQL", "BullMQ"],
    links: [{ label: "Backend source", href: "https://github.com/donaldamadi/job-scraper-backend", external: true }],
  },
];

/** Smaller things, listed on /about. */
export const projects: readonly Project[] = [
  {
    name: "kmm-notes-app",
    tagline: "One domain, two native UIs",
    description:
      "A small notes app with one shared Kotlin domain layer and two fully native interfaces, Jetpack Compose on Android and SwiftUI on iOS. I wrote it to find out where the Kotlin Multiplatform seam really falls once you build something.",
    period: "2023",
    stack: ["Kotlin Multiplatform", "Jetpack Compose", "SwiftUI"],
    links: [{ label: "Source", href: "https://github.com/donaldamadi/kmm-notes-app", external: true }],
  },
  {
    name: "Fluid level monitor",
    tagline: "Final-year project: hardware to phone, in real time",
    description:
      "A device that measures the level and temperature of a fluid and streams both to a Flutter app in real time. Sensor, transport and interface, all mine.",
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
