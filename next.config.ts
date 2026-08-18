import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    // This deploy targets Cloudflare Workers via OpenNext with no `images`
    // binding in wrangler.jsonc, so Next's default optimizer (which needs
    // either that binding or a custom Cloudflare Images loader) isn't
    // available. Source screenshots are already small; served unoptimized
    // with the existing immutable cache headers below, this is fine.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|ico|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/Resume.pdf",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      {
        source: "/(sitemap\\.xml|robots\\.txt)",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

export default nextConfig;
