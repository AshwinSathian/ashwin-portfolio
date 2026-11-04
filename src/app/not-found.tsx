import type { Metadata } from "next";
import ArrowLink from "@/components/ArrowLink";
import KineticHeading from "@/components/KineticHeading";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: true },
  // Don't inherit the root layout's canonical (the home page URL).
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center pb-20 pt-32 lg:pb-32">
      <KineticHeading
        text="Nothing at this address."
        className="max-w-4xl text-display-xl font-bold tracking-[-0.03em]"
      />
      <p className="load-rise mt-6 max-w-2xl text-[1.1875rem] leading-[1.5] text-fg" style={{ "--d": "300ms" } as React.CSSProperties}>
        This address returned a 404. One of these pages should have what you were after.
      </p>
      <div className="load-rise mt-6 flex flex-wrap gap-x-8" style={{ "--d": "400ms" } as React.CSSProperties}>
        <ArrowLink href="/">Home</ArrowLink>
        <ArrowLink href="/projects">Projects</ArrowLink>
        <ArrowLink href="/writing">Writing</ArrowLink>
      </div>
    </div>
  );
}
