import type {
  Experience,
  Project,
  Skill,
  Award,
  Certification,
  NavLink,
} from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export const HERO = {
  name: "Raju Kumar Yadav",
  title: "Full Stack Engineer",
  tagline:
    "3.5+ years building microservices, React frontends, and cloud infrastructure. I believe clean architecture saves more time than clever hacks.",
  cta: {
    primary: { label: "View My Work", href: "#projects" },
    secondary: { label: "Get In Touch", href: "#contact" },
  },
};

export const ABOUT = {
  summary:
    "Full Stack Engineer with 3.5+ years of experience building production-grade platforms from backend to frontend. Currently architecting a microservices platform at Astha AI with 8+ independently deployable services. Previously built scalable cloud infrastructure and cross-platform apps at Belvy IO. Started my journey freelancing during college, delivering full stack web applications for clients.",
  stats: [
    { label: "Years Experience", value: 3.5, suffix: "+" },
    { label: "Services Built", value: 8, suffix: "+" },
    { label: "Tests Written", value: 132, suffix: "+" },
    { label: "API Req/Month", value: 1, suffix: "M+" },
  ],
};

export const EXPERIENCES: Experience[] = [
  {
    company: "Astha AI",
    role: "Software Engineer",
    location: "Lalitpur, Nepal",
    period: "2025 — Present",
    type: "full-time",
    bullets: [
      "Architected and built a production microservices platform comprising 8+ independently deployable services using FastAPI and Clean Architecture (Hexagonal) pattern with strict separation of domain, application, and adapter layers.",
      "Developed a centralized authentication service integrating JWT token management and Keycloak, handling user login, registration, session verification, and multi-language support.",
      "Built an OPA-based authorization service implementing fine-grained RBAC with route-based access control, supporting SELF and ADMIN scopes, with hot-reloadable Rego policies.",
      "Engineered a user management service with organization management, email domain-based org suggestions, OTP verification flows, and Stripe payment integration.",
      "Designed a course management service with global catalog imports from GitHub releases, org-scoped enrollments, progress tracking, quiz/exam auto-scoring, and PDF certificate generation.",
      "Built the notification service with SendGrid integration, full lifecycle tracking, SHA-256 based idempotent IDs, and provider-swappable architecture.",
      "Developed the Next.js 16 + React 19 frontend with TypeScript, implementing authentication flows, course catalog, quiz interfaces, team management, and MCP registry using Zustand and React Query.",
      "Implemented comprehensive OpenTelemetry instrumentation across all services for distributed tracing, structured logging, and end-to-end observability.",
      "Wrote 132+ tests across unit and E2E (Jest + Playwright) for frontend, and Pytest suites for all backend services, enforcing type safety with Pyright and code quality with Ruff.",
    ],
    tech: [
      "FastAPI",
      "Python",
      "Next.js",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "MongoDB",
      "Docker",
      "SQLAlchemy",
      "OPA",
      "Keycloak",
      "OpenTelemetry",
      "Stripe",
      "SendGrid",
    ],
  },
  {
    company: "Belvy IO",
    role: "Software Engineer",
    location: "Remote (US-based)",
    period: "2024",
    type: "remote",
    bullets: [
      "Architected cloud infrastructure using Terraform, provisioning AWS Lambda, ECS, ECR, and S3, while implementing CI/CD pipelines with GitHub Actions.",
      "Built scalable frontend applications with React + TypeScript and Next.js, improving page load speeds by 25% and user engagement by 15%.",
      "Optimized backend REST APIs with Flask RESTful, improving response times by 40% and handling 1M+ requests/month with zero downtime.",
      "Integrated Textkernel API for automated resume parsing and job matching, reducing manual processing time by 50%.",
      "Implemented secure payment processing via Stripe API, facilitating 5,000+ transactions with 99.99% success rate.",
      "Contributed to cross-platform mobile development using React Native + TypeScript, integrating native modules for Bluetooth, Camera, and Location services.",
    ],
    tech: [
      "React",
      "Next.js",
      "React Native",
      "TypeScript",
      "Flask",
      "Terraform",
      "AWS",
      "Stripe",
      "GitHub Actions",
    ],
  },
  {
    company: "Freelance",
    role: "Full Stack Developer",
    location: "Nepal",
    period: "2022 — 2023",
    type: "freelance",
    bullets: [
      "Built complete web applications with React frontends and Flask/Django backends for multiple clients during college.",
      "Delivered production-ready full stack solutions independently, managing client requirements, development, and deployment.",
      "Gained real-world experience with REST API design, database modeling, and responsive UI development across diverse project domains.",
    ],
    tech: [
      "React",
      "TypeScript",
      "Flask",
      "Django",
      "PostgreSQL",
      "REST APIs",
    ],
  },
];

