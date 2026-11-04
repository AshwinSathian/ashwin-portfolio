import Image from "next/image";
import type { ProjectMedia as ProjectMediaData } from "@/app/data/projects";

export type ProjectMediaProps = {
  media: ProjectMediaData;
  priority?: boolean;
  /** `sizes` hint for the screenshot; defaults to full container width. */
  sizes?: string;
};

/** A project's hero media: the real screenshot at its natural ratio, or a code sample. */
export default function ProjectMedia({
  media,
  priority,
  sizes = "(min-width: 1200px) 1104px, 100vw",
}: ProjectMediaProps) {
  if (media.kind === "screenshot") {
    return (
      <div className="panel p-2 md:p-3">
        <Image
          // Every PNG under public/projects has a .webp sibling (quality 82), about a third the size.
          src={media.src.replace(/\.png$/, ".webp")}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          sizes={sizes}
          className="block h-auto w-full rounded-control"
        />
      </div>
    );
  }

  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex items-center justify-between bg-surface-2 px-5 py-3 text-meta tabular-nums text-fg-2">
        <span>{media.caption}</span>
        <span>{media.language}</span>
      </figcaption>
      <pre className="code p-5 text-fg">
        <code>{media.snippet}</code>
      </pre>
    </figure>
  );
}
