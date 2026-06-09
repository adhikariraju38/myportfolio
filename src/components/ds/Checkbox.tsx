"use client";

import { useState, useCallback } from "react";

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
  className?: string;
}

/**
 * Checkbox — the box springs and the tick draws itself (stroke-dash)
 * on check. Use for boolean choices and consent.
 */
export function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  id,
  className,
}: CheckboxProps) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const autoId = id || "ds-checkbox";

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !on;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [disabled, on, isControlled, onChange]);

  return (
    <label
      htmlFor={autoId}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        userSelect: "none",
      }}
    >
      <button
        type="button"
        role="checkbox"
        id={autoId}
        aria-checked={on}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        style={{
          position: "relative",
          width: 22,
          height: 22,
          flexShrink: 0,
          padding: 0,
          borderRadius: "var(--r-xs)",
          border: "1px solid",
          borderColor: on ? "var(--accent)" : "var(--border-strong)",
          background: on ? "var(--accent)" : "var(--surface-3)",
          boxShadow: on ? "var(--glow-accent-sm)" : "var(--edge-light)",
          cursor: disabled ? "not-allowed" : "pointer",
          transition:
            "background-color var(--dur-fast) var(--ease-spring), border-color var(--dur-fast) var(--ease-snappy), box-shadow var(--dur-base) var(--ease-out)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-on-accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ display: "block" }}
        >
          <polyline
            points="20 6 9 17 4 12"
            style={{
              strokeDasharray: 24,
              strokeDashoffset: on ? 0 : 24,
              transition: "stroke-dashoffset var(--dur-base) var(--ease-out)",
              transitionDelay: on ? "60ms" : "0ms",
            }}
          />
        </svg>
      </button>
      {label && <span style={{ fontSize: "var(--text-sm)", color: "var(--text)" }}>{label}</span>}
    </label>
  );
}
