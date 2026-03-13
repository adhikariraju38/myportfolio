"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function Button({
  variant = "primary",
  children,
  className,
  href,
  onClick,
}: ButtonProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97, y: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variant === "primary" &&
          "bg-accent text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30",
        variant === "secondary" &&
          "border border-border text-text-secondary hover:border-accent/50 hover:text-text",
        className
      )}
    >
      {children}
    </motion.a>
  );
}
