import { getSiteSettings } from "@/lib/queries/site";

interface UniversalLoaderProps {
  label?: string;
}

export async function UniversalLoader({ label }: UniversalLoaderProps = {}) {
  const settings = await getSiteSettings().catch(() => null);
  const brand = (settings?.brandShort as string | undefined) ?? "RKY";

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
          <div className="absolute inset-0 flex items-center justify-center rounded-full border border-accent/40 bg-bg-secondary font-display text-lg font-bold text-accent">
            {brand}
          </div>
        </div>
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: "0ms" }} />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: "150ms" }} />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: "300ms" }} />
        </div>
        {label && <p className="text-xs text-text-secondary">{label}</p>}
      </div>
    </div>
  );
}
