"use client";

import { useSyncExternalStore } from "react";

// Reads the resolved --accent hex from <html> so Three.js materials follow
// the switchable accent (and live admin preview). Re-reads whenever the
// data-accent attribute or the theme class changes.
const DEFAULT_ACCENT = "#8c7cff";

function readAccent(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  // Guard against unresolved var() (older engines) — fall back to default.
  return v && v.startsWith("#") ? v : DEFAULT_ACCENT;
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-accent", "class"],
  });
  return () => obs.disconnect();
}

export function useAccentColor(): string {
  return useSyncExternalStore(subscribe, readAccent, () => DEFAULT_ACCENT);
}
