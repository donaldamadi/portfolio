import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RevealRoot } from "@/components/reveal-root";
import { ProgressBar } from "@/components/progress-bar";
import { profile, SITE_URL } from "@/content/profile";
import { themeBootstrapScript } from "@/lib/theme";
import "./globals.css";

// One variable family carries both body and display, the way zedvance.com runs
// Outfit across the whole document. Weight and tracking do the work a second
// typeface used to do.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

const description =
  "Product engineer in Lagos. Mobile at heart, years of fintech, now building whole products end to end. Currently building PinDey, an app that helps friends find each other in a crowd.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.shortName} · ${profile.role}`,
    template: `%s · ${profile.shortName}`,
  },
  description,
  applicationName: `${profile.shortName} portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Donald Amadi",
    "product engineer",
    "PinDey",
    "Flutter",
    "Swift",
    "Kotlin",
    "fintech",
    "AI-native engineering",
    "Lagos",
    "Nigeria",
  ],
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: profile.shortName,
    title: `${profile.shortName} · ${profile.role}`,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@thatmandonald",
    title: `${profile.shortName} · ${profile.role}`,
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
    { media: "(prefers-color-scheme: dark)", color: "#05070d" },
    { media: "(prefers-color-scheme: light)", color: "#f7fafd" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${outfit.variable} ${mono.variable}`}
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
        <ProgressBar />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealRoot />
      </body>
    </html>
  );
}
