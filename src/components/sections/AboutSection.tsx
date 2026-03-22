"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Counter } from "@/components/ui/Counter";
import { ABOUT } from "@/lib/data";
import { staggerContainer, fadeInUp, wordReveal, wordRevealChild } from "@/styles/animations";
import { useHasMounted } from "@/hooks/useHasMounted";

export function AboutSection() {
  const mounted = useHasMounted();
  return (
    <SectionWrapper id="about">
      <motion.div
        variants={staggerContainer}
        initial={mounted ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-12 md:grid-cols-2 md:items-center"
      >
        {/* Photo with professional treatment */}
        <motion.div variants={fadeInUp} className="flex justify-center">
          <div className="relative">
            {/* Gradient ring glow */}
            <div className="absolute -inset-1.5 rounded-2xl bg-linear-to-br from-accent via-accent-emerald to-cyan-400 opacity-50 blur-md" />
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-accent via-accent-emerald to-cyan-400 opacity-70" />
            <div className="relative h-72 w-72 overflow-hidden rounded-2xl md:h-80 md:w-80">
              <Image
                src="/images/raju-profile.jpg"
                alt="Raju Kumar Yadav"
                fill
                className="object-cover object-[center_20%] brightness-[1.02] contrast-[1.05]"
                sizes="(max-width: 768px) 288px, 640px"
                priority
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-bg/30 via-transparent to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div>
          <motion.h2
            variants={wordReveal}
            initial={mounted ? "hidden" : false}
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-2 font-display text-3xl font-bold text-text md:text-4xl"
          >
            {"About Me".split(" ").map((word, i) => (
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
            className="mb-6 h-1 w-16 rounded-full bg-linear-to-r from-accent to-accent-emerald"
          />
          <motion.p
            variants={fadeInUp}
            className="mb-8 text-base leading-relaxed text-text-secondary"
          >
            {ABOUT.summary}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 gap-4"
          >
            {ABOUT.stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="rounded-xl border border-border bg-bg-secondary/50 p-4 text-center"
              >
                <div className="font-display text-3xl font-bold text-accent">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-xs text-text-secondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
