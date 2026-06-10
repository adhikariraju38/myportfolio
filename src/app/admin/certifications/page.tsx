"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { ResourceList } from "@/components/admin/resource-list";
import { AdminButton, AdminInput, AdminLabel, AdminSwitch } from "@/components/ui/admin-input";
import { fieldErrors, certificationCreateSchema } from "@/lib/validations";

interface Cert {
  id: string;
  title: string;
  issuer?: string;
  link?: string;
  orderIndex: number;
  isVisible: boolean;
}

export default function CertificationsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Cert | null>(null);
  const [creating, setCreating] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.certifications.list() });

  const create = useMutation({
    mutationFn: (b: Partial<Cert>) => apiClient.post("/api/admin/certifications", b),
    onSuccess: () => { toast.success("Added"); refresh(); setCreating(false); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Cert> }) =>
      apiClient.patch(`/api/admin/certifications/${id}`, body),
    onSuccess: () => { toast.success("Saved"); refresh(); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<Cert>
        title="Certifications"
        resourceUrl="/api/admin/certifications"
        queryKey={queryKeys.certifications.list()}
        rowLabel={(r) => r.title}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">{r.title}</p>
            <p className="text-[10px] text-text-tertiary truncate">{r.issuer}</p>
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
  initial?: Cert;
  onCancel: () => void;
  onSubmit: (b: Partial<Cert>) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [issuer, setIssuer] = useState(initial?.issuer ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const body = { title, issuer, link, isVisible };
    const errs = fieldErrors(certificationCreateSchema, body);
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
        {initial ? "Edit certification" : "New certification"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <AdminLabel>Title</AdminLabel>
          <AdminInput value={title} error={errors.title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Issuer</AdminLabel>
          <AdminInput value={issuer} onChange={(e) => setIssuer(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Link</AdminLabel>
          <AdminInput value={link} error={errors.link} onChange={(e) => setLink(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <AdminSwitch checked={isVisible} onCheckedChange={setIsVisible} />
          <span className="text-xs text-text-secondary">Visible</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>Cancel</AdminButton>
        <AdminButton onClick={submit}>
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}
