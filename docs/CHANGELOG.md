# Changelog

All notable changes to the portfolio migration, phase by phase. Append a line each time a phase wraps.

## Format

`YYYY-MM-DD — Phase NN — summary` (one or two sentences max).

---

## 2026-05-20 — Migration kickoff
- Branched `feat/dynamic-cms-mongodb` off `main`.
- Authored `CLAUDE.md`, `REQUIREMENTS.md`, `docs/CONTEXT.md`, and the 12-phase plan under `docs/phases/`.
- Authored `docker-compose.yml` for local MongoDB + Mongo Express.
- Authored `.env.example` enumerating every env var the migration introduces.

## 2026-05-20 — Phase 01 — Foundation
- Installed deps (mongoose, bcrypt, RQ5, Zustand, RHF, Zod, sonner, dnd-kit, radix-ui, tiptap, next-themes, tsx, prettier).
- Hardened tsconfig (`noUncheckedIndexedAccess`, `noImplicitOverride`).
- Added `.prettierrc`, `components.json` (shadcn config), npm seed scripts.
- Fixed pre-existing strict-mode TS issues in `3d/`, sections, SectionWrapper.

## 2026-05-20 — Phase 02 — Auth & security
- Mongoose connection + `lib/db/serialize.ts`; `User` + `Session` models with TTL index.
- bcrypt 12-round hashing, 96-char hex session tokens, httpOnly cookies (7-day).
- `withAdminAuth` / `withSuperAdminAuth` + Zod parse helpers, safe error responses.
- Sliding-window rate limit (5/15min on login).
- `/api/auth/{login,logout,session}`, login page + form + logout button.
- `proxy.ts` (Edge) redirects unauthenticated `/admin/*` to `/login`.
- Security headers in `next.config.ts` (XFO, XCTO, RP, PP, HSTS prod-only).
- Bumped host docker mongo port to 27018 (host already had mongod on 27017).
- `scripts/seed-super-admin.ts` runs idempotently.

## 2026-05-20 — Phase 03 — Database + Zod + seeds
- 16 Mongoose models: users, sessions, site-settings, home-section, nav-menu-item, hero-content, about-content, education, experience, skill-category, skill, project, publication, open-source-contribution, award, certification, community-involvement, inquiry.
- Zod schemas per entity in `lib/validations/`.
- Seed scripts: site-settings, home-sections (10 fixed keys), navbar, content (one-time bootstrap from old `lib/data.ts`).
- Public-side query helpers under `lib/queries/` wrapped in `unstable_cache` with revalidate tags.

## 2026-05-20 — Phase 04 — API + GridFS
- `lib/db/gridfs.ts` (bucket helpers).
- `/api/admin/upload` (multipart → GridFS, 10MB cap, mime whitelist).
- `/api/media/[id]` streams files with immutable Cache-Control + ETag.
- `lib/api-crud.ts` generic crudList/Create/Detail/Update/Delete + singletonGet/Patch + reorderHandler.
- Admin CRUD routes for every entity, public `/api/public/inquiries` (rate-limited, DOMPurify-sanitized).
- Switched `revalidateTag(tag, "max")` per Next 16.2 signature.

## 2026-05-20 — Phase 05 — Providers + UniversalLoader
- React Query 5 provider + dev tools + server-safe client singleton.
- `lib/query-keys.ts` factory.
- Zustand `ui-store` (sidebar + mobile menu).
- `hooks/use-admin-data.ts`, `use-upload.ts`, `use-debounce.ts`.
- `<UniversalLoader />` server-driven from `site_settings.brand_short` + skeleton primitives + `ConfirmDeleteDialog`.
- `components/ui/sonner.tsx` toaster + `admin-input.tsx` primitives.

## 2026-05-20 — Phase 06 — Dynamic public chrome
- `app/layout.tsx` server-async; `generateMetadata` + `generateViewport` read from `site_settings`.
- Theme CSS variables injected into `<style>` at layout.
- `NavbarShell` / `FooterShell` fetch nav + settings server-side and pass props to interactive Navbar/Footer.
- `app/icon.tsx` and `app/opengraph-image.tsx` rebuilt to read everything from settings.
- `app/sitemap.ts` and `app/robots.ts` now dynamic per `site_settings.siteUrl` + visible sections.
- `app/loading.tsx` + `app/error.tsx`.
- `app/not-found.tsx` reads brand from settings.

