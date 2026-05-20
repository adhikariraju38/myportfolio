// Public-facing types — what query helpers return after serialize().

export interface PublicHero {
  id?: string;
  eyebrowText?: string;
  name: string;
  title: string;
  tagline?: string;
  primaryCta?: { label?: string; href?: string };
  secondaryCta?: { label?: string; href?: string };
  enable3dCanvas?: boolean;
}

export interface PublicStat {
  label: string;
  value: number;
  suffix?: string;
}

export interface PublicAbout {
  id?: string;
  heading?: string;
  summary: string;
  profileImage?: { url?: string };
  profileAlt?: string;
  stats: PublicStat[];
}

export interface PublicExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  period?: string;
  type: "full-time" | "remote" | "freelance" | "contract" | "internship";
  bullets: string[];
  tech: string[];
}

export interface PublicSkillCategory {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
}

export interface PublicSkill {
  id: string;
  name: string;
  categoryId: string;
  production?: boolean;
}

export interface PublicProject {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  tech: string[];
  metric?: string;
  link?: string;
  github?: string;
  coverImage?: { url?: string };
}

export interface PublicPublication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  doi?: string;
  description?: string;
}

export interface PublicOpenSourceContrib {
  refId?: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  description?: string;
  url?: string;
}

export interface PublicOpenSource {
  id: string;
  project: string;
  organization?: string;
  description?: string;
  repoUrl?: string;
  contributions: PublicOpenSourceContrib[];
}

export interface PublicAward {
  id: string;
  title: string;
  event?: string;
  rank: string;
}

export interface PublicCertification {
  id: string;
  title: string;
  issuer?: string;
  link?: string;
}

export interface PublicEducation {
  id?: string;
  school: string;
  degree: string;
  grade?: string;
  period?: string;
  location?: string;
  logoImage?: { url?: string };
}

export interface PublicCommunity {
  id: string;
  role: string;
  org: string;
  year?: string;
  description?: string;
}

export interface PublicSocialLink {
  platform: string;
  url: string;
  label?: string;
  icon?: string;
}

export interface PublicSiteSettings {
  siteTitle: string;
  siteDescription?: string;
  brandShort: string;
  brandFull?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactLocation?: string;
  socials: PublicSocialLink[];
  enable3dHero?: boolean;
  enable3dContact?: boolean;
  enableSmoothScroll?: boolean;
  enableCustomCursor?: boolean;
  enableScrollProgress?: boolean;
  jsonLd?: Record<string, unknown>;
  logoImage?: { url?: string };
}
