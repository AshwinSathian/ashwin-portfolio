import type { ReactNode } from "react";
import KineticHeading, { twoLineSize } from "@/components/KineticHeading";

export type PageHeaderProps = {
  title: string;
  intro?: ReactNode;
};

/** Top of every sub-page: kinetic h1 plus one intro paragraph. */
export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="shell pb-16 pt-32 lg:pb-24 lg:pt-44">
      <KineticHeading
        text={title}
        className="text-display-l font-semibold tracking-[-0.025em]"
        style={{ fontSize: twoLineSize(title, "var(--text-display-l)") }}
      />
      {intro && (
        <p className="load-rise mt-6 max-w-2xl text-fg sm:text-[1.1875rem] lg:mt-8" style={{ "--d": "350ms" } as React.CSSProperties}>
          {intro}
        </p>
      )}
    </header>
  );
}
