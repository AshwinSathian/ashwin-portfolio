import Link from "next/link";
import type { LogEntry } from "@/app/data/log";

export type RecentLogProps = {
  entries: LogEntry[];
};

export default function RecentLog({ entries }: RecentLogProps) {
  return (
    <section aria-labelledby="recent-heading" className="px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <p
          id="recent-heading"
          className="load-fade-up font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
          style={{ animationDelay: "320ms" }}
        >
          Recent
        </p>
        <ol className="flex flex-col">
          {entries.map((entry, i) => (
            <li
              key={entry.href}
              className="load-fade-up border-t border-line py-6 first:border-t-0 first:pt-0"
              style={{ animationDelay: `${400 + i * 90}ms` }}
            >
              <Link
                href={entry.href}
                className="group flex flex-col gap-1.5 focus-visible:outline-none md:flex-row md:items-baseline md:gap-6"
              >
                <span className="shrink-0 font-display text-[13px] text-signal md:w-28">
                  {entry.date}
                </span>
                <span className="font-body text-[16px] leading-relaxed text-ink transition-colors duration-200 group-hover:text-accent">
                  {entry.text}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
