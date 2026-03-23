export interface Experience {
  company: string;
  role: string;
  location: string;
  period: string;
  type: "full-time" | "remote" | "freelance";
  bullets: string[];
  tech: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  metric: string;
  link?: string;
  github?: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  production?: boolean;
}

export type SkillCategory =
  | "Languages"
  | "Backend"
  | "Frontend"
  | "Databases"
  | "DevOps & Cloud"
  | "Architecture"
  | "Testing";

export interface Award {
  title: string;
  event: string;
  rank: "winner" | "runner-up" | "2nd-runner-up" | "top-5";
}

export interface Certification {
  title: string;
  issuer: string;
  link: string;
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi?: string;
  description: string;
}

export interface OpenSourceContribution {
  project: string;
  organization: string;
  description: string;
  contributions: {
    id: string;
    title: string;
    severity: "critical" | "high" | "medium";
    description: string;
    url: string;
  }[];
  repoUrl: string;
}

export interface NavLink {
  label: string;
  href: string;
}
