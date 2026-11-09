import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import { GROUPS, INTRO, LATELY, STORIES, WORK } from "@/app/data/home";
import { PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { capitalize, numberWord } from "@/lib/text";
import { getAllPosts } from "@/lib/writing";

export default function Page() {
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
            <h1 id="hello-heading" className="load-rise font-display text-display-xl font-bold tracking-[-0.03em] text-fg">
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
          <h2 id="lately-heading" className="reveal font-display text-display-m font-bold tracking-[-0.03em] lg:col-span-3">
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

      {posts.length > 0 && (
        <section aria-labelledby="writing-heading" className="shell py-16 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-3 lg:col-span-3">
              <h2 id="writing-heading" className="reveal font-display text-display-m font-bold tracking-[-0.03em]">
                Writing
              </h2>
              <p className="reveal text-small text-fg-2">
                Notes from the things I build.{" "}
                <a href="/writing/feed.xml" className="text-fg-3 hover:text-fg-2">
                  <span className="link">RSS</span>
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-9">
              <ul className="flex flex-col border-b border-line">
                {posts.map((post) => (
                  <li key={post.slug} className="reveal">
                    <Link
                      href={`/writing/${post.slug}`}
                      className="row grid gap-x-8 gap-y-1 rounded-control border-t border-line py-5 sm:grid-cols-[6.5rem_1fr] sm:items-baseline"
                    >
                      <span className="text-meta tabular-nums text-fg-3">{monthYear(post.date)}</span>
                      <span className="flex flex-col gap-1">
                        <h3 className="font-display text-title font-semibold tracking-[-0.01em] leading-snug text-fg">{post.title}</h3>
                        <span className="text-small text-fg-2">{post.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ArrowLink href="/writing">All writing</ArrowLink>
            </div>
          </div>
        </section>
      )}

      {/* Things I've made: text first, grouped by kind. Pictures live on the project pages. */}
      <section aria-labelledby="made-heading" className="shell py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-3 lg:col-span-3">
            <h2 id="made-heading" className="reveal font-display text-display-m font-bold tracking-[-0.03em]">
              Things I’ve made
            </h2>
            <p className="reveal text-small text-fg-2">{capitalize(total)} projects, built on my own time.</p>
          </div>
          <div className="flex flex-col gap-14 lg:col-span-9">
            {GROUPS.map((group) => (
              <div key={group.title} className="flex flex-col gap-2">
                <h3 className="reveal font-sans text-small italic text-fg-3">{group.title}</h3>
                <ul className="flex flex-col">
                  {group.slugs.map((slug) => {
                    const p = PROJECTS.find((x) => x.slug === slug);
                    if (!p) return null;
                    return (
                      <li key={slug} className="reveal">
                        <Link
                          href={`/projects/${slug}`}
                          className="row flex flex-col gap-1.5 rounded-control border-t border-line py-5"
                        >
                          <span className="flex flex-wrap items-baseline gap-x-3">
                            <span className="font-display text-title font-semibold tracking-[-0.01em] text-fg">{p.name}</span>
                            <span className="text-small italic text-fg-3">{p.category}</span>
                            {p.status && <span className="text-small text-zari">{p.status}</span>}
                          </span>
                          <span className="max-w-3xl text-fg-2">{STORIES[slug] ?? p.tagline}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <ArrowLink href="/projects">All projects, with how each was built</ArrowLink>
          </div>
        </div>
      </section>

      {/* Work: the career in a paragraph, with durations. */}
      <section aria-labelledby="work-heading" className="shell py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 id="work-heading" className="reveal font-display text-display-m font-bold tracking-[-0.03em] lg:col-span-3">
            Work
          </h2>
          <div className="flex flex-col gap-6 lg:col-span-9">
            {WORK.map((p, i) => (
              <p key={i} className={`reveal max-w-3xl ${i === 0 ? "text-fg" : "text-fg-2"}`}>
                {p}
              </p>
            ))}
            <ArrowLink href="/experience">Every role, in detail</ArrowLink>
          </div>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="shell py-20 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <h2 id="contact-heading" className="reveal font-display text-display-m font-bold tracking-[-0.03em] lg:col-span-3">
            Say hello
          </h2>
          <div className="flex flex-col gap-5 lg:col-span-9">
            <p className="reveal max-w-2xl text-fg-2">
              Email is the quickest way to reach me. Write about a system you’re building or a problem you’re
              stuck on.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="reveal self-start font-display text-[clamp(1.75rem,5vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] text-zari"
            >
              <span className="link">{SITE.email}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

/** "2026-10-13" → "Oct 2026", matching the Lately dates. */
function monthYear(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}
