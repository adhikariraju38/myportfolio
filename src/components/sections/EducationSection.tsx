"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Card } from "@/components/ui/Card";
import { EDUCATION, COMMUNITY } from "@/lib/data";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";

export function EducationSection() {
  return (
    <SectionWrapper id="education">
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
          {"Education & Community".split(" ").map((word, i) => (
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

        <div className="grid gap-6 md:grid-cols-2">
          {/* Education */}
          <motion.div variants={fadeInUp}>
            <Card spotlight={false}>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <GraduationCap size={18} className="text-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold text-text">
                {EDUCATION.school}
              </h3>
              <p className="text-sm text-text-secondary">{EDUCATION.degree}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-tertiary">
                <span>Grade: {EDUCATION.grade}</span>
                <span>{EDUCATION.period}</span>
                <span>{EDUCATION.location}</span>
              </div>
            </Card>
          </motion.div>

          {/* Community */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-4">
            {COMMUNITY.map((item) => (
              <Card key={item.role} spotlight={false}>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-emerald/10">
                    <Users size={14} className="text-accent-emerald" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text">
                      {item.role}
                    </h4>
                    <p className="text-xs text-text-secondary">{item.org}</p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {item.description}
                    </p>
                    <span className="mt-1 inline-block text-[10px] text-text-tertiary">
                      {item.year}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
