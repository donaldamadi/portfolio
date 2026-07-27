import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.shortName} — ${profile.role}`,
    short_name: profile.shortName,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
