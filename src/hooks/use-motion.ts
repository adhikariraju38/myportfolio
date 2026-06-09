"use client";

// ──────────────────────────────────────────────────────────────
// "Engineered Motion" — hand-rolled spring-physics hooks.
// Ported from the design system's components/motion.js. These hooks
// drive the DOM directly via refs (no per-frame React re-render), so
// motion stays buttery. The integration math mirrors the spring
// configs in globals.css one-to-one.
// ──────────────────────────────────────────────────────────────
import { useRef, useCallback, useEffect, useState } from "react";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Semi-implicit Euler spring step. dt fixed at 1/60 for stability.
function springStep(
  p: number,
  v: number,
  target: number,
  stiffness: number,
  damping: number,
  mass: number,
): [number, number] {
  const dt = 1 / 60;
  const f = -stiffness * (p - target);
  const d = -damping * v;
  const a = (f + d) / mass;
  const nv = v + a * dt;
  const np = p + nv * dt;
  return [np, nv];
}

// ── Magnetic pull ─────────────────────────────────────────────
// Element drifts toward the cursor, then springs home on leave.
export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 0.3,
  max = 6,
  stiffness = 150,
  damping = 15,
}: { strength?: number; max?: number; stiffness?: number; damping?: number } = {}) {
  const ref = useRef<T>(null);
  const s = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, raf: 0, running: false });

  const loop = useCallback(() => {
    const st = s.current;
    [st.x, st.vx] = springStep(st.x, st.vx, st.tx, stiffness, damping, 1);
    [st.y, st.vy] = springStep(st.y, st.vy, st.ty, stiffness, damping, 1);
    if (ref.current) {
      ref.current.style.transform = `translate(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px)`;
    }
    const settled =
      Math.abs(st.x - st.tx) < 0.04 &&
      Math.abs(st.y - st.ty) < 0.04 &&
      Math.abs(st.vx) < 0.04 &&
      Math.abs(st.vy) < 0.04;
    if (settled) {
      st.x = st.tx;
      st.y = st.ty;
      st.vx = 0;
      st.vy = 0;
      if (ref.current) ref.current.style.transform = `translate(${st.tx}px, ${st.ty}px)`;
      st.running = false;
      return;
    }
    st.raf = requestAnimationFrame(loop);
  }, [stiffness, damping]);

  const ensure = useCallback(() => {
    const st = s.current;
    if (!st.running) {
      st.running = true;
      st.raf = requestAnimationFrame(loop);
    }
  }, [loop]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (REDUCED || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      s.current.tx = clamp(dx * strength, -max, max);
      s.current.ty = clamp(dy * strength, -max, max);
      ensure();
    },
    [strength, max, ensure],
  );

  const onMouseLeave = useCallback(() => {
    s.current.tx = 0;
    s.current.ty = 0;
    ensure();
  }, [ensure]);

  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);
  return { ref, onMouseMove, onMouseLeave };
}

// ── 3D tilt + spotlight ───────────────────────────────────────
// Card rotates toward the cursor; --spotlight-x/y track the pointer.
export function useTilt<T extends HTMLElement = HTMLElement>({
  max = 8,
  stiffness = 220,
  damping = 22,
  spotlight = true,
}: { max?: number; stiffness?: number; damping?: number; spotlight?: boolean } = {}) {
  const ref = useRef<T>(null);
  const s = useRef({ rx: 0, ry: 0, vrx: 0, vry: 0, trx: 0, try_: 0, raf: 0, running: false });

  const loop = useCallback(() => {
    const st = s.current;
    [st.rx, st.vrx] = springStep(st.rx, st.vrx, st.trx, stiffness, damping, 1);
    [st.ry, st.vry] = springStep(st.ry, st.vry, st.try_, stiffness, damping, 1);
    if (ref.current) {
      ref.current.style.transform = `perspective(900px) rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg)`;
    }
    const settled =
      Math.abs(st.rx - st.trx) < 0.02 &&
      Math.abs(st.ry - st.try_) < 0.02 &&
      Math.abs(st.vrx) < 0.02 &&
      Math.abs(st.vry) < 0.02;
    if (settled) {
      st.rx = st.trx;
      st.ry = st.try_;
      st.vrx = 0;
      st.vry = 0;
      if (st.trx === 0 && st.try_ === 0 && ref.current) ref.current.style.transform = "";
      st.running = false;
      return;
    }
    st.raf = requestAnimationFrame(loop);
  }, [stiffness, damping]);

  const ensure = useCallback(() => {
    const st = s.current;
    if (!st.running) {
      st.running = true;
      st.raf = requestAnimationFrame(loop);
    }
  }, [loop]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (REDUCED || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      s.current.trx = clamp((0.5 - py) * 2 * max, -max, max);
      s.current.try_ = clamp((px - 0.5) * 2 * max, -max, max);
      if (spotlight) {
        ref.current.style.setProperty("--spotlight-x", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--spotlight-y", `${e.clientY - r.top}px`);
      }
      ensure();
    },
    [max, spotlight, ensure],
  );

  const onMouseLeave = useCallback(() => {
    s.current.trx = 0;
    s.current.try_ = 0;
    ensure();
  }, [ensure]);

  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);
  return { ref, onMouseMove, onMouseLeave };
}

// ── Ripple ink on press ───────────────────────────────────────
// Spawns a ripple from the pointer inside a positioned host.
export function useRipple() {
  return useCallback((e: React.MouseEvent) => {
    if (REDUCED) return;
    const host = e.currentTarget as HTMLElement;
    const r = host.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const span = document.createElement("span");
    span.className = "ds-ripple-ink";
    span.style.width = span.style.height = `${size}px`;
    const cx = (e.clientX ?? r.left + r.width / 2) - r.left - size / 2;
    const cy = (e.clientY ?? r.top + r.height / 2) - r.top - size / 2;
    span.style.left = `${cx}px`;
    span.style.top = `${cy}px`;
    host.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  }, []);
}

// ── Driven numeric spring (returns live value, re-renders) ────
// For controls where React must read the value (slider fill, switch).
export function useSpringValue(
  target: number,
  { stiffness = 420, damping = 30, mass = 1 }: { stiffness?: number; damping?: number; mass?: number } = {},
) {
  const [value, setValue] = useState(target);
  const s = useRef({ p: target, v: 0, raf: 0 });
  useEffect(() => {
    if (REDUCED) {
      setValue(target);
      return;
    }
    cancelAnimationFrame(s.current.raf);
    const tick = () => {
      const st = s.current;
      [st.p, st.v] = springStep(st.p, st.v, target, stiffness, damping, mass);
      if (Math.abs(st.p - target) < 0.001 && Math.abs(st.v) < 0.001) {
        st.p = target;
        st.v = 0;
        setValue(target);
        return;
      }
      setValue(st.p);
      st.raf = requestAnimationFrame(tick);
    };
    s.current.raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.current.raf);
  }, [target, stiffness, damping, mass]);
  return value;
}

export const prefersReducedMotion = REDUCED;
