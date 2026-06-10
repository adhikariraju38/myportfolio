"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Card } from "@/components/ui/Card";
import {
  staggerContainer,
  fadeInUp,
  wordReveal,
  wordRevealChild,
} from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { PublicCommunity, PublicEducation } from "@/types/public";

interface EducationSectionProps {
  education: PublicEducation | null;
  community: PublicCommunity[];
}

export function EducationSection({ education, community }: EducationSectionProps) {
  const mounted = useHasMounted();
  if (!education && community.length === 0) return null;
  return (
    <SectionWrapper id="education">
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
          {"Education & Community".split(" ").map((word, i) => (
            <motion.span key={i} variants={wordRevealChild} className="mr-[0.25em] inline-block last:mr-0">
              {word}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="mb-12 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-hover"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {education && (
            <motion.div variants={fadeInUp}>
              <Card spotlight={false}>
                {education.logoImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={education.logoImage.url}
                    alt={`${education.school} logo`}
                    className="mb-4 h-10 w-10 rounded-full object-contain"
                  />
                ) : (
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <GraduationCap size={18} className="text-accent" />
                  </div>
                )}
                <h3 className="font-display text-lg font-semibold text-text">{education.school}</h3>
                <p className="text-sm text-text-secondary">{education.degree}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-tertiary">
                  {education.grade && <span>Grade: {education.grade}</span>}
                  {education.period && <span>{education.period}</span>}
                  {education.location && <span>{education.location}</span>}
                </div>
              </Card>
            </motion.div>
          )}

          {community.length > 0 && (
            <motion.div variants={fadeInUp} className="flex flex-col gap-4">
              {community.map((item) => (
                <Card key={item.id} spotlight={false}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-emerald/10">
                      <Users size={14} className="text-accent-emerald" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-text">{item.role}</h4>
                      <p className="text-xs text-text-secondary">{item.org}</p>
                      {item.description && (
                        <p className="mt-1 text-xs text-text-tertiary">{item.description}</p>
                      )}
                      {item.year && (
                        <span className="mt-1 inline-block text-[10px] text-text-tertiary">{item.year}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
