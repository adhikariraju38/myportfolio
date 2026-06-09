"use client";

import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ThreeErrorBoundary } from "./ErrorBoundary";
import { useAccentColor } from "@/hooks/use-accent-color";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Shared scroll position (window.scrollY, kept in sync by Lenis) — drives the
// scroll-fade of the hero object exactly like the design kit.
function useScrollRef() {
  const scroll = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      scroll.current = window.scrollY;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scroll;
}

// ── The hero object: wireframe icosahedron + faint core + vertex nodes ──
// Rotates toward the pointer, drifts over time, and fades/shrinks on scroll.
function HeroObject({ accentColor }: { accentColor: string }) {
  const group = useRef<THREE.Group>(null);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null);
  const nodeMat = useRef<THREE.PointsMaterial>(null);
  const scroll = useScrollRef();
  const r = useRef({ rx: 0, ry: 0 });

  const geom = useMemo(() => new THREE.IcosahedronGeometry(1.4, 1), []);
  const coreGeom = useMemo(() => new THREE.IcosahedronGeometry(1.36, 1), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = state.pointer;
    const targetRy = (REDUCED ? 0 : p.x * 0.5) * 0.8;
    const targetRx = (REDUCED ? 0 : -p.y * 0.5) * 0.5;
    r.current.ry += (targetRy - r.current.ry) * 0.05;
    r.current.rx += (targetRx - r.current.rx) * 0.05;

    const t = REDUCED ? 0 : state.clock.elapsedTime;
    g.rotation.y = t * 0.18 + r.current.ry;
    g.rotation.x = t * 0.11 + r.current.rx;

    const fade = Math.min(scroll.current / 650, 1);
    g.scale.setScalar(1 - fade * 0.25);
    if (wireMat.current) wireMat.current.opacity = 0.8 * (1 - fade * 0.9);
    if (nodeMat.current) nodeMat.current.opacity = 0.9 * (1 - fade * 0.9);
  });

  return (
    <group ref={group}>
      <mesh geometry={geom}>
        <meshBasicMaterial ref={wireMat} color={accentColor} wireframe transparent opacity={0.8} />
      </mesh>
      <mesh geometry={coreGeom}>
        <meshBasicMaterial color={accentColor} transparent opacity={0.05} />
      </mesh>
      <points geometry={geom}>
        <pointsMaterial ref={nodeMat} color={accentColor} size={0.07} transparent opacity={0.9} sizeAttenuation />
      </points>
    </group>
  );
}

// ── Floating particle "dust" shell around the object ──
function generateDust(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.6 + ((i * 13) % 100) / 100 * 2.4;
    const th = ((i * 7.13) % (Math.PI * 2));
    const ph = Math.acos(2 * (((i * 3.7) % 100) / 100) - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = r * Math.cos(ph);
  }
  return pos;
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const scroll = useScrollRef();
  const [positions] = useState(() => generateDust(count));
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = REDUCED ? 0 : state.clock.elapsedTime;
    ref.current.rotation.y = -t * 0.06;
    ref.current.rotation.x = t * 0.03;
    if (matRef.current) {
      const fade = Math.min(scroll.current / 650, 1);
      matRef.current.opacity = 0.6 * (1 - fade);
    }
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial ref={matRef} color="#8B919E" size={0.022} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene({ dustCount, accentColor }: { dustCount: number; accentColor: string }) {
  return (
    <>
      <HeroObject accentColor={accentColor} />
      {dustCount > 0 && <Dust count={dustCount} />}
    </>
  );
}

function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
    </div>
  );
}

export function HeroCanvas({
  frameloop = "always",
  dpr = [1, 1.5],
  particleMultiplier = 1,
}: {
  frameloop?: "always" | "demand";
  dpr?: [number, number];
  particleMultiplier?: number;
}) {
  const dustCount = Math.round(380 * particleMultiplier);
  const accentColor = useAccentColor();

  return (
    <ThreeErrorBoundary fallback={<HeroFallback />}>
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 50 }}
          style={{ position: "absolute", inset: 0 }}
          dpr={dpr}
          frameloop={frameloop}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene dustCount={dustCount} accentColor={accentColor} />
          <PointerCamera />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  );
}

// Subtle camera parallax toward the pointer (kept from the original scene feel).
function PointerCamera() {
  const { camera } = useThree();
  useFrame((state) => {
    if (REDUCED) return;
    const tx = state.pointer.x * 0.25;
    const ty = state.pointer.y * 0.18;
    camera.position.x += (tx - camera.position.x) * 0.03;
    camera.position.y += (ty - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}
