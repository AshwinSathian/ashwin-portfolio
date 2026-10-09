import ArrowLink from "@/components/ArrowLink";
import Hero from "@/components/Hero";
import ProjectPanel from "@/components/ProjectPanel";
import ProjectRow from "@/components/ProjectRow";
import { RoleList } from "@/components/RoleRows";
import Section from "@/components/Section";
import PostList from "@/components/writing/PostList";
import { PROJECTS } from "@/app/data/projects";
import { RECORD } from "@/app/data/record";
import { SITE } from "@/app/data/site";
import { getAllPosts } from "@/lib/writing";

const HOME_HIDDEN = ["darkframe", "typester"];
const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function Page() {
  const featured = PROJECTS.filter((p) => p.featured);
  // Home shows a short list; these stay on /projects only.
  const rest = PROJECTS.filter((p) => !p.featured && !HOME_HIDDEN.includes(p.slug));
  const posts = getAllPosts().slice(0, 3);
  const total = NUMBER_WORDS[PROJECTS.length] ?? String(PROJECTS.length);

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.website}/#profilepage`,
    url: SITE.website,
    name: `${SITE.name}, Engineer`,
    mainEntity: { "@id": `${SITE.website}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <Hero />

      <Section
        id="work"
        index="01"
        title="Selected work"
        intro={`${capitalize(total)} independent products shipped on my own time, each documented against the actual repo. These ${NUMBER_WORDS[featured.length]} go deepest.`}
      >
        <div className="flex flex-col gap-20 lg:gap-36">
          {featured.map((project, i) => (
            <ProjectPanel key={project.slug} project={project} index={i} flip={i % 2 === 1} priority={i === 0} />
          ))}
        </div>

        <div className="mt-20 lg:mt-36">
          <h3 className="reveal mb-4 text-small text-fg-3">More shipped</h3>
          <div className="flex flex-col border-b border-line">
            {rest.map((project, i) => (
              <ProjectRow
                key={project.slug}
                href={`/projects/${project.slug}`}
                name={project.name}
                description={project.tagline}
                status={project.status}
                marker={String(featured.length + i + 1).padStart(2, "0")}
                as="h4"
              />
            ))}
          </div>
          <ArrowLink href="/projects" className="mt-6">
            All {total} projects
          </ArrowLink>
        </div>
      </Section>

      <Section id="record" index="02" title="The record">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="reveal flex flex-col gap-5 lg:col-span-6">
            {RECORD.paragraphs.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-[1.1875rem] leading-[1.55] text-fg" : "text-fg-2"}>
                {paragraph}
              </p>
            ))}
            <p className="text-small text-fg-3">{RECORD.footnote}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 self-start lg:col-span-6">
            {RECORD.figures.map((figure) => (
              <div key={figure.value} className="reveal flex flex-col-reverse gap-2 border-t border-line-strong pt-4">
                <dt className="text-small text-fg-2">{figure.label}</dt>
                <dd className="text-display-m font-semibold tracking-[-0.03em] text-fg">
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 lg:mt-24">
          <div className="border-b border-line">
            <RoleList />
          </div>
          <ArrowLink href="/experience" className="mt-6">
            Full experience
          </ArrowLink>
        </div>
      </Section>

      {posts.length > 0 && (
        <Section
          id="writing"
          index="03"
          title="Writing"
          intro="Technical notes from the libraries and tools I build, including what I got wrong."
        >
          <div className="border-b border-line">
            <PostList posts={posts} as="h3" />
          </div>
          <ArrowLink href="/writing" className="mt-6">
            All writing
          </ArrowLink>
        </Section>
      )}

      <section aria-labelledby="contact-heading" className="relative overflow-clip border-t border-line">
        <div aria-hidden className="glow -bottom-[70%] left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2" />
        <div className="shell relative py-24 lg:py-44">
          <h2
            id="contact-heading"
            className="reveal text-display-xl font-bold tracking-[-0.045em]"
          >
            Let&apos;s talk.
          </h2>
          <div className="reveal mt-10 flex flex-col gap-6 border-t border-line pt-6 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
            <a
              href={`mailto:${SITE.email}`}
              className="flex min-h-11 items-center text-[clamp(1.125rem,4.6vw,2rem)] font-medium tracking-[-0.02em] text-fg"
            >
              <span className="link">{SITE.email}</span>
            </a>
            <p className="max-w-xs text-small text-fg-2">
              Engineering, ideas, or interesting problems welcome.
            </p>
            <div className="flex gap-x-8">
              <ArrowLink href={SITE.linkedin} external>
                LinkedIn
              </ArrowLink>
              <ArrowLink href={SITE.github} external>
                GitHub
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
