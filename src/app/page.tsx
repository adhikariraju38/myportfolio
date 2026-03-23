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

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Raju Kumar Yadav",
    jobTitle: "Full Stack Engineer",
    url: "https://rajukumaryadav.com",
    email: "itsmeerajuyadav@gmail.com",
    sameAs: [
      "https://linkedin.com/in/adhikariraju38",
      "https://github.com/adhikariraju38",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "FastAPI",
      "Python",
      "TypeScript",
      "AWS",
      "Microservices",
      "Clean Architecture",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "IOE Pulchowk Campus",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lalitpur",
      addressCountry: "Nepal",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <PublicationsSection />
      <OpenSourceSection />
      <AwardsSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}
