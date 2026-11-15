
export default function AdminStudentsLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Heading */}
      <div>
        <div className="h-9 w-48 rounded bg-muted" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-muted" />
      </div>

      {/* Search input */}
      <div className="h-10 w-full rounded-md bg-muted sm:max-w-md" />

      {/* Students table */}
      <div className="overflow-hidden rounded-xl border">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4 bg-muted p-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-background" />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center gap-4 border-t p-4"
          >
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-4 w-36 rounded bg-muted" />
            <div className="h-4 w-28 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
