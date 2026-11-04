import Image from "next/image";
import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import KochiTime from "@/components/home/KochiTime";
import { RoleList } from "@/components/RoleRows";
import PostList from "@/components/writing/PostList";
import { INTRO, LATELY, STORIES } from "@/app/data/home";
import { PROJECTS, type Project } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { capitalize, numberWord } from "@/lib/text";
import { getAllPosts } from "@/lib/writing";

export default function Page() {
  const featured = PROJECTS.filter((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);
  const posts = getAllPosts().slice(0, 4);
  const total = numberWord(PROJECTS.length);

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE.website}/#profilepage`,
    url: SITE.website,
    name: `${SITE.name}, senior full-stack engineer`,
    mainEntity: { "@id": `${SITE.website}/#person` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />

      {/* Intro: who, where, what I like doing. */}
      <section aria-labelledby="hello-heading" className="shell pb-20 pt-28 lg:pb-32 lg:pt-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <h1 id="hello-heading" className="load-rise text-display-xl font-medium tracking-[-0.015em] text-fg">
              {INTRO.greeting}
            </h1>
            <div className="load-rise flex flex-col gap-5" style={{ "--d": "150ms" } as React.CSSProperties}>
              {INTRO.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-title leading-[1.5] text-fg" : "text-fg-2"}>
                  {p}
                </p>
              ))}
            </div>
            <ul className="load-rise mt-2 flex flex-wrap gap-x-7 gap-y-1" style={{ "--d": "300ms" } as React.CSSProperties}>
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center text-zari">
                  <span className="link">{SITE.email}</span>
                </a>
              </li>
              <li>
                <ArrowLink href={SITE.github} external>GitHub</ArrowLink>
              </li>
              <li>
                <ArrowLink href={SITE.linkedin} external>LinkedIn</ArrowLink>
              </li>
              <li>
                <ArrowLink href={SITE.resumePath} external>Résumé</ArrowLink>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Lately: a dated log. */}
      <section aria-labelledby="lately-heading" className="shell py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 id="lately-heading" className="reveal text-display-m font-medium tracking-[-0.015em] lg:col-span-3">
            Lately
          </h2>
          <ol className="flex flex-col border-b border-line lg:col-span-9">
            {LATELY.map((item) => (
              <li key={item.text} className="reveal">
                <Link
                  href={item.href}
                  className="row group grid gap-x-8 gap-y-1 rounded-control border-t border-line py-5 sm:grid-cols-[6.5rem_1fr_auto] sm:items-baseline"
                >
                  <span className="text-meta tabular-nums text-zari">{item.when}</span>
                  <span className="text-fg">{item.text}</span>
                  <span aria-hidden className="arrow hidden text-fg-3 sm:block">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Things I've made: each project as a short story with one picture. */}
      <section aria-labelledby="made-heading" className="shell py-16 lg:py-24">
        <div className="mb-12 grid gap-4 lg:mb-20 lg:grid-cols-12 lg:gap-16">
          <h2 id="made-heading" className="reveal text-display-m font-medium tracking-[-0.015em] lg:col-span-3">
            Things I’ve made
          </h2>
          <p className="reveal max-w-xl text-fg-2 lg:col-span-9">
            {capitalize(total)} projects, built on my own time. These six have the most to them.
          </p>
        </div>

        <div className="flex flex-col gap-16 lg:gap-28">
          {featured.map((project, i) => (
            <Story key={project.slug} project={project} flip={i % 2 === 1} />
          ))}
        </div>

        <div className="mt-16 grid gap-4 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          <h3 className="reveal text-title font-medium text-fg lg:col-span-3">And also</h3>
          <ul className="flex flex-col gap-3 lg:col-span-9">
            {others.map((p) => (
              <li key={p.slug} className="reveal">
                <Link href={`/projects/${p.slug}`}>
                  <span className="link text-fg">{p.name}</span>
                  <span className="text-fg-2">: {p.tagline}</span>
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <ArrowLink href="/projects">All {total} projects</ArrowLink>
            </li>
          </ul>
        </div>
      </section>

      {/* Work: the career, briefly. */}
      <section aria-labelledby="work-heading" className="shell py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 id="work-heading" className="reveal text-display-m font-medium tracking-[-0.015em] lg:col-span-3">
            Work
          </h2>
          <div className="flex flex-col gap-8 lg:col-span-9">
            <p className="reveal max-w-2xl text-fg">
              Eight years and seven roles, from junior programmer to owning platform architecture at Penny
              Software, where I mentored a 12-person team. Most recently I spent four months as Lead Engineer for
              Funnels, Websites, and Webinars at HighLevel.
            </p>
            <div className="border-b border-line">
              <RoleList />
            </div>
            <ArrowLink href="/experience">Full experience</ArrowLink>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section aria-labelledby="writing-heading" className="shell py-16 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-3 lg:col-span-3">
              <h2 id="writing-heading" className="reveal text-display-m font-medium tracking-[-0.015em]">
                Writing
              </h2>
              <p className="reveal text-small text-fg-2">Notes from the things I build.</p>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-9">
              <div className="border-b border-line">
                <PostList posts={posts} as="h3" />
              </div>
              <ArrowLink href="/writing">All writing</ArrowLink>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="contact-heading" className="shell py-20 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 id="contact-heading" className="reveal text-display-m font-medium tracking-[-0.015em] lg:col-span-3">
            Say hello
          </h2>
          <div className="flex flex-col gap-5 lg:col-span-9">
            <p className="reveal max-w-2xl text-fg-2">
              Email is the quickest way to reach me. Write about a system you’re building or a problem you’re
              stuck on. I’m in Kochi, on IST. <KochiTime />
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="reveal self-start text-[clamp(1.75rem,5vw,3.5rem)] italic leading-tight text-zari"
            >
              <span className="link">{SITE.email}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Story({ project, flip }: { project: Project; flip: boolean }) {
  const href = `/projects/${project.slug}`;
  const media = project.media;
  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
      <div className={`flex flex-col gap-4 lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
        <h3 className="reveal flex flex-wrap items-baseline gap-x-3">
          <Link href={href} className="text-display-m font-medium tracking-[-0.015em] text-fg">
            <span className="link">{project.name}</span>
          </Link>
          <span className="text-small italic text-fg-3">{project.category}</span>
        </h3>
        <p className="reveal text-fg-2">{STORIES[project.slug] ?? project.tagline}</p>
        <ArrowLink href={href} className="reveal">
          {project.caseStudy ? "How I built it" : "More about it"}
          <span className="sr-only">: {project.name}</span>
        </ArrowLink>
      </div>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden
        className={`reveal-media block overflow-hidden rounded-panel bg-surface lg:col-span-7 ${flip ? "lg:order-1" : ""}`}
      >
        {media.kind === "screenshot" ? (
          <Image
            src={media.src.replace(/\.png$/, ".webp")}
            alt=""
            width={media.width}
            height={media.height}
            sizes="(min-width: 1200px) 640px, (min-width: 1024px) 55vw, 100vw"
            className="aspect-[16/10] w-full object-cover object-top"
          />
        ) : (
          <pre className="code aspect-[16/10] overflow-hidden p-6 text-fg-2">
            <code>{media.snippet.split("\n").slice(0, 14).join("\n")}</code>
          </pre>
        )}
      </Link>
    </article>
  );
}
