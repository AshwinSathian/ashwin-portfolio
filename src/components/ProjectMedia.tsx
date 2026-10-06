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
      <div className="overflow-hidden rounded-panel border border-line-strong bg-surface">
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          sizes={sizes}
          className="block h-auto w-full"
        />
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-panel border border-line-strong bg-surface shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
      <figcaption className="flex items-center justify-between border-b border-line px-5 py-3 font-mono text-meta text-fg-3">
        <span>{media.caption}</span>
        <span>{media.language}</span>
      </figcaption>
      <pre className="code p-5 text-fg">
        <code>{media.snippet}</code>
      </pre>
    </figure>
  );
}
