import type { ReactNode } from "react";
import KineticHeading from "@/components/KineticHeading";

export type SectionProps = {
  id: string;
  /** Two-digit position marker, e.g. "01". */
  index: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
};

/** A home-page section: mono index, h2, optional intro, then content. */
export default function Section({ id, index, title, intro, children }: SectionProps) {
  return (
    <section aria-labelledby={`${id}-heading`} id={id} className="shell py-20 lg:py-36">
      <header className="reveal mb-10 grid gap-4 lg:mb-16 lg:grid-cols-12 lg:gap-12">
        <div className="flex items-baseline gap-4 lg:col-span-7">
          <span aria-hidden className="text-meta tabular-nums text-fg-3">
            {index}
          </span>
          <h2
            id={`${id}-heading`}
            className="text-display-l font-semibold tracking-[-0.035em]"
          >
            {title}
          </h2>
        </div>
        {intro && <p className="max-w-md self-end text-fg-2 lg:col-span-5">{intro}</p>}
      </header>
      {children}
    </section>
  );
}

export type PageHeaderProps = {
  title: string;
  intro?: ReactNode;
};

/** Top of every sub-page: kinetic h1 plus one intro paragraph. */
export function PageHeader({ title, intro }: PageHeaderProps) {
  return (
    <header className="shell pb-12 pt-32 lg:pb-20 lg:pt-44">
      <KineticHeading
        text={title}
        className="max-w-5xl text-display-l font-semibold tracking-[-0.035em]"
      />
      {intro && (
        <p className="load-rise mt-6 max-w-2xl text-fg-2 lg:mt-8 lg:text-[1.1875rem]" style={{ "--d": "350ms" } as React.CSSProperties}>
          {intro}
        </p>
      )}
    </header>
  );
}
