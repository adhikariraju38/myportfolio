"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionQuery } from "@/hooks/use-admin-data";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UniversalLoaderClient } from "@/components/shared/universal-loader-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useSessionQuery();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !data)) router.push("/login?redirect=/admin");
  }, [isLoading, isError, data, router]);

  if (isLoading || !data) return <UniversalLoaderClient />;

  return (
    <div className="flex min-h-screen bg-bg">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main className="min-w-0 flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
