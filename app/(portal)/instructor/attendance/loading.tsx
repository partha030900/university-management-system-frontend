
export default function InstructorAttendanceLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Header */}
      <div>
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-muted" />
      </div>

      {/* Section cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-xl border p-5">
            <div className="h-5 w-24 rounded bg-muted" />
            <div className="h-4 w-48 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
          </div>
        ))}
      </section>

      {/* Student attendance section */}
      <section className="rounded-xl border p-5">
        <div className="h-6 w-56 rounded bg-muted" />

        {/* Date input */}
        <div className="mt-5 h-10 w-48 rounded-md bg-muted" />

        {/* Student rows */}
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <div className="h-5 w-36 rounded bg-muted" />
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="h-3 w-28 rounded bg-muted" />
              </div>

              <div className="h-10 w-36 rounded-md bg-muted" />
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="mt-5 h-10 w-36 rounded-md bg-muted" />
      </section>
    </main>
  );
}
