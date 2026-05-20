"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import {
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminSwitch,
} from "@/components/ui/admin-input";
import { SkeletonList } from "@/components/shared/skeleton";

interface Category {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
}
interface Skill {
  id: string;
  name: string;
  categoryId: string;
  production: boolean;
  orderIndex: number;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SkillsPage() {
  const qc = useQueryClient();
  const { data: cats, isLoading: catsLoading } = useQuery<Category[]>({
    queryKey: queryKeys.skillCategories.list(),
    queryFn: () => apiClient.get("/api/admin/skill-categories"),
  });
  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: queryKeys.skills.list(),
    queryFn: () => apiClient.get("/api/admin/skills"),
  });

  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newSkillName, setNewSkillName] = useState("");

  const refreshCats = () => qc.invalidateQueries({ queryKey: queryKeys.skillCategories.list() });
  const refreshSkills = () => qc.invalidateQueries({ queryKey: queryKeys.skills.list() });

  const createCat = useMutation({
    mutationFn: (body: Partial<Category>) => apiClient.post("/api/admin/skill-categories", body),
    onSuccess: () => {
      toast.success("Category added");
      setNewCatName("");
      refreshCats();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const updateCat = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Category> }) =>
      apiClient.patch(`/api/admin/skill-categories/${id}`, body),
    onSuccess: () => refreshCats(),
  });
  const deleteCat = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/admin/skill-categories/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      refreshCats();
      refreshSkills();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createSkill = useMutation({
    mutationFn: (body: Partial<Skill>) => apiClient.post("/api/admin/skills", body),
    onSuccess: () => {
      toast.success("Skill added");
      setNewSkillName("");
      refreshSkills();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const updateSkill = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Skill> }) =>
      apiClient.patch(`/api/admin/skills/${id}`, body),
    onSuccess: () => refreshSkills(),
  });
  const deleteSkill = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/admin/skills/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      refreshSkills();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (catsLoading || skillsLoading) return <SkeletonList rows={6} />;

  const filtered = (skills ?? []).filter((s) => (activeCat ? s.categoryId === activeCat : true));

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-bold text-text">Skills</h1>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-xl border border-border bg-bg-secondary p-3">
          <p className="mb-2 px-2 text-xs font-medium text-text-secondary">Categories</p>
          <div className="space-y-1">
            {(cats ?? []).map((c) => (
              <div
                key={c.id}
                className={
                  "flex items-center gap-2 rounded-md px-2 py-1.5 " +
                  (activeCat === c.id ? "bg-bg-tertiary" : "")
                }
              >
                <button
                  onClick={() => setActiveCat(activeCat === c.id ? null : c.id)}
                  className="flex-1 truncate text-left text-xs text-text"
                >
                  {c.name}
                </button>
                <button
                  onClick={() => {
                    const name = window.prompt("Rename category", c.name) ?? "";
                    if (name && name !== c.name) {
                      updateCat.mutate({ id: c.id, body: { name } });
                    }
                  }}
                  className="text-[10px] text-text-tertiary hover:text-text"
                >
                  edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete category "${c.name}"? Its skills will need to be reassigned.`)) {
                      deleteCat.mutate(c.id);
                    }
                  }}
                  className="text-[10px] text-text-tertiary hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <AdminInput
              placeholder="New category"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <AdminButton
              onClick={() => {
                if (!newCatName.trim()) return;
                createCat.mutate({
                  name: newCatName.trim(),
                  slug: slugify(newCatName),
                  orderIndex: (cats?.length ?? 0),
                });
              }}
            >
              +
            </AdminButton>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-3">
          <p className="mb-2 px-2 text-xs font-medium text-text-secondary">
            {activeCat ? "Skills in category" : "All skills"}
          </p>
          <div className="space-y-1">
            {filtered.map((s) => (
              <div key={s.id} className="flex items-center gap-2 rounded-md px-2 py-1.5">
                <span className="flex-1 truncate text-xs text-text">{s.name}</span>
                <span className="text-[10px] text-text-tertiary">
                  {cats?.find((c) => c.id === s.categoryId)?.name ?? "?"}
                </span>
                <AdminSwitch
                  checked={s.production}
                  onCheckedChange={(v) => updateSkill.mutate({ id: s.id, body: { production: v } })}
                />
                <button
                  onClick={() => deleteSkill.mutate(s.id)}
                  className="text-[10px] text-text-tertiary hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {activeCat && (
            <div className="mt-3 flex gap-2">
              <AdminInput
                placeholder="New skill"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
              <AdminButton
                onClick={() => {
                  if (!newSkillName.trim()) return;
                  createSkill.mutate({
                    name: newSkillName.trim(),
                    categoryId: activeCat,
                    production: false,
                    orderIndex: filtered.length,
                  });
                }}
              >
                +
              </AdminButton>
            </div>
          )}
          {!activeCat && (cats ?? []).length > 0 && (
            <p className="mt-3 text-[10px] text-text-tertiary">
              Pick a category on the left to add skills.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
