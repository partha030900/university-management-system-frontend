
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ExamsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Exams page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-bold">
        Something went wrong!
      </h2>

      <p className="text-muted-foreground">
        We couldn't load the exams page. Please try again.
      </p>

      <Button onClick={() => reset()}>
        Try Again
      </Button>
    </div>
  );
}
