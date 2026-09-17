import Link from "next/link";
import Skills from "@/components/Skills";
import { SITE } from "@/app/data/site";

export default function HomeSkills() {
  return (
    <section aria-labelledby="stack-heading" className="border-t border-line px-6 py-16 md:px-16 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-12 md:gap-8">
        <p
          id="stack-heading"
          className="font-ui text-micro font-medium uppercase tracking-[0.14em] text-ink-muted md:col-span-3"
        >
          Stack
        </p>
        <div className="flex flex-col gap-6 md:col-span-8 md:col-start-4">
          <Skills variant="compact" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/writing" className="font-ui text-body text-ink transition-colors duration-200 hover:text-accent">
              Writing →
            </Link>
            <a href={`mailto:${SITE.email}`} className="font-ui text-body text-ink transition-colors duration-200 hover:text-accent">
              Get in touch →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
