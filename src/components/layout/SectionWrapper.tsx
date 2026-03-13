"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax: content shifts up slightly as you scroll through
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  // Fade edges: full opacity in the middle, slightly faded at entry/exit
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative mx-auto max-w-6xl px-6 py-24 md:py-32", className)}
    >
      <motion.div style={{ y, opacity, willChange: "transform, opacity" }}>
        {children}
      </motion.div>
    </section>
  );
}
