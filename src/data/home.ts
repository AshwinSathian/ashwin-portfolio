// Home page copy. Every fact here already appears in projects.ts,
// experience.ts or a post in src/content/writing; nothing new is asserted.

export const INTRO = {
  greeting: "Hi, I’m Ashwin.",
  paragraphs: [
    "I’m Ashwin Sathian, a senior full-stack engineer in Kochi, Kerala, India. I joined Penny Software as a founding engineer and stayed five years, through its growth into a procurement platform with $1B+ in GTV, owning its platform architecture and mentoring the 12-person team that built it.",
    "The part of the job I like most is the start: a customer describes a problem, nobody has written it down yet, and I get to turn it into a spec. Then I build it, schema to UI.",
    "On my own time I make tools and libraries, and I write about them, including the parts I got wrong.",
  ],
} as const;

/** The short version of each project, told as what prompted it. */
export const STORIES: Record<string, string> = {
  weir:
    "Weir began with a caching layer that had three weaknesses: a full flush sent every request to the origin at once, nothing held back a flood, and entries stored together expired together. Weir is the Go library that fixes all three in one place.",
  booklet:
    "Sharing a Markdown file usually means sending the raw file or pasting it into a tool that mangles it. Booklet turns it into a page with a link, from a browser, a terminal, CI or an AI assistant.",
  brnr:
    "Private messengers often still keep accounts or history on a server somewhere. BRNR keeps neither: a code starts a chat between two people, messages are end-to-end encrypted, and every one expires after 24 hours.",
  wayfarer:
    "API clients ask you to trust their accounts with the secrets you paste in. Wayfarer opens in a browser tab with no account, keeps secrets in a vault encrypted on your machine, and says what the browser will do to a request before you send it.",
  "ngx-runtime-i18n":
    "Angular’s built-in i18n needs a separate build per language. This library swaps languages at runtime behind a signal, without breaking server rendering.",
  typester:
    "A ground-up rebuild of a 2018 Angular 7 typing game. Every decision in the new version traces back to a defect in the old one, and each is written down with its reasoning.",
  "better-auth-mongoose":
    "Better Auth’s MongoDB adapter skips Mongoose, so populate() breaks on anything it creates. This adapter uses real Mongoose models, closing a gap open on Better Auth’s GitHub since February 2025.",
  "humanize-writing-skill":
    "Claude’s prose is easy to spot, and banned-word lists go stale. This Claude Code skill shapes the writing while it happens, and every blind test round is published, including one it lost.",
};

/** Home groups the projects by kind; every slug must exist in PROJECTS. */
export const GROUPS: { title: string; slugs: string[] }[] = [
  { title: "Products", slugs: ["booklet", "brnr", "wayfarer", "typester"] },
  {
    title: "Libraries and tools",
    slugs: ["weir", "ngx-runtime-i18n", "better-auth-mongoose", "humanize-writing-skill"],
  },
];

/** The career in prose, with durations. Facts from experience.ts. */
export const WORK = [
  "Eight years so far. Most of it, five years from 2020 to 2025, was at Penny Software, where I went from full-stack developer to product specialist to lead engineer, owning the platform architecture of a procurement SaaS and mentoring the 12-person team building it.",
  "Before that I spent a year at WeCP building SaaS platforms for technical hiring, and six months at Manaraah moving construction clients off legacy systems. My first job, in 2018, was at Reubro International. Most recently I spent four months as Lead Engineer at HighLevel, owning Funnels, Websites, and Webinars.",
];

/** One tone per kind of project, used the same way on the home tiles and on each project page. */
export function toneForProject(slug: string): "orange" | "teal" {
  return GROUPS[0]!.slugs.includes(slug) ? "orange" : "teal";
}
