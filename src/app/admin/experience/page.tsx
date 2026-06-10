"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { ResourceList } from "@/components/admin/resource-list";
import {
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminSwitch,
  AdminTextarea,
} from "@/components/ui/admin-input";
import { ArrayInput } from "@/components/admin/array-input";
import { fieldErrors, experienceCreateSchema } from "@/lib/validations";

interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  period?: string;
  type: "full-time" | "remote" | "freelance" | "contract" | "internship";
  bullets: string[];
  tech: string[];
  orderIndex: number;
  isVisible: boolean;
}

export default function ExperienceAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Experience | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.experiences.list() });

  const create = useMutation({
    mutationFn: (body: Partial<Experience>) => apiClient.post("/api/admin/experience", body),
    onSuccess: () => {
      toast.success("Added");
      refresh();
      setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Experience> }) =>
      apiClient.patch(`/api/admin/experience/${id}`, body),
    onSuccess: () => {
      toast.success("Saved");
      refresh();
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<Experience>
        title="Experience"
        description="Roles, with bullets and tech stack."
        resourceUrl="/api/admin/experience"
        reorderUrl="/api/admin/experience/reorder"
        queryKey={queryKeys.experiences.list()}
        rowLabel={(r) => `${r.role} @ ${r.company}`}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">
              {r.role} <span className="text-text-tertiary">@</span> {r.company}
            </p>
            <p className="text-[10px] font-mono text-text-tertiary">
              {r.period} · {r.location} · {r.type}
            </p>
          </div>
        )}
        onEdit={setEditing}
        onCreate={() => setCreating(true)}
      />

      {(creating || editing) && (
        <ExperienceForm
          initial={editing ?? undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={(body) =>
            editing ? update.mutate({ id: editing.id, body }) : create.mutate(body)
          }
        />
      )}
    </div>
  );
}

function ExperienceForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Experience;
  onCancel: () => void;
  onSubmit: (b: Partial<Experience>) => void;
}) {
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [period, setPeriod] = useState(initial?.period ?? "");
  const [type, setType] = useState<Experience["type"]>(initial?.type ?? "full-time");
  const [bullets, setBullets] = useState<string[]>(initial?.bullets ?? []);
  const [tech, setTech] = useState<string[]>(initial?.tech ?? []);
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const body = {
      company,
      role,
      location,
      period,
      type,
      bullets: bullets.filter((s) => s.trim().length > 0),
      tech,
      isVisible,
    };
    const errs = fieldErrors(experienceCreateSchema, body);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit(body);
  };

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-text">
        {initial ? "Edit experience" : "New experience"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <AdminLabel>Company</AdminLabel>
          <AdminInput value={company} error={errors.company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Role</AdminLabel>
          <AdminInput value={role} error={errors.role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Location</AdminLabel>
          <AdminInput value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Period</AdminLabel>
          <AdminInput value={period} onChange={(e) => setPeriod(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Type</AdminLabel>
          <AdminSelect value={type} onChange={(e) => setType(e.target.value as Experience["type"])}>
            {["full-time", "remote", "freelance", "contract", "internship"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </AdminSelect>
        </div>
        <div className="flex items-center gap-2 pt-5">
          <AdminSwitch checked={isVisible} onCheckedChange={setIsVisible} />
          <span className="text-xs text-text-secondary">Visible</span>
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Bullets</AdminLabel>
          <ArrayInput value={bullets} onChange={setBullets} textarea placeholder="Achievement…" />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Tech stack (one per line)</AdminLabel>
          <AdminTextarea
            rows={3}
            value={tech.join("\n")}
            onChange={(e) =>
              setTech(
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton onClick={submit}>
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}
