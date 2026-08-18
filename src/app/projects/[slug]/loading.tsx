export default function LoadingProjectDetail() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-24 pt-29 md:px-8 md:py-32 md:pt-33">
      <div className="mb-8 h-5 w-16 animate-pulse rounded-full bg-paper-raised" />
      <div className="mb-3 h-4 w-32 animate-pulse rounded-full bg-paper-raised" />
      <div className="mb-4 h-10 w-2/3 animate-pulse rounded-xl bg-paper-raised" />
      <div className="mb-10 h-5 w-1/2 animate-pulse rounded-lg bg-paper-raised" />
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl border border-line bg-paper-raised" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-line bg-paper-raised" />
        ))}
      </div>
    </main>
  );
}
