
export default function DashboardLoading() {
  return (
    <main className="animate-pulse p-6">
      {/* Header skeleton */}
      <div>
        <div className="h-9 w-64 rounded bg-muted" />

        <div className="mt-3 h-4 w-80 rounded bg-muted" />
      </div>

      {/* Student summary skeleton */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-5">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="mt-3 h-6 w-32 rounded bg-muted" />
          </div>
        ))}
      </section>

      {/* Program skeleton */}
      <section className="mt-8 rounded-lg border p-6">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="mt-3 h-7 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-40 rounded bg-muted" />
      </section>

      {/* Quick links skeleton */}
      <section className="mt-8">
        <div className="h-7 w-36 rounded bg-muted" />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-5">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="mt-3 h-4 w-full rounded bg-muted" />
              <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
