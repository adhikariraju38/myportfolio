"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface CanvasProps {
  frameloop?: "always" | "demand";
  dpr?: [number, number];
  particleMultiplier?: number;
}

export const DynamicHeroCanvas: ComponentType<CanvasProps> = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>
    ),
  }
);

export const DynamicContactCanvas: ComponentType<CanvasProps> = dynamic(
  () => import("./ContactMesh").then((mod) => mod.ContactCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-accent/3 via-transparent to-transparent" />
      </div>
    ),
  }
);
