"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMagnetic, useRipple } from "@/hooks/use-motion";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// "Engineered Motion" button: magnetic pull toward the cursor (outer
// wrapper), press rebound + ripple ink on the inner surface. The two
// transforms live on separate elements so they never fight.
export function Button({
  variant = "primary",
  children,
  className,
  href,
  onClick,
}: ButtonProps) {
  const magnetic = useMagnetic<HTMLSpanElement>({ strength: 0.35, max: 6 });
  const ripple = useRipple();

  return (
    <span
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      className="inline-flex"
    >
      <motion.a
        href={href}
        onClick={onClick}
        onMouseDown={ripple}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 520, damping: 30 }}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-[box-shadow,border-color,background-color,color] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          variant === "primary" &&
            "bg-accent text-on-accent shadow-(--glow-accent-sm) hover:shadow-(--glow-accent)",
          variant === "secondary" &&
            "border border-border text-text-secondary hover:border-accent/50 hover:text-text hover:shadow-(--glow-accent-sm)",
          className,
        )}
      >
        {children}
      </motion.a>
    </span>
  );
}
