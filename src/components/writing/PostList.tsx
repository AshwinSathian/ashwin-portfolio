import Link from "next/link";
import type { PostMeta } from "@/lib/writing";

type Props = {
  posts: PostMeta[];
  as?: "h2" | "h3";
};

export default function PostList({ posts, as: Heading = "h2" }: Props) {
  if (posts.length === 0) return null;

  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/writing/${post.slug}`}
            className="row reveal grid gap-x-8 gap-y-2 rounded-control border-t border-line py-7 md:grid-cols-[11rem_1fr_auto] md:items-baseline"
          >
            <span className="font-mono text-meta text-fg-3">
              {post.formattedDate}
              {post.draft && " · Draft"}
            </span>
            <span className="flex flex-col gap-2">
              <Heading className="font-display text-[1.375rem] font-semibold leading-[1.2] tracking-[-0.02em] text-fg">
                {post.title}
              </Heading>
              <span className="max-w-2xl text-small text-fg-2">{post.description}</span>
              {post.tags && post.tags.length > 0 && (
                <span className="font-mono text-meta text-fg-3">{post.tags.join(" · ")}</span>
              )}
            </span>
            <span className="font-mono text-meta text-fg-3">{post.readingTime} min</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
