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
import { fieldErrors, openSourceCreateSchema } from "@/lib/validations";

interface ContribItem {
  refId: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  url: string;
}
interface OpenSource {
  id: string;
  project: string;
  organization?: string;
  description?: string;
  repoUrl?: string;
  orderIndex: number;
  isVisible: boolean;
  contributions: ContribItem[];
}

export default function OpenSourcePage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<OpenSource | null>(null);
  const [creating, setCreating] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.openSource.list() });

  const create = useMutation({
    mutationFn: (b: Partial<OpenSource>) => apiClient.post("/api/admin/open-source", b),
    onSuccess: () => { toast.success("Added"); refresh(); setCreating(false); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<OpenSource> }) =>
      apiClient.patch(`/api/admin/open-source/${id}`, body),
    onSuccess: () => { toast.success("Saved"); refresh(); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<OpenSource>
        title="Open source contributions"
        resourceUrl="/api/admin/open-source"
        queryKey={queryKeys.openSource.list()}
        rowLabel={(r) => r.project}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">{r.project}</p>
            <p className="text-[10px] text-text-tertiary">{r.organization} · {r.contributions.length} contributions</p>
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
  initial?: OpenSource;
  onCancel: () => void;
  onSubmit: (b: Partial<OpenSource>) => void;
}) {
  const [project, setProject] = useState(initial?.project ?? "");
  const [organization, setOrganization] = useState(initial?.organization ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [contribs, setContribs] = useState<ContribItem[]>(initial?.contributions ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const body = { project, organization, description, repoUrl, isVisible, contributions: contribs };
    const errs = fieldErrors(openSourceCreateSchema, body);
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
        {initial ? "Edit open-source entry" : "New entry"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <AdminLabel>Project</AdminLabel>
          <AdminInput value={project} error={errors.project} onChange={(e) => setProject(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Organization</AdminLabel>
          <AdminInput value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Description</AdminLabel>
          <AdminTextarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Repo URL</AdminLabel>
          <AdminInput value={repoUrl} error={errors.repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <AdminSwitch checked={isVisible} onCheckedChange={setIsVisible} />
          <span className="text-xs text-text-secondary">Visible</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-text">Contributions</p>
        <div className="space-y-3">
          {contribs.map((c, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-border bg-bg p-3 md:grid-cols-[1fr_2fr_1fr_auto]">
              <div>
                <AdminLabel>Ref ID</AdminLabel>
                <AdminInput
                  value={c.refId}
                  onChange={(e) => {
                    const arr = [...contribs];
                    arr[i] = { ...c, refId: e.target.value };
                    setContribs(arr);
                  }}
                />
              </div>
              <div>
                <AdminLabel>Title</AdminLabel>
                <AdminInput
                  value={c.title}
                  onChange={(e) => {
                    const arr = [...contribs];
                    arr[i] = { ...c, title: e.target.value };
                    setContribs(arr);
                  }}
                />
              </div>
              <div>
                <AdminLabel>Severity</AdminLabel>
                <AdminSelect
                  value={c.severity}
                  onChange={(e) => {
                    const arr = [...contribs];
                    arr[i] = { ...c, severity: e.target.value as ContribItem["severity"] };
                    setContribs(arr);
                  }}
                >
                  {(["critical", "high", "medium", "low"] as const).map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </AdminSelect>
              </div>
              <AdminButton variant="ghost" onClick={() => setContribs(contribs.filter((_, j) => j !== i))}>
                ×
              </AdminButton>
              <div className="md:col-span-4">
                <AdminLabel>Description</AdminLabel>
                <AdminTextarea
                  rows={2}
                  value={c.description}
                  onChange={(e) => {
                    const arr = [...contribs];
                    arr[i] = { ...c, description: e.target.value };
                    setContribs(arr);
                  }}
                />
              </div>
              <div className="md:col-span-4">
                <AdminLabel>URL</AdminLabel>
                <AdminInput
                  value={c.url}
                  onChange={(e) => {
                    const arr = [...contribs];
                    arr[i] = { ...c, url: e.target.value };
                    setContribs(arr);
                  }}
                />
              </div>
            </div>
          ))}
          <AdminButton
            variant="secondary"
            onClick={() =>
              setContribs([
                ...contribs,
                { refId: "", title: "", severity: "medium", description: "", url: "" },
              ])
            }
          >
            + Add contribution
          </AdminButton>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>Cancel</AdminButton>
        <AdminButton onClick={submit}>
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}
