
export default function AdminLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Dashboard heading */}
      <div>
        <div className="h-9 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-muted" />
      </div>

      {/* Dashboard cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border bg-card p-6"
          >
            <div className="h-4 w-28 rounded bg-muted" />
            <div className="h-9 w-20 rounded bg-muted" />
            <div className="h-4 w-40 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
