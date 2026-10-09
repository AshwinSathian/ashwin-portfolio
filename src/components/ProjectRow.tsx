import Link from "next/link";

export type ProjectRowProps = {
  /** Internal path or absolute URL; absolute URLs open in a new tab. */
  href: string;
  name: string;
  description: string;
  /** Left-hand marker, e.g. "05" or a category. */
  marker?: string;
  /** Shown as a tag beside the name, e.g. "In progress". */
  status?: string;
  as?: "h2" | "h3" | "h4";
};

/** Marks work that is unfinished or unreleased. */
export function StatusTag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-line-strong px-2 py-0.5 text-meta tabular-nums text-fg-2">
      <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-fg-2" />
      {children}
    </span>
  );
}

/** A compact list row for a project or an external repo. */
export default function ProjectRow({ href, name, description, marker, status, as: Heading = "h3" }: ProjectRowProps) {
  const external = href.startsWith("http");
  const cls =
    "row reveal grid gap-x-8 gap-y-1.5 rounded-control border-t border-line py-6 md:grid-cols-[3.5rem_16rem_1fr_auto] md:items-baseline";
  const inner = (
    <>
      <span className="text-meta tabular-nums text-fg-3">{marker}</span>
      <span className="flex flex-col items-start gap-2">
        <Heading className="text-title font-semibold tracking-[-0.02em] text-fg wrap-anywhere">
          {name}
        </Heading>
        {status && <StatusTag>{status}</StatusTag>}
      </span>
      <span className="text-small text-fg-2">{description}</span>
      <span aria-hidden className={`arrow hidden text-fg-3 md:block ${external ? "arrow-out" : ""}`}>
        {external ? "↗" : "→"}
      </span>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
