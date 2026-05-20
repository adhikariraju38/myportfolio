"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { ResourceList } from "@/components/admin/resource-list";
import { AdminButton, AdminInput, AdminLabel, AdminSwitch, AdminTextarea } from "@/components/ui/admin-input";

interface Community {
  id: string;
  role: string;
  org: string;
  year?: string;
  description?: string;
  orderIndex: number;
  isVisible: boolean;
}

export default function CommunityPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Community | null>(null);
  const [creating, setCreating] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.community.list() });

  const create = useMutation({
    mutationFn: (b: Partial<Community>) => apiClient.post("/api/admin/community", b),
    onSuccess: () => { toast.success("Added"); refresh(); setCreating(false); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Community> }) =>
      apiClient.patch(`/api/admin/community/${id}`, body),
    onSuccess: () => { toast.success("Saved"); refresh(); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<Community>
        title="Community involvement"
        resourceUrl="/api/admin/community"
        queryKey={queryKeys.community.list()}
        rowLabel={(r) => `${r.role} @ ${r.org}`}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">{r.role} <span className="text-text-tertiary">@</span> {r.org}</p>
            <p className="text-[10px] text-text-tertiary">{r.year}</p>
          </div>
        )}
        onEdit={setEditing}
        onCreate={() => setCreating(true)}
      />
      {(creating || editing) && (
        <Form
          initial={editing ?? undefined}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSubmit={(b) => (editing ? update.mutate({ id: editing.id, body: b }) : create.mutate(b))}
        />
      )}
    </div>
  );
}

function Form({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Community;
  onCancel: () => void;
  onSubmit: (b: Partial<Community>) => void;
}) {
  const [role, setRole] = useState(initial?.role ?? "");
  const [org, setOrg] = useState(initial?.org ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-text">
        {initial ? "Edit entry" : "New entry"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <AdminLabel>Role</AdminLabel>
          <AdminInput value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Organization</AdminLabel>
          <AdminInput value={org} onChange={(e) => setOrg(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Year</AdminLabel>
          <AdminInput value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <AdminSwitch checked={isVisible} onCheckedChange={setIsVisible} />
          <span className="text-xs text-text-secondary">Visible</span>
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Description</AdminLabel>
          <AdminTextarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>Cancel</AdminButton>
        <AdminButton onClick={() => onSubmit({ role, org, year, description, isVisible })}>
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}
