// Run after `astro build`. Checks what crawlers see: every page has one h1, a
// canonical, a sane title and description, parseable JSON-LD, and every
// internal link and image resolves to a file in dist/.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const DIST = "dist";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith(".html") && !f.endsWith("404.html"));
const exists = (url) => {
  const p = url.split("#")[0].split("?")[0];
  if (p === "/" || p === "") return true;
  return [p, `${p}.html`, `${p}/index.html`].some((c) => fs.existsSync(path.join(DIST, c)));
};

test("dist has pages", () => assert.ok(pages.length >= 20));

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const name = file.replace(DIST, "");
  test(`${name}: head`, () => {
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
    assert.ok(title.length > 10 && title.length <= 95, `title length ${title.length}: ${title}`);
    assert.ok(desc.length >= 60 && desc.length <= 160, `description length ${desc.length}`);
    assert.ok(!desc.endsWith("…"), "description was cut mid-sentence");
    assert.match(html, /<link rel="canonical" href="https:\/\/ashwinsathian\.com[^"]*"/);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "exactly one h1");
    assert.match(html, /<html lang="en"/);
  });
  test(`${name}: json-ld`, () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocks.length >= 2);
    for (const [, json] of blocks) JSON.parse(json);
  });
  test(`${name}: links and images`, () => {
    for (const [, href] of html.matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) {
      assert.ok(exists(href), `broken: ${href}`);
    }
    for (const [, alt] of html.matchAll(/<img[^>]*?alt="([^"]*)"/g)) assert.ok(alt.length > 0);
  });
}
