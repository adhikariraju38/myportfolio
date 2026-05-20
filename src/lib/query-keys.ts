export const queryKeys = {
  session: () => ["session"] as const,
  settings: () => ["settings"] as const,
  sections: () => ["sections"] as const,
  nav: (loc?: string) => (loc ? (["nav", loc] as const) : (["nav"] as const)),
  hero: () => ["hero"] as const,
  about: () => ["about"] as const,
  education: () => ["education"] as const,
  experiences: {
    list: () => ["experiences"] as const,
    detail: (id: string) => ["experiences", id] as const,
  },
  skillCategories: {
    list: () => ["skill-categories"] as const,
    detail: (id: string) => ["skill-categories", id] as const,
  },
  skills: {
    list: () => ["skills"] as const,
    detail: (id: string) => ["skills", id] as const,
  },
  projects: {
    list: () => ["projects"] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  publications: {
    list: () => ["publications"] as const,
    detail: (id: string) => ["publications", id] as const,
  },
  openSource: {
    list: () => ["open-source"] as const,
    detail: (id: string) => ["open-source", id] as const,
  },
  awards: {
    list: () => ["awards"] as const,
    detail: (id: string) => ["awards", id] as const,
  },
  certifications: {
    list: () => ["certifications"] as const,
    detail: (id: string) => ["certifications", id] as const,
  },
  community: {
    list: () => ["community"] as const,
    detail: (id: string) => ["community", id] as const,
  },
  inquiries: {
    list: (status?: string) =>
      status ? (["inquiries", status] as const) : (["inquiries"] as const),
    detail: (id: string) => ["inquiries", id] as const,
  },
  users: {
    list: () => ["users"] as const,
    detail: (id: string) => ["users", id] as const,
  },
  media: () => ["media"] as const,
} as const;
