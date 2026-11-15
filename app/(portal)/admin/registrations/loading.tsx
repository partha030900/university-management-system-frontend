
export default function AdminRegistrationsLoading() {
  return (
    <main className="animate-pulse space-y-6 p-6">
      {/* Heading */}
      <div>
        <div className="h-9 w-72 rounded bg-muted" />
        <div className="mt-3 h-4 w-96 max-w-full rounded bg-muted" />
      </div>

      {/* Search and payment filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-10 w-full rounded-md bg-muted" />
        <div className="h-10 w-full rounded-md bg-muted sm:w-48" />
      </div>

      {/* Registrations table */}
      <div className="overflow-hidden rounded-xl border">
        {/* Table header */}
        <div className="grid grid-cols-6 gap-4 bg-muted p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-background" />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-6 items-center gap-4 border-t p-4"
          >
            <div className="h-4 w-12 rounded bg-muted" />

            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted" />
            </div>

            <div className="h-4 w-20 rounded bg-muted" />

            <div className="h-6 w-16 rounded-full bg-muted" />

            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
