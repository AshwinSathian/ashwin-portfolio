import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

// Greyscale on purpose: the site has no hue, so code is told apart by
// brightness alone.
const THEME = {
  name: "lumen",
  type: "dark" as const,
  colors: { "editor.foreground": "#d4d4d4", "editor.background": "#0c0c0d" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6f6f6f", fontStyle: "italic" } },
    { scope: ["string", "string.template", "constant.other.symbol"], settings: { foreground: "#a6a6a6" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier"], settings: { foreground: "#ffffff", fontStyle: "bold" } },
    { scope: ["entity.name.function", "support.function", "entity.name.type", "entity.name.class", "entity.name.tag"], settings: { foreground: "#f5f5f4" } },
    { scope: ["constant.numeric", "constant.language", "variable.language"], settings: { foreground: "#f5f5f4" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#8a8a8a" } },
  ],
};

const ALIASES: Record<string, string> = { ts: "typescript", js: "javascript", sh: "bash", shell: "bash" };

let instance: Promise<HighlighterCore> | undefined;

// JavaScript regex engine and explicit grammars: no WASM, so this is safe to
// bundle for a Cloudflare Worker even though posts are rendered at build time.
function getHighlighter() {
  instance ??= createHighlighterCore({
    themes: [THEME],
    langs: [
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/json.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return instance;
}

/** Returns highlighted `<pre>` HTML, or null when the language is not loaded. */
export async function highlight(code: string, lang: string | undefined): Promise<string | null> {
  if (!lang) return null;
  const highlighter = await getHighlighter();
  const resolved = ALIASES[lang] ?? lang;
  if (!highlighter.getLoadedLanguages().includes(resolved)) return null;
  return highlighter.codeToHtml(code, { lang: resolved, theme: "lumen" });
}
