import { Hero } from "@/components/hero";
import { PinDey } from "@/components/pindey";
import { ReactNative } from "@/components/react-native";
import { WorkIndex } from "@/components/work-index";
import { CareerRun } from "@/components/career-run";
import { ExperienceLedger } from "@/components/experience-ledger";
import { HowIWork } from "@/components/how-i-work";
import { OpenSource } from "@/components/open-source";
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
      "React Native",
      "React",
      "Next.js",
      "TypeScript",
      "Flutter",
      "Swift",
      "Kotlin",
      "Node.js",
      "Mobile architecture",
      "Fintech payments",
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
      <PinDey />
      <ReactNative />
      <WorkIndex />
      <CareerRun />
      <ExperienceLedger />
      <HowIWork />
      <OpenSource />
      <Contact />
    </>
  );
}
