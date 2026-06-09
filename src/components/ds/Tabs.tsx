"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";

type TabItem = string | { id: string; label: string };

interface TabsProps {
  tabs?: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

/**
 * Tabs — the active indicator slides between tabs with a spring,
 * borrowing the portfolio nav's signature motion.
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, variant = "pill", className }: TabsProps) {
  const norm = tabs.map((t) => (typeof t === "string" ? { id: t, label: t } : t));
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? norm[0]?.id);
  const active = isControlled ? value : internal;

  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const el = active ? refs.current[active] : null;
    const wrap = wrapRef.current;
    if (el && wrap) {
      const er = el.getBoundingClientRect();
      const wr = wrap.getBoundingClientRect();
      setInd({ left: er.left - wr.left, width: er.width, ready: true });
    }
  }, [active, norm.length]);

  const select = useCallback(
    (id: string) => {
      if (!isControlled) setInternal(id);
      onChange?.(id);
    },
    [isControlled, onChange],
  );

  const isPill = variant === "pill";

  return (
    <div
      ref={wrapRef}
      role="tablist"
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        gap: isPill ? 4 : 8,
        padding: isPill ? 4 : 0,
        borderRadius: "var(--r-pill)",
        background: isPill ? "var(--surface-2)" : "transparent",
        border: isPill ? "1px solid var(--border)" : "none",
        borderBottom: "1px solid var(--border)",
        boxShadow: isPill ? "var(--edge-light)" : "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          left: ind.left,
          width: ind.width,
          ...(isPill
            ? { top: 4, bottom: 4, borderRadius: "var(--r-pill)", background: "var(--accent)", boxShadow: "var(--glow-accent-sm)" }
            : { bottom: -1, height: 2, borderRadius: "var(--r-pill)", background: "var(--accent)" }),
          opacity: ind.ready ? 1 : 0,
          transition: "left var(--dur-base) var(--ease-spring), width var(--dur-base) var(--ease-spring)",
        }}
      />
      {norm.map((t) => {
        const on = t.id === active;
        const onColor = isPill && on ? "var(--text-on-accent)" : on ? "var(--text)" : "var(--text-secondary)";
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            onClick={() => select(t.id)}
            style={{
              position: "relative",
              zIndex: 1,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: isPill ? "8px 16px" : "8px 4px",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-sm)",
              fontWeight: on ? "var(--fw-medium)" : "var(--fw-regular)",
              color: onColor,
              whiteSpace: "nowrap",
              transition: "color var(--dur-base) var(--ease-out)",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
