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
} from "@/components/ui/admin-input";

interface Award {
  id: string;
  title: string;
  event?: string;
  rank: string;
  orderIndex: number;
  isVisible: boolean;
}

const RANKS = ["winner", "runner-up", "2nd-runner-up", "top-5", "finalist", "honorable-mention"];

export default function AwardsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Award | null>(null);
  const [creating, setCreating] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.awards.list() });

  const create = useMutation({
    mutationFn: (b: Partial<Award>) => apiClient.post("/api/admin/awards", b),
    onSuccess: () => { toast.success("Added"); refresh(); setCreating(false); },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Award> }) =>
      apiClient.patch(`/api/admin/awards/${id}`, body),
    onSuccess: () => { toast.success("Saved"); refresh(); setEditing(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<Award>
        title="Awards"
        resourceUrl="/api/admin/awards"
        queryKey={queryKeys.awards.list()}
        rowLabel={(r) => r.title}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">{r.title}</p>
            <p className="text-[10px] text-text-tertiary">{r.event} · {r.rank}</p>
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
  initial?: Award;
  onCancel: () => void;
  onSubmit: (b: Partial<Award>) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [event, setEvent] = useState(initial?.event ?? "");
  const [rank, setRank] = useState(initial?.rank ?? "finalist");
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-text">
        {initial ? "Edit award" : "New award"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <AdminLabel>Title</AdminLabel>
          <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Event</AdminLabel>
          <AdminInput value={event} onChange={(e) => setEvent(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Rank</AdminLabel>
          <AdminSelect value={rank} onChange={(e) => setRank(e.target.value)}>
            {RANKS.map((r) => <option key={r}>{r}</option>)}
          </AdminSelect>
        </div>
        <div className="flex items-center gap-2">
          <AdminSwitch checked={isVisible} onCheckedChange={setIsVisible} />
          <span className="text-xs text-text-secondary">Visible</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>Cancel</AdminButton>
        <AdminButton onClick={() => onSubmit({ title, event, rank, isVisible })}>
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}
