export default function HowIWork() {
  return (
    <section aria-labelledby="how-i-work-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="how-i-work-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          How I work
        </p>
        <div className="flex flex-col gap-5 md:col-span-8 md:col-start-4">
          <p className="font-body text-body-lg leading-[1.75] text-ink">
            A customer&rsquo;s ask rarely arrives as a spec. I write it myself, then build against it end to end — no PM handoff, no EM rewrite in between.
          </p>
          <p className="font-body text-body leading-[1.7] text-ink-muted">
            Penny Software&rsquo;s Vendor Pre-Qualification System is the clearest example. It started as one customer&rsquo;s manual process and one conversation with me, and it ended as shipped software, schema to UI, built and owned alone.
          </p>
        </div>
      </div>
    </section>
  );
}
