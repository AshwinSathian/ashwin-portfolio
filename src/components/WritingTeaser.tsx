import Link from "next/link";
import { getAllPosts } from "@/lib/writing";

export default function WritingTeaser() {
  const posts = getAllPosts().slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <section
      id="writing"
      aria-labelledby="writing-teaser-heading"
      className="bg-canvas px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-label-3">
              Writing
            </p>
            <h2
              id="writing-teaser-heading"
              className="font-thin leading-none tracking-[-0.035em] text-label-1"
              style={{ fontSize: "clamp(36px, 5.5vw, 64px)" }}
            >
              Thinking out loud.
            </h2>
          </div>

          <div className="flex flex-col">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group flex items-start justify-between gap-6 border-t border-white/8 py-8 first:border-t-0 first:pt-0 transition-opacity duration-200 hover:opacity-80"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] text-label-4">{post.formattedDate}</p>
                  <h3 className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-label-1">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="max-w-2xl text-[15px] leading-[1.6] text-label-2">
                      {post.description}
                    </p>
                  )}
                </div>
                <span className="mt-1 shrink-0 text-[14px] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Read →
                </span>
              </Link>
            ))}
          </div>

          <Link
            href="/writing"
            className="w-fit text-[14px] text-label-3 transition-colors duration-200 hover:text-label-1"
          >
            All writing →
          </Link>
        </div>
      </div>
    </section>
  );
}
