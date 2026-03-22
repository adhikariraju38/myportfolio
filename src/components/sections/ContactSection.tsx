"use client";

import { useRef, useState, useEffect, useCallback, type FormEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { CONTACT } from "@/lib/data";
import { DynamicContactCanvas } from "@/components/3d/SceneLoaders";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";

function MagneticIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      x.set(Math.max(-3, Math.min(3, dx * 0.3)));
      y.set(Math.max(-3, Math.min(3, dy * 0.3)));
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      style={{ x: springX, y: springY }}
      className="flex h-10 w-10 items-center justify-center rounded-full glass-pill text-text-secondary transition-all hover:-translate-y-0.5 hover:text-text hover:shadow-[0_0_12px_-3px_var(--accent-blue)]"
      aria-label={label}
    >
      {children}
    </motion.a>
  );
}

export function ContactSection() {
  const mounted = useHasMounted();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Phase 2: Pause Three.js when contact is off-screen
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const heading = "Let's Build Something Together";

  return (
    <SectionWrapper id="contact" className="relative">
      {/* 3D background — desktop only, pauses when off-screen */}
      <div ref={sectionRef} className="absolute inset-0 -z-10 hidden md:block" aria-hidden="true">
        <DynamicContactCanvas frameloop={isVisible ? "always" : "demand"} />
      </div>
      <motion.div
        variants={staggerContainer}
        initial={mounted ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={wordReveal}
          initial={mounted ? "hidden" : false}
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-2 font-display text-3xl font-bold text-text md:text-4xl"
        >
          {heading.split(" ").map((word, i) => (
            <motion.span
              key={i}
              variants={wordRevealChild}
              className="mr-[0.25em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="mb-4 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-emerald"
        />
        <motion.p
          variants={fadeInUp}
          className="mb-12 max-w-lg text-sm text-text-secondary"
        >
          Have a project in mind or want to discuss an opportunity? I&apos;d love to
          hear from you.
        </motion.p>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Form */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="input-wrapper">
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-text-secondary"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg glass-subtle px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-tertiary focus:shadow-[0_0_12px_-3px_var(--accent-blue)]"
                placeholder="Your name"
              />
            </div>
            <div className="input-wrapper">
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-text-secondary"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg glass-subtle px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-tertiary focus:shadow-[0_0_12px_-3px_var(--accent-blue)]"
                placeholder="your@email.com"
              />
            </div>
            <div className="input-wrapper">
              <label
                htmlFor="message"
                className="mb-1.5 block text-xs font-medium text-text-secondary"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-lg glass-subtle px-4 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-tertiary focus:shadow-[0_0_12px_-3px_var(--accent-blue)]"
                placeholder="Tell me about your project..."
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97, y: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex items-center gap-2 rounded-full bg-accent/90 backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent hover:shadow-[0_0_24px_-4px_var(--accent-blue)]"
            >
              <Send size={16} />
              Send Message
            </motion.button>
          </motion.form>

          {/* Contact info */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="space-y-4">
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text link-underline"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full glass-pill">
                  <Mail size={16} className="text-accent" />
                </div>
                {CONTACT.email}
              </a>
              <a
                href={`tel:${CONTACT.phone}`}
                className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text link-underline"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full glass-pill">
                  <Phone size={16} className="text-accent" />
                </div>
                {CONTACT.phone}
              </a>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <div className="flex h-10 w-10 items-center justify-center rounded-full glass-pill">
                  <MapPin size={16} className="text-accent" />
                </div>
                {CONTACT.location}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <p className="mb-3 text-xs font-medium text-text-tertiary">
                Find me on
              </p>
              <div className="flex gap-3">
                <MagneticIcon href={CONTACT.github} label="GitHub">
                  <Github size={18} />
                </MagneticIcon>
                <MagneticIcon href={CONTACT.linkedin} label="LinkedIn">
                  <Linkedin size={18} />
                </MagneticIcon>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
