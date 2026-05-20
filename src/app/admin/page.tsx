"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { SkeletonCard } from "@/components/shared/skeleton";

type ListResult<T = Record<string, unknown>> = T[];

function useCounts() {
  return useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [projects, experiences, sections, inquiries] = await Promise.all([
        apiClient.get<ListResult>("/api/admin/projects"),
        apiClient.get<ListResult>("/api/admin/experience"),
        apiClient.get<ListResult>("/api/admin/sections"),
        apiClient.get<ListResult>("/api/admin/inquiries"),
      ]);
      return {
        projects: projects.length,
        experiences: experiences.length,
        sectionsVisible: sections.filter((s) => s.isVisible).length,
        sectionsTotal: sections.length,
        inquiriesNew: inquiries.filter((i) => i.status === "new").length,
        inquiries: inquiries.slice(0, 5),
      };
    },
  });
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-4">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-text">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useCounts();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-sm text-text-secondary">Edit any section to update the public site.</p>
      </div>
      {isLoading || !data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Projects" value={data.projects} />
          <StatCard label="Experiences" value={data.experiences} />
          <StatCard label="Sections visible" value={`${data.sectionsVisible}/${data.sectionsTotal}`} />
          <StatCard label="New inquiries" value={data.inquiriesNew} />
        </div>
      )}

      <div className="rounded-xl border border-border bg-bg-secondary p-5">
        <h2 className="mb-3 font-display text-base font-semibold text-text">Quick actions</h2>
        <div className="flex flex-wrap gap-2">
          {[
            ["/admin/settings", "Site Settings"],
            ["/admin/hero", "Edit Hero"],
            ["/admin/projects", "Projects"],
            ["/admin/inquiries", "Inquiries"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href as string}
              className="rounded-full border border-border bg-bg px-4 py-2 text-xs text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
