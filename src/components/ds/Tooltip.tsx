"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const POS = {
  top: { bottom: "calc(100% + 8px)", left: "50%", translate: "-50% 0", origin: "bottom center", from: "translate(-50%, 4px)" },
  bottom: { top: "calc(100% + 8px)", left: "50%", translate: "-50% 0", origin: "top center", from: "translate(-50%, -4px)" },
  left: { right: "calc(100% + 8px)", top: "50%", translate: "0 -50%", origin: "center right", from: "translate(4px, -50%)" },
  right: { left: "calc(100% + 8px)", top: "50%", translate: "0 -50%", origin: "center left", from: "translate(-4px, -50%)" },
} as const;

/**
 * Tooltip — springs in from the trigger on hover/focus. Wrap any
 * element; pass the text as `label`.
 */
export function Tooltip({ children, label, side = "top", className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 80);
  }, []);
  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);

  const pos = POS[side] ?? POS.top;

  return (
    <span
      className={className}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: "absolute",
          top: "top" in pos ? pos.top : undefined,
          bottom: "bottom" in pos ? pos.bottom : undefined,
          left: "left" in pos ? pos.left : undefined,
          right: "right" in pos ? pos.right : undefined,
          zIndex: 100,
          padding: "6px 10px",
          borderRadius: "var(--r-sm)",
          background: "var(--ink-4)",
          color: "var(--ink-11)",
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--shadow-md)",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-2xs)",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          transformOrigin: pos.origin,
          transform: open
            ? `translate(${pos.translate.replace(" ", ",")}) scale(1)`
            : `${pos.from} scale(0.85)`,
          opacity: open ? 1 : 0,
          transition: "transform var(--dur-base) var(--ease-spring), opacity var(--dur-fast) var(--ease-out)",
        }}
      >
        {label}
      </span>
    </span>
  );
}
