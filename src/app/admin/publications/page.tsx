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
  AdminSwitch,
  AdminTextarea,
} from "@/components/ui/admin-input";
import { fieldErrors, publicationCreateSchema } from "@/lib/validations";

interface Publication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi?: string;
  description?: string;
  orderIndex: number;
  isVisible: boolean;
}

export default function PublicationsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Publication | null>(null);
  const [creating, setCreating] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.publications.list() });

  const create = useMutation({
    mutationFn: (body: Partial<Publication>) => apiClient.post("/api/admin/publications", body),
    onSuccess: () => { toast.success("Added"); refresh(); setCreating(false); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Publication> }) =>
      apiClient.patch(`/api/admin/publications/${id}`, body),
    onSuccess: () => { toast.success("Saved"); refresh(); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<Publication>
        title="Publications"
        resourceUrl="/api/admin/publications"
        reorderUrl="/api/admin/publications/reorder"
        queryKey={queryKeys.publications.list()}
        rowLabel={(r) => r.title}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">{r.title}</p>
            <p className="text-[10px] text-text-tertiary truncate">
              {r.venue} · {r.year}
            </p>
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
  initial?: Publication;
  onCancel: () => void;
  onSubmit: (b: Partial<Publication>) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [authors, setAuthors] = useState(initial?.authors ?? "");
  const [venue, setVenue] = useState(initial?.venue ?? "");
  const [year, setYear] = useState(initial?.year ?? "");
  const [doi, setDoi] = useState(initial?.doi ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const body = { title, authors, venue, year, doi, description, isVisible };
    const errs = fieldErrors(publicationCreateSchema, body);
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
        {initial ? "Edit publication" : "New publication"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <AdminLabel>Title</AdminLabel>
          <AdminInput value={title} error={errors.title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Authors</AdminLabel>
          <AdminTextarea rows={2} value={authors} error={errors.authors} onChange={(e) => setAuthors(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Venue</AdminLabel>
          <AdminInput value={venue} error={errors.venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Year</AdminLabel>
          <AdminInput value={year} error={errors.year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>DOI</AdminLabel>
          <AdminInput value={doi} onChange={(e) => setDoi(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Description</AdminLabel>
          <AdminTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
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
