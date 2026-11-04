// Home page copy. Every fact here already appears in projects.ts,
// experience.ts or a post in src/content/writing; nothing new is asserted.

export const INTRO = {
  greeting: "Hi, I’m Ashwin.",
  paragraphs: [
    "I build software in Kochi, Kerala. I joined Penny Software as a founding engineer and stayed five years, through its growth into a procurement platform with $1B+ in GTV, owning its platform architecture and mentoring the 12-person team that built it.",
    "The part of the job I like most is the start: a customer describes a problem, nobody has written it down yet, and I get to turn it into a spec. Then I build it, schema to UI.",
    "On my own time I make tools and libraries, and I write about them, including the parts I got wrong.",
  ],
} as const;

/** Dated things, newest first. Each links to where the proof lives. */
export const LATELY: { when: string; text: string; href: string }[] = [
  {
    when: "Oct 2026",
    text: "Released Weir 1.2.0, so clients waiting on a large response share one origin download.",
    href: "/projects/weir",
  },
  {
    when: "Oct 2026",
    text: "Tagged Weir 1.0.0, fifteen days after its first design document, and wrote up why I built it.",
    href: "/writing/three-gaps-in-a-caching-layer-and-the-go-library-i-built-to-close-them",
  },
  {
    when: "Oct 2026",
    text: "Audited my own writing skill against newer research and rewrote its rules.",
    href: "/writing/the-ai-tells-moved-my-tool-for-avoiding-them-hadnt",
  },
  {
    when: "Aug 2026",
    text: "Worked out how to mark an answer right when nobody agrees how to spell it, for Etha Padam, a daily Malayalam movie game I’m building.",
    href: "/writing/how-do-you-check-an-answer-when-nobody-agrees-how-to-spell-it",
  },
  {
    when: "May 2026",
    text: "Moved Booklet off Cloudflare Workers and onto a self-hosted process behind a tunnel.",
    href: "/projects/booklet",
  },
];

/** The short version of each project, told as what prompted it. */
export const STORIES: Record<string, string> = {
  weir:
    "Weir began with a caching layer that had three weaknesses: a full flush sent every request to the origin at once, nothing held back a flood, and entries stored together expired together. Weir is the Go library that fixes all three in one place.",
  booklet:
    "Sharing a Markdown file usually means sending the raw file or pasting it into a tool that mangles it. Booklet turns it into a page with a link, from a browser, a terminal, CI or an AI assistant.",
  brnr:
    "Private messengers often still keep accounts or history on a server somewhere. BRNR keeps neither: a code starts a chat between two people, messages are end-to-end encrypted, and every one expires after 24 hours.",
  wayfarer:
    "API clients ask you to trust their accounts with the secrets you paste in. Wayfarer runs in your browser tab with no account at all, and keeps secrets in a vault encrypted on your machine.",
  "ngx-runtime-i18n":
    "Angular’s built-in i18n needs a separate build per language. This library swaps languages at runtime behind a signal, without breaking server rendering.",
  "humanize-writing-skill":
    "Claude’s prose is easy to spot, and banned-word lists go stale. This Claude Code skill shapes the writing while it happens, and every blind test round is published, including one it lost.",
};
