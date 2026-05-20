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
import { ImageUpload, type ImageRef } from "@/components/admin/image-upload";

interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  tech: string[];
  metric?: string;
  link?: string;
  github?: string;
  coverImage?: ImageRef;
  orderIndex: number;
  isPublished: boolean;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function ProjectsAdminPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.projects.list() });

  const create = useMutation({
    mutationFn: (body: Partial<Project>) => apiClient.post("/api/admin/projects", body),
    onSuccess: () => {
      toast.success("Added");
      refresh();
      setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Project> }) =>
      apiClient.patch(`/api/admin/projects/${id}`, body),
    onSuccess: () => {
      toast.success("Saved");
      refresh();
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <ResourceList<Project>
        title="Projects"
        resourceUrl="/api/admin/projects"
        reorderUrl="/api/admin/projects/reorder"
        queryKey={queryKeys.projects.list()}
        rowLabel={(r) => r.title}
        renderRow={(r) => (
          <div>
            <p className="text-sm text-text">{r.title}</p>
            <p className="text-[10px] font-mono text-text-tertiary">/{r.slug} {r.isPublished ? "" : "· draft"}</p>
          </div>
        )}
        onEdit={setEditing}
        onCreate={() => setCreating(true)}
      />

      {(creating || editing) && (
        <ProjectForm
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

function ProjectForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Project;
  onCancel: () => void;
  onSubmit: (b: Partial<Project>) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tech, setTech] = useState<string[]>(initial?.tech ?? []);
  const [metric, setMetric] = useState(initial?.metric ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [github, setGithub] = useState(initial?.github ?? "");
  const [coverImage, setCoverImage] = useState<ImageRef | null>(initial?.coverImage ?? null);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? true);

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-text">
        {initial ? "Edit project" : "New project"}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <AdminLabel>Title</AdminLabel>
          <AdminInput
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!initial && !slug) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div>
          <AdminLabel>Slug</AdminLabel>
          <AdminInput value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Subtitle</AdminLabel>
          <AdminInput value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <AdminLabel>Description</AdminLabel>
          <AdminTextarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <AdminLabel>Metric</AdminLabel>
          <AdminInput value={metric} onChange={(e) => setMetric(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Link</AdminLabel>
          <AdminInput value={link} onChange={(e) => setLink(e.target.value)} />
        </div>
        <div>
          <AdminLabel>GitHub</AdminLabel>
          <AdminInput value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>
        <div>
          <AdminLabel>Tech (one per line)</AdminLabel>
          <AdminTextarea
            rows={4}
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
        <ImageUpload
          label="Cover image"
          value={coverImage ?? undefined}
          onChange={(v) => setCoverImage(v)}
        />
        <div className="flex items-center gap-2 pt-5">
          <AdminSwitch checked={isPublished} onCheckedChange={setIsPublished} />
          <span className="text-xs text-text-secondary">Published</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <AdminButton variant="secondary" onClick={onCancel}>
          Cancel
        </AdminButton>
        <AdminButton
          onClick={() =>
            onSubmit({
              title,
              slug,
              subtitle,
              description,
              tech,
              metric,
              link,
              github,
              coverImage: coverImage ?? {},
              isPublished,
            })
          }
        >
          {initial ? "Save" : "Add"}
        </AdminButton>
      </div>
    </div>
  );
}
