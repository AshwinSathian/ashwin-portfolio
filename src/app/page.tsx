import Link from "next/link";
import ArrowLink from "@/components/ArrowLink";
import PinnedWork from "@/components/home/PinnedWork";
import WeirZoom from "@/components/home/WeirZoom";
import { RECENT_EXPERIENCE } from "@/app/data/experience";
import { PROJECTS } from "@/app/data/projects";
import { SITE } from "@/app/data/site";
import { numberWord } from "@/lib/text";
import { getAllPosts } from "@/lib/writing";

export default function Page() {
  const featured = PROJECTS.filter((p) => p.featured);
  const posts = getAllPosts().slice(0, 3);
  const total = numberWord(PROJECTS.length);
  const [user, domain] = SITE.email.split("@");

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

      <PinnedWork projects={featured} total={total} />

      <WeirZoom />

      {/* Experience: one statement, then every role at one type size. */}
      <section aria-labelledby="experience-heading" id="experience" className="bg-surface py-24 lg:py-40">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <h2
              id="experience-heading"
              className="reveal text-display-l font-semibold tracking-[-0.025em] lg:col-span-5"
            >
              Eight years, seven roles.
            </h2>
            <p className="reveal-late text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.35] tracking-[-0.01em] text-fg lg:col-span-7">
              Five years as a founding engineer at Penny Software, a procurement platform that grew past $1B in
              GTV. I mentored its 12-person team and kept queries under 200ms at that scale.
            </p>
          </div>

          <table className="mt-16 w-full text-left lg:mt-24">
            <caption className="sr-only">Roles, newest first</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Company</th>
                <th scope="col">Dates</th>
              </tr>
            </thead>
            <tbody className="text-[clamp(1.0625rem,2vw,1.75rem)] leading-[1.25] tracking-[-0.015em]">
              {RECENT_EXPERIENCE.map((item) => (
                <tr
                  key={`${item.company}-${item.role}`}
                  className="reveal grid grid-cols-2 gap-x-4 py-3 md:table-row md:py-0"
                >
                  <th scope="row" className="col-span-2 font-medium text-fg md:w-[46%] md:py-3 md:pr-6">
                    {item.role}
                  </th>
                  <td className="text-small text-fg-2 md:w-[28%] md:py-3 md:text-[length:inherit]">{item.company}</td>
                  <td className="text-right text-small tabular-nums text-fg-2 md:py-3 md:text-[length:inherit]">
                    {item.dates}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ArrowLink href="/experience" className="mt-10">
            Full experience
          </ArrowLink>
        </div>
      </section>

      {posts.length > 0 && (
        <section aria-labelledby="writing-heading" className="shell py-24 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-5 lg:col-span-4">
              <h2 id="writing-heading" className="reveal text-display-l font-semibold tracking-[-0.025em]">
                Writing
              </h2>
              <p className="reveal-late max-w-sm text-fg-2">
                Technical notes from the libraries and tools I build, including what I got wrong.
              </p>
              <ArrowLink href="/writing">All writing</ArrowLink>
            </div>
            <ul className="flex flex-col gap-2 lg:col-span-8">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/writing/${post.slug}`}
                    className="row reveal flex flex-col gap-2 rounded-control py-6"
                  >
                    <h3 className="text-[clamp(1.125rem,2.1vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-fg">
                      {post.title}
                    </h3>
                    <p className="text-small tabular-nums text-fg-2">
                      {post.formattedDate} · {post.readingTime} min read
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Contact on the inverse field: the address is the display type. */}
      <section aria-labelledby="contact-heading" className="paper">
        <div className="shell flex flex-col gap-14 py-20 lg:gap-20 lg:py-32">
          <div className="flex max-w-xl flex-col gap-3">
            <h2 id="contact-heading" className="text-display-m font-semibold tracking-[-0.025em]">
              Let’s talk.
            </h2>
            <p className="text-[1.25rem] leading-[1.4]">
              Write about a system you’re building or a problem you’re stuck on.
            </p>
          </div>

          <a
            href={`mailto:${SITE.email}`}
            className="contact-mail block text-[clamp(2.5rem,9.2vw,8.25rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
          >
            {user}@
            <br />
            {domain}
          </a>

          <div className="flex flex-col gap-4 text-small sm:flex-row sm:items-end sm:justify-between">
            <p>Kochi, Kerala, India</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                  <span className="link">LinkedIn</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                  <span className="link">GitHub</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
              <li>
                <a href={SITE.resumePath} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center">
                  <span className="link">Résumé</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
