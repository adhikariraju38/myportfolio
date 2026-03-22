"use client";

import { useRef, useState, useMemo, useEffect, createContext, useContext } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { ThreeErrorBoundary } from "./ErrorBoundary";

// Shared entrance progress context — ramps 0→1 over ~1s
const EntranceContext = createContext<React.RefObject<number>>({ current: 0 });

function EntranceController({ children }: { children: React.ReactNode }) {
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(progress.current + delta / 1.0, 1);
    }
  });

  return (
    <EntranceContext value={progress}>
      {children}
    </EntranceContext>
  );
}

function getChildProgress(globalProgress: number, start: number, end: number): number {
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  const t = (globalProgress - start) / (end - start);
  return t * t * (3 - 2 * t);
}

function HexRing({
  radius,
  color,
  speed,
  yOffset,
  enterStart,
  enterEnd,
}: {
  radius: number;
  color: string;
  speed: number;
  yOffset: number;
  enterStart: number;
  enterEnd: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const entrance = useContext(EntranceContext);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const sides = 6;
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 6;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const points = shape.getPoints(6);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [radius]);

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const progress = entrance.current ?? 0;
    const p = getChildProgress(progress, enterStart, enterEnd);

    const scale = 0.5 + p * 0.5;
    ref.current.scale.setScalar(scale);
    matRef.current.opacity = p * 0.6;

    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    ref.current.position.y =
      yOffset + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={ref}>
      <lineLoop geometry={geometry}>
        <lineBasicMaterial ref={matRef} color={color} transparent opacity={0} />
      </lineLoop>
    </group>
  );
}

// Generate random positions outside component to satisfy purity rules
function generateParticlePositions(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.5 + Math.random() * 2.5;
    arr[i * 3] = Math.cos(angle) * r;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
    arr[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 1;
  }
  return arr;
}

function generateParticleSpeeds(count: number) {
  return Array.from({ length: count }, () => 0.2 + Math.random() * 0.8);
}

function Particles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const entrance = useContext(EntranceContext);

  const [positions] = useState(() => generateParticlePositions(count));
  const [speeds] = useState(() => generateParticleSpeeds(count));

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const progress = entrance.current ?? 0;
    const p = getChildProgress(progress, 0.4, 0.85);
    matRef.current.opacity = p * 0.8;

    const posAttr = ref.current.geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const angle =
        state.clock.elapsedTime * speeds[i] * 0.3 +
        (i / count) * Math.PI * 2;
      const r = 0.5 + ((i * 7) % 25) * 0.08;
      posAttr.setX(i, Math.cos(angle) * r);
      posAttr.setZ(i, Math.sin(angle) * r);
    }
    posAttr.needsUpdate = true;
  });

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        ref={matRef}
        size={0.03}
        color="#22d3ee"
        transparent
        opacity={0}
        sizeAttenuation
      />
    </points>
  );
}

function FadingStars() {
  const groupRef = useRef<THREE.Group>(null);
  const cachedMaterial = useRef<THREE.PointsMaterial | null>(null);
  const entrance = useContext(EntranceContext);

  useEffect(() => {
    if (!groupRef.current) return;
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Points && child.material instanceof THREE.PointsMaterial) {
        cachedMaterial.current = child.material;
      }
    });
  }, []);

  useFrame(() => {
    if (!cachedMaterial.current) {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Points && child.material instanceof THREE.PointsMaterial) {
            cachedMaterial.current = child.material;
          }
        });
      }
      return;
    }
    const progress = entrance.current ?? 0;
    const p = getChildProgress(progress, 0.2, 0.6);
    cachedMaterial.current.opacity = p;
  });

  return (
    <group ref={groupRef}>
      <Stars
        radius={10}
        depth={30}
        count={400}
        factor={2}
        saturation={0.2}
        fade
        speed={0.5}
      />
    </group>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const pointer = state.pointer;
    target.current.x = pointer.x * 0.3;
    target.current.y = pointer.y * 0.2;

    /* eslint-disable react-hooks/immutability -- Three.js camera mutation is the standard R3F pattern */
    camera.position.x += (target.current.x - camera.position.x) * 0.02;
    camera.position.y +=
      (target.current.y + 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
    /* eslint-enable react-hooks/immutability */
  });

  return null;
}

function Scene({ particleCount, showStars }: { particleCount: number; showStars: boolean }) {
  return (
    <EntranceController>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={0.4} color="#6366f1" />
      <directionalLight position={[3, 3, 3]} intensity={0.6} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group>
          <HexRing radius={0.8} color="#f59e0b" speed={0.15} yOffset={0} enterStart={0.0} enterEnd={0.4} />
          <HexRing radius={1.4} color="#3b82f6" speed={-0.1} yOffset={0} enterStart={0.15} enterEnd={0.55} />
          <HexRing radius={2.0} color="#6b7280" speed={0.05} yOffset={0} enterStart={0.3} enterEnd={0.7} />
        </group>
      </Float>

      {particleCount > 0 && <Particles count={particleCount} />}
      {showStars && <FadingStars />}
      <MouseParallax />
    </EntranceController>
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
  const particleCount = Math.round(50 * particleMultiplier);
  const showStars = particleMultiplier > 0;

  return (
    <ThreeErrorBoundary fallback={<HeroFallback />}>
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 50 }}
          style={{ position: "absolute", inset: 0 }}
          dpr={dpr}
          frameloop={frameloop}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene particleCount={particleCount} showStars={showStars} />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  );
}
