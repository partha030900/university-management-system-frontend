
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <main className="p-6">
      <div className="flex items-center gap-3">
        <BookOpen className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Loading available courses...
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-40 animate-pulse rounded-lg border bg-muted/40"
          />
        ))}
      </div>
    </main>
  );
}
