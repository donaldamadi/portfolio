/**
 * "Ship it", the career run. Each chapter is a real stretch of my career, in
 * order. The bugs are failure modes I actually met there, the pickups are the
 * stack I used, and the shield is the fix that got me through. Facts match
 * experience.ts, work.ts and the case studies; keep them in step.
 */

export type Chapter = {
  readonly id: string;
  readonly when: string;
  readonly where: string;
  readonly who: string;
  /** What clearing the chapter "ships". Finishes the sentence "Shipped: …". */
  readonly shipped: string;
  readonly bugs: readonly string[];
  readonly fix: string;
  readonly stack: readonly string[];
  /** A case study on this site, for the "read the real story" link. */
  readonly caseStudy?: string;
};

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "first-app",
    when: "2021",
    where: "Lagos",
    who: "Student Paddy",
    shipped: "my first app end to end, with real-time chat",
    bugs: ["null check", "merge conflict"],
    fix: "code review",
    stack: ["Flutter", "Dart", "Firebase"],
  },
  {
    id: "first-bank",
    when: "2022",
    where: "Lagos",
    who: "First Bank of Nigeria",
    shipped: "transfers and bill payments for LitApp",
    bugs: ["rounding error", "timeout"],
    fix: "retry with backoff",
    stack: ["Flutter", "Dart"],
  },
  {
    id: "tamata",
    when: "2022 to 2024",
    where: "Dubai",
    who: "Creative Advanced Technologies",
    shipped: "a 40% faster app for 500,000 users",
    bugs: ["jank", "flaky build"],
    fix: "CI pipeline",
    stack: ["Flutter", "RxBloc", "Shorebird"],
  },
  {
    id: "uplines",
    when: "2024",
    where: "Saudi Arabia, remote",
    who: "Equivator",
    shipped: "the React web app and iOS widgets for Uplines",
    bugs: ["crash loop", "stale widget"],
    fix: "Sentry",
    stack: ["React", "Swift", "SwiftUI"],
  },
  {
    id: "extracash",
    when: "2024",
    where: "Lagos",
    who: "Zedcrest",
    shipped: "ExtraCash, lending inside a banking app",
    bugs: ["double charge", "skipped KYC"],
    fix: "idempotency key",
    stack: ["Flutter", "Kotlin", "Mono"],
    caseStudy: "extracash-embedded-lending",
  },
  {
    id: "ofin-eko",
    when: "2025",
    where: "Lagos",
    who: "Ofin Eko",
    shipped: "Lagos State law, offline and read aloud",
    bugs: ["no signal", "lost bookmark"],
    fix: "offline cache",
    stack: ["React Native", "TypeScript"],
  },
  {
    id: "snappay",
    when: "2026",
    where: "remote",
    who: "SnapPay",
    shipped: "a transport that survives its key rotating",
    bugs: ["403: key rotated", "plaintext call"],
    fix: "single-flight refresh",
    stack: ["Flutter", "AES"],
    caseStudy: "aes-encrypted-transport",
  },
  {
    id: "pindey",
    when: "2026",
    where: "Lagos",
    who: "PinDey",
    shipped: "PinDey, every layer of it",
    bugs: ["five bars", "dropped call"],
    fix: "honest Finder",
    stack: ["Flutter", "Next.js", "NestJS"],
  },
];
