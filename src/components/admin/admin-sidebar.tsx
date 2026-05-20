"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionQuery } from "@/hooks/use-admin-data";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  superAdminOnly?: boolean;
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Site",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/settings", label: "Settings" },
      { href: "/admin/navigation", label: "Navigation" },
      { href: "/admin/sections", label: "Section Order" },
      { href: "/admin/media", label: "Media" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/about", label: "About" },
      { href: "/admin/experience", label: "Experience" },
      { href: "/admin/skills", label: "Skills" },
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/publications", label: "Publications" },
      { href: "/admin/open-source", label: "Open Source" },
      { href: "/admin/awards", label: "Awards" },
      { href: "/admin/certifications", label: "Certifications" },
      { href: "/admin/education", label: "Education" },
      { href: "/admin/community", label: "Community" },
    ],
  },
  {
    title: "Ops",
    items: [{ href: "/admin/inquiries", label: "Inquiries" }],
  },
  {
    title: "Admin",
    items: [{ href: "/admin/users", label: "Users", superAdminOnly: true }],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data } = useSessionQuery();
  const isSuper = data?.user.role === "super_admin";

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-secondary lg:block">
      <div className="sticky top-0 max-h-screen overflow-y-auto px-3 py-4">
        <div className="mb-4 px-2 font-display text-lg font-bold text-text">Portfolio CMS</div>
        {GROUPS.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
              {group.title}
            </div>
            <nav className="flex flex-col">
              {group.items.map((it) => {
                if (it.superAdminOnly && !isSuper) return null;
                const active =
                  it.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(it.href);
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cn(
                      "rounded-md px-2 py-1.5 text-xs transition-colors",
                      active
                        ? "bg-bg-tertiary text-text"
                        : "text-text-secondary hover:bg-bg-tertiary/40 hover:text-text",
                    )}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
