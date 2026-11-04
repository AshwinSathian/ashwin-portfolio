import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: { viewTransition: true },
  images: {
    // This deploy targets Cloudflare Workers via OpenNext with no `images`
    // binding in wrangler.jsonc, so Next's default optimizer (which needs
    // either that binding or a custom Cloudflare Images loader) isn't
    // available. Source screenshots are already small; served unoptimized
    // (as pre-generated WebP) with the cache headers in public/_headers, this is fine.
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
      // Files in public/ and /_next/static are served by Workers static assets
      // without running the Worker, so their cache headers live in public/_headers.
      // This rule now only reaches Worker-served routes such as /favicon.ico.
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|ico|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(sitemap\\.xml|robots\\.txt)",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
      },
    ];
  },
};

export default nextConfig;
