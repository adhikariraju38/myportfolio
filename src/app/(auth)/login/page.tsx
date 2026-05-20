import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(params.redirect ?? "/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 font-display text-3xl font-bold text-text">Admin sign in</h1>
        <p className="mb-8 text-sm text-text-secondary">
          Portfolio content management. Public viewers don&apos;t need an account.
        </p>
        <LoginForm redirectTo={params.redirect ?? "/admin"} />
      </div>
    </main>
  );
}
