
export default function ResultsLoading() {
  return (
    <main className="animate-pulse space-y-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-8 w-56 rounded bg-muted" />
          <div className="mt-3 h-4 w-72 max-w-full rounded bg-muted" />
        </div>
        <div className="size-14 rounded-xl bg-muted" />
      </div>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border p-5">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="mt-4 h-9 w-24 rounded bg-muted" />
            <div className="mt-3 h-3 w-40 rounded bg-muted" />
          </div>
        ))}
      </section>

      {/* Student information */}
      <section className="rounded-xl border p-5">
        <div className="h-5 w-40 rounded bg-muted" />

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="mt-3 h-5 w-36 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>

      {/* Results table */}
      <section className="overflow-hidden rounded-xl border">
        <div className="border-b p-5">
          <div className="h-5 w-48 rounded bg-muted" />
          <div className="mt-3 h-4 w-64 rounded bg-muted" />
        </div>

        <div className="space-y-5 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 sm:grid-cols-6"
            >
              {Array.from({ length: 6 }).map((_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="h-5 rounded bg-muted"
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
