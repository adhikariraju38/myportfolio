"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Suspense } from "react";
import { ThreeErrorBoundary } from "./ErrorBoundary";

function ConnectionGrid({ count = 50 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const { basePositions, connections } = useMemo(() => {
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      base[i * 3] = (Math.random() - 0.5) * 8;
      base[i * 3 + 1] = (Math.random() - 0.5) * 6;
      base[i * 3 + 2] = (Math.random() - 0.5) * 3 - 2;
    }

    // Pre-compute connections for nearby points
    const conns: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = base[i * 3] - base[j * 3];
        const dy = base[i * 3 + 1] - base[j * 3 + 1];
        const dz = base[i * 3 + 2] - base[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          conns.push(i, j);
        }
      }
    }

    return { basePositions: base, connections: conns };
  }, [count]);

  const linePositions = useMemo(
    () => new Float32Array(connections.length * 3),
    [connections]
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const pointer = state.pointer;
    mouse.current.x += (pointer.x * 4 - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y * 3 - mouse.current.y) * 0.05;

    const pos = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      // Gentle float
      const x = bx + Math.sin(time * 0.3 + i) * 0.1;
      const y = by + Math.cos(time * 0.2 + i * 0.5) * 0.1;

      // Mouse attraction
      const dx = mouse.current.x - x;
      const dy = mouse.current.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - dist / 3) * 0.3;

      pos.setXYZ(i, x + dx * force, y + dy * force, bz);
    }
    pos.needsUpdate = true;

    // Update lines
    if (linesRef.current) {
      const lp = linesRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let c = 0; c < connections.length; c += 2) {
        const i = connections[c];
        const j = connections[c + 1];
        const idx = c * 3;
        lp.array[idx] = pos.getX(i);
        lp.array[idx + 1] = pos.getY(i);
        lp.array[idx + 2] = pos.getZ(i);
        lp.array[idx + 3] = pos.getX(j);
        lp.array[idx + 4] = pos.getY(j);
        lp.array[idx + 5] = pos.getZ(j);
      }
      lp.needsUpdate = true;
    }
  });

  const pointsGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(basePositions), 3)
    );
    return g;
  }, [basePositions]);

  const linesGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    return g;
  }, [linePositions]);

  return (
    <>
      <points ref={pointsRef} geometry={pointsGeom}>
        <pointsMaterial
          size={0.04}
          color="#3b82f6"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={linesGeom}>
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </lineSegments>
    </>
  );
}

function ContactFallback() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-accent/3 via-transparent to-transparent" />
    </div>
  );
}

export function ContactCanvas({ frameloop = "always" }: { frameloop?: "always" | "demand" }) {
  return (
    <ThreeErrorBoundary fallback={<ContactFallback />}>
      <Suspense fallback={<ContactFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            pointerEvents: "none",
          }}
          dpr={[1, 1.5]}
          frameloop={frameloop}
          gl={{ antialias: false, alpha: true }}
        >
          <ConnectionGrid count={40} />
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  );
}
