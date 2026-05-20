import type { ReactNode } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PublicationsSection } from "@/components/sections/PublicationsSection";
import { OpenSourceSection } from "@/components/sections/OpenSourceSection";
import { AwardsSection } from "@/components/sections/AwardsSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getHomeSections, getSiteSettings } from "@/lib/queries/site";
import {
  getAbout,
  getAwards,
  getCommunityInvolvement,
  getEducation,
  getExperiences,
  getHero,
  getOpenSource,
  getProjects,
  getPublications,
  getSkills,
} from "@/lib/queries/content";
import type {
  PublicAbout,
  PublicAward,
  PublicCertification,
  PublicCommunity,
  PublicEducation,
  PublicExperience,
  PublicHero,
  PublicOpenSource,
  PublicProject,
  PublicPublication,
  PublicSkill,
  PublicSkillCategory,
  PublicSocialLink,
} from "@/types/public";

export default async function Home() {
  const [
    sections,
    settings,
    hero,
    about,
    experiences,
    skillsData,
    projects,
    publications,
    openSource,
    awardsData,
    education,
    community,
  ] = await Promise.all([
    getHomeSections(),
    getSiteSettings(),
    getHero(),
    getAbout(),
    getExperiences(),
    getSkills(),
    getProjects(),
    getPublications(),
    getOpenSource(),
    getAwards(),
    getEducation(),
    getCommunityInvolvement(),
  ]);

  const enable3dHero = (settings?.enable3dHero as boolean | undefined) ?? true;
  const enable3dContact = (settings?.enable3dContact as boolean | undefined) ?? true;

  const heroData = hero as unknown as PublicHero | null;
  const aboutData = about as unknown as PublicAbout | null;
  const exps = experiences as unknown as PublicExperience[];
  const cats = (skillsData.categories ?? []) as unknown as PublicSkillCategory[];
  const skills = (skillsData.skills ?? []) as unknown as PublicSkill[];
  const projs = projects as unknown as PublicProject[];
  const pubs = publications as unknown as PublicPublication[];
  const os = openSource as unknown as PublicOpenSource[];
  const awards = (awardsData.awards ?? []) as unknown as PublicAward[];
  const certifications = (awardsData.certifications ?? []) as unknown as PublicCertification[];
  const edu = education as unknown as PublicEducation | null;
  const comm = community as unknown as PublicCommunity[];
  const socials = (settings?.socials as PublicSocialLink[] | undefined) ?? [];
  const contact = {
    email: (settings?.contactEmail as string | undefined) ?? "",
    phone: (settings?.contactPhone as string | undefined) ?? "",
    location: (settings?.contactLocation as string | undefined) ?? "",
  };

  const SECTION_MAP: Record<string, ReactNode> = {
    hero: heroData
      ? <HeroSection key="hero" hero={{ ...heroData, enable3dCanvas: heroData.enable3dCanvas !== false && enable3dHero }} />
      : null,
    about: aboutData ? <AboutSection key="about" about={aboutData} /> : null,
    experience: <ExperienceSection key="experience" experiences={exps} />,
    skills: <SkillsSection key="skills" categories={cats} skills={skills} />,
    projects: <ProjectsSection key="projects" projects={projs} />,
    publications: <PublicationsSection key="publications" publications={pubs} />,
    "open-source": <OpenSourceSection key="open-source" entries={os} />,
    awards: <AwardsSection key="awards" awards={awards} certifications={certifications} />,
    education: <EducationSection key="education" education={edu} community={comm} />,
    contact: (
      <ContactSection
        key="contact"
        contact={contact}
        socials={socials}
        enable3dCanvas={enable3dContact}
      />
    ),
  };

  const visibleSections = sections
    .filter((s) => s.isVisible !== false)
    .map((s) => SECTION_MAP[String(s.key)])
    .filter(Boolean);

  return <>{visibleSections}</>;
}
