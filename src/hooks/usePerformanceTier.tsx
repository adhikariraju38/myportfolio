"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── Tier definitions ────────────────────────────────────────────────
// HIGH   → all effects: 3D, particles, blur, cursor, parallax, magnetic
// MEDIUM → reduced particles, lower DPR, simpler blur, keep cursor
// LOW    → no 3D, no particles, no cursor, CSS-only, no backdrop-filter
export type PerformanceTier = "high" | "medium" | "low";

export interface PerformanceConfig {
  tier: PerformanceTier;
  /** Show Three.js canvases */
  enable3D: boolean;
  /** Particle count multiplier (0–1) */
  particleMultiplier: number;
  /** Canvas device pixel ratio range */
  dpr: [number, number];
  /** Show custom cursor */
  enableCursor: boolean;
  /** Enable section parallax */
  enableParallax: boolean;
  /** Enable card 3D tilt + spotlight */
  enableCardTilt: boolean;
  /** Enable magnetic hover on nav/contact icons */
  enableMagnetic: boolean;
  /** Enable backdrop-filter blur on glass elements */
  enableBlur: boolean;
  /** Enable smooth scroll (Lenis) */
  enableSmoothScroll: boolean;
}

const TIER_CONFIGS: Record<PerformanceTier, PerformanceConfig> = {
  high: {
    tier: "high",
    enable3D: true,
    particleMultiplier: 1,
    dpr: [1, 1.5],
    enableCursor: true,
    enableParallax: true,
    enableCardTilt: true,
    enableMagnetic: true,
    enableBlur: true,
    enableSmoothScroll: true,
  },
  medium: {
    tier: "medium",
    enable3D: true,
    particleMultiplier: 0.5,
    dpr: [1, 1],
    enableCursor: true,
    enableParallax: true,
    enableCardTilt: false,
    enableMagnetic: false,
    enableBlur: true,
    enableSmoothScroll: true,
  },
  low: {
    tier: "low",
    enable3D: false,
    particleMultiplier: 0,
    dpr: [1, 1],
    enableCursor: false,
    enableParallax: false,
    enableCardTilt: false,
    enableMagnetic: false,
    enableBlur: false,
    enableSmoothScroll: false,
  },
};

// ── Detection logic ─────────────────────────────────────────────────

function detectInitialTier(): PerformanceTier {
  if (typeof window === "undefined") return "high";

  // Respect user preference immediately
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isTouch = "ontouchstart" in window && !window.matchMedia("(pointer: fine)").matches;

  // Low-end: ≤2 cores, ≤2GB RAM, or budget mobile
  if (cores <= 2 || memory <= 2) return "low";
  // Mid-range: mobile with decent specs, or ≤4 cores desktop
  if (isMobile || isTouch || cores <= 4 || memory <= 4) return "medium";
  // High-end: desktop with 4+ cores and 4+ GB
  return "high";
}

// ── FPS Monitor ─────────────────────────────────────────────────────

function createFPSMonitor(onDowngrade: (tier: PerformanceTier) => void, getCurrentTier: () => PerformanceTier) {
  let frames = 0;
  let lastTime = performance.now();
  let rafId: number;
  let checkCount = 0;
  const MAX_CHECKS = 10; // Stop monitoring after 10 checks (~5 seconds)
  const CHECK_INTERVAL = 500; // Check every 500ms

  function tick() {
    frames++;
    const now = performance.now();
    const elapsed = now - lastTime;

    if (elapsed >= CHECK_INTERVAL) {
      const fps = (frames / elapsed) * 1000;
      frames = 0;
      lastTime = now;
      checkCount++;

      const currentTier = getCurrentTier();

      // Auto-downgrade if FPS consistently low
      if (fps < 24 && currentTier === "high") {
        onDowngrade("medium");
      } else if (fps < 20 && currentTier === "medium") {
        onDowngrade("low");
      }

      // Stop monitoring after enough checks or if we've hit low
      if (checkCount >= MAX_CHECKS || getCurrentTier() === "low") {
        return; // Don't schedule next frame
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    frames = 0;
    lastTime = performance.now();
    checkCount = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(rafId);
  }

  return { start, stop };
}

// ── React Context ───────────────────────────────────────────────────

const PerformanceContext = createContext<PerformanceConfig>(TIER_CONFIGS.high);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  // Detect tier eagerly on client, default "high" on server
  const [tier, setTier] = useState<PerformanceTier>(() =>
    typeof window === "undefined" ? "high" : detectInitialTier()
  );
  const tierRef = useRef(tier);

  const applyTier = useCallback((newTier: PerformanceTier) => {
    tierRef.current = newTier;
    setTier(newTier);
    document.documentElement.dataset.perfTier = newTier;
  }, []);

  // Keep ref in sync and apply CSS attribute
  useEffect(() => {
    tierRef.current = tier;
    document.documentElement.dataset.perfTier = tier;
  }, [tier]);

  // Start FPS monitor on mount
  useEffect(() => {
    if (tierRef.current === "low") return;

    const monitor = createFPSMonitor(
      applyTier,
      () => tierRef.current
    );
    const timer = setTimeout(() => monitor.start(), 2000);
    return () => {
      clearTimeout(timer);
      monitor.stop();
    };
  }, [applyTier]);

  const config = TIER_CONFIGS[tier];

  return (
    <PerformanceContext value={config}>
      {children}
    </PerformanceContext>
  );
}

export function usePerformance(): PerformanceConfig {
  return useContext(PerformanceContext);
}
