
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <main className="animate-pulse space-y-8 p-4 sm:p-6">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-8 w-40 rounded bg-muted" />
          <div className="mt-3 h-4 w-64 rounded bg-muted" />
        </div>

        <div className="size-14 rounded-xl bg-muted" />
      </div>

      {/* Profile overview */}
      <section className="rounded-xl border p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="size-20 shrink-0 rounded-full bg-muted" />

          <div className="flex-1">
            <div className="h-7 w-48 rounded bg-muted" />
            <div className="mt-3 h-4 w-36 rounded bg-muted" />
            <div className="mt-3 h-7 w-24 rounded-full bg-muted" />
          </div>

          <div className="h-10 w-24 rounded-md bg-muted" />
        </div>
      </section>

      {/* Personal information */}
      <section className="space-y-4">
        <div>
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="mt-2 h-4 w-64 rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 rounded-lg border p-4">
              <div className="size-10 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-5 w-36 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic information */}
      <section className="space-y-4">
        <div>
          <div className="h-6 w-52 rounded bg-muted" />
          <div className="mt-2 h-4 w-64 rounded bg-muted" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-3 rounded-lg border p-4">
              <div className="size-10 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 rounded bg-muted" />
                <div className="h-5 w-40 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
