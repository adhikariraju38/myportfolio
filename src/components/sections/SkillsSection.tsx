"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import {
  staggerContainer,
  fadeInUp,
  wordReveal,
  wordRevealChild,
} from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/utils";
import type { PublicSkill, PublicSkillCategory } from "@/types/public";

interface SkillsSectionProps {
  categories: PublicSkillCategory[];
  skills: PublicSkill[];
}

export function SkillsSection({ categories, skills }: SkillsSectionProps) {
  const mounted = useHasMounted();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  if (skills.length === 0) return null;

  const filtered =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.categoryId === activeCategory);

  const catById = new Map(categories.map((c) => [c.id, c]));

  return (
    <SectionWrapper id="skills">
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
          {"Technical Skills".split(" ").map((word, i) => (
            <motion.span key={i} variants={wordRevealChild} className="mr-[0.25em] inline-block last:mr-0">
              {word}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="mb-4 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-hover"
        />
        <motion.p variants={fadeInUp} className="mb-8 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
            Production — used in shipped products
          </span>
        </motion.p>

        <motion.div variants={fadeInUp} className="mb-8 flex flex-wrap gap-2">
          {["All", ...categories.map((c) => c.id)].map((catId) => {
            const label = catId === "All" ? "All" : catById.get(catId)?.name ?? catId;
            return (
              <motion.button
                key={catId}
                onClick={() => setActiveCategory(catId)}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
                  activeCategory === catId
                    ? "glass-pill text-accent shadow-[0_0_12px_-3px_var(--accent)]"
                    : "border border-border text-text-secondary hover:border-accent/30 hover:text-text",
                )}
              >
                {label}
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div layout className="flex flex-wrap gap-2">
          {filtered.map((skill) => {
            const catName = catById.get(skill.categoryId)?.name ?? "";
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Badge
                  category={catName as never}
                  variant={skill.production ? "production" : "default"}
                >
                  {skill.name}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
