"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Card } from "@/components/ui/Card";
import { PUBLICATIONS } from "@/lib/data";
import {
  staggerContainer,
  fadeInUp,
  wordReveal,
  wordRevealChild,
} from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";

export function PublicationsSection() {
  const mounted = useHasMounted();
  return (
    <SectionWrapper id="publications">
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
          {"Publications".split(" ").map((word, i) => (
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

        <div className="grid gap-6">
          {PUBLICATIONS.map((pub) => (
            <motion.div key={pub.title} variants={fadeInUp}>
              <Card className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <BookOpen size={18} className="text-accent" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-semibold text-text">
                      {pub.title}
                    </h3>
                    <span className="flex-shrink-0 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
                      {pub.year}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-text-tertiary">
                    {pub.authors}
                  </p>
                  <p className="mt-1 text-sm font-medium text-accent-emerald">
                    {pub.venue}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {pub.description}
                  </p>
                  {pub.doi && (
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-accent"
                    >
                      <ExternalLink size={12} />
                      DOI: {pub.doi}
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
