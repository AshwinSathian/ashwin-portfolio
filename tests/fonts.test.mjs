// Guards the first paint and the one-typeface rule. Run after the build (`npm test`).
// A failure names the rule. Budgets are ceilings: raise one only with a line in DESIGN.md saying why.
// What was measured (Lighthouse mobile, devtools throttling, median of 5): inlining the CSS and cutting the font took the
// first contentful paint of / from 1470 to about 670 ms; a font preload made it slower, so there is none.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const DIST = "dist";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const pages = walk(DIST).filter((f) => f.endsWith(".html") && !f.endsWith("404.html"));
const gz = (b) => zlib.gzipSync(b).length;
const KB = 1024;
// A font above ~42 KB takes a third TCP round trip to arrive, so the Bricolage ceiling sits well under it.
const BUDGET = { homeHtmlGz: 18 * KB, bricolage: 30 * KB, mono: 12 * KB };

const cut = (name) => new Set(JSON.parse(fs.readFileSync(`src/fonts/${name}.codepoints.json`, "utf8")));
const bricolage = cut("bricolage-grotesque");
const mono = cut("jetbrains-mono");
// Drawn by the system font on purpose: JetBrains Mono's Latin cut has no arrow, and a post uses one inside inline code.
const CODE_FALLBACK = new Set(["→"]);
const decode = (h) =>
  h.replace(/&#x([0-9a-f]+);/gi, (_, x) => String.fromCodePoint(parseInt(x, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&(amp|lt|gt|quot|apos|nbsp);/g, " ");

test("one text face: Bricolage Grotesque, and mono only for code", () => {
  const files = fs.readdirSync(path.join(DIST, "_astro")).filter((f) => /\.(woff2?|ttf|otf)$/.test(f));
  assert.deepEqual(files.map((f) => f.split(".")[0]).sort(), ["bricolage-grotesque", "jetbrains-mono"]);
  for (const f of files) {
    const size = fs.statSync(path.join(DIST, "_astro", f)).size;
    const max = f.startsWith("bricolage") ? BUDGET.bricolage : BUDGET.mono;
    assert.ok(size <= max, `${f} is ${size} bytes, over ${max}`);
  }
  assert.ok(!/figtree/i.test(pages.map((p) => fs.readFileSync(p, "utf8")).join("\n")), "Figtree is still referenced");
});

test("no page links a stylesheet or preloads a font", () => {
  for (const p of pages) {
    const html = fs.readFileSync(p, "utf8");
    assert.ok(!/<link[^>]+rel="stylesheet"/.test(html), `${p} links a stylesheet: the CSS must stay inline (build.inlineStylesheets)`);
    assert.ok(/<style[^>]*>[^<]{1000,}/.test(html), `${p} has no inline CSS`);
    assert.ok(!/<link[^>]+rel="preload"[^>]+as="font"/.test(html), `${p} preloads a font: measured slower to first paint`);
  }
});

test("home page HTML with its CSS fits the budget", () => {
  const n = gz(fs.readFileSync(path.join(DIST, "index.html")));
  assert.ok(n <= BUDGET.homeHtmlGz, `index.html is ${(n / KB).toFixed(1)} KB gzipped, over ${BUDGET.homeHtmlGz / KB}`);
});

test("every character on every page is in the font cut", () => {
  for (const p of pages) {
    const html = fs.readFileSync(p, "utf8");
    const codeChars = new Set([...html.matchAll(/<pre[^>]*>([\s\S]*?)<\/pre>|<code[^>]*>([\s\S]*?)<\/code>/g)].flatMap((m) => [...decode((m[1] ?? m[2]).replace(/<[^>]+>/g, ""))]));
    const text = decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " "));
    const missing = [...new Set([...text].filter((c) => !/\s/.test(c) && !bricolage.has(c.codePointAt(0)) && !(codeChars.has(c) && (mono.has(c.codePointAt(0)) || CODE_FALLBACK.has(c)))))];
    assert.deepEqual(missing, [], `${p}: not in the Bricolage cut (add to tools/cut-fonts.sh and rerun it): ${missing.join(" ")}`);
    const missingMono = [...codeChars].filter((c) => !/\s/.test(c) && !mono.has(c.codePointAt(0)) && !CODE_FALLBACK.has(c));
    assert.deepEqual(missingMono, [], `${p}: not in the mono cut: ${missingMono.join(" ")}`);
  }
});
