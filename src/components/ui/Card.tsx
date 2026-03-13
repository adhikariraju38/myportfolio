"use client";

import { useRef, useCallback, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  spotlight?: boolean;
}

export function Card({ children, className, spotlight = true }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 20 });

  const isPointerFine = useRef(
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (spotlight) {
        ref.current.style.setProperty("--spotlight-x", `${x}px`);
        ref.current.style.setProperty("--spotlight-y", `${y}px`);
      }

      if (isPointerFine.current) {
        rotateX.set(((y - rect.height / 2) / rect.height) * -8);
        rotateY.set(((x - rect.width / 2) / rect.width) * 8);
      }
    },
    [spotlight, rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 800,
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-accent/30",
        "hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5",
        spotlight &&
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:opacity-0 before:transition-opacity hover:before:opacity-100",
        spotlight &&
          "before:bg-[radial-gradient(400px_circle_at_var(--spotlight-x)_var(--spotlight-y),var(--accent-blue)/0.08,transparent_60%)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
