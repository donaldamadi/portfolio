import type { Metadata, Viewport } from "next";
import { GeistSerifRegular } from "geist/font/serif/regular";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { profile, SITE_URL } from "@/content/profile";
import { themeBootstrapScript } from "@/lib/theme";
import "./globals.css";
import { Explorer } from "@/components/explorer";

// Geist Serif, everywhere on the site (the CV PDF keeps its own type). It ships
// in one weight, so hierarchy comes from size and colour; globals.css turns off
// faux-bold synthesis so a stray font-medium never smears it.
const serif = GeistSerifRegular;

const description =
  "Product engineer in Lagos. Five years shipping mobile apps in React Native, Flutter, Swift and Kotlin, React and Next.js on the web, and the Node services behind them. Building PinDey.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.shortName}, ${profile.role.toLowerCase()}`,
    template: `%s | ${profile.shortName}`,
  },
  description,
  applicationName: `${profile.shortName} portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Donald Amadi",
    "React Native developer",
    "React developer",
    "product engineer",
    "mobile engineer",
    "Flutter",
    "Next.js",
    "TypeScript",
    "Node.js",
    "fintech",
    "PinDey",
    "Lagos",
  ],
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: profile.shortName,
    title: `${profile.shortName}, ${profile.role.toLowerCase()}`,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@thatmandonald",
    title: `${profile.shortName}, ${profile.role.toLowerCase()}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={serif.variable}
    >
      <head>
        {/* Applied before first paint, so there is no flash of the wrong palette. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm"
          style={{ color: "var(--bg)" }}
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <Explorer />
      </body>
    </html>
  );
}
