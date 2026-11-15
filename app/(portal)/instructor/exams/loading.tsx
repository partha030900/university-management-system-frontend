
export default function InstructorExamsLoading() {
  return (
    <main className="max-w-2xl animate-pulse space-y-6 p-6">
      {/* Page heading */}
      <div>
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-muted" />
      </div>

      {/* Create exam form */}
      <section className="space-y-5 rounded-xl border p-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-10 w-full rounded-md bg-muted" />
          </div>
        ))}

        <div className="h-10 w-32 rounded-md bg-muted" />
      </section>

      {/* My exams heading */}
      <div className="h-7 w-40 rounded bg-muted" />

      {/* Exam cards */}
      {Array.from({ length: 3 }).map((_, index) => (
        <section key={index} className="space-y-4 rounded-xl border p-4">
          <div className="flex justify-between gap-4">
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-4 w-40 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>

            <div className="h-6 w-20 rounded bg-muted" />
          </div>

          <div className="flex gap-4">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>

          <div className="flex gap-2">
            <div className="h-9 w-32 rounded-md bg-muted" />
            <div className="h-9 w-16 rounded-md bg-muted" />
            <div className="h-9 w-20 rounded-md bg-muted" />
          </div>
        </section>
      ))}
    </main>
  );
}
