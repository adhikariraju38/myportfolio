"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePerformance } from "@/hooks/usePerformanceTier";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  const perf = usePerformance();

  useEffect(() => {
    // Skip Lenis entirely on low-tier — use native scroll
    if (!perf.enableSmoothScroll) return;

    const lenis = new Lenis({
      lerp: 0.075,
      duration: 1.8,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    // Reduce backdrop-filter blur during active scroll
    let scrollTimeout: number;
    lenis.on("scroll", () => {
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 150);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      clearTimeout(scrollTimeout);
      document.documentElement.classList.remove("is-scrolling");
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [perf.enableSmoothScroll]);

  return null;
}
