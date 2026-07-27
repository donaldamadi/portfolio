import { Hero } from "@/components/hero";
import { Statement } from "@/components/statement";
import { WorkIndex } from "@/components/work-index";
import { ExperienceLedger } from "@/components/experience-ledger";
import { Practice } from "@/components/practice";
import { OpenSource } from "@/components/open-source";
import { Writing } from "@/components/writing";
import { Contact } from "@/components/contact";
import { profile, SITE_URL } from "@/content/profile";

/** Person + WebSite structured data. Recruiters' tooling reads this; so does Google. */
function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.shortName,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    jobTitle: profile.role,
    address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.school,
    },
    knowsAbout: [
      "Flutter",
      "Dart",
      "Swift",
      "Kotlin",
      "Mobile architecture",
      "Fintech payments",
      "Platform Channels",
      "AI agent orchestration",
    ],
    sameAs: profile.links.filter((link) => !link.href.startsWith("mailto:")).map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Statement />
      <WorkIndex />
      <ExperienceLedger />
      <Practice />
      <OpenSource />
      <Writing />
      <Contact />
    </>
  );
}
