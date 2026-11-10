// Runs only for the one path listed in wrangler.jsonc `run_worker_first`.
// Google's file check needs a 200 at the exact .html URL, and static assets
// would redirect it to the extensionless form. Everything else is static.
export default {
  fetch() {
    return new Response("google-site-verification: google4e979ce58507a6a4.html", {
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=86400",
        "x-content-type-options": "nosniff",
        "strict-transport-security": "max-age=31536000",
        "content-security-policy": "default-src 'none'" },
    });
  },
};
