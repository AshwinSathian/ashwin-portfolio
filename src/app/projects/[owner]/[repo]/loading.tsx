"use client";

import { Skeleton } from "primereact/skeleton";

export default function LoadingProjectDetail() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-8 md:py-24">
      <div className="mb-8">
        <Skeleton width="100px" height="2.5rem" className="rounded-full" />
      </div>
      <Skeleton width="60%" height="3.5rem" className="mb-6 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton width="80%" height="1.25rem" className="rounded-xl" />
        <Skeleton width="90%" height="1.25rem" className="rounded-xl" />
        <Skeleton width="75%" height="1.25rem" className="rounded-xl" />
        <Skeleton width="95%" height="1.25rem" className="rounded-xl" />
        <Skeleton width="70%" height="1.25rem" className="rounded-xl" />
      </div>
    </main>
  );
}
