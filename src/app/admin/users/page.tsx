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
  AdminSelect,
  AdminSwitch,
} from "@/components/ui/admin-input";
import { SkeletonList } from "@/components/shared/skeleton";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { useSessionQuery } from "@/hooks/use-admin-data";
import { fieldErrors, userCreateSchema } from "@/lib/validations";

interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin";
  isActive: boolean;
  lastLoginAt?: string;
}

export default function UsersPage() {
  const session = useSessionQuery();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<User[]>({
    queryKey: queryKeys.users.list(),
    queryFn: () => apiClient.get("/api/admin/users"),
  });

  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);

  const create = useMutation({
    mutationFn: (body: { email: string; name: string; password: string; role: User["role"]; isActive: boolean }) =>
      apiClient.post("/api/admin/users", body),
    onSuccess: () => {
      toast.success("Added");
      qc.invalidateQueries({ queryKey: queryKeys.users.list() });
      setAdding(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<User & { password: string }> }) =>
      apiClient.patch(`/api/admin/users/${id}`, body),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: queryKeys.users.list() });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: queryKeys.users.list() });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (session.data?.user.role !== "super_admin") {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-6 text-sm text-text-secondary">
        Users management is restricted to super admins.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text">Users</h1>
        <AdminButton onClick={() => setAdding(true)}>+ Add user</AdminButton>
      </div>
      {isLoading ? (
        <SkeletonList rows={3} />
      ) : (
        <div className="space-y-2">
          {(data ?? []).map((u) => (
            <div
              key={u.id}
              className="grid items-center gap-3 rounded-md border border-border bg-bg-secondary p-3 md:grid-cols-[1.5fr_2fr_1fr_auto_auto]"
            >
              <div>
                <p className="text-sm text-text">{u.name}</p>
                <p className="text-[10px] font-mono text-text-tertiary">{u.email}</p>
              </div>
              <p className="font-mono text-[10px] text-text-tertiary">{u.role}</p>
              <AdminSwitch
                checked={u.isActive}
                onCheckedChange={(v) => update.mutate({ id: u.id, body: { isActive: v } })}
              />
              <AdminButton
                variant="secondary"
                onClick={() => {
                  const pw = window.prompt("New password (min 8 chars)") ?? "";
                  if (pw.length >= 8) update.mutate({ id: u.id, body: { password: pw } });
                  else if (pw) toast.error("Too short");
                }}
              >
                Reset password
              </AdminButton>
              <AdminButton variant="danger" onClick={() => setToDelete(u)}>
                ×
              </AdminButton>
            </div>
          ))}
        </div>
      )}

      {adding && (
        <NewUserForm
          onCancel={() => setAdding(false)}
          onSubmit={(body) => create.mutate(body)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        title={`Delete "${toDelete?.name}"?`}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) await del.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}

function NewUserForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (b: { email: string; name: string; password: string; role: User["role"]; isActive: boolean }) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<User["role"]>("admin");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = () => {
    const body = { email, name, password, role, isActive: true };
    const errs = fieldErrors(userCreateSchema, body);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit(body);
  };

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <AdminLabel>Email</AdminLabel>
          <AdminInput value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Name</AdminLabel>
          <AdminInput value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Password (min 8)</AdminLabel>
          <AdminInput
            type="password"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <AdminLabel>Role</AdminLabel>
          <AdminSelect value={role} onChange={(e) => setRole(e.target.value as User["role"])}>
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </AdminSelect>
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton onClick={submit}>
          Add
        </AdminButton>
      </div>
    </div>
  );
}
