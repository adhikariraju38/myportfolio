"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show on desktop with pointer device
    const mql = window.matchMedia("(pointer: fine) and (min-width: 768px)");
    if (!mql.matches) return;

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const handleEnterInteractive = () => setIsHovering(true);
    const handleLeaveInteractive = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMove);

    // Track interactive elements
    const observer = new MutationObserver(() => {
      const elements = document.querySelectorAll(
        "a, button, [role='button'], input, textarea, select"
      );
      elements.forEach((el) => {
        el.addEventListener("mouseenter", handleEnterInteractive);
        el.addEventListener("mouseleave", handleLeaveInteractive);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial scan
    const elements = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select"
    );
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleEnterInteractive);
      el.addEventListener("mouseleave", handleLeaveInteractive);
    });

    // Animation loop
    let raf: number;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px)`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMove);
      observer.disconnect();
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={{ willChange: "transform" }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHovering
              ? "h-10 w-10 border-accent/40 bg-accent/5"
              : "h-5 w-5 border-text-tertiary/40"
          }`}
        />
      </div>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={{ willChange: "transform" }}
      >
        <div className="h-1 w-1 rounded-full bg-accent" />
      </div>
    </>
  );
}
