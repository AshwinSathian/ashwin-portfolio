"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/writing";
import { fadeInUp, stagger } from "@/lib/motion";

type Props = {
  posts: PostMeta[];
};

export default function PostList({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <motion.ol
      initial="hidden"
      animate="show"
      variants={stagger}
      className="mt-16 list-none"
      aria-label="Posts"
    >
      {posts.map((post) => (
        <motion.li key={post.slug} variants={fadeInUp}>
          <Link
            href={`/writing/${post.slug}`}
            className="group block border-t border-line py-8 last:border-b last:border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
              <div className="flex flex-col gap-1.5">
                <span className="font-ui text-[11px] font-medium uppercase tracking-[0.1em] text-ink-muted">
                  {post.formattedDate}
                  {post.draft && (
                    <span className="ml-3 rounded-full border border-line px-2 py-0.5 text-[10px] normal-case tracking-normal text-ink-muted">
                      Draft
                    </span>
                  )}
                </span>
                <h2 className="font-display text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-signal">
                  {post.title}
                </h2>
                <p className="font-body text-[15px] leading-[1.6] text-ink-muted">
                  {post.description}
                </p>
              </div>
              <div className="shrink-0 font-ui text-[13px] text-ink-muted md:text-right">
                {post.readingTime} min
              </div>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-3 py-0.5 font-ui text-[11px] text-ink-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        </motion.li>
      ))}
    </motion.ol>
  );
}