## 2026-05-20 — Phase 07 — Admin shell + Site/Ops modules
- `admin/layout.tsx` (session-gated client shell with sidebar + topbar).
- `/admin` dashboard with stat cards.
- `/admin/settings` (8-tab editor for every chrome field).
- `/admin/navigation` (header + footer CRUD + reorder).
- `/admin/sections` (drag-reorder + visibility toggles for 10 sections).
- `/admin/media` (GridFS browser, upload, copy URL, delete).
- `/admin/users` (super_admin only, CRUD + reset password).

## 2026-05-20 — Phase 08 — Content pt.1
- `/admin/hero`, `/admin/about` (singletons with image uploads + stats[]).
- `/admin/experience` (CRUD + bullets array).
- `/admin/skills` (two-pane: categories ↔ skills).
- `/admin/projects` (CRUD with cover image + slug auto-generation).
- `components/admin/resource-list.tsx`, `array-input.tsx` shared helpers.

## 2026-05-20 — Phase 09 — Content pt.2
- `/admin/publications` (with year + DOI).
- `/admin/open-source` (parent record + nested `contributions[]` editor).
- `/admin/awards`, `/admin/certifications`, `/admin/education` (singleton).
- `/admin/community` involvement CRUD.
- `/admin/inquiries` (status filter + detail dialog + mark read / archive / delete).

## 2026-05-20 — Phase 10 — Server-driven sections + delete data.ts
- All 10 section components refactored to accept data via props (no static imports).
- `app/page.tsx` is server-async: parallel-fetches everything, maps section keys to components.
- `ContactSection` now POSTs to `/api/public/inquiries` (no more mailto:).
- `types/public.ts` defines serialized doc shapes.
- DELETED `src/lib/data.ts`, `src/types/index.ts`, `scripts/seed-content.ts`.
- Build passes with 53 routes (12 static / 1 SSG / 40+ dynamic).

## 2026-05-20 — Phase 11 — SEO + polish
- `admin/loading.tsx`, `admin/error.tsx`, `(auth)/login/loading.tsx`.
- `not-found.tsx` reads brand from settings.
- `app/layout.tsx` honors `enableSmoothScroll` / `enableCustomCursor` / `enableScrollProgress` toggles.
- README rewritten for the CMS-driven portfolio.

## 2026-05-20 — Phase 12 — Production-ready
- Moved `proxy.ts` to `src/proxy.ts` so Next picks it up under the `src/` directory layout.
- Verified end-to-end smoke against `npm run build` + `npm run start`:
  - `/` returns 200 (162KB server-rendered HTML).
  - `/admin` unauth → 307 → `/login?redirect=/admin`.
  - `/admin` authed → 200.
  - `/api/auth/login` returns `Set-Cookie: myportfolio_session=…` and `{ user }`.
  - `/api/auth/session` returns 401 unauth, 200 + user authed.
  - `/api/admin/projects` returns 6, `/api/admin/experience` returns 3, `/api/admin/sections` returns 10.
  - `/api/public/inquiries` POST returns 200 + landed as `status: "new"` in `/api/admin/inquiries`.
  - `/icon` returns `image/png`.
  - `/opengraph-image/default` returns `image/png` 68 KB.
  - `/sitemap.xml` and `/robots.txt` are dynamic and correct.

### Production deploy (when you're ready)
1. Provision a MongoDB Atlas M0 cluster; set `MONGODB_URI` in Vercel.
2. Set `NEXT_PUBLIC_SITE_URL`, `SESSION_COOKIE_NAME`, `MAX_UPLOAD_BYTES`, `INITIAL_ADMIN_*` env vars.
3. Run `MONGODB_URI=… npm run db:seed:all` against prod once.
4. `vercel deploy --prod` (or push to `main` if a Vercel-GitHub integration is set).
