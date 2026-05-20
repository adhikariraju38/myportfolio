# Phase 08 — Content Modules pt.1: Hero, About, Experience, Skills, Projects

> **Status:** pending
> **Estimated effort:** Days 10–12 (≈ 18 hrs)

---

## Objective

Build the admin UIs for the 5 heaviest content modules.

## Prerequisites

- [x] Phase 07 (shell + data-table + image-upload + RHF/Zod patterns)

## Tasks

### Hero (`/admin/hero`)
- [ ] Singleton form — fields: `eyebrowText` (e.g. "Hi, I'm"), `name`, `title`, `tagline` (Tiptap), `primaryCta {label, href}`, `secondaryCta {label, href}`, `enable3dCanvas` toggle
- [ ] PATCH `/api/admin/hero` on save
- [ ] `revalidateTag("hero")`

### About (`/admin/about`)
- [ ] Singleton form — `summary` (Tiptap), `profileImage` (ImageUpload), `profileAlt`, `stats[]` (sortable array — label, value (number), suffix)
- [ ] PATCH `/api/admin/about`
- [ ] `revalidateTag("about")`

### Experience (`/admin/experience`)
- [ ] List page: `DataTable` (company, role, period, type, orderIndex, actions). Drag-reorder rows.
- [ ] Detail/edit `/admin/experience/[id]`: company, role, location, period, type select, bullets (sortable array of strings), tech (tag input), isVisible
- [ ] POST/PATCH/DELETE handlers; `revalidateTag("experiences")`

### Skills (`/admin/skills`)
- [ ] Two-column layout:
  - Left: sortable list of `skill_categories` with create/edit/delete
  - Right: when a category selected → sortable list of skills in that category (name + production toggle)
- [ ] Toggling category reorder via drag → PATCH `/api/admin/skill-categories/reorder`
- [ ] Skill reorder via drag → PATCH `/api/admin/skills/reorder`
- [ ] `revalidateTag("skills")`

### Projects (`/admin/projects`)
- [ ] List page: `DataTable` (title, subtitle, metric, orderIndex, isPublished, actions). Drag-reorder.
- [ ] Detail/edit `/admin/projects/[id]`: slug (auto-derived from title, editable), title, subtitle, description (Tiptap), tech tags, metric, link, github, coverImage (ImageUpload), isPublished
- [ ] Slug uniqueness validation server-side
- [ ] `revalidateTag("projects")`

### Verification
- [ ] Edit Hero name → reload `/` → name updates (≤60s)
- [ ] Toggle hero `enable3dCanvas: false` → 3D scene disappears (static fallback shows)
- [ ] Upload About profile photo → it replaces the static `/images/raju-profile.jpg` reference (Phase 10 finishes the wiring — but the upload succeeds and persists now)
- [ ] Add a new Experience entry → it appears on public landing after revalidation (or in this phase, in Mongo it's correct and Phase 10 wires the public side)
- [ ] Reorder skill categories → admin UI persists new order
- [ ] Add a new Project → slug auto-generates, isPublished toggle works
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `feat(phase-08): hero, about, experience, skills, projects admin`

## Notes & Learnings

_(fill in as you go)_
