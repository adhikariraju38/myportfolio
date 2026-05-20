"use client";

import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await apiClient.post("/api/auth/logout");
        router.push("/login");
        router.refresh();
      }}
      className={
        className ??
        "rounded-full border border-border px-4 py-2 text-xs font-medium text-text-secondary transition-colors hover:text-text"
      }
    >
      Sign out
    </button>
  );
}
