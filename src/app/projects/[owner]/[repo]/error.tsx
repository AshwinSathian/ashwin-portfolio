"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

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

  const message = error.message ?? "";
  const isReadmeMissing = /404/.test(message);
  const summary = isReadmeMissing ? "README not found" : "Something went wrong";
  const detail = isReadmeMissing
    ? `We couldn't load the README for ${owner}/${repo}.`
    : "Please try again in a moment.";
  const severity = isReadmeMissing ? "warn" : "error";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <Message
        severity={severity}
        className="w-full rounded-3xl bg-bg-glass p-6 shadow-glass backdrop-blur-soft"
        content={() => (
          <div className="space-y-4">
            <div className="text-base font-semibold text-text-primary">
              {summary}
            </div>
            <p className="text-sm text-text-muted">{detail}</p>
            <p className="text-sm text-text-muted">
              View the project on{" "}
              <Link
                href={`https://github.com/${owner}/${repo}`}
                className="text-text-primary underline decoration-dotted underline-offset-4"
              >
                GitHub
              </Link>{" "}
              or head back to{" "}
              <Link
                href="/#projects"
                className="text-text-primary underline decoration-dotted underline-offset-4"
              >
                Top Projects
              </Link>
              .
            </p>
            {!isReadmeMissing ? (
              <Button
                label="Retry"
                icon="pi pi-refresh"
                text
                className="text-text-secondary"
                onClick={reset}
              />
            ) : null}
          </div>
        )}
      />
    </main>
  );
}
