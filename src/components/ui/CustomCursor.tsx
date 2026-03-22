"use client";

import { useEffect, useRef, useState } from "react";
import { usePerformance } from "@/hooks/usePerformanceTier";

export function CustomCursor() {
  const perf = usePerformance();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip entirely on low-tier devices
    if (!perf.enableCursor) return;

    const mql = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    if (!mql.matches) return;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMove);

    const isInteractive = (el: Element | null): boolean => {
      if (!el) return false;
      return el.closest("a, button, [role='button'], input, textarea, select") !== null;
    };

    const handleOver = (e: MouseEvent) => {
      if (isInteractive(e.target as Element)) setIsHovering(true);
    };
    const handleOut = (e: MouseEvent) => {
      if (isInteractive(e.target as Element)) setIsHovering(false);
    };

    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    let raf: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, [perf.enableCursor]);

  // Don't render DOM elements if cursor is disabled
  if (!perf.enableCursor) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-9999 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHovering
              ? "h-10 w-10 border-accent/40 bg-accent/5"
              : "h-5 w-5 border-text-tertiary/40"
          }`}
        />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-9999 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={{ willChange: "transform" }}
      >
        <div className="h-1 w-1 rounded-full bg-accent" />
      </div>
    </>
  );
}
