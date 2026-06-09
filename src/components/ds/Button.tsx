"use client";

import { useState, useCallback, type ReactNode, type CSSProperties } from "react";
import { useMagnetic, useRipple } from "@/hooks/use-motion";

const SIZES = {
  sm: { height: "var(--control-sm)", padding: "0 16px", font: "var(--text-sm)", gap: "6px" },
  md: { height: "var(--control-md)", padding: "0 24px", font: "var(--text-sm)", gap: "8px" },
  lg: { height: "var(--control-lg)", padding: "0 34px", font: "var(--text-md)", gap: "10px" },
} as const;

type Variant = "primary" | "secondary" | "ghost" | "danger";

function variantStyle(variant: Variant, hovered: boolean): CSSProperties {
  switch (variant) {
    case "secondary":
      return {
        background: hovered ? "var(--surface-hover)" : "var(--surface-3)",
        color: "var(--text)",
        border: "1px solid var(--border-strong)",
        boxShadow: "var(--edge-light)",
      };
    case "ghost":
      return {
        background: hovered ? "var(--surface-3)" : "transparent",
        color: "var(--text-secondary)",
        border: "1px solid transparent",
        boxShadow: "none",
      };
    case "danger":
      return {
        background: hovered ? "var(--red)" : "var(--red-dim)",
        color: hovered ? "#fff" : "var(--red)",
        border: "1px solid var(--red)",
        boxShadow: "none",
      };
    case "primary":
    default:
      return {
        background: hovered ? "var(--accent-hover)" : "var(--accent)",
        color: "var(--text-on-accent)",
        border: "1px solid transparent",
        boxShadow: hovered ? "var(--glow-accent-sm)" : "var(--shadow-sm)",
      };
  }
}

interface ButtonProps {
  children?: ReactNode;
  variant?: Variant;
  size?: keyof typeof SIZES;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  magnetic?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  /** Forwarded to the anchor when href is set + opens in a new tab. */
  target?: string;
  rel?: string;
}

/**
 * Button — the primary action element. Magnetic pull on hover, a spring
 * rebound on release, and a ripple from the pointer. Faithful port of the
 * design system's Button (the single source of button motion).
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  magnetic = true,
  fullWidth = false,
  type = "button",
  className,
  target,
  rel,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const mag = useMagnetic<HTMLSpanElement>({ strength: 0.35, max: 6 });
  const ripple = useRipple();

  const sz = SIZES[size] ?? SIZES.md;
  const vs = variantStyle(variant, hovered && !disabled);
  const isDisabled = disabled || loading;

  const handleDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isDisabled) {
        setPressed(true);
        ripple(e as unknown as React.MouseEvent);
      }
    },
    [isDisabled, ripple],
  );
  const handleUp = useCallback(() => setPressed(false), []);

  const lift = pressed ? 1 : hovered && !isDisabled ? -2 : 0;
  const scale = pressed ? 0.96 : 1;

  const style: CSSProperties = {
    position: "relative",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: sz.gap,
    width: fullWidth ? "100%" : undefined,
    height: sz.height,
    padding: sz.padding,
    borderRadius: "var(--r-pill)",
    fontFamily: "var(--font-sans)",
    fontSize: sz.font,
    fontWeight: 500,
    lineHeight: 1,
    whiteSpace: "nowrap",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
    textDecoration: "none",
    userSelect: "none",
    flexShrink: 0,
    boxSizing: "border-box",
    transform: `translateY(${lift}px) scale(${scale})`,
    transition:
      "transform var(--dur-fast) var(--ease-spring), background-color var(--dur-fast) var(--ease-snappy), color var(--dur-fast) var(--ease-snappy), box-shadow var(--dur-base) var(--ease-out)",
    ...vs,
  };

  const cls = ["group", className].filter(Boolean).join(" ");

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && iconLeft}
      {children != null && <span style={{ whiteSpace: "nowrap" }}>{children}</span>}
      {!loading && iconRight}
    </>
  );

  const inner =
    href && !isDisabled ? (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        className={cls}
        style={style}
      >
        {content}
      </a>
    ) : (
      <button
        type={type}
        onClick={isDisabled ? undefined : onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cls}
        style={style}
      >
        {content}
      </button>
    );

  if (magnetic && !isDisabled) {
    return (
      <span
        ref={mag.ref}
        onMouseMove={mag.onMouseMove}
        onMouseLeave={mag.onMouseLeave}
        style={{ display: fullWidth ? "block" : "inline-block", flexShrink: 0, willChange: "transform" }}
      >
        {inner}
      </span>
    );
  }
  return inner;
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        display: "inline-block",
        animation: "ds-spin 0.7s linear infinite",
      }}
    />
  );
}
