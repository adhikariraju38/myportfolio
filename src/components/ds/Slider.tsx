"use client";

import { useState, useRef, useCallback } from "react";
import { useSpringValue, clamp } from "@/hooks/use-motion";

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (next: number) => void;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  format?: (v: number) => string | number;
  className?: string;
}

/**
 * Slider — grab the thumb and it tracks your pointer 1:1 (it feels
 * connected); release and it settles with a weighty spring. The thumb
 * lifts and glows while held.
 */
export function Slider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step,
  onChange,
  disabled = false,
  label,
  showValue = false,
  format = (v) => Math.round(v),
  className,
}: SliderProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const v = isControlled ? value : internal;
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const springed = useSpringValue(v, { stiffness: 260, damping: 28, mass: 1.1 });
  const shown = dragging ? v : springed;
  const pct = clamp((shown - min) / (max - min), 0, 1) * 100;

  const commit = useCallback(
    (nv: number) => {
      let next = clamp(nv, min, max);
      if (step) next = Math.round((next - min) / step) * step + min;
      next = clamp(next, min, max);
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [min, max, step, isControlled, onChange],
  );

  const valueFromEvent = useCallback(
    (clientX: number) => {
      const r = trackRef.current?.getBoundingClientRect();
      if (!r) return min;
      const ratio = clamp((clientX - r.left) / r.width, 0, 1);
      return min + ratio * (max - min);
    },
    [min, max],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      commit(valueFromEvent(e.clientX));
    },
    [disabled, commit, valueFromEvent],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      commit(valueFromEvent(e.clientX));
    },
    [dragging, commit, valueFromEvent],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      setDragging(false);
    },
    [dragging],
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      const d = step || (max - min) / 100;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        commit(v + d);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        commit(v - d);
      }
      if (e.key === "Home") {
        e.preventDefault();
        commit(min);
      }
      if (e.key === "End") {
        e.preventDefault();
        commit(max);
      }
    },
    [disabled, step, max, min, v, commit],
  );

  return (
    <div className={className} style={{ width: "100%", opacity: disabled ? 0.5 : 1 }}>
      {(label || showValue) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          {label && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{label}</span>}
          {showValue && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--accent-ink)" }}>
              {format(shown)}
            </span>
          )}
        </div>
      )}
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.round(v)}
        aria-label={label}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKey}
        ref={trackRef}
        style={{
          position: "relative",
          height: 26,
          display: "flex",
          alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          touchAction: "none",
          outline: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 6,
            borderRadius: "var(--r-pill)",
            background: "var(--surface-3)",
            border: "1px solid var(--border)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            height: 6,
            width: `${pct}%`,
            borderRadius: "var(--r-pill)",
            background: "var(--accent)",
            boxShadow: dragging ? "var(--glow-accent-sm)" : "none",
            transition: dragging ? "box-shadow var(--dur-fast)" : "box-shadow var(--dur-base)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${pct}%`,
            width: 20,
            height: 20,
            marginLeft: -10,
            borderRadius: "50%",
            background: "var(--ink-11)",
            border: "2px solid var(--accent)",
            boxShadow: dragging
              ? "var(--glow-accent), 0 4px 10px rgba(0,0,0,0.4)"
              : "0 2px 6px rgba(0,0,0,0.35)",
            transform: `scale(${dragging ? 1.28 : 1})`,
            transition: "transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)",
          }}
        />
      </div>
    </div>
  );
}
