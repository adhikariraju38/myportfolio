"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award as AwardIcon, ExternalLink } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Card } from "@/components/ui/Card";
import { AWARDS, CERTIFICATIONS } from "@/lib/data";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";

const rankConfig = {
  winner: {
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    label: "Winner",
  },
  "runner-up": {
    icon: Medal,
    color: "text-gray-300",
    bg: "bg-gray-300/10",
    border: "border-gray-300/20",
    label: "Runner Up",
  },
  "2nd-runner-up": {
    icon: Medal,
    color: "text-amber-700",
    bg: "bg-amber-700/10",
    border: "border-amber-700/20",
    label: "2nd Runner Up",
  },
  "top-5": {
    icon: AwardIcon,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    label: "Top 5",
  },
};

export function AwardsSection() {
  return (
    <SectionWrapper id="awards">
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
          {"Awards & Certifications".split(" ").map((word, i) => (
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

        {/* Awards */}
        <motion.h3
          variants={fadeInUp}
          className="mb-6 text-lg font-semibold text-text-secondary"
        >
          Awards
        </motion.h3>
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AWARDS.map((award) => {
            const config = rankConfig[award.rank];
            const Icon = config.icon;
            return (
              <motion.div key={award.title} variants={fadeInUp}>
                <Card
                  spotlight={false}
                  className={`text-center ${config.border}`}
                >
                  <div
                    className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${config.bg}`}
                  >
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className={`mb-1 text-xs font-semibold ${config.color}`}>
                    {config.label}
                  </div>
                  <h4 className="text-sm font-medium text-text">
                    {award.title}
                  </h4>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {award.event}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.h3
          variants={fadeInUp}
          className="mb-6 text-lg font-semibold text-text-secondary"
        >
          Certifications
        </motion.h3>
        <div className="grid gap-4 md:grid-cols-3">
          {CERTIFICATIONS.map((cert) => (
            <motion.div key={cert.title} variants={fadeInUp}>
              <Card spotlight={false} className="flex items-start gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-text">
                    {cert.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-text-tertiary">
                    {cert.issuer}
                  </p>
                </div>
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-text-tertiary transition-colors hover:text-accent"
                  aria-label={`View ${cert.title} credential`}
                >
                  <ExternalLink size={14} />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
