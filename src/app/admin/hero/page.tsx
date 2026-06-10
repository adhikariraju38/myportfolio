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
  AdminSwitch,
  AdminTextarea,
} from "@/components/ui/admin-input";
import { SkeletonForm } from "@/components/shared/skeleton";

type Hero = Record<string, unknown>;

export default function HeroPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Hero | null>({
    queryKey: queryKeys.hero(),
    queryFn: () => apiClient.get("/api/admin/hero"),
  });
  const [draft, setDraft] = useState<Hero>({});
  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const save = useMutation({
    mutationFn: (body: Hero) => apiClient.patch("/api/admin/hero", body),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: queryKeys.hero() });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isLoading) return <SkeletonForm />;
  const set = (k: string, v: unknown) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: undefined as unknown as string } : e));
  };
  const cta = (k: "primaryCta" | "secondaryCta") => (draft[k] as Record<string, string>) ?? {};

  const handleSave = () => {
    const next: Record<string, string> = {};
    if (!String(draft.name ?? "").trim()) next.name = "Name is required";
    if (!String(draft.title ?? "").trim()) next.title = "Title is required";
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
        <h1 className="font-display text-2xl font-bold text-text">Hero</h1>
        <AdminButton onClick={handleSave} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </AdminButton>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-bg-secondary p-5 md:grid-cols-2">
        <div>
          <AdminLabel>Eyebrow text</AdminLabel>
          <AdminInput
            value={(draft.eyebrowText as string) ?? ""}
            onChange={(e) => set("eyebrowText", e.target.value)}
          />
        </div>
        <div>
          <AdminLabel>Name</AdminLabel>
          <AdminInput
            value={(draft.name as string) ?? ""}
            error={errors.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Title (role)</AdminLabel>
          <AdminInput
            value={(draft.title as string) ?? ""}
            error={errors.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Tagline</AdminLabel>
          <AdminTextarea
            rows={3}
            value={(draft.tagline as string) ?? ""}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </div>
        <div>
          <AdminLabel>Primary CTA label</AdminLabel>
          <AdminInput
            value={cta("primaryCta").label ?? ""}
            onChange={(e) => set("primaryCta", { ...cta("primaryCta"), label: e.target.value })}
          />
        </div>
        <div>
          <AdminLabel>Primary CTA href</AdminLabel>
          <AdminInput
            value={cta("primaryCta").href ?? ""}
            onChange={(e) => set("primaryCta", { ...cta("primaryCta"), href: e.target.value })}
          />
        </div>
        <div>
          <AdminLabel>Secondary CTA label</AdminLabel>
          <AdminInput
            value={cta("secondaryCta").label ?? ""}
            onChange={(e) =>
              set("secondaryCta", { ...cta("secondaryCta"), label: e.target.value })
            }
          />
        </div>
        <div>
          <AdminLabel>Secondary CTA href</AdminLabel>
          <AdminInput
            value={cta("secondaryCta").href ?? ""}
            onChange={(e) =>
              set("secondaryCta", { ...cta("secondaryCta"), href: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-2 md:col-span-2">
          <AdminSwitch
            checked={Boolean(draft.enable3dCanvas)}
            onCheckedChange={(v) => set("enable3dCanvas", v)}
          />
          <span className="text-xs text-text-secondary">Enable 3D hero canvas</span>
        </div>
      </div>
    </div>
  );
}
