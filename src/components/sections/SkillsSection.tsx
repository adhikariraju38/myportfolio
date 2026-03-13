"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { SKILLS, SKILL_CATEGORIES } from "@/lib/data";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/types";

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory | "All">(
    "All"
  );

  const filteredSkills =
    activeCategory === "All"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <SectionWrapper id="skills">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          variants={wordReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-2 font-display text-3xl font-bold text-text md:text-4xl"
        >
          {"Technical Skills".split(" ").map((word, i) => (
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
        <motion.p variants={fadeInUp} className="mb-8 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
            Production — used in shipped products
          </span>
        </motion.p>

        {/* Category tabs */}
        <motion.div
          variants={fadeInUp}
          className="mb-8 flex flex-wrap gap-2"
        >
          {["All", ...SKILL_CATEGORIES].map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat as SkillCategory | "All")}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "border border-border text-text-secondary hover:border-accent/30 hover:text-text"
              )}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          layout
          className="flex flex-wrap gap-2"
        >
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Badge
                category={skill.category}
                variant={skill.production ? "production" : "default"}
              >
                {skill.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}
