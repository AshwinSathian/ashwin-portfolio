import { SITE } from "@/app/data/site";

export default function ContactBand() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="border-t border-line bg-paper-raised px-6 py-20 text-center md:px-16 md:py-28"
    >
      <h2
        id="contact-heading"
        className="font-display text-[clamp(36px,6vw,64px)] font-bold leading-none tracking-[-0.02em] text-signal"
      >
        Let&apos;s talk.
      </h2>
      <a
        href={`mailto:${SITE.email}`}
        className="mt-6 inline-block font-body text-[clamp(17px,2vw,22px)] text-ink transition-colors duration-200 hover:text-accent hover:underline underline-offset-4"
      >
        {SITE.email}
      </a>
      <p className="mt-4 font-ui text-[14px] text-ink-muted">
        Engineering, ideas, or interesting problems welcome.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 font-ui text-[13px] text-ink-muted">
        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          LinkedIn
        </a>
        <span>·</span>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}
