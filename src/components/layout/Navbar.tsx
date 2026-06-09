"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollSection } from "@/hooks/useScrollSection";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { IconButton } from "@/components/ds/IconButton";
import { usePerformance } from "@/hooks/usePerformanceTier";

export interface NavItemProp {
  label: string;
  href: string;
  icon?: string;
  opensInNewTab?: boolean;
}

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
    [x, y, magnetic],
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
        "relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isActive ? "text-accent-ink" : "text-text-secondary hover:text-text link-underline",
      )}
    >
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute inset-0 rounded-full bg-accent-soft ring-1 ring-inset ring-accent/30"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

interface NavbarProps {
  items: NavItemProp[];
  brand: string;
  logoUrl?: string | null;
}

export function Navbar({ items, brand, logoUrl }: NavbarProps) {
  const perf = usePerformance();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeSection = useScrollSection();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      window.__lenis?.scrollTo(href, {
        offset: -80,
        duration: 2.5,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
    }
    setIsMobileOpen(false);
  };

  if (items.length === 0) return null;

  const initial = (brand?.trim().charAt(0) || "R").toUpperCase();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
    >
      <nav className="glass glass-highlight flex items-center gap-1.5 rounded-full p-1.5">
        {/* Brand mark — accent square + display wordmark (design system look) */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, "#")}
          className="flex items-center gap-2 rounded-full py-1 pl-1.5 pr-2.5"
          aria-label={brand || "Home"}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo is an admin-uploaded GridFS URL streamed via /api/media; next/image domain config doesn't apply
            <img src={logoUrl} alt={brand} className="h-5.5 w-auto" />
          ) : (
            <span
              aria-hidden="true"
              className="grid size-5.5 place-items-center rounded-[7px] bg-accent font-display text-[13px] font-extrabold text-on-accent"
            >
              {initial}
            </span>
          )}
          {brand && (
            <span className="font-display text-[15px] font-bold tracking-tight text-text">
              {brand}
            </span>
          )}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((link) => (
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

        <span className="md:hidden">
          <IconButton
            label="Toggle menu"
            variant="ghost"
            size="sm"
            magnetic={false}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </IconButton>
        </span>
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
              {items.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={activeSection === link.href.slice(1) ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    activeSection === link.href.slice(1)
                      ? "bg-accent-soft text-accent-ink ring-1 ring-inset ring-accent/30"
                      : "text-text-secondary hover:text-text",
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
  );
}
