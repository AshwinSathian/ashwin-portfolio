"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { PostMeta } from "@/lib/writing";
import { fadeInUp, stagger } from "@/lib/motion";

type Props = {
  posts: PostMeta[];
};

export default function PostList({ posts }: Props) {
  if (posts.length === 0) {
    return (
      <p className="mt-16 text-[15px] text-label-3">Nothing published yet.</p>
    );
  }

  return (
    <motion.ol
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mt-16 list-none"
      aria-label="Posts"
    >
      {posts.map((post) => (
        <motion.li key={post.slug} variants={fadeInUp}>
          <Link
            href={`/writing/${post.slug}`}
            className="group block border-t border-white/6 py-8 last:border-b last:border-white/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-label-4">
                  {post.formattedDate}
                  {post.draft && (
                    <span className="ml-3 rounded-full border border-white/15 px-2 py-0.5 text-[10px] normal-case tracking-normal text-label-3">
                      Draft
                    </span>
                  )}
                </span>
                <h2 className="text-[17px] font-medium leading-snug tracking-[-0.01em] text-label-1 transition-colors duration-200 group-hover:text-accent">
                  {post.title}
                </h2>
                <p className="text-[15px] leading-[1.6] text-label-3">
                  {post.description}
                </p>
              </div>

              <div className="shrink-0 text-[13px] text-label-4 md:text-right">
                {post.readingTime} min
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/6 px-3 py-0.5 text-[11px] text-label-4"
                  >
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
