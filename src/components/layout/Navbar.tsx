"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/data";
import { useScrollSection } from "@/hooks/useScrollSection";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { usePerformance } from "@/hooks/usePerformanceTier";

function MagneticLink({
  href,
  isActive,
  magnetic,
  onClick,
  children,
}: {
  href: string;
  isActive: boolean;
  magnetic: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnetic || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      x.set(Math.max(-5, Math.min(5, dx * 0.3)));
      y.set(Math.max(-5, Math.min(5, dy * 0.3)));
    },
    [x, y, magnetic]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magnetic ? { x: springX, y: springY } : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative rounded-full px-4 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isActive
          ? "text-text"
          : "text-text-secondary hover:text-text link-underline"
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-full glass-pill"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

export function Navbar() {
  const perf = usePerformance();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeSection = useScrollSection();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.__lenis?.scrollTo(href, { offset: -80, duration: 2.5, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    setIsMobileOpen(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
        >
          <nav className="glass glass-highlight flex items-center gap-1 rounded-full px-2 py-2">
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <MagneticLink
                  key={link.href}
                  href={link.href}
                  isActive={activeSection === link.href.slice(1)}
                  magnetic={perf.enableMagnetic}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                </MagneticLink>
              ))}
            </div>

            <ThemeToggle />

            <motion.button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              whileTap={{ scale: 0.9 }}
              className="rounded-full p-2 text-text-secondary hover:text-text md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </nav>

          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass glass-highlight mt-1 overflow-hidden rounded-2xl md:hidden"
              >
                <div className="flex flex-col p-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      aria-current={activeSection === link.href.slice(1) ? "page" : undefined}
                      className={cn(
                        "rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        activeSection === link.href.slice(1)
                          ? "glass-pill text-text"
                          : "text-text-secondary hover:text-text"
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
