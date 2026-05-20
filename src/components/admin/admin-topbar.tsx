"use client";

import { usePathname } from "next/navigation";
import { useSessionQuery } from "@/hooks/use-admin-data";
import { LogoutButton } from "@/components/auth/logout-button";

function titleFromPath(path: string): string {
  if (path === "/admin" || path === "/admin/") return "Dashboard";
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function AdminTopbar() {
  const pathname = usePathname();
  const { data } = useSessionQuery();
  const user = data?.user;

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-bg-secondary px-5">
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <span>Admin</span>
        <span>›</span>
        <span className="font-medium text-text">{titleFromPath(pathname)}</span>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-xs text-text-secondary">
            {user.name} · <span className="opacity-70">{user.role.replace("_", " ")}</span>
          </span>
        )}
        <LogoutButton />
      </div>
    </header>
  );
}
