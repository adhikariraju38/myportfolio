"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { IconButton } from "@/components/ds/IconButton";

// External store for theme state
const listeners = new Set<() => void>();

function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getThemeSnapshot() {
  return !document.documentElement.classList.contains("light");
}

function getThemeServerSnapshot() {
  return true;
}

function setTheme(dark: boolean) {
  document.documentElement.classList.add("no-transitions");
  if (dark) {
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.add("light");
    localStorage.setItem("theme", "light");
  }
  // Notify subscribers so useSyncExternalStore re-renders
  listeners.forEach((cb) => cb());
  // Re-enable transitions after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transitions");
    });
  });
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const toggle = () => setTheme(!isDark);

  return (
    <IconButton
      label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant="ghost"
      size="sm"
      onClick={toggle}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </IconButton>
  );
}
