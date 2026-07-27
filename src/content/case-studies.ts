import type { CaseStudy } from "./types";

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "extracash-embedded-lending",
    title: "Lending, inside a bank people already trusted",
    kicker: "ExtraCash",
    company: "Zedcrest Group · Zedvance",
    period: "2024 — present",
    role: "Mobile Engineer",
    accentIndex: 0,
    summary:
      "An embedded credit product that decides in-app whether you qualify, then moves the money the moment you do. The interesting part was never the loan calculator. It was every way the flow could stop halfway.",
    problem: [
      "Zedvance was already a working retail banking app. Adding credit meant adding three things it didn’t have: an underwriting pipeline, an identity trail strong enough to lend against, and an irreversible money-movement path — all inside a product people already used for their salary.",
      "It couldn’t feel bolted on. And it couldn’t be casual about failure, because a lending flow that breaks in the middle doesn’t just annoy someone; it leaves them thinking they owe money they don’t, or that they don’t owe money they do.",
    ],
    constraints: [
      "Eligibility depends on data the app doesn’t own: bank statements through Mono’s open-banking APIs, identity through KYC providers, employment and income through user capture.",
      "Every one of those is a slow, failable third-party call — over Nigerian mobile networks, on devices that background aggressively.",
      "Money movement is irreversible. Disbursement and repayment have to be safe under retry.",
      "A user’s limit is not a stored constant. Income changes, so eligibility has to be re-assessed rather than remembered.",
    ],
    decisions: [
      {
        title: "Model eligibility as a resumable state machine, not a form",
        body:
          "Statement linkage, KYC tier, employment capture and decisioning are each their own persisted state. A user who abandons at the bank-statement consent screen comes back to exactly that step. A user whose KYC lapses drops a tier rather than being ejected from the flow.",
        rejected:
          "A multi-step form holding progress in local state. It reads simpler right up until a third-party callback fails on step four of six and the user is asked to start again — which, in flows like this, is the single largest source of drop-off.",
      },
      {
        title: "Gate on capability, not on screen order",
        body:
          "Each screen asks the domain a question — “can this user disburse yet?” — instead of assuming the screen before it ran. The answer is derived from persisted state, not from navigation history.",
        rejected:
          "Relying on route order for correctness. It holds until deep links, push notifications and app-resume start dropping users into the middle of the flow. This product uses all three.",
      },
      {
        title: "Treat disbursement and repayment as two different reliability problems",
        body:
          "Disbursement is ours to retry against our own wallet ledger, keyed idempotently. Repayment goes out through a card rail where the authoritative answer lives on someone else’s server, so the client reconciles against that answer and never asserts its own.",
        rejected:
          "Optimistic local balance updates on repayment. Fast, and wrong at exactly the moment it matters — a user who sees a repayment that never settled will call support, and they’ll be right to.",
      },
      {
        title: "Make re-assessment a first-class event",
        body:
          "Income change triggers a re-evaluation rather than a silent overwrite, so a limit that moves has a reason attached to it that support can read back to a customer.",
        rejected:
          "Recomputing the limit lazily on next open. Cheaper, but it produces a number nobody can explain — the worst possible property for a credit decision.",
      },
    ],
    outcome: [
      "ExtraCash ships inside Zedvance: eligibility from open-banking statement analysis, automated decisioning, instant disbursement to wallet, and card repayment via Rave/Flutterwave.",
      "The same architecture carried into the surrounding surfaces — new service modules in the core banking app, a POS application, and a separate business-banking app for SMEs.",
    ],
    stack: ["Flutter", "Dart", "Mono (open banking)", "Rave / Flutterwave", "KYC", "Idempotent money flows"],
  },

  {
    slug: "aes-encrypted-transport",
    title: "A transport layer that can lose its key mid-transfer and not tell the user",
    kicker: "Encrypted networking",
    company: "SnapPay",
    period: "2026",
    role: "Flutter Engineer",
    accentIndex: 1,
    summary:
      "Every request and response encrypted above TLS with a server-issued AES key. Keys expire without warning. The client’s job is to notice, recover, and replay — invisibly, and exactly once.",
    problem: [
      "SnapPay puts wallets, transfers, bill payments, savings, invoices and QR pay in front of live Nigerian users. Payloads are encrypted end-to-end on top of TLS using an AES key the server issues.",
      "Those keys rotate. Nothing tells the client in advance — it finds out by being rejected with a 403, at which point the user’s transfer is already half-made and sitting in memory.",
    ],
    constraints: [
      "Rotation is not on a schedule the client can predict. The only signal is a rejection.",
      "A 403 during a transfer must never reach the user as an error. It has to be invisible.",
      "The recovery replay must not create a second transfer.",
      "401 and 403 look nearly identical at the wire and mean entirely different things: one is “your session is over”, the other is “your key is stale”.",
    ],
    decisions: [
      {
        title: "Put encryption in an interceptor, not at the call sites",
        body:
          "Encrypt on the way out, decrypt on the way in, in one place in the pipeline. Every feature added afterwards is encrypted by construction rather than by discipline.",
        rejected:
          "Encrypting explicitly in each repository. More visible, and more honest-looking in review — until the twelfth feature forgets once and you ship a plaintext endpoint you cannot detect from the outside.",
      },
      {
        title: "Single-flight the key refresh",
        body:
          "The first 403 starts a refresh. Concurrent 403s await that same in-flight future instead of each starting their own, and all of them replay against the new key once it lands.",
        rejected:
          "Refreshing per failed request. Under a burst — a dashboard fanning out six calls on load — you get six refreshes, five of which invalidate each other, and the app settles into a login loop that only reproduces on slow networks.",
      },
      {
        title: "Separate 401 from 403 at the transport boundary",
        body:
          "403 means refresh the key and replay silently. 401 means tear the session down, clear secrets, and route to login. The distinction is made once, at the edge, and never re-litigated upstream.",
        rejected:
          "A single generic auth-failure handler. Fewer lines, and it will eventually log someone out in the middle of sending money because a key rotated.",
      },
      {
        title: "Make failures values, not exceptions",
        body:
          "A layered MVVM core with Provider and get_it, and dartz Either at the domain boundary, so a decryption failure or a rotation timeout is a value the view model has to handle rather than an exception thrown through three layers into a global catch.",
        rejected:
          "Exception-based control flow. It compiles, it’s idiomatic in a lot of Dart, and it makes the set of things a screen can fail at unknowable from the screen’s own signature.",
      },
    ],
    outcome: [
      "Transfers, Prembly KYC (BVN / NIN / liveness), biometric auth, QR scan-to-pay, PDF receipts and deep links all ride the same transport, all encrypted, all rotation-safe.",
      "Changes shipped backwards-compatible and feature-flag-gated into an app with live users and live money.",
    ],
    stack: ["Flutter", "AES request/response encryption", "MVVM", "Provider", "get_it", "dartz", "Prembly KYC"],
  },

  {
    slug: "pos-platform-channels",
    title: "Flutter on the screen, a vendor’s card kernel on the reader",
    kicker: "POS · Platform Channels",
    company: "Zedcrest Group",
    period: "2024 — 2025",
    role: "Mobile Engineer",
    accentIndex: 2,
    summary:
      "Card-present payments on Android POS terminals. The UI is Flutter. The EMV kernel, PIN pad and printer live in a vendor Java SDK that will never be Dart. One channel contract between them, and no room to be wrong about either side.",
    problem: [
      "Taking a physical card means driving hardware: card detection, an EMV kernel, a PIN pad, online authorisation, and a thermal printer. All of that ships as a callback-driven Java/Kotlin SDK that only exists on the native side.",
      "Meanwhile the entire product surface — the amount entry, the receipt, the retry — is Flutter. The gap between those two worlds is where card-present bugs live.",
    ],
    constraints: [
      "A single tap is a long-running, multi-stage process. Thirty seconds is normal: detect, read, PIN, authorise, print.",
      "Terminal hardware and SDK builds vary by vendor. The same flow has to survive being pointed at a different box.",
      "Android will reclaim the activity if the transaction takes long enough and the device is under pressure.",
      "A failure part-way can leave the terminal in a state the next transaction inherits.",
    ],
    decisions: [
      {
        title: "Model the SDK as an event stream, not a request/response",
        body:
          "A MethodChannel carries commands down. An EventChannel carries the terminal’s own timeline up — card presented, PIN entered, host authorising, printing. Flutter renders that timeline; it never guesses at it.",
        rejected:
          "A single awaitable charge() method. A beautiful signature that hides thirty seconds of state, so the operator gets a spinner and no idea whether it’s safe to remove the card — which is the moment most failed transactions are actually created.",
      },
      {
        title: "Keep the transaction’s source of truth native",
        body:
          "Dart holds a projection of the transaction, not the transaction. If the isolate is killed or the app is backgrounded mid-authorisation, the native side still knows whether money moved, and the UI re-derives from it on resume.",
        rejected:
          "Owning transaction state in Dart because that’s where the rest of the app’s state lives. Consistent, convenient, and it loses the answer to “did this card get charged?” the first time Android reclaims the activity.",
      },
      {
        title: "One thin, versioned channel contract",
        body:
          "Serialised domain types cross the channel — never SDK objects, never SDK-shaped maps. The vendor’s vocabulary stops at the platform boundary.",
        rejected:
          "Passing the SDK’s own payloads straight through to Dart. Quicker to build, and it welds the product to one vendor’s field names, so the second terminal model becomes a rewrite instead of an adapter.",
      },
    ],
    outcome: [
      "Card-present payment flows running across terminals from a Flutter UI, driving the native card SDK through a single audited channel surface.",
      "The channel contract, not the SDK, is what the rest of the app depends on — so adding a terminal is an adapter, not a migration.",
    ],
    stack: ["Flutter", "Dart", "Kotlin", "Java", "MethodChannel", "EventChannel", "EMV card SDK"],
  },

  {
    slug: "medpal-telemedicine",
    title: "Real-time consultations, and 480 keys that refuse to drift",
    kicker: "MedPal Provider",
    company: "MedPal",
    period: "2025 — present",
    role: "Flutter Engineer",
    accentIndex: 3,
    summary:
      "Provider-side telemedicine: video and voice consults on Agora, payouts, availability — and a bilingual product where the second language stays correct because CI won’t let it rot.",
    problem: [
      "A consultation isn’t a screen, it’s a lifecycle: a request arrives, a provider accepts, a call runs with controls, and it ends — sometimes cleanly, often not, occasionally on a train.",
      "The platform ships into an English- and Spanish-speaking market, and internationalisation done once decays from the very next pull request unless something enforces it.",
    ],
    constraints: [
      "Real-time media has failure modes the rest of the app doesn’t: a dropped call needs a defined destination, not an undefined one.",
      "Healthcare context — an AI suggestion that routes a patient wrongly is not a cosmetic bug.",
      "Multiple Firebase environments (dev, staging, prod) behind build flavours.",
      "480+ user-facing strings, and a team that will keep adding more.",
    ],
    decisions: [
      {
        title: "Make the consultation lifecycle explicit",
        body:
          "Incoming request, accept, in-call controls and completion are modelled as states around the Agora RTC engine, on a Clean Architecture core with Cubit, go_router and get_it. Every terminal state — including “the network went away” — resolves somewhere specific.",
        rejected:
          "Driving the call from widget state and SDK callbacks directly. It works in a demo and produces a UI that can’t say what’s happening the first time a consult drops at minute nine.",
      },
      {
        title: "Make translation drift a build failure",
        body:
          "All 480+ strings migrated to gen-l10n, with CI parity tests that fail when one locale gains a key the other doesn’t.",
        rejected:
          "A translation checklist enforced in code review. Reviewers catch the first ten misses and none of the next hundred, and six months later the Spanish build is a patchwork.",
      },
      {
        title: "Use the model where it removes a form, not where it removes a decision",
        body:
          "Firebase AI (Vertex AI / Gemini) suggests a provider’s medical specialty during onboarding. The provider confirms it. Nothing clinical is inferred and committed without a human in the loop.",
        rejected:
          "Letting the model classify and persist directly. It’s a better demo and a worse product: in healthcare a mis-set specialty is a routing error with a patient on the other end of it.",
      },
    ],
    outcome: [
      "Live provider-to-patient video and voice consults, earnings and payouts, availability scheduling, QR generation, biometric login and consent capture.",
      "A genuinely bilingual codebase where adding an English string without its Spanish counterpart breaks the build.",
    ],
    stack: ["Flutter", "Agora RTC", "Firebase AI (Vertex / Gemini)", "Cubit / flutter_bloc", "go_router", "get_it", "gen-l10n"],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
