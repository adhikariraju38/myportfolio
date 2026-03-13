"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import { ThreeErrorBoundary } from "./ErrorBoundary";

function HexRing({
  radius,
  color,
  speed,
  yOffset,
}: {
  radius: number;
  color: string;
  speed: number;
  yOffset: number;
}) {
  const ref = useRef<THREE.Group>(null);

  // Create hexagonal shape
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
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    ref.current.position.y =
      yOffset + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={ref}>
      <lineLoop geometry={geometry}>
        <lineBasicMaterial color={color} transparent opacity={0.6} />
      </lineLoop>
    </group>
  );
}

function Particles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 2.5;
      arr[i * 3] = Math.cos(angle) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 2;
      arr[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 1;
    }
    return arr;
  }, [count]);

  const speeds = useMemo(() => {
    return Array.from({ length: count }, () => 0.2 + Math.random() * 0.8);
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
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
        size={0.03}
        color="#22d3ee"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const pointer = state.pointer;
    target.current.x = pointer.x * 0.3;
    target.current.y = pointer.y * 0.2;

    camera.position.x += (target.current.x - camera.position.x) * 0.02;
    camera.position.y +=
      (target.current.y + 1.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={0.4} color="#6366f1" />
      <directionalLight position={[3, 3, 3]} intensity={0.6} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group>
          {/* Inner ring — Domain Layer */}
          <HexRing radius={0.8} color="#f59e0b" speed={0.15} yOffset={0} />
          {/* Middle ring — Application Layer */}
          <HexRing radius={1.4} color="#3b82f6" speed={-0.1} yOffset={0} />
          {/* Outer ring — Adapter Layer */}
          <HexRing radius={2.0} color="#6b7280" speed={0.05} yOffset={0} />
        </group>
      </Float>

      <Particles count={50} />

      <Stars
        radius={10}
        depth={30}
        count={400}
        factor={2}
        saturation={0.2}
        fade
        speed={0.5}
      />

      <MouseParallax />
    </>
  );
}

function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
    </div>
  );
}

export function HeroCanvas() {
  return (
    <ThreeErrorBoundary fallback={<HeroFallback />}>
      <Suspense fallback={<HeroFallback />}>
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 50 }}
          style={{ position: "absolute", inset: 0 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  );
}
