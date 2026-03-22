"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/usePerformanceTier";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ id, children, className }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const perf = usePerformance();
  // Start true to match SSR
  const [isNear, setIsNear] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsNear(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const shouldAnimate = perf.enableParallax && isNear;
  const y = useTransform(scrollYProgress, [0, 1], shouldAnimate ? [20, -20] : [0, 0]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    shouldAnimate ? [0.6, 1, 1, 0.6] : [1, 1, 1, 1]
  );

  const sectionStyle = !isNear ? { contain: "layout style paint" as const } : undefined;

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative mx-auto max-w-6xl px-6 py-24 md:py-32", className)}
      style={sectionStyle}
    >
      <motion.div style={{ y, opacity, willChange: shouldAnimate ? "transform, opacity" : "auto" }}>
        {children}
      </motion.div>
    </section>
  );
}
