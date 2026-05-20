"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { AdminButton, AdminSwitch } from "@/components/ui/admin-input";
import { SkeletonList } from "@/components/shared/skeleton";

interface Section {
  id: string;
  key: string;
  label: string;
  isVisible: boolean;
  orderIndex: number;
}

export default function SectionOrderPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Section[]>({
    queryKey: queryKeys.sections(),
    queryFn: () => apiClient.get("/api/admin/sections"),
  });
  const [draft, setDraft] = useState<Section[]>([]);

  useEffect(() => {
    if (data) setDraft([...data].sort((a, b) => a.orderIndex - b.orderIndex));
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      apiClient.patch("/api/admin/sections", {
        items: draft.map((d, i) => ({ key: d.key, isVisible: d.isVisible, orderIndex: i })),
      }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: queryKeys.sections() });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= draft.length) return;
    const arr = [...draft];
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
    setDraft(arr);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text">Section order</h1>
          <p className="text-sm text-text-secondary">
            Reorder or hide sections on the public landing page.
          </p>
        </div>
        <AdminButton onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </AdminButton>
      </div>
      {isLoading ? (
        <SkeletonList rows={10} />
      ) : (
        <div className="space-y-2">
          {draft.map((s, i) => (
            <div
              key={s.key}
              className="flex items-center justify-between rounded-md border border-border bg-bg-secondary p-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-text-tertiary">{i + 1}.</span>
                <div>
                  <p className="text-sm text-text">{s.label}</p>
                  <p className="text-[10px] font-mono text-text-tertiary">{s.key}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AdminSwitch
                  checked={s.isVisible}
                  onCheckedChange={(v) => {
                    const arr = [...draft];
                    arr[i] = { ...s, isVisible: v };
                    setDraft(arr);
                  }}
                />
                <AdminButton variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑
                </AdminButton>
                <AdminButton
                  variant="ghost"
                  onClick={() => move(i, 1)}
                  disabled={i === draft.length - 1}
                >
                  ↓
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
