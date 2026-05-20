"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { AdminButton, AdminSelect } from "@/components/ui/admin-input";
import { SkeletonList } from "@/components/shared/skeleton";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<Inquiry | null>(null);
  const [toDelete, setToDelete] = useState<Inquiry | null>(null);

  const { data, isLoading } = useQuery<Inquiry[]>({
    queryKey: queryKeys.inquiries.list(filter || undefined),
    queryFn: () =>
      apiClient.get(filter ? `/api/admin/inquiries?status=${filter}` : "/api/admin/inquiries"),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["inquiries"] });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Inquiry["status"] }) =>
      apiClient.patch(`/api/admin/inquiries/${id}`, { status }),
    onSuccess: () => { toast.success("Updated"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/admin/inquiries/${id}`),
    onSuccess: () => { toast.success("Deleted"); refresh(); setOpen(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">Inquiries</h1>
        <AdminSelect value={filter} onChange={(e) => setFilter(e.target.value)} className="w-40">
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </AdminSelect>
      </div>

      {isLoading ? (
        <SkeletonList rows={5} />
      ) : (data ?? []).length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-text-secondary">
          No inquiries.
        </div>
      ) : (
        <div className="space-y-2">
          {data!.map((inq) => (
            <button
              key={inq.id}
              type="button"
              onClick={() => setOpen(inq)}
              className="flex w-full items-center gap-3 rounded-md border border-border bg-bg-secondary p-3 text-left hover:bg-bg-tertiary/30"
            >
              <span
                className={
                  "rounded-full px-2 py-0.5 text-[10px] font-medium " +
                  (inq.status === "new"
                    ? "bg-accent/15 text-accent"
                    : inq.status === "read"
                      ? "bg-bg-tertiary text-text-secondary"
                      : "bg-bg-tertiary/40 text-text-tertiary")
                }
              >
                {inq.status}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text">
                  {inq.name} <span className="text-text-tertiary">·</span> {inq.email}
                </p>
                <p className="truncate text-[10px] text-text-tertiary">{inq.message}</p>
              </div>
              <span className="font-mono text-[10px] text-text-tertiary">
                {new Date(inq.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-bg-secondary p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-base font-semibold text-text">{open.name}</p>
                <p className="text-xs text-text-tertiary">{open.email}</p>
              </div>
              <AdminButton variant="ghost" onClick={() => setOpen(null)}>×</AdminButton>
            </div>
            <p className="mb-4 whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm text-text">
              {open.message}
            </p>
            <p className="mb-4 font-mono text-[10px] text-text-tertiary">
              {new Date(open.createdAt).toLocaleString()} · {open.ipAddress ?? "—"}
            </p>
            <div className="flex justify-between">
              <AdminButton variant="danger" onClick={() => setToDelete(open)}>Delete</AdminButton>
              <div className="flex gap-2">
                {open.status !== "read" && (
                  <AdminButton
                    variant="secondary"
                    onClick={() => update.mutate({ id: open.id, status: "read" })}
                  >
                    Mark read
                  </AdminButton>
                )}
                {open.status !== "archived" && (
                  <AdminButton
                    onClick={() => update.mutate({ id: open.id, status: "archived" })}
                  >
                    Archive
                  </AdminButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        title="Delete inquiry?"
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await del.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
