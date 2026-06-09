"use client";

import { useState, useCallback, type ReactNode, type CSSProperties } from "react";

const VARIANTS = {
  neutral: { bg: "var(--surface-3)", color: "var(--text-secondary)", border: "var(--border)" },
  accent: { bg: "var(--accent-soft)", color: "var(--accent-ink)", border: "color-mix(in oklab, var(--accent) 35%, transparent)" },
  success: { bg: "var(--green-dim)", color: "var(--green)", border: "color-mix(in oklab, var(--green) 35%, transparent)" },
  warning: { bg: "var(--amber-dim)", color: "var(--amber)", border: "color-mix(in oklab, var(--amber) 35%, transparent)" },
  danger: { bg: "var(--red-dim)", color: "var(--red)", border: "color-mix(in oklab, var(--red) 35%, transparent)" },
  tech: { bg: "var(--surface-2)", color: "var(--text-secondary)", border: "var(--border-strong)" },
} as const;

interface BadgeProps {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  dot?: boolean;
  interactive?: boolean;
  animateIn?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * Badge / Tag — a compact status or category chip. Pops in on mount;
 * springs on tap when `interactive`.
 */
export function Badge({
  children,
  variant = "neutral",
  dot = false,
  interactive = false,
  animateIn = false,
  onClick,
  className,
  style,
}: BadgeProps) {
  const [pressed, setPressed] = useState(false);
  const v = VARIANTS[variant] ?? VARIANTS.neutral;
  const clickable = interactive || !!onClick;

  const handleDown = useCallback(() => clickable && setPressed(true), [clickable]);
  const handleUp = useCallback(() => setPressed(false), []);

  return (
    <span
      onClick={onClick}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 11px",
        borderRadius: "var(--r-pill)",
        background: v.bg,
        color: v.color,
        border: `1px solid ${v.border}`,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--fw-medium)" as unknown as number,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
        cursor: clickable ? "pointer" : "default",
        userSelect: "none",
        transform: pressed ? "scale(0.92)" : "scale(1)",
        transition: "transform var(--dur-fast) var(--ease-spring)",
        animation: animateIn ? "ds-pop var(--dur-base) var(--ease-bounce)" : undefined,
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.color, flexShrink: 0 }} />}
      {children}
    </span>
  );
}
