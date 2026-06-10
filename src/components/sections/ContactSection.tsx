"use client";

import { useRef, useState, useEffect, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { DynamicContactCanvas } from "@/components/3d/SceneLoaders";
import {
  staggerContainer,
  fadeInUp,
  wordReveal,
  wordRevealChild,
} from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";
import { usePerformance } from "@/hooks/usePerformanceTier";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { Input } from "@/components/ds/Input";
import { Textarea } from "@/components/ds/Textarea";
import { Button as DSButton } from "@/components/ds/Button";
import { IconButton } from "@/components/ds/IconButton";
import { Tooltip } from "@/components/ds/Tooltip";
import { getIcon } from "@/lib/icons";
import type { PublicSocialLink } from "@/types/public";

interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
}

interface ContactSectionProps {
  contact: ContactInfo;
  socials: PublicSocialLink[];
  enable3dCanvas?: boolean;
  /** Admin-controlled 3D mesh density, percent of baseline (0–200). */
  meshDensity?: number;
}


export function ContactSection({
  contact,
  socials,
  enable3dCanvas = true,
  meshDensity = 100,
}: ContactSectionProps) {
  const mounted = useHasMounted();
  const perf = usePerformance();
  const enable3d = perf.enable3D && enable3dCanvas;
  const [isVisible, setIsVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry?.isIntersecting ?? false),
      { rootMargin: "200px" },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const body = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };
    setSubmitting(true);
    try {
      await apiClient.post("/api/public/inquiries", body);
      toast.success("Thanks — I'll get back to you soon.");
      form.reset();
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Submit failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const heading = "Let's Build Something Together";

  return (
    <SectionWrapper id="contact" className="relative">
      {enable3d ? (
        <div ref={sectionRef} className="absolute inset-0 -z-10 hidden md:block" aria-hidden="true">
          <DynamicContactCanvas
            frameloop={isVisible ? "always" : "demand"}
            dpr={perf.dpr}
            particleMultiplier={perf.particleMultiplier * (meshDensity / 100)}
          />
        </div>
      ) : (
        <div ref={sectionRef} className="absolute inset-0 -z-10 hidden md:block" aria-hidden="true">
          <div className="absolute inset-0 bg-linear-to-t from-accent/3 via-transparent to-transparent" />
        </div>
      )}
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
            <motion.span key={i} variants={wordRevealChild} className="mr-[0.25em] inline-block last:mr-0">
              {word}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="mb-4 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-hover"
        />
        <motion.p variants={fadeInUp} className="mb-12 max-w-lg text-sm text-text-secondary">
          Have a project in mind or want to discuss an opportunity? I&apos;d love to hear from you.
        </motion.p>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-5">
            <Input id="name" name="name" type="text" label="Name" required placeholder="Your name" />
            <Input id="email" name="email" type="email" label="Email" required placeholder="your@email.com" />
            <Textarea
              id="message"
              name="message"
              label="Message"
              required
              rows={5}
              placeholder="Tell me about your project..."
            />
            <DSButton type="submit" loading={submitting} iconLeft={<Send size={16} />}>
              {submitting ? "Sending…" : "Send Message"}
            </DSButton>
          </motion.form>

          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="space-y-4">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text link-underline"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full glass-pill">
                    <Mail size={16} className="text-accent" />
                  </div>
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-text link-underline"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full glass-pill">
                    <Phone size={16} className="text-accent" />
                  </div>
                  {contact.phone}
                </a>
              )}
              {contact.location && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full glass-pill">
                    <MapPin size={16} className="text-accent" />
                  </div>
                  {contact.location}
                </div>
              )}
            </div>

            {socials.length > 0 && (
              <div className="border-t border-border pt-6">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
                  Find me on
                </p>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s) => {
                    const Icon = getIcon(s.icon ?? s.platform);
                    const label = s.label ?? s.platform;
                    return (
                      <Tooltip key={s.url} label={label}>
                        <IconButton
                          label={label}
                          variant="soft"
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {Icon ? <Icon size={18} /> : <span className="text-xs font-medium">{s.platform[0]?.toUpperCase()}</span>}
                        </IconButton>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
