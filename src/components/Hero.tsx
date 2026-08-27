import { HERO } from "@/app/data/hero";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative px-6 pb-20 pt-32 md:px-16 md:pb-28 md:pt-40"
    >
      <div className="grid gap-10 md:grid-cols-12 md:gap-6">
        <p
          className="load-fade-up font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-12"
          style={{ animationDelay: "0ms" }}
        >
          {HERO.eyebrow}
        </p>

        <h1
          id="hero-name"
          className="load-fade-up font-display text-display-1 font-bold leading-[0.95] tracking-[-0.02em] text-ink md:col-span-8"
          style={{ animationDelay: "80ms" }}
        >
          {HERO.name}
        </h1>

        <div className="load-fade-up flex flex-col gap-5 md:col-span-4 md:justify-end md:pb-2" style={{ animationDelay: "160ms" }}>
          <p className="font-body text-heading text-ink-muted">{HERO.title}</p>
          <p className="font-body text-body leading-[1.7] text-ink-muted">{HERO.thesis}</p>
        </div>
      </div>
    </section>
  );
}
