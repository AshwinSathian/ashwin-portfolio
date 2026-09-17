import { SUMMARY } from "@/app/data/summary";

export default function Summary() {
  return (
    <section aria-labelledby="summary-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="summary-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          Summary
        </p>
        <p className="font-body text-body-lg leading-[1.75] text-ink md:col-span-8 md:col-start-4">
          {SUMMARY}
        </p>
      </div>
    </section>
  );
}
