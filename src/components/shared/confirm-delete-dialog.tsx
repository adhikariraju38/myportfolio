"use client";

import { useState } from "react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDeleteDialog({
  open,
  title = "Delete?",
  description = "This cannot be undone.",
  onCancel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [pending, setPending] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-bg-secondary p-5 shadow-2xl">
        <h2 className="mb-1 font-display text-lg font-semibold text-text">{title}</h2>
        <p className="mb-5 text-sm text-text-secondary">{description}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-text-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              setPending(true);
              try {
                await onConfirm();
              } finally {
                setPending(false);
              }
            }}
            disabled={pending}
            className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
