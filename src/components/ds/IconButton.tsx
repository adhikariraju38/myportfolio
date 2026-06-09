"use client";

import { useState, type ReactNode, type CSSProperties } from "react";
import { useMagnetic, useRipple } from "@/hooks/use-motion";

const SIZES = { sm: 32, md: 40, lg: 48 } as const;

type Variant = "solid" | "soft" | "ghost";

function variantStyle(variant: Variant, hovered: boolean): CSSProperties {
  switch (variant) {
    case "solid":
      return {
        background: hovered ? "var(--accent-hover)" : "var(--accent)",
        color: "var(--text-on-accent)",
        border: "1px solid transparent",
        boxShadow: hovered ? "var(--glow-accent-sm)" : "var(--shadow-sm)",
      };
    case "ghost":
      return {
        background: hovered ? "var(--surface-3)" : "transparent",
        color: hovered ? "var(--text)" : "var(--text-secondary)",
        border: "1px solid transparent",
        boxShadow: "none",
      };
    case "soft":
    default:
      return {
        background: hovered ? "var(--surface-hover)" : "var(--surface-3)",
        color: hovered ? "var(--accent-ink)" : "var(--text-secondary)",
        border: "1px solid var(--border)",
        boxShadow: "var(--edge-light)",
      };
  }
}

interface IconButtonProps {
  children: ReactNode;
  label: string;
  variant?: Variant;
  size?: keyof typeof SIZES;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  magnetic?: boolean;
  className?: string;
}

/**
 * IconButton — a circular, icon-only control. Same magnetic + spring +
 * ripple physics as Button. Always pass `label` for a11y.
 */
export function IconButton({
  children,
  label,
  variant = "soft",
  size = "md",
  onClick,
  disabled = false,
  magnetic = true,
  className,
}: IconButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const mag = useMagnetic<HTMLSpanElement>({ strength: 0.4, max: 5 });
  const ripple = useRipple();

  const dim = SIZES[size] ?? SIZES.md;
  const vs = variantStyle(variant, hovered && !disabled);
  const scale = pressed ? 0.9 : hovered && !disabled ? 1.06 : 1;

  const btn = (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={(e) => {
        if (!disabled) {
          setPressed(true);
          ripple(e);
        }
      }}
      onPointerUp={() => setPressed(false)}
      disabled={disabled}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        borderRadius: "var(--r-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transform: `scale(${scale})`,
        transition:
          "transform var(--dur-fast) var(--ease-spring), background-color var(--dur-fast) var(--ease-snappy), color var(--dur-fast) var(--ease-snappy), box-shadow var(--dur-base) var(--ease-out)",
        ...vs,
      }}
    >
      {children}
    </button>
  );

  if (magnetic && !disabled) {
    return (
      <span
        ref={mag.ref}
        onMouseMove={mag.onMouseMove}
        onMouseLeave={mag.onMouseLeave}
        style={{ display: "inline-block", willChange: "transform" }}
      >
        {btn}
      </span>
    );
  }
  return btn;
}
