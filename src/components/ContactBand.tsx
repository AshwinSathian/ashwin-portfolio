import { SITE } from "@/app/data/site";

export default function ContactBand() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="border-t border-line px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <h2
          id="contact-heading"
          className="font-display text-display-1 font-medium italic leading-[0.95] tracking-[-0.01em] text-ink"
        >
          Let&apos;s talk.
        </h2>
        <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
          <a
            href={`mailto:${SITE.email}`}
            className="font-body text-body-lg text-accent transition-colors duration-200 hover:text-accent-strong hover:underline underline-offset-4"
          >
            {SITE.email}
          </a>
          <p className="font-ui text-small text-ink-muted">
            Engineering, ideas, or interesting problems welcome.
          </p>
          <div className="flex items-center gap-2 font-ui text-small text-ink-muted">
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-ink">
              LinkedIn
            </a>
            <span>·</span>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-ink">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
