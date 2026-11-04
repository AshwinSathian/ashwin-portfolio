import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import { SITE } from "@/app/data/site";

const description =
  "How ashwinsathian.com is built: Next.js 16 on Cloudflare Workers, one serif typeface, a palette from the kasavu sari, and CSS-only motion.";

const ogImageUrl = `/og?title=Colophon&description=${encodeURIComponent(description)}&label=Colophon`;

export const metadata: Metadata = {
  title: "Colophon",
  description,
  alternates: { canonical: `${SITE.website}/colophon` },
  openGraph: {
    title: "Colophon | Ashwin Sathian",
    description,
    url: `${SITE.website}/colophon`,
    type: "website",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "Colophon | Ashwin Sathian" }],
  },
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Stack",
    body: [
      "The site is Next.js 16 and React 19, styled with Tailwind CSS 4. Nearly every page is rendered to static HTML at build time; the one dynamic route draws the social-card images.",
      "It runs on Cloudflare Workers through OpenNext. Static files are served straight from Cloudflare’s edge, and anything with a hashed filename is cached for a year.",
    ],
  },
  {
    title: "Writing",
    body: [
      "Posts are Markdown files in the repository, parsed with gray-matter and marked. Code blocks are highlighted at build time with Shiki, using its JavaScript regex engine so nothing has to load WebAssembly in the Worker. Every post is published here first and only here, and there is an RSS feed.",
    ],
  },
  {
    title: "Type and colour",
    body: [
      "One typeface, Newsreader, an open-source reading serif from Production Type. It has an optical-size axis, so body text gets the cut meant for reading and headings get the sharper display cut without a second font. Code uses your system’s monospace.",
      "The colours come from the kasavu sari of Kerala: off-white cotton with a gold border, set here on a warm dark ground. The gold is used for one thing at a time. There is no light theme.",
      "The favicon is an italic Newsreader “a”, traced from the font’s own outlines.",
    ],
  },
  {
    title: "Motion and the rest",
    body: [
      "Motion is CSS only and stays small: headings fade in, and a few things rise into place as you scroll. If your system asks for reduced motion, all of it turns off. Every page is complete without JavaScript.",
      "Project facts are checked against each project’s repository when they are written.",
    ],
  },
];

export default function ColophonPage() {
  return (
    <>
      <PageHeader title="Colophon." intro="How this site is put together, and why." />
      <div className="shell flex flex-col gap-14 pb-24 lg:pb-40">
        {SECTIONS.map((section) => (
          <section key={section.title} aria-labelledby={`c-${section.title}`} className="grid gap-4 lg:grid-cols-12 lg:gap-16">
            <h2 id={`c-${section.title}`} className="reveal text-title font-medium text-fg lg:col-span-3">
              {section.title}
            </h2>
            <div className="flex max-w-2xl flex-col gap-4 lg:col-span-9">
              {section.body.map((p, i) => (
                <p key={i} className="reveal text-fg-2">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