export const SKILLS: Skill[] = [
  // Languages
  { name: "Python", category: "Languages", production: true },
  { name: "TypeScript", category: "Languages", production: true },
  { name: "JavaScript", category: "Languages", production: true },
  { name: "C/C++", category: "Languages" },
  { name: "SQL", category: "Languages", production: true },
  { name: "HTML/CSS", category: "Languages", production: true },
  // Backend
  { name: "FastAPI", category: "Backend", production: true },
  { name: "Flask RESTful", category: "Backend", production: true },
  { name: "Express.js", category: "Backend" },
  { name: "SQLAlchemy", category: "Backend", production: true },
  { name: "Pydantic", category: "Backend", production: true },
  { name: "Alembic", category: "Backend", production: true },
  { name: "Celery", category: "Backend", production: true },
  // Frontend
  { name: "React 19", category: "Frontend", production: true },
  { name: "Next.js", category: "Frontend", production: true },
  { name: "React Native", category: "Frontend", production: true },
  { name: "Zustand", category: "Frontend", production: true },
  { name: "React Query", category: "Frontend", production: true },
  { name: "React Hook Form", category: "Frontend", production: true },
  { name: "Zod", category: "Frontend", production: true },
  { name: "Tailwind CSS", category: "Frontend", production: true },
  { name: "Material UI", category: "Frontend" },
  // Databases
  { name: "PostgreSQL", category: "Databases", production: true },
  { name: "Redis", category: "Databases", production: true },
  { name: "MongoDB", category: "Databases", production: true },
  { name: "SQLite", category: "Databases" },
  { name: "TimescaleDB", category: "Databases" },
  // DevOps & Cloud
  { name: "Docker", category: "DevOps & Cloud", production: true },
  { name: "AWS Lambda", category: "DevOps & Cloud", production: true },
  { name: "AWS ECS", category: "DevOps & Cloud", production: true },
  { name: "AWS S3", category: "DevOps & Cloud", production: true },
  { name: "AWS Cognito", category: "DevOps & Cloud", production: true },
  { name: "Terraform", category: "DevOps & Cloud", production: true },
  { name: "GitHub Actions", category: "DevOps & Cloud", production: true },
  // Architecture
  { name: "Microservices", category: "Architecture", production: true },
  { name: "Clean Architecture", category: "Architecture", production: true },
  { name: "REST APIs", category: "Architecture", production: true },
  { name: "JWT/OAuth", category: "Architecture", production: true },
  { name: "OPA (RBAC)", category: "Architecture", production: true },
  { name: "OpenTelemetry", category: "Architecture", production: true },
  // Testing
  { name: "Pytest", category: "Testing", production: true },
  { name: "Jest", category: "Testing", production: true },
  { name: "Playwright", category: "Testing", production: true },
  { name: "Pyright", category: "Testing", production: true },
  { name: "Ruff", category: "Testing", production: true },
];

export const SKILL_CATEGORIES = [
  "Languages",
  "Backend",
  "Frontend",
  "Databases",
  "DevOps & Cloud",
  "Architecture",
  "Testing",
] as const;

