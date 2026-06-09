"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
import type { PublicProject } from "@/types/public";

interface ProjectsSectionProps {
  projects: PublicProject[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const mounted = useHasMounted();
  if (projects.length === 0) return null;
  return (
    <SectionWrapper id="projects">
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
          {"Projects".split(" ").map((word, i) => (
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
          {projects.map((project) => (
            <motion.div key={project.slug} variants={fadeInUp}>
              <Card className="flex h-full flex-col">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text">{project.title}</h3>
                    {project.subtitle && <p className="text-sm text-accent">{project.subtitle}</p>}
                  </div>
                  <div className="flex gap-2">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary transition-colors hover:text-text"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-tertiary transition-colors hover:text-text"
                        aria-label={`Visit ${project.title}`}
                      >
                        <ArrowUpRight size={18} />
                      </a>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>
                )}
                {project.metric && (
                  <div className="mb-3 flex items-center gap-1.5">
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent">
                      {project.metric}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <Badge key={t} variant="tech">
                      {t}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
