import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function AdminPlaceholderPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/admin");

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-2 font-display text-3xl font-bold text-text">Admin</h1>
      <p className="mb-8 text-sm text-text-secondary">
        Signed in as <strong className="text-text">{user.name}</strong> ({user.role})
      </p>
      <p className="mb-6 text-sm text-text-secondary">
        Dashboard and modules are wired up in Phase 07 onwards. Phase 02 placeholder.
      </p>
      <LogoutButton />
    </main>
  );
}
