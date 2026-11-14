// Instant navigation: rules for prerender/prefetch ship and are linked, every page carries the skeleton and the script.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIST = "dist";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith(".html") && !f.endsWith("404.html"));

test("speculation rules are valid JSON, served with the right type, and linked from the headers", () => {
  const rules = JSON.parse(fs.readFileSync(path.join(DIST, "speculation.json"), "utf8"));
  assert.ok(rules.prefetch?.length && rules.prerender?.length);
  const headers = fs.readFileSync(path.join(DIST, "_headers"), "utf8");
  assert.match(headers, /Speculation-Rules: "\/speculation\.json"/);
  assert.match(headers, /\/speculation\.json\s+Content-Type: application\/speculationrules\+json/);
});

test("the CSP needs no inline script for any of this", () => {
  const csp = fs.readFileSync(path.join(DIST, "_headers"), "utf8").match(/Content-Security-Policy: (.*)/)[1];
  assert.match(csp, /script-src 'self';/);
});

for (const file of pages) {
  test(`${file.replace(DIST, "")}: skeleton and navigation script`, () => {
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /id="nav-skeleton"/);
    for (const kind of ["home", "list", "article"]) assert.match(html, new RegExp(`data-kind="${kind}"`));
    const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)];
    assert.equal(scripts.length, 1, "one script file for the whole site (menu, navigation, prefetch)");
  });
}

test("pages are cacheable in the browser with stale-while-revalidate, and hashed files stay immutable", () => {
  const headers = fs.readFileSync(path.join(DIST, "_headers"), "utf8");
  for (const route of ["/", "/projects", "/projects/*", "/writing", "/writing/*", "/experience", "/colophon"]) {
    assert.match(headers, new RegExp(`\\n${route.replace(/[/*]/g, "\\$&")}\\n  Cache-Control: public, max-age=60, stale-while-revalidate=600`), route);
  }
  assert.match(headers, /\/_astro\/\*\n  Cache-Control: public, max-age=31536000, immutable/);
});
