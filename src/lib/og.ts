import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { truncate } from "./text";

// Satori reads TTF/OTF/WOFF, not WOFF2, so the cards use the static fontsource
// files. This runs at build time only; the cards are plain PNGs on the edge.
const file = (pkg: string, name: string) =>
  fs.readFileSync(path.resolve("node_modules/@fontsource", pkg, "files", name));

const fonts = [
  { name: "Figtree", data: file("figtree", "figtree-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Figtree", data: file("figtree", "figtree-latin-500-normal.woff"), weight: 500 as const, style: "normal" as const },
  { name: "Bricolage Grotesque", data: file("bricolage-grotesque", "bricolage-grotesque-latin-700-normal.woff"), weight: 700 as const, style: "normal" as const },
];

const C = { night: "#15120f", fg: "#f1eadc", fg2: "#c3b8a6", fg3: "#9a8f7d", orange: "#f47a38", yellow: "#ffc849", teal: "#18b6aa", blue: "#6598f8" };
export type Tone = "orange" | "yellow" | "teal" | "blue";

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style: { display: "flex", ...style }, children },
});

const pill = (label: string, color: string) =>
  h("div", { background: color, color: C.night, borderRadius: 999, padding: "10px 26px", fontFamily: "Bricolage Grotesque", fontWeight: 700, fontSize: 26 }, label);

async function png(tree: Node): Promise<Buffer> {
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

/** The home card: the greeting, and the four tones as a row of folder tabs. */
export function siteCard() {
  return png(
    h("div", { width: 1200, height: 630, boxSizing: "border-box", flexDirection: "column", justifyContent: "space-between", padding: "56px 80px 0", background: C.night, fontFamily: "Figtree" }, [
      h("div", { flexDirection: "column" }, [
        h("div", { fontFamily: "Bricolage Grotesque", fontWeight: 700, fontSize: 132, letterSpacing: "-0.045em", lineHeight: 0.95, color: C.fg }, "Hi, I’m Ashwin."),
        h("div", { marginTop: 28, fontSize: 34, color: C.fg2, maxWidth: 900 }, "I turn a problem into a spec, then I ship it."),
      ]),
      h("div", { flexDirection: "column", gap: 18 }, [
        h("div", { justifyContent: "space-between", fontSize: 22, color: C.fg3 }, [
          h("span", {}, "Senior full-stack engineer · Kochi, India"),
          h("span", {}, "ashwinsathian.com"),
        ]),
        h("div", { gap: 8 }, (["orange", "yellow", "teal", "blue"] as Tone[]).map((t) => h("div", { flex: 1, height: 32, background: C[t], borderRadius: "18px 18px 0 0" }))),
      ]),
    ]),
  );
}

/** A section, project or post card. */
export function titleCard({ title, description, label, tone }: { title: string; description?: string; label: string; tone: Tone }) {
  const t = truncate(title, 72);
  return png(
    h("div", { width: 1200, height: 630, boxSizing: "border-box", flexDirection: "column", justifyContent: "space-between", padding: "56px 80px 0", background: C.night, fontFamily: "Figtree" }, [
      h("div", {}, [pill(label, C[tone])]),
      h("div", { flexDirection: "column", gap: 18 }, [
        h("div", { fontFamily: "Bricolage Grotesque", fontWeight: 700, fontSize: t.length > 40 ? 58 : 84, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.fg, maxWidth: 1040 }, t),
        description ? h("div", { fontSize: 26, lineHeight: 1.35, color: C.fg2, maxWidth: 980, lineClamp: 2 }, description) : h("div", {}, ""),
      ]),
      h("div", { flexDirection: "column", gap: 14 }, [
        h("div", { justifyContent: "space-between", alignItems: "center" }, [
          h("span", { fontFamily: "Bricolage Grotesque", fontWeight: 700, fontSize: 28, color: C.fg }, "Ashwin Sathian"),
          h("span", { fontWeight: 500, fontSize: 20, color: C.fg3 }, "ashwinsathian.com"),
        ]),
        h("div", { height: 24, background: C[tone], borderRadius: "14px 14px 0 0" }, ""),
      ]),
    ]),
  );
}
