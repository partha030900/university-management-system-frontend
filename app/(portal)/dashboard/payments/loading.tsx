
export default function PaymentsLoading() {
  return (
    <main className="animate-pulse space-y-6 p-4 md:p-8">
      {/* Page heading */}
      <div>
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="mt-3 h-4 w-80 max-w-full rounded bg-muted" />
      </div>

      {/* Payment cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="flex flex-col rounded-xl border bg-card p-5"
          >
            {/* Icon and course code */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="size-11 rounded-lg bg-muted" />
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>

            {/* Course information */}
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="mt-2 h-4 w-32 rounded bg-muted" />

            {/* Registration and payment status */}
            <div className="mt-5 h-4 w-36 rounded bg-muted" />
            <div className="mt-3 h-4 w-40 rounded bg-muted" />

            {/* Pay button */}
            <div className="mt-auto pt-5">
              <div className="h-10 w-full rounded-md bg-muted" />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
