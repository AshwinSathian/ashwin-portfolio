import ArrowLink from "@/components/ArrowLink";
import KineticHeading from "@/components/KineticHeading";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col justify-end pb-16 pt-32 lg:pb-24">
      <p className="load-rise mb-4 font-mono text-meta text-fg-3">404</p>
      <KineticHeading
        text="Nothing at this address."
        className="max-w-4xl font-display text-display-xl font-bold tracking-[-0.045em]"
      />
      <div className="load-rise mt-10 flex flex-wrap gap-x-8 border-t border-line pt-6" style={{ "--d": "400ms" } as React.CSSProperties}>
        <ArrowLink href="/">Home</ArrowLink>
        <ArrowLink href="/projects">Projects</ArrowLink>
        <ArrowLink href="/writing">Writing</ArrowLink>
      </div>
    </div>
  );
}
