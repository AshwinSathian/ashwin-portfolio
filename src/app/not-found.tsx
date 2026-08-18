import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 pt-32 md:px-8 md:py-32 md:pt-40">
      <div className="rounded-2xl border border-line bg-paper-raised p-8">
        <p className="font-body text-[17px] font-medium text-ink">Page not found.</p>
        <p className="mt-2 font-body text-[15px] text-ink-muted">
          It may have moved. Go back{" "}
          <Link href="/" className="text-accent hover:underline">
            home
          </Link>
          , or browse{" "}
          <Link href="/projects" className="text-accent hover:underline">
            projects
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
