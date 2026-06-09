"use client";

import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/usePerformanceTier";
import { useTilt } from "@/hooks/use-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
}

// Engineered surface that tilts toward the cursor (hand-rolled spring
// physics) with an accent spotlight tracking the pointer. Tilt/spotlight
// are gated on the performance tier; reduced-motion collapses the tilt.
export function Card({ children, className, spotlight = true }: CardProps) {
  const perf = usePerformance();
  const enableTilt = perf.enableCardTilt;
  const enableSpotlight = spotlight && perf.enableCardTilt;
  const tilt = useTilt<HTMLDivElement>({ max: 8, spotlight: enableSpotlight });

  return (
    <div
      ref={tilt.ref}
      onMouseMove={enableTilt || enableSpotlight ? tilt.onMouseMove : undefined}
      onMouseLeave={enableTilt || enableSpotlight ? tilt.onMouseLeave : undefined}
      className={cn(
        "group relative overflow-hidden rounded-xl glass-card glass-highlight p-6 transition-shadow duration-300 focus-within:ring-2 focus-within:ring-accent/30",
        // hover lift only applies when tilt is off (tilt owns the transform)
        !enableTilt && "transition-[transform,box-shadow] hover:-translate-y-1",
        "hover:shadow-(--glow-accent-sm)",
        enableSpotlight &&
          "after:pointer-events-none after:absolute after:inset-0 after:z-2 after:rounded-xl after:opacity-0 after:transition-opacity hover:after:opacity-100",
        enableSpotlight &&
          "after:bg-[radial-gradient(400px_circle_at_var(--spotlight-x)_var(--spotlight-y),var(--accent-soft),transparent_60%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
