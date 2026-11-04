import Image from "next/image";
import Link from "next/link";

export type ProjectRowProps = {
  /** Internal path or absolute URL; absolute URLs open in a new tab. */
  href: string;
  name: string;
  description: string;
  /** Appended to the description on image rows, e.g. a category. */
  marker?: string;
  /** Shown as a tag beside the name, e.g. "In progress". */
  status?: string;
  /** 16:10 thumbnail; with it the row becomes a large panel. */
  image?: { src: string; alt: string };
  as?: "h2" | "h3" | "h4";
};

/** Marks work that is unfinished or unreleased. */
export function StatusTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-[6px] bg-surface-2 px-2 py-0.5 text-meta tabular-nums text-fg-2">
      {children}
    </span>
  );
}

/** A project or external repo: a panel with a thumbnail, or a plain row without one. */
export default function ProjectRow({ href, name, description, marker, status, image, as: Heading = "h3" }: ProjectRowProps) {
  const external = href.startsWith("http");
  const arrow = (
    <span aria-hidden className="hidden text-fg-3 md:block">
      <span className={`arrow ${external ? "arrow-out" : ""}`}>{external ? "↗" : "→"}</span>
    </span>
  );
  const title = (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <Heading className={`${image ? "text-display-m" : "text-title"} font-semibold tracking-[-0.02em] text-fg wrap-anywhere`}>
        {name}
      </Heading>
      {status && <StatusTag>{status}</StatusTag>}
    </span>
  );

  const cls = image
    ? "panel reveal grid gap-6 p-3 md:grid-cols-[280px_1fr_auto] md:items-center md:gap-10 md:p-4 md:pr-6"
    : "row reveal grid gap-x-8 gap-y-1.5 rounded-control py-5 md:grid-cols-[16rem_1fr_auto] md:items-baseline";

  const inner = image ? (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        width={2400}
        height={1500}
        sizes="(min-width: 768px) 280px, 100vw"
        className="block aspect-16/10 h-auto w-full rounded-control object-cover"
      />
      <span className="flex flex-col gap-3 px-3 pb-4 md:px-0 md:pb-0">
        {title}
        <span className="text-fg">
          {description}
          {marker && <span className="text-fg-2"> {marker}.</span>}
        </span>
      </span>
      {arrow}
    </>
  ) : (
    <>
      {title}
      <span className="text-fg-2">{description}</span>
      {arrow}
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
