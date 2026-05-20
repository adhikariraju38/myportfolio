import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export default async function NotFound() {
  const s = await getSiteSettings().catch(() => null);
  const brand = (s?.brandShort as string | undefined) ?? "RKY";
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-accent">{brand}</p>
      <h1 className="font-display text-8xl font-bold text-accent">404</h1>
      <p className="mt-4 text-lg text-text-secondary">Page not found</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
      >
        Back to Home
      </Link>
    </div>
  );
}
