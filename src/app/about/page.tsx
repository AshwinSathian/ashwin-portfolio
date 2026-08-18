import type { Metadata } from "next";
import { SITE } from "@/app/data/site";

const description =
  "Who this is, and why an engineering leader with a full-time lead role also ships independent products in his own time.";

const ogImageUrl = `/og?title=About&description=${encodeURIComponent("Who this is, and why an engineering leader also ships independent products in his own time.")}&label=About`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: `${SITE.website}/about` },
  openGraph: {
    title: "About | Ashwin Sathian",
    description,
    url: `${SITE.website}/about`,
    type: "website",
    images: [{ url: ogImageUrl, width: 1200, height: 630, alt: "About | Ashwin Sathian" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Ashwin Sathian",
    description,
    creator: "@ashwinsathian",
    images: [ogImageUrl],
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 pt-32 md:px-8 md:py-32 md:pt-40">
      <p className="font-ui text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
        About
      </p>
      <h1 className="mt-4 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-ink">
        Ashwin Sathian
      </h1>

      <div className="mt-10 flex flex-col gap-6 font-body text-[17px] leading-[1.8] text-ink">
        <p>
          Ashwin Sathian is an engineering leader with seven years building and scaling
          enterprise-grade SaaS platforms — systems that carry thousands of users, millions of
          records, and, in procurement alone, more than a billion dollars in transaction value.
          The résumé version of that sentence stops there. This page doesn&apos;t.
        </p>
        <p>
          At Penny Software, &ldquo;architecting multi-tenant, high-performance systems&rdquo;
          meant the actual Angular, NestJS, and MongoDB stack behind a B2B procurement platform:
          RBAC and tenancy isolation built as platform-wide standards rather than features bolted
          on per client, and query paths held under 200ms as the platform scaled toward $1B+ in
          gross transaction value. None of that is abstract — it&apos;s the architecture a
          five-year tenure was spent building, then defending as load grew.
        </p>
        <p>
          &ldquo;Accelerating release cycles&rdquo; was concrete too: a 1.5× faster release
          cadence came from reworking how engineering, QA, and product actually coordinated, and
          a 40%+ improvement in API and query response times came from treating performance as a
          standing responsibility, not a quarterly fire drill. &ldquo;Shaping engineering
          culture&rdquo; meant mentoring and directing a twelve-person team — introducing code
          review and clean-code standards that got adopted, not just proposed.
        </p>
        <p>
          Most recently, at HighLevel, he led engineering for Funnels, Websites, and Webinars —
          three revenue surfaces inside a platform serving tens of thousands of marketing
          agencies — while driving an AI-augmented Full Stack Builder effort: putting AI tooling
          to work across planning, prototyping, building, QA, and shipping, as a real change to
          how the SDLC runs rather than a novelty layer on top of the existing process.
        </p>
        <p>
          None of that explains why an engineering leader with a full-time lead role also ships
          independent products in his own time — eight of them, at last count, each documented on
          this site to the same standard as the professional work: real facts, checkable against
          the source. What connects the two is a specific kind of discipline. Booklet shipped on
          Cloudflare Workers, then moved to a self-hosted process once production revealed the
          tradeoffs. Darkframe shipped as &ldquo;Umbra,&rdquo; then was renamed after a
          shipping-readiness review turned up a naming collision — alongside a security
          vulnerability that got fixed and disclosed in the same changelog entry. The instinct to
          look at a decision honestly, including the one that turned out wrong, and change it in
          the open rather than quietly, isn&apos;t a side-project hobby distinct from the day job.
          It&apos;s the same engineer.
        </p>
        <p>
          Ashwin studied Electronics &amp; Communication Engineering at the National Institute of
          Technology Calicut (2014–2018) — the one credential behind all of this. He&apos;s based
          in Kochi, Kerala, India.
        </p>
      </div>
    </div>
  );
}
