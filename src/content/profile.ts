import type { Link, StackGroup } from "./types";

export const SITE_URL = "https://donaldamadi.dev";

export const profile = {
  name: "Donald Obinna Amadi",
  shortName: "Donald Amadi",
  role: "Senior Mobile Engineer",
  location: "Lagos, Nigeria",
  timezone: "WAT · UTC+1",
  email: "donaldamadi15@gmail.com",
  phone: "+234 814 564 0723",

  /** One sentence. If a recruiter reads nothing else, they read this. */
  tagline: "I build the software that lives in your pocket. Mostly for money that has to arrive.",

  /** The three-line version, for the hero. */
  intro: [
    "Five years turning “wouldn’t it be good if…” into apps that stay fast on a three-year-old phone with two bars of signal.",
    "Most of it in fintech, where a rounding error ruins someone’s day and “it works on my machine” is not a defence.",
    "Flutter, Swift and Kotlin today. Backend, systems and the teams that build them next.",
  ],

  /**
   * The one thing the hero doesn't say. Rendered once, between the hero and
   * the work, as a pause rather than a section. The other three paragraphs
   * this used to hold said what the hero and the practice section already say,
   * so they're gone: unrendered prose is just a file that lies about itself.
   */
  statement:
    "The work I\u2019m proudest of is rarely the work you can see. Empty states. The offline path. The retry that doesn\u2019t double-charge anybody. A release that doesn\u2019t page you at 3am. Good software should feel quiet.",

  /** How I work. Deliberately short; each line is a claim I can defend. */
  principles: [
    {
      title: "Failure states are the product",
      body: "The happy path takes a week. The other paths take the rest of the quarter, and they’re what people remember.",
    },
    {
      title: "Decisions beat opinions",
      body: "I can tell you what I chose. I can also tell you what I rejected and the specific way it breaks. If I can’t do the second one, I haven’t finished thinking.",
    },
    {
      title: "Boring reliability",
      body: "Idempotency, feature flags, a rollback you’ve actually rehearsed. Cleverness is a cost you pay every time someone new opens the file.",
    },
    {
      title: "Write it down",
      body: "Architecture that only exists in one head is a single point of failure with a notice period.",
    },
  ],

  availability: {
    status: "Open to senior mobile & full-stack roles",
    detail: "Relocation-ready for Ireland, Netherlands, Denmark, Germany, France, Canada, UK.",
    notes: [
      "Visa sponsorship required (Nigerian passport). Familiar with Critical Skills, EU Blue Card and Specialist permit routes.",
      "Comfortable overlapping with CET/GMT/EST, after five years of fully-remote delivery across Lagos, Dubai, Riyadh and the US.",
      "Also open to fully-remote contract work.",
    ],
  },

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

export const stack: readonly StackGroup[] = [
  {
    label: "Languages",
    items: ["Dart", "Swift", "Kotlin", "TypeScript", "JavaScript", "Python", "Java"],
  },
  {
    label: "Mobile",
    items: ["Flutter", "SwiftUI", "UIKit", "Jetpack Compose", "Kotlin Multiplatform", "Platform Channels"],
  },
  {
    label: "Architecture",
    items: ["Clean Architecture", "MVVM", "BLoC / Cubit", "Riverpod", "Provider", "get_it", "go_router"],
  },
  {
    label: "Fintech",
    items: ["Card & POS SDKs", "Open banking (Mono)", "KYC (Prembly, HyperVerge)", "AES transport", "Paystack", "Flutterwave"],
  },
  {
    label: "Backend & web",
    items: ["Node.js", "Express", "Prisma", "PostgreSQL", "Redis / BullMQ", "Next.js", "React"],
  },
  {
    label: "Ship & operate",
    items: ["GitHub Actions", "Bitrise", "Codemagic", "Fastlane", "Shorebird", "Firebase", "Sentry", "GCP"],
  },
];
