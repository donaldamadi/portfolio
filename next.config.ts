import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  async redirects() {
    return [
      // /work has no index page; the case studies are listed on the home page.
      // Someone trimming the URL back by hand should land somewhere useful
      // rather than on a 404.
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/cv", destination: "/Donald-Amadi-CV.pdf", permanent: false },
      { source: "/resume", destination: "/Donald-Amadi-CV.pdf", permanent: false },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // .dev is on the HSTS preload list, so browsers already refuse plain
          // HTTP here. Sending the header anyway is what a scanner looks for,
          // and it costs nothing.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
