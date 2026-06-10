"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { AdminButton, AdminInput, AdminLabel } from "@/components/ui/admin-input";
import { SkeletonForm } from "@/components/shared/skeleton";
import { ImageUpload, type ImageRef } from "@/components/admin/image-upload";

type Education = Record<string, unknown>;

export default function EducationPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Education | null>({
    queryKey: queryKeys.education(),
    queryFn: () => apiClient.get("/api/admin/education"),
  });
  const [draft, setDraft] = useState<Education>({});
  useEffect(() => { if (data) setDraft(data); }, [data]);

  const save = useMutation({
    mutationFn: (body: Education) => apiClient.patch("/api/admin/education", body),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: queryKeys.education() });
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
    const next: Record<string, string> = {};
    if (!String(draft.school ?? "").trim()) next.school = "School is required";
    if (!String(draft.degree ?? "").trim()) next.degree = "Degree is required";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    save.mutate(draft);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">Education</h1>
        <AdminButton onClick={handleSave} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </AdminButton>
      </div>
      <div className="grid gap-3 rounded-xl border border-border bg-bg-secondary p-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <AdminLabel>School</AdminLabel>
          <AdminInput value={(draft.school as string) ?? ""} error={errors.school} onChange={(e) => set("school", e.target.value)} />
        </div>
        <div>
          <AdminLabel>Degree</AdminLabel>
          <AdminInput value={(draft.degree as string) ?? ""} error={errors.degree} onChange={(e) => set("degree", e.target.value)} />
        </div>
        <div>
          <AdminLabel>Grade</AdminLabel>
          <AdminInput value={(draft.grade as string) ?? ""} onChange={(e) => set("grade", e.target.value)} />
        </div>
        <div>
          <AdminLabel>Period</AdminLabel>
          <AdminInput value={(draft.period as string) ?? ""} onChange={(e) => set("period", e.target.value)} />
        </div>
        <div>
          <AdminLabel>Location</AdminLabel>
          <AdminInput value={(draft.location as string) ?? ""} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <ImageUpload
            label="School logo (optional)"
            value={draft.logoImage as ImageRef}
            onChange={(v) => set("logoImage", v ?? {})}
          />
        </div>
      </div>
    </div>
  );
}
