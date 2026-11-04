import Image from "next/image";
import ArrowLink from "@/components/ArrowLink";

/**
 * One frame, three distances: the live Weir site, then its terminal's
 * Cache-Status line, then the go get line, as the reader scrolls. The steps
 * are CSS scroll timelines (globals.css .zoom-*); without them the frame and
 * every line of text simply show at rest.
 */
export default function WeirZoom() {
  return (
    <section aria-labelledby="weir-heading" className="zoom-wrap">
      <div className="zoom-stage shell flex flex-col justify-center gap-8 py-24 lg:gap-10">
        <h2
          id="weir-heading"
          className="max-w-5xl text-[clamp(1.75rem,5.4vw,4.75rem)] font-semibold leading-[1] tracking-[-0.03em]"
        >
          One download, <span className="zoom-late inline-block">every waiting client served.</span>
        </h2>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="aspect-[16/10] overflow-hidden rounded-panel bg-surface lg:col-span-8">
            <Image
              src="/projects/weir/live.webp"
              alt="The live Weir site: a terminal shows a cached response with the header Cache-Status: Weir; hit; ttl=43"
              width={2400}
              height={1500}
              sizes="(min-width: 1200px) 736px, (min-width: 1024px) 62vw, 100vw"
              className="zoom-img h-full w-full object-cover object-top"
            />
          </div>
          <div className="zoom-last flex flex-col gap-4 lg:col-span-4">
            <p className="text-fg">
              Weir is a Go HTTP cache for an origin that has to stay up. Version 1.2.0 shares one origin
              download between every client waiting on a large response, and coalesces across nodes.
            </p>
            <ArrowLink href="/projects/weir">Read the Weir case study</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
