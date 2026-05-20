"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  AdminButton,
  AdminInput,
  AdminLabel,
  AdminSelect,
  AdminSwitch,
} from "@/components/ui/admin-input";
import { SkeletonList } from "@/components/shared/skeleton";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  location: "header" | "footer";
  orderIndex: number;
  isActive: boolean;
  opensInNewTab: boolean;
}

function NavList({ location }: { location: "header" | "footer" }) {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery<NavItem[]>({
    queryKey: ["nav", location],
    queryFn: () => apiClient.get(`/api/admin/navigation?location=${location}`),
  });

  const [editing, setEditing] = useState<NavItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<NavItem | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["nav", location] });
  };

  const create = useMutation({
    mutationFn: (body: Partial<NavItem>) => apiClient.post("/api/admin/navigation", { ...body, location }),
    onSuccess: () => {
      toast.success("Added");
      refresh();
      setAdding(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<NavItem> }) =>
      apiClient.patch(`/api/admin/navigation/${id}`, body),
    onSuccess: () => {
      toast.success("Saved");
      refresh();
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/admin/navigation/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      refresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) =>
      apiClient.patch("/api/admin/navigation/reorder", {
        items: orderedIds.map((id, i) => ({ id, orderIndex: i })),
      }),
    onSuccess: () => refresh(),
  });

  function move(i: number, dir: -1 | 1) {
    if (!items) return;
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const ids = items.map((it) => it.id);
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    reorder.mutate(ids);
  }

  if (isLoading || !items) return <SkeletonList rows={5} />;

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <AdminButton onClick={() => setAdding(true)}>+ Add</AdminButton>
      </div>
      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-text-secondary">
          No items.
        </div>
      )}
      {items.map((it, i) => (
        <div
          key={it.id}
          className="flex items-center gap-3 rounded-md border border-border bg-bg-secondary p-3"
        >
          <span className="font-mono text-[10px] text-text-tertiary">{i + 1}.</span>
          <div className="flex-1">
            <p className="text-sm text-text">{it.label}</p>
            <p className="text-[10px] font-mono text-text-tertiary">{it.href}</p>
          </div>
          <AdminSwitch
            checked={it.isActive}
            onCheckedChange={(v) => update.mutate({ id: it.id, body: { isActive: v } })}
          />
          <AdminButton variant="ghost" onClick={() => move(i, -1)} disabled={i === 0}>
            ↑
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
            ↓
          </AdminButton>
          <AdminButton variant="secondary" onClick={() => setEditing(it)}>
            Edit
          </AdminButton>
          <AdminButton variant="danger" onClick={() => setToDelete(it)}>
            ×
          </AdminButton>
        </div>
      ))}

      {(adding || editing) && (
        <NavForm
          initial={editing ?? undefined}
          location={location}
          onCancel={() => {
            setAdding(false);
            setEditing(null);
          }}
          onSubmit={(body) => {
            if (editing) update.mutate({ id: editing.id, body });
            else create.mutate(body);
          }}
        />
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.label}"?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await remove.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

function NavForm({
  initial,
  location,
  onCancel,
  onSubmit,
}: {
  initial?: NavItem;
  location: "header" | "footer";
  onCancel: () => void;
  onSubmit: (body: Partial<NavItem>) => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [opensInNewTab, setOpensInNewTab] = useState(initial?.opensInNewTab ?? false);

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <p className="mb-3 text-sm font-medium text-text">
        {initial ? "Edit item" : "New item"} ({location})
      </p>
      <div className="grid gap-3 md:grid-cols-4">
        <div>
          <AdminLabel>Label</AdminLabel>
          <AdminInput value={label} onChange={(e) => setLabel(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Href</AdminLabel>
          <AdminInput value={href} onChange={(e) => setHref(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Icon (key)</AdminLabel>
          <AdminSelect value={icon} onChange={(e) => setIcon(e.target.value)}>
            <option value="">— none —</option>
            {["user", "briefcase", "code", "folder", "file-text", "github", "linkedin", "mail", "award", "graduation-cap"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </AdminSelect>
        </div>
        <div className="flex items-center gap-2 pt-5 md:col-span-4">
          <AdminSwitch checked={opensInNewTab} onCheckedChange={setOpensInNewTab} />
          <span className="text-xs text-text-secondary">Open in new tab</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton onClick={() => onSubmit({ label, href, icon, opensInNewTab })}>
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}

export default function NavigationPage() {
  const [tab, setTab] = useState<"header" | "footer">("header");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Navigation</h1>
        <p className="text-sm text-text-secondary">
          Edit header and footer items. Public site picks them up after a few seconds.
        </p>
      </div>
      <div className="flex gap-1 border-b border-border">
        {(["header", "footer"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              "rounded-t-md px-3 py-1.5 text-xs " +
              (t === tab
                ? "border border-b-0 border-border bg-bg-secondary text-text"
                : "text-text-secondary hover:text-text")
            }
          >
            {t === "header" ? "Header" : "Footer"}
          </button>
        ))}
      </div>
      <NavList location={tab} />
    </div>
  );
}
