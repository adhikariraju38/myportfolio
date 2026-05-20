"use client";

import { useEffect } from "react";

export default function AdminError({
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
    <div className="m-6 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-200">
      <p className="mb-2 font-semibold">Admin section failed to load</p>
      <p className="mb-4 text-xs opacity-80">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-red-500/60 px-3 py-1.5 text-xs"
      >
        Retry
      </button>
    </div>
  );
}
