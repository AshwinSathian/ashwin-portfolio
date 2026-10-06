import Link from "next/link";
import { RECENT_EXPERIENCE } from "@/app/data/experience";

export default function HomeExperience() {
  const [latest] = RECENT_EXPERIENCE;

  return (
    <section aria-labelledby="experience-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="experience-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          Experience
        </p>

        <div className="flex flex-col gap-6 md:col-span-8 md:col-start-4">
          <div className="flex flex-col gap-1.5">
            <p className="font-data text-small text-accent">{latest.dates}</p>
            <p className="font-display text-heading font-semibold text-ink">{latest.role}</p>
            <p className="font-body text-body text-ink-muted">{latest.company}</p>
          </div>

          <p className="max-w-2xl font-body text-body leading-[1.7] text-ink-muted">
            More than eight years, seven roles, and five companies, including five years as a founding engineer at Penny Software.
          </p>

          <Link
            href="/experience"
            className="inline-flex items-center gap-2 font-ui text-body text-ink transition-colors duration-200 hover:text-accent"
          >
            Full record, all seven roles →
          </Link>
        </div>
      </div>
    </section>
  );
}
