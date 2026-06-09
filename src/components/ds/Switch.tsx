"use client";

import { useState, useCallback, type CSSProperties } from "react";
import { useSpringValue } from "@/hooks/use-motion";

const SIZES = {
  sm: { w: 40, h: 24, pad: 3 },
  md: { w: 50, h: 30, pad: 3 },
} as const;

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: keyof typeof SIZES;
  label?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Switch — a physical toggle. The knob slides with a bouncy spring and
 * squashes mid-travel (squash/stretch), like a real rocker.
 */
export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  id,
  className,
  style,
}: SwitchProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const on = isControlled ? checked : internal;

  const sz = SIZES[size] ?? SIZES.md;
  const knob = sz.h - sz.pad * 2;
  const travel = sz.w - knob - sz.pad * 2;

  const progress = useSpringValue(on ? 1 : 0, { stiffness: 480, damping: 18, mass: 1 });
  const x = sz.pad + progress * travel;
  const stretch = 1 + 0.16 * Math.sin(Math.min(Math.max(progress, 0), 1) * Math.PI);

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [disabled, on, isControlled, onChange]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={onKey}
      className={className}
      style={{
        position: "relative",
        width: sz.w,
        height: sz.h,
        flexShrink: 0,
        borderRadius: "var(--r-pill)",
        border: "1px solid",
        borderColor: on ? "var(--accent)" : "var(--border-strong)",
        background: on ? "var(--accent)" : "var(--surface-3)",
        boxShadow: on ? "var(--glow-accent-sm)" : "var(--edge-light)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        padding: 0,
        transition:
          "background-color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        verticalAlign: "middle",
        ...style,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: sz.pad,
          left: 0,
          width: knob,
          height: knob,
          borderRadius: "50%",
          background: on ? "var(--text-on-accent)" : "var(--ink-9)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          transform: `translateX(${x}px) scaleX(${stretch})`,
          transformOrigin: progress > 0.5 ? "right center" : "left center",
        }}
      />
    </button>
  );
}
