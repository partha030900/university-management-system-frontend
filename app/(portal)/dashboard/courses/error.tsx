
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Courses page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>

      <p className="mt-2 text-muted-foreground">
        We couldn't load the courses page. Please try again.
      </p>

      <Button className="mt-5" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
