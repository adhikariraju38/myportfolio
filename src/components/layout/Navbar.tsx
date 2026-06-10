"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollSection } from "@/hooks/useScrollSection";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { IconButton } from "@/components/ds/IconButton";
import { Tabs } from "@/components/ds/Tabs";

export interface NavItemProp {
  label: string;
  href: string;
  icon?: string;
  opensInNewTab?: boolean;
}

interface NavbarProps {
  items: NavItemProp[];
  brand: string;
  logoUrl?: string | null;
}

export function Navbar({ items, brand, logoUrl }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeSection = useScrollSection();

  const scrollTo = (href: string) => {
    if (href.startsWith("#")) {
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
  const tabItems = items.map((it) => ({ id: it.href, label: it.label }));
  const activeHref =
    items.find((it) => it.href.slice(1) === activeSection)?.href ?? items[0]?.href;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2"
    >
      <nav className="glass flex items-center gap-1.5 rounded-full p-1.5">
        {/* Brand mark — accent square + display wordmark (design system look) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#");
          }}
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

        {/* Desktop links — DS Tabs pill with a sliding solid-accent indicator */}
        <div className="hidden md:block">
          <Tabs tabs={tabItems} value={activeHref} onChange={scrollTo} variant="pill" />
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
            className="mt-1 overflow-hidden rounded-2xl border border-border bg-bg-secondary shadow-(--shadow-lg) backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col p-2">
              {items.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) e.preventDefault();
                    scrollTo(link.href);
                  }}
                  aria-current={activeSection === link.href.slice(1) ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    activeSection === link.href.slice(1)
                      ? "bg-accent text-on-accent"
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
