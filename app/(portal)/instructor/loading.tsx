
export default function InstructorLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="h-9 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-72 rounded bg-muted" />
      </div>

      {/* Statistics cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-xl border p-5">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="mt-4 h-9 w-20 rounded bg-muted" />
          </div>
        ))}
      </section>

      {/* Sections heading */}
      <section className="space-y-4">
        <div className="h-7 w-40 rounded bg-muted" />

        {/* Section cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-xl border p-5">
              <div>
                <div className="h-5 w-48 rounded bg-muted" />
                <div className="mt-3 h-4 w-28 rounded bg-muted" />
              </div>

              <div className="flex justify-between">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
              </div>

              <div className="flex justify-between">
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-4 w-8 rounded bg-muted" />
              </div>

              <div className="h-4 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
