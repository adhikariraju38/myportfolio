"use client";

import { motion } from "framer-motion";
import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { Github } from "@/components/ui/BrandIcons";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  staggerContainer,
  fadeInUp,
  wordReveal,
  wordRevealChild,
} from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";
import type { PublicOpenSource } from "@/types/public";

const severityConfig = {
  critical: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", label: "Critical" },
  high: { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", label: "High" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", label: "Medium" },
  low: { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", label: "Low" },
};

interface OpenSourceSectionProps {
  entries: PublicOpenSource[];
}

export function OpenSourceSection({ entries }: OpenSourceSectionProps) {
  const mounted = useHasMounted();
  if (entries.length === 0) return null;
  return (
    <SectionWrapper id="open-source">
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
          {"Open Source Contributions".split(" ").map((word, i) => (
            <motion.span key={i} variants={wordRevealChild} className="mr-[0.25em] inline-block last:mr-0">
              {word}
            </motion.span>
          ))}
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="mb-12 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-emerald"
        />

        {entries.map((project) => (
          <motion.div key={project.id} variants={fadeInUp}>
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-surface-tertiary/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <ShieldCheck size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text">{project.project}</h3>
                    {project.organization && (
                      <p className="text-sm text-accent-emerald">{project.organization}</p>
                    )}
                  </div>
                </div>
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-surface-tertiary/50 px-3 py-1.5 text-sm text-text-tertiary transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    <Github size={14} />
                    Repository
                  </a>
                )}
              </div>

              {project.description && (
                <div className="px-6 pt-4">
                  <p className="text-sm leading-relaxed text-text-secondary">{project.description}</p>
                </div>
              )}

              <div className="grid gap-4 p-6">
                {project.contributions.map((contrib, i) => {
                  const config = severityConfig[contrib.severity];
                  return (
                    <motion.div
                      key={i}
                      variants={fadeInUp}
                      className={`rounded-lg border ${config.border} ${config.bg} p-4`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <ShieldAlert size={16} className={config.color} />
                          {contrib.refId && (
                            <span className="font-mono text-sm font-semibold text-text">{contrib.refId}</span>
                          )}
                          {contrib.refId && <span className="text-text-tertiary">—</span>}
                          <span className="text-sm font-medium text-text">{contrib.title}</span>
                          <Badge variant="tech">
                            <span className={config.color}>{config.label}</span>
                          </Badge>
                        </div>
                        {contrib.url && (
                          <a
                            href={contrib.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-shrink-0 items-center gap-1 text-xs text-text-tertiary transition-colors hover:text-accent"
                            aria-label={`View ${contrib.title}`}
                          >
                            <ExternalLink size={12} />
                            View
                          </a>
                        )}
                      </div>
                      {contrib.description && (
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{contrib.description}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
