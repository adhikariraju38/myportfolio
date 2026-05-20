# Phase 01 — Foundation & Tooling

> **Status:** pending
> **Estimated effort:** Day 1 (≈ 6 hrs)
> **Owner:** Raju

---

## Objective

Land the migration scaffolding: feature branch, planning docs (CLAUDE.md, REQUIREMENTS.md, docs/), `docker-compose.yml` for local MongoDB, `.env.example`, package upgrades (`mongoose`, `bcrypt`, React Query, shadcn deps, Zod, RHF, Zustand, Sonner, `@dnd-kit`, `tsx`, `tiptap`). Zero business logic.

## Prerequisites

- [x] Branch `feat/dynamic-cms-mongodb` created
- [x] `CLAUDE.md`, `REQUIREMENTS.md`, `docs/CONTEXT.md` written
- [ ] Docker Desktop running on dev machine

## Tasks

### Docs
- [x] `CLAUDE.md` at repo root
- [x] `REQUIREMENTS.md` at repo root
- [x] `docs/CONTEXT.md`
- [x] `docs/CHANGELOG.md`
- [x] `docs/phases/PHASE-01-foundation.md` … `PHASE-12-deploy.md`
- [x] `docs/CREDENTIALS.md.example` (gitignored example for real CREDENTIALS.md)

### Local Docker stack
- [x] `docker-compose.yml` — MongoDB 7 on `:27017` + Mongo Express on `:8081`
- [ ] `docker compose up -d` → both containers healthy
- [ ] `mongosh "mongodb://admin:devpassword@localhost:27017/?authSource=admin"` connects
- [ ] Mongo Express UI loads at http://localhost:8081 and lists databases

### Env
- [x] `.env.example` enumerating: `MONGODB_URI`, `NEXT_PUBLIC_SITE_URL`, `SESSION_COOKIE_NAME`, `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, `MAX_UPLOAD_BYTES`
- [ ] Copy `.env.example` → `.env.local` and fill defaults

### Dependencies (Phase 1 install)
- [ ] `npm install mongoose bcrypt @tanstack/react-query @tanstack/react-query-devtools zustand react-hook-form @hookform/resolvers zod sonner @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities isomorphic-dompurify next-themes server-only @radix-ui/react-alert-dialog @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-accordion @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-separator @radix-ui/react-checkbox @radix-ui/react-slot class-variance-authority cmdk date-fns @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-underline`
- [ ] `npm install -D @types/bcrypt tsx prettier prettier-plugin-tailwindcss`

### Lint / format
- [ ] Add `prettier` + `prettier-plugin-tailwindcss`, `.prettierrc`, `.prettierignore`
- [ ] Confirm `eslint.config.mjs` keeps `next/core-web-vitals` + adds `react-hooks` rules

### Tsconfig hardening
- [ ] Enable `noUncheckedIndexedAccess` and `noImplicitOverride`
- [ ] Re-run `npm run build` — fix any new errors that surface

### npm scripts
- [ ] Add `"typecheck": "tsc --noEmit"`
- [ ] Add `"format": "prettier --write ."`, `"format:check": "prettier --check ."`
- [ ] Add `"db:seed:all": "npm run db:seed:admin && npm run db:seed:settings && npm run db:seed:navbar && npm run db:seed:sections && npm run db:seed:content"`
  - Individual seeds defined in Phase 03

### Folder skeleton (empty placeholders OK)
- [ ] `src/lib/db/` (empty)
- [ ] `src/lib/queries/`
- [ ] `src/lib/validations/`
- [ ] `src/components/admin/`
- [ ] `src/components/shared/`
- [ ] `src/components/auth/`
- [ ] `src/providers/`
- [ ] `src/stores/`
- [ ] `src/app/admin/`
- [ ] `src/app/api/admin/`
- [ ] `src/app/api/public/`
- [ ] `src/app/api/auth/`
- [ ] `src/app/api/media/`
- [ ] `scripts/`

### Verification
- [ ] `npm install` clean
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes (Turbopack)
- [ ] `npm run dev` — home at http://localhost:3000 still renders the current (static) portfolio with no regressions

### Git
- [ ] Commit: `chore(phase-01): foundation docs + docker + deps`
- [ ] Do NOT push yet — wait until end of Phase 02

## Requirements mapping

- REQUIREMENTS.md §4 Technical Architecture
- REQUIREMENTS.md §9 Theme & Design System
- REQUIREMENTS.md §15 Migration Phases

## Notes & Learnings

_(fill in as you go)_
