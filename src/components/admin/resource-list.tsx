"use client";

import { type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { AdminButton } from "@/components/ui/admin-input";
import { SkeletonList } from "@/components/shared/skeleton";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useState } from "react";

interface ResourceListProps<T extends { id: string; orderIndex?: number }> {
  title: string;
  description?: string;
  resourceUrl: string;
  reorderUrl?: string;
  queryKey: readonly unknown[];
  renderRow: (row: T) => ReactNode;
  rowLabel: (row: T) => string;
  onEdit: (row: T) => void;
  onCreate: () => void;
}

export function ResourceList<T extends { id: string; orderIndex?: number }>({
  title,
  description,
  resourceUrl,
  reorderUrl,
  queryKey,
  renderRow,
  rowLabel,
  onEdit,
  onCreate,
}: ResourceListProps<T>) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<T[]>({
    queryKey,
    queryFn: () => apiClient.get(resourceUrl),
  });
  const [toDelete, setToDelete] = useState<T | null>(null);

  const del = useMutation({
    mutationFn: (id: string) => apiClient.delete(`${resourceUrl}/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: (ids: string[]) =>
      reorderUrl
        ? apiClient.patch(reorderUrl, {
            items: ids.map((id, i) => ({ id, orderIndex: i })),
          })
        : Promise.resolve({}),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  function move(i: number, dir: -1 | 1) {
    if (!data) return;
    const j = i + dir;
    if (j < 0 || j >= data.length) return;
    const ids = data.map((r) => r.id);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    reorder.mutate(ids);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">{title}</h1>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        <AdminButton onClick={onCreate}>+ New</AdminButton>
      </div>

      {isLoading ? (
        <SkeletonList rows={5} />
      ) : (data ?? []).length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-text-secondary">
          No entries yet.
        </div>
      ) : (
        <div className="space-y-2">
          {data!.map((row, i) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-md border border-border bg-bg-secondary p-3"
            >
              <span className="font-mono text-[10px] text-text-tertiary">{i + 1}.</span>
              <div className="flex-1 min-w-0">{renderRow(row)}</div>
              {reorderUrl && (
                <>
                  <AdminButton variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                    ↑
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    onClick={() => move(i, 1)}
                    disabled={i === data!.length - 1}
                  >
                    ↓
                  </AdminButton>
                </>
              )}
              <AdminButton variant="secondary" onClick={() => onEdit(row)}>
                Edit
              </AdminButton>
              <AdminButton variant="danger" onClick={() => setToDelete(row)}>
                ×
              </AdminButton>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        title={`Delete "${toDelete ? rowLabel(toDelete) : ""}"?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await del.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
