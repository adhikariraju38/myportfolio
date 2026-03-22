"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HERO } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { DynamicHeroCanvas } from "@/components/3d/SceneLoaders";

export function HeroSection() {
  const [show3D, setShow3D] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  // Defer 3D canvas until text animations are well underway
  useEffect(() => {
    const timer = setTimeout(() => setShow3D(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Phase 2: Pause Three.js when hero is off-screen
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.__lenis?.scrollTo(href, { offset: -80, duration: 2.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  };

  const handleScrollClick = () => {
    window.__lenis?.scrollTo("#about", { offset: -80, duration: 2.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* 3D scene — deferred to avoid jank during text animations */}
      <motion.div
        className="absolute inset-0 hidden md:block"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: show3D ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {show3D && <DynamicHeroCanvas frameloop={isVisible ? "always" : "demand"} />}
      </motion.div>
      {/* Mobile fallback with CSS stars */}
      <div className="absolute inset-0 md:hidden" aria-hidden="true">
        <div className="mobile-stars absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* All hero text uses CSS animations — zero JS overhead, pure compositor */}
      {/* Phase 5: Clear will-change after animations finish to free GPU memory */}
      <div
        className="relative z-10 flex max-w-4xl flex-col items-center text-center"
        onAnimationEnd={(e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains("hero-fade-in") || target.classList.contains("hero-word-reveal")) {
            target.style.willChange = "auto";
          }
        }}
      >
        <p className="hero-fade-in mb-4 font-mono text-sm text-accent" style={{ animationDelay: "0ms" }}>
          Hi, I&apos;m
        </p>

        <h1 className="mb-4 font-display text-5xl font-bold tracking-tight text-text md:text-7xl">
          {HERO.name.split(" ").map((word, i) => (
            <span
              key={i}
              className="hero-word-reveal mr-[0.25em] inline-block last:mr-0"
              style={{ animationDelay: `${80 + i * 60}ms` }}
            >
              {word}
            </span>
          ))}
        </h1>

        <h2 className="mb-6 font-mono text-xl text-text-secondary md:text-2xl">
          {HERO.title.split(" ").map((word, i) => (
            <span
              key={i}
              className="hero-word-reveal mr-[0.25em] inline-block last:mr-0"
              style={{ animationDelay: `${260 + i * 50}ms` }}
            >
              {word}
            </span>
          ))}
        </h2>

        <p
          className="hero-fade-in mb-10 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg"
          style={{ animationDelay: "400ms" }}
        >
          {HERO.tagline}
        </p>

        <div
          className="hero-fade-in flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: "500ms" }}
        >
          <Button
            href={HERO.cta.primary.href}
            onClick={(e) => handleCTAClick(e, HERO.cta.primary.href)}
          >
            {HERO.cta.primary.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            href={HERO.cta.secondary.href}
            onClick={(e) => handleCTAClick(e, HERO.cta.secondary.href)}
            variant="secondary"
          >
            {HERO.cta.secondary.label}
          </Button>
        </div>
      </div>

      {/* Scroll indicator — clickable */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={handleScrollClick}
        className="absolute bottom-10 flex cursor-pointer flex-col items-center gap-2 border-none bg-transparent"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-text-tertiary" />
        </motion.div>
      </motion.button>
    </section>
  );
}
