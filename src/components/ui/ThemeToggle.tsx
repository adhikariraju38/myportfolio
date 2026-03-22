"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

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
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9, rotate: 15 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="glass-pill rounded-full p-2 text-text-secondary transition-colors hover:text-text"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </motion.button>
  );
}
