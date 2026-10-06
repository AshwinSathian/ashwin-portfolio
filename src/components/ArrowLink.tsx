import Link from "next/link";
import type { ReactNode } from "react";

export type ArrowLinkProps = {
  href: string;
  children: ReactNode;
  /** Opens in a new tab and uses the outbound arrow. */
  external?: boolean;
  className?: string;
};

export default function ArrowLink({ href, children, external, className = "" }: ArrowLinkProps) {
  const cls = `inline-flex min-h-11 items-center gap-2 text-fg ${className}`;
  const inner = (
    <>
      <span className="link">{children}</span>
      <span aria-hidden className={`arrow ${external ? "arrow-out" : ""}`}>
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
