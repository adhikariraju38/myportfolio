"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { EXPERIENCES } from "@/lib/data";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof EXPERIENCES)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleBullets = expanded ? exp.bullets : exp.bullets.slice(0, 3);
  const hasMore = exp.bullets.length > 3;

  return (
    <motion.div
      variants={fadeInUp}
      className="relative grid gap-4 md:grid-cols-[200px_1fr]"
    >
      {/* Timeline dot + line */}
      <div className="hidden md:flex md:flex-col md:items-center">
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-bg-secondary">
          <Briefcase size={16} className="text-accent" />
        </div>
        {index < EXPERIENCES.length - 1 && (
          <div className="w-px flex-1 bg-linear-to-b from-accent/30 to-border" />
        )}
      </div>

      {/* Content */}
      <div className="pb-12">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl font-semibold text-text">
            {exp.role}
          </h3>
          <span className="text-text-tertiary">@</span>
          <span className="font-medium text-accent">{exp.company}</span>
          {exp.type === "remote" && (
            <Badge variant="tech" className="text-[10px]">Remote</Badge>
          )}
          {exp.type === "freelance" && (
            <Badge variant="tech" className="text-[10px]">Freelance</Badge>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-text-tertiary">
          <span>{exp.period}</span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {exp.location}
          </span>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-4 space-y-2"
        >
          {visibleBullets.map((bullet, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className="flex gap-2 text-sm leading-relaxed text-text-secondary"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
              {bullet}
            </motion.li>
          ))}
        </motion.ul>

        {hasMore && (
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="mb-4 flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            {expanded ? "Show less" : `Show ${exp.bullets.length - 3} more`}
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </motion.button>
        )}

        <div className="flex flex-wrap gap-1.5">
          {exp.tech.map((t) => (
            <Badge key={t} variant="tech">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function ExperienceSection() {
  return (
    <SectionWrapper id="experience">
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
          {"Experience".split(" ").map((word, i) => (
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
          className="mb-12 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-emerald"
        />

        <div className="relative">
          {EXPERIENCES.map((exp, i) => (
            <TimelineItem key={exp.company} exp={exp} index={i} />
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
