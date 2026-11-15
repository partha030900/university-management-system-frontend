
export default function Loading() {
  return (
    <main className="space-y-6 p-6 animate-pulse">
      {/* Page heading skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="h-4 w-72 rounded-md bg-muted" />
      </div>

      {/* Search input skeleton */}
      <div className="h-10 w-full rounded-md bg-muted" />

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-xl border">
        {/* Table headings */}
        <div className="grid grid-cols-5 gap-4 bg-muted p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-4 rounded bg-background"
            />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 border-t p-4"
          >
            {Array.from({ length: 5 }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="h-4 rounded bg-muted"
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
