import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-29 md:px-8 md:py-32 md:pt-33">
      <div className="rounded-2xl border border-white/8 bg-surface-2 p-8">
        <p className="text-[17px] font-medium text-label-1">Project not found.</p>
        <p className="mt-2 text-[15px] text-label-3">
          It may have moved. Go back to{" "}
          <Link href="/#projects" className="text-accent hover:underline">
            Work
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
