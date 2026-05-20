<div align="center">

# Raju Kumar Yadav — Portfolio CMS

**Fully dynamic, MongoDB-backed portfolio with admin panel**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js)](https://threejs.org)

</div>

---

A performance-first portfolio built with **Next.js 16**, **React Three Fiber**, **Framer Motion**, and a **fully dynamic CMS** layered on **MongoDB**. Every visible string — name, title, navbar items, projects, skills, footer, logo, favicon, OG image, theme colors — is admin-editable at `/admin`. Public pages are server-rendered for SEO. Only the 3D scene geometry stays in code.

## Highlights

- **Fully dynamic content** — every section, navbar item, footer link, social icon, theme color, favicon glyph, and OG image is editable from the admin panel. No redeploy needed.
- **Server-rendered public site** — `app/page.tsx` is an async server component that fetches all data via Mongoose in parallel and renders cached HTML.
- **Universal Loader** — every `loading.tsx` uses a single brand-aware `<UniversalLoader />` driven by `site_settings.brand_short`.
- **Section toggles + reordering** — show/hide and reorder the 10 landing sections from `/admin/sections`.
- **GridFS media** — all uploads go to MongoDB GridFS (no S3, no Cloudinary). Served via `/api/media/[id]` with immutable Cache-Control.
- **Session auth** — bcrypt + httpOnly cookies, edge proxy guards `/admin/*`, rate-limited login + contact form.
- **3D Hero + Contact Mesh** — React Three Fiber. Visibility toggleable from `/admin/settings → Toggles`.
- **Dark / Light Theme** — both palettes are admin-editable; injected as CSS variables in `<style>` at layout.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5.7 strict |
| Database | MongoDB 7 + Mongoose 8 |
| Media | MongoDB GridFS |
| Admin state | React Query 5 + Zustand 5 |
| Validation | Zod 3 + React Hook Form 7 |
| Auth | bcrypt + httpOnly session cookies |
| 3D | React Three Fiber + @react-three/drei |
| Animation | Framer Motion 12 + CSS Keyframes |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Scroll | Lenis |
| Toasts | Sonner |
| Deploy | Vercel + MongoDB Atlas |

## Local development

```bash
# 1. Bring up MongoDB (host port 27018 → container 27017)
docker compose up -d

# 2. Install deps
npm install

# 3. Copy + adjust env
cp .env.example .env.local

# 4. Seed the database
npm run db:seed:all

# 5. Run dev server
npm run dev
```

Open `http://localhost:3000` for the public site, `http://localhost:3000/admin` for the CMS (default creds in `.env.local`). Mongo Express is at `http://localhost:8081`.

## Admin modules

Site
- **Settings** — Branding, SEO, Contact, Social, Theme, OG/Favicon, Toggles, JSON-LD
- **Navigation** — header + footer items (CRUD + reorder + isActive)
- **Section Order** — show/hide + reorder the 10 landing sections
- **Media Library** — browse + delete GridFS files

Content (per landing section)
- Hero, About, Experience, Skills, Projects, Publications, Open Source, Awards, Certifications, Education, Community

Ops
- **Inquiries** — public contact-form submissions with status filter

Admin
- **Users** — super_admin only

## Architecture

```
src/
├── app/                       # Next.js App Router
│   ├── page.tsx               # server-async — fetches everything, renders sections
│   ├── layout.tsx             # server-async — DB-driven metadata + theme vars
│   ├── icon.tsx               # dynamic favicon from settings
│   ├── opengraph-image.tsx    # dynamic OG image from settings
│   ├── (auth)/login/
│   ├── admin/                 # client shell + 17 module pages
│   └── api/
│       ├── auth/              # login, logout, session
│       ├── admin/             # CRUD per module
│       ├── public/inquiries/  # rate-limited contact form
│       └── media/[id]/        # GridFS streaming
├── components/
│   ├── 3d/                    # ALLOWED hardcoded (HeroScene, ContactMesh)
│   ├── admin/                 # shell, sidebar, topbar, data-table, image-upload
│   ├── auth/                  # login-form, logout-button
│   ├── layout/                # NavbarShell, FooterShell + interactive children
│   ├── sections/              # 10 prop-driven section components
│   ├── shared/                # UniversalLoader, skeletons, error boundary
│   └── ui/                    # Buttons, badges, admin inputs, sonner
├── lib/
│   ├── db/
│   │   ├── models/            # 16 Mongoose models
│   │   ├── gridfs.ts          # bucket helpers
│   │   └── index.ts           # mongoose.connect cache
│   ├── queries/               # public-side server-only fetchers (cached + tagged)
│   ├── validations/           # Zod schemas per entity
│   ├── auth.ts, auth-constants.ts
│   ├── api-client.ts          # typed fetch wrapper
│   ├── api-helpers.ts         # withAdminAuth, parseBody, success/error
│   ├── api-crud.ts            # generic crudList/Create/Detail/Update/Delete
│   ├── rate-limit.ts          # sliding-window in-memory
│   ├── cache-tags.ts          # revalidateTag tag names
│   ├── icons.ts               # Lucide + custom Brand icon map
│   └── theme.ts               # CSS-var override builder
├── hooks/                     # use-admin-data, use-upload, ...
├── providers/                 # query-provider, theme-provider
├── stores/                    # ui-store (sidebar, mobile menu)
├── styles/
│   └── animations.ts          # framer-motion variants
└── types/
    ├── api.ts                 # ApiResponse<T>
    └── public.ts              # serialized doc shapes for public components
```

## Migration history

See [`docs/phases/`](docs/phases/) for the phase-by-phase migration plan from the original static `lib/data.ts` portfolio to this CMS-driven version. Each phase doc has its task list, prereqs, testing checklist, and notes.

| Phase | What landed |
|---|---|
| 01 | Docs, docker-compose (Mongo), deps, tsconfig hardening |
| 02 | Mongoose auth + session cookies + `proxy.ts` |
| 03 | 16 Mongoose models, Zod schemas, seeds |
| 04 | Admin CRUD API + GridFS upload + media stream |
| 05 | Providers, hooks, UniversalLoader, primitives |
| 06 | DB-driven chrome (layout, navbar, footer, icon, OG, theme) |
| 07 | Admin shell + Settings/Navigation/Sections/Media/Users |
| 08 | Hero, About, Experience, Skills, Projects admin |
| 09 | Publications, Open Source, Awards, Certs, Education, Community, Inquiries |
| 10 | Server-driven public sections, delete `lib/data.ts` |
| 11 | SEO + polish + admin loading/error |
| 12 | Production deploy + handover |

## License

MIT

---

<div align="center">

**Built by [Raju Kumar Yadav](https://github.com/adhikariraju38)**

</div>
