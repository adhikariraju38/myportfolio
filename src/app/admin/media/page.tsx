"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { AdminButton, AdminInput } from "@/components/ui/admin-input";
import { SkeletonCard } from "@/components/shared/skeleton";
import { useUpload } from "@/hooks/use-upload";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

interface Media {
  id: string;
  filename: string;
  contentType: string;
  length: number;
  uploadDate: string;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MediaPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Media[]>({
    queryKey: queryKeys.media(),
    queryFn: () => apiClient.get("/api/admin/media"),
  });
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<Media | null>(null);
  const { upload, isUploading } = useUpload();

  const del = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/admin/media/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: queryKeys.media() });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await upload(file);
      toast.success("Uploaded");
      qc.invalidateQueries({ queryKey: queryKeys.media() });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      e.target.value = "";
    }
  }

  const filtered = (data ?? []).filter((m) =>
    m.filename.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-text">Media library</h1>
        <div className="flex items-center gap-2">
          <AdminInput
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-48"
          />
          <label className="cursor-pointer rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white">
            {isUploading ? "Uploading…" : "Upload"}
            <input type="file" className="hidden" onChange={onFile} accept="image/*,application/pdf" />
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-text-secondary">
          No media uploaded yet.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-xl border border-border bg-bg-secondary p-3">
              <div className="mb-3 flex h-32 items-center justify-center overflow-hidden rounded-md bg-bg-tertiary">
                {m.contentType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/media/${m.id}`} alt={m.filename} className="max-h-full max-w-full" />
                ) : (
                  <span className="font-mono text-xs text-text-tertiary">{m.contentType}</span>
                )}
              </div>
              <p className="truncate text-xs text-text" title={m.filename}>
                {m.filename}
              </p>
              <p className="text-[10px] text-text-tertiary">{formatBytes(m.length)}</p>
              <div className="mt-2 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`/api/media/${m.id}`);
                    toast.success("URL copied");
                  }}
                  className="rounded-md border border-border px-2 py-1 text-[10px] text-text-secondary"
                >
                  Copy URL
                </button>
                <AdminButton variant="danger" onClick={() => setToDelete(m)}>
                  Delete
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.filename}"?`}
        description="If this file is referenced by content, those references will break. Continue?"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await del.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
