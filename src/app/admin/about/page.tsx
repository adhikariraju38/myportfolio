"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import {
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminTextarea,
} from "@/components/ui/admin-input";
import { SkeletonForm } from "@/components/shared/skeleton";
import { ImageUpload, type ImageRef } from "@/components/admin/image-upload";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

type About = Record<string, unknown>;

export default function AboutPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<About | null>({
    queryKey: queryKeys.about(),
    queryFn: () => apiClient.get("/api/admin/about"),
  });
  const [draft, setDraft] = useState<About>({});
  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);
  const stats = (draft.stats as Stat[]) ?? [];

  const save = useMutation({
    mutationFn: (body: About) => apiClient.patch("/api/admin/about", body),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: queryKeys.about() });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isLoading) return <SkeletonForm />;
  const set = (k: string, v: unknown) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined as unknown as string } : e));
  };

  const handleSave = () => {
    if (!String(draft.summary ?? "").trim()) {
      setErrors({ summary: "Summary is required" });
      return;
    }
    setErrors({});
    save.mutate(draft);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">About</h1>
        <AdminButton onClick={handleSave} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </AdminButton>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-bg-secondary p-5">
        <div>
          <AdminLabel>Heading</AdminLabel>
          <AdminInput
            value={(draft.heading as string) ?? ""}
            onChange={(e) => set("heading", e.target.value)}
          />
        </div>
        <div>
          <AdminLabel>Summary</AdminLabel>
          <AdminTextarea
            rows={6}
            value={(draft.summary as string) ?? ""}
            error={errors.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-[200px_1fr]">
          <ImageUpload
            label="Profile image"
            value={draft.profileImage as ImageRef}
            onChange={(v) => set("profileImage", v ?? {})}
          />
          <div>
            <AdminLabel>Alt text</AdminLabel>
            <AdminInput
              value={(draft.profileAlt as string) ?? ""}
              onChange={(e) => set("profileAlt", e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-text-secondary">Stats</p>
          <div className="space-y-2">
            {stats.map((s, i) => (
              <div key={i} className="grid items-end gap-2 md:grid-cols-[2fr_1fr_1fr_auto]">
                <div>
                  <AdminLabel>Label</AdminLabel>
                  <AdminInput
                    value={s.label}
                    onChange={(e) => {
                      const arr = [...stats];
                      arr[i] = { ...s, label: e.target.value };
                      set("stats", arr);
                    }}
                  />
                </div>
                <div>
                  <AdminLabel>Value</AdminLabel>
                  <AdminInput
                    type="number"
                    step="0.1"
                    value={s.value}
                    onChange={(e) => {
                      const arr = [...stats];
                      arr[i] = { ...s, value: Number(e.target.value) };
                      set("stats", arr);
                    }}
                  />
                </div>
                <div>
                  <AdminLabel>Suffix</AdminLabel>
                  <AdminInput
                    value={s.suffix ?? ""}
                    onChange={(e) => {
                      const arr = [...stats];
                      arr[i] = { ...s, suffix: e.target.value };
                      set("stats", arr);
                    }}
                  />
                </div>
                <AdminButton
                  variant="ghost"
                  onClick={() => set("stats", stats.filter((_, j) => j !== i))}
                >
                  ×
                </AdminButton>
              </div>
            ))}
            <AdminButton
              variant="secondary"
              onClick={() => set("stats", [...stats, { label: "", value: 0, suffix: "" }])}
            >
              + Add stat
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
}
