"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProjectDetailError({ error, reset }: ErrorProps) {
  const params = useParams<{ owner: string; repo: string }>();
  const owner = params?.owner ?? "unknown";
  const repo = params?.repo ?? "unknown";

  useEffect(() => {
    console.error(error);
  }, [error]);

  const isReadmeMissing = /404/.test(error.message ?? "");
  const summary = isReadmeMissing ? "README not found." : "Something went wrong.";
  const detail = isReadmeMissing
    ? `Couldn't load the README for ${owner}/${repo}.`
    : "Please try again in a moment.";

  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-29 md:px-8 md:py-32 md:pt-33">
      <div className="rounded-2xl border border-white/8 bg-surface-2 p-8">
        <p className="text-[17px] font-medium text-label-1">{summary}</p>
        <p className="mt-2 text-[15px] text-label-3">{detail}</p>
        <p className="mt-3 text-[15px] text-label-3">
          View on{" "}
          <Link
            href={`https://github.com/${owner}/${repo}`}
            className="text-accent hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>{" "}
          or go back to{" "}
          <Link href="/#projects" className="text-accent hover:underline">
            Work
          </Link>
          .
        </p>
        {!isReadmeMissing && (
          <button
            onClick={reset}
            className="mt-6 text-[15px] text-label-2 transition-colors duration-200 hover:text-label-1"
          >
            Try again →
          </button>
        )}
      </div>
    </main>
  );
}
