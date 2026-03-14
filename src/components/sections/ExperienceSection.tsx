"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown, MapPin } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Badge } from "@/components/ui/Badge";
import { EXPERIENCES } from "@/lib/data";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";

function TimelineItem({
  exp,
  index,
}: {
  exp: (typeof EXPERIENCES)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
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

        <ul className="mb-4 space-y-2">
          {exp.bullets.slice(0, 3).map((bullet, i) => (
            <motion.li
              key={i}
              variants={fadeInUp}
              className="flex gap-2 text-sm leading-relaxed text-text-secondary"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
              {bullet}
            </motion.li>
          ))}
          <AnimatePresence>
            {expanded &&
              exp.bullets.slice(3).map((bullet, i) => (
                <motion.li
                  key={`extra-${i}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex gap-2 overflow-hidden text-sm leading-relaxed text-text-secondary"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                  {bullet}
                </motion.li>
              ))}
          </AnimatePresence>
        </ul>

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
  const mounted = useHasMounted();
  return (
    <SectionWrapper id="experience">
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
