export default function LoadingProjectDetail() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-29 md:px-8 md:py-32 md:pt-33">
      <div className="mb-8 h-5 w-16 animate-pulse rounded-full bg-surface-3" />
      <div className="mb-4 h-10 w-2/3 animate-pulse rounded-xl bg-surface-3" />
      <div className="mb-10 h-5 w-1/3 animate-pulse rounded-lg bg-surface-3" />
      <div className="rounded-2xl border border-white/8 bg-surface-2 p-8">
        <div className="flex flex-col gap-4">
          {[95, 85, 90, 75, 88].map((w, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded-lg bg-surface-3"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
