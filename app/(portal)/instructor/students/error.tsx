
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("My Students page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-100 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-bold">
        Something went wrong!
      </h2>

      <p className="text-muted-foreground">
        We couldn't load this page. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="rounded-md bg-primary px-5 py-2 text-primary-foreground hover:opacity-90"
      >
        Try Again
      </button>
    </main>
  );
}
