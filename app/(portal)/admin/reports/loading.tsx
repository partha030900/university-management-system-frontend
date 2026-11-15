
export default function AdminReportsLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Heading */}
      <div>
        <div className="h-9 w-72 rounded bg-muted" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-muted" />
      </div>

      {/* Report cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border bg-card p-6"
          >
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-9 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
