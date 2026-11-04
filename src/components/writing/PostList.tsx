import Link from "next/link";
import type { PostMeta } from "@/lib/writing";

type Props = {
  posts: PostMeta[];
  as?: "h2" | "h3";
};

export default function PostList({ posts, as: Heading = "h2" }: Props) {
  if (posts.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/writing/${post.slug}`}
            className="row reveal grid gap-x-8 gap-y-2 rounded-control py-6 md:grid-cols-[10rem_1fr_auto] md:items-baseline"
          >
            <span className="text-meta tabular-nums text-fg-3">
              {post.formattedDate}
              {post.draft && " · Draft"}
            </span>
            <span className="flex flex-col gap-2">
              {/* Long titles drop a step on phones so they stay on two lines. */}
              <Heading className={`${post.title.length > 60 ? "text-body sm:text-title" : "text-title"} font-semibold tracking-[-0.02em] text-fg`}>{post.title}</Heading>
              <span className="max-w-2xl text-fg-2">{post.description}</span>
              {post.tags && post.tags.length > 0 && (
                <span className="text-meta tabular-nums text-fg-3">{post.tags.join(" · ")}</span>
              )}
            </span>
            <span className="text-meta tabular-nums text-fg-3">{post.readingTime} min read</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
