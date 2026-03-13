"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/types";

const categoryColors: Record<SkillCategory, string> = {
  Languages: "hover:border-accent-amber/50 hover:text-accent-amber",
  Backend: "hover:border-accent/50 hover:text-accent",
  Frontend: "hover:border-cyan-400/50 hover:text-cyan-400",
  Databases: "hover:border-accent-emerald/50 hover:text-accent-emerald",
  "DevOps & Cloud": "hover:border-violet-400/50 hover:text-violet-400",
  Architecture: "hover:border-accent/50 hover:text-accent",
  Testing: "hover:border-accent-emerald/50 hover:text-accent-emerald",
};

interface BadgeProps {
  children: React.ReactNode;
  category?: SkillCategory;
  variant?: "default" | "production" | "tech";
  className?: string;
}

export function Badge({
  children,
  category,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <motion.span
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200",
        variant === "tech" &&
          "border-border bg-bg-secondary text-text-secondary",
        variant === "production" &&
          "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald",
        variant === "default" &&
          "border-border bg-bg-secondary text-text-secondary hover:scale-105",
        category && categoryColors[category],
        className
      )}
    >
      {variant === "production" && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
      )}
      {children}
    </motion.span>
  );
}
