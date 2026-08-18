import { HERO } from "@/app/data/hero";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="field-texture relative flex flex-col gap-6 px-6 pb-16 pt-32 md:px-16 md:pb-24 md:pt-40"
    >
      <p
        className="load-fade-up font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted"
        style={{ animationDelay: "0ms" }}
      >
        {HERO.eyebrow}
      </p>
      <h1
        id="hero-name"
        className="load-fade-up font-display text-[clamp(40px,7vw,76px)] font-bold leading-[0.98] tracking-[-0.02em] text-ink"
        style={{ animationDelay: "80ms" }}
      >
        {HERO.name}
      </h1>
      <p
        className="load-fade-up font-body text-[clamp(20px,2.6vw,28px)] text-ink-muted"
        style={{ animationDelay: "160ms" }}
      >
        {HERO.title}
      </p>
      <p
        className="load-fade-up max-w-2xl font-body text-[17px] leading-[1.7] text-ink"
        style={{ animationDelay: "240ms" }}
      >
        {HERO.thesis}
      </p>
    </section>
  );
}
