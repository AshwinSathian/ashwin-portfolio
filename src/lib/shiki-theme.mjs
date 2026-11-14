// Dark theme on the site's tones: brightness carries structure, the four
// tone colours mark keywords, strings, functions and constants.
export const shikiTheme = {
  name: "kasavu-tones",
  type: "dark",
  colors: { "editor.foreground": "#e6dfd0", "editor.background": "#1c1814" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#968b7a" } },
    { scope: ["string", "string.template", "constant.other.symbol"], settings: { foreground: "#4fd3c7" } },
    { scope: ["keyword", "storage", "storage.type", "storage.modifier"], settings: { foreground: "#ff9a5c" } },
    { scope: ["entity.name.function", "support.function"], settings: { foreground: "#8fb4fb" } },
    { scope: ["entity.name.type", "entity.name.class", "entity.name.tag"], settings: { foreground: "#ffd36b" } },
    { scope: ["constant.numeric", "constant.language", "variable.language"], settings: { foreground: "#ffd36b" } },
    { scope: ["punctuation", "meta.brace", "keyword.operator"], settings: { foreground: "#a79c8a" } },
  ],
};
