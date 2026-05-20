"use client";

import { useEffect } from "react";

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="mb-2 font-display text-3xl font-bold text-text">Something went wrong</h1>
        <p className="mb-6 text-sm text-text-secondary">
          The page failed to load. Try again or come back later.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
