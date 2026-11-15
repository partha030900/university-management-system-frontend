
export default function InstructorResultsLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Exam information */}
      <section>
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-4 w-36 rounded bg-muted" />
        </div>
      </section>

      {/* Performance dashboard */}
      <section className="space-y-4">
        <div className="h-7 w-64 rounded bg-muted" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-5">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-8 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>

      {/* Registered students */}
      <section className="space-y-4 rounded-xl border p-5">
        <div className="h-6 w-48 rounded bg-muted" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-lg border p-4">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-56 rounded bg-muted" />
            <div className="h-4 w-36 rounded bg-muted" />

            <div className="flex gap-3">
              <div className="h-10 w-32 rounded-md bg-muted" />
              <div className="h-10 w-28 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