export const PROJECTS: Project[] = [
  {
    slug: "astha-ai",
    title: "Astha AI Platform",
    subtitle: "Production Microservices Platform",
    description:
      "A production microservices platform for AI-powered education and enterprise management with 8+ independently deployable services, Clean Architecture, and comprehensive observability.",
    tech: [
      "FastAPI",
      "Next.js",
      "React 19",
      "PostgreSQL",
      "Redis",
      "OPA",
      "OpenTelemetry",
      "Docker",
    ],
    metric: "8+ microservices, 132+ tests",
  },
  {
    slug: "zomec-ai",
    title: "Zomec AI",
    subtitle: "AI-Powered Job Matching Platform",
    description:
      "AI-driven platform connecting job seekers and providers through smart CV-to-job matching algorithms, increasing match accuracy by 40%. Cloud-native with Terraform infrastructure.",
    tech: [
      "React",
      "TypeScript",
      "Flask",
      "AWS",
      "Terraform",
      "Stripe",
      "Cognito",
    ],
    metric: "40% accuracy improvement",
  },
  {
    slug: "code4pro",
    title: "Code4Pro",
    subtitle: "Full Stack Real-time Platform",
    description:
      "Full stack platform with real-time WebSocket features, AWS Lambda background jobs, cross-platform mobile apps, and Flask RESTful backend optimized for high-throughput workloads.",
    tech: [
      "React",
      "React Native",
      "TypeScript",
      "Flask",
      "WebSocket",
      "AWS Lambda",
    ],
    metric: "Cross-platform mobile + web",
  },
  {
    slug: "agricultural-marketplace",
    title: "Agricultural Marketplace",
    subtitle: "Buyer-Seller Platform",
    description:
      "Platform connecting agricultural buyers and sellers with ReactJS frontend and Django backend, processing 1,000+ daily transactions.",
    tech: ["React.js", "Django", "PostgreSQL", "SQLite", "Bootstrap"],
    metric: "1,000+ daily transactions",
    github: "https://github.com/adhikariraju38/marketplace",
  },
  {
    slug: "mockify-ts",
    title: "mockify-ts",
    subtitle: "Published npm Package",
    description:
      "Lightweight TypeScript mock data factory with smart field inference for Jest/Vitest and React Testing Library — eliminates boilerplate in unit tests.",
    tech: ["TypeScript", "Node.js", "npm"],
    metric: "Published on npm",
    link: "https://www.npmjs.com/package/mockify-ts",
    github: "https://github.com/adhikariraju38/mockify-ts",
  },
  {
    slug: "dev-env-toolkit",
    title: "dev-env-toolkit",
    subtitle: "Published npm Package",
    description:
      "Type-safe environment variables, config management, and debugging utilities for Node.js and TypeScript projects.",
    tech: ["TypeScript", "Node.js", "npm", "CLI"],
    metric: "Published on npm",
    link: "https://www.npmjs.com/package/dev-env-toolkit",
    github: "https://github.com/adhikariraju38/dot-env-toolkit",
  },
];

export const AWARDS: Award[] = [
  {
    title: "Best AI Project",
    event: "DeltaThon",
    rank: "winner",
  },
  {
    title: "Frontend Web Development",
    event: "ACES Competition",
    rank: "runner-up",
  },
  {
    title: "Dataverse",
    event: "DOCSUMO",
    rank: "2nd-runner-up",
  },
  {
    title: "Spirathon",
    event: "National Level Hackathon by Spiralogics",
    rank: "top-5",
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: "AWS Academy Data Engineering",
    issuer: "Amazon Web Services",
    link: "https://drive.google.com/file/d/1x-MMdaaNSjwRJVcaioVdE4bMI5jbGhWC/view",
  },
  {
    title: "Microsoft Innovative Educator (Azure)",
    issuer: "Microsoft",
    link: "https://drive.google.com/file/d/1xnTNk8vEnD8_9wtpF-GLqTJL2Afjg3nv/view",
  },
  {
    title: "Supervised Machine Learning",
    issuer: "Coursera & DeepLearning.AI",
    link: "https://drive.google.com/file/d/1_lEtLMF41XXRxfVE4xoVBUf7EuRPQO6a/view",
  },
];

export const EDUCATION = {
  school: "IOE Pulchowk Campus",
  degree: "Bachelor in Computer Engineering",
  grade: "75.01%",
  period: "Nov. 2019 — April 2024",
  location: "Lalitpur, Nepal",
};

export const COMMUNITY = [
  {
    role: "Secretary",
    org: "Saraswati Puja Committee, Pulchowk Campus",
    year: "2024",
    description:
      "Coordinated a large-scale event attracting approximately 20,000 attendees.",
  },
  {
    role: "Computer Programming Instructor",
    org: "IOE Purwanchal Campus",
    year: "2022",
    description:
      "Taught Computer Programming course to junior students based on IOE syllabus.",
  },
];

export const CONTACT = {
  email: "itsmeerajuyadav@gmail.com",
  phone: "+9779813977980",
  location: "Tikathali, Lalitpur, Nepal",
  linkedin: "https://linkedin.com/in/adhikariraju38",
  github: "https://github.com/adhikariraju38",
};
