# Phase 03 — Database Schema & Seeds

> **Status:** pending
> **Estimated effort:** Days 3–4 (≈ 14 hrs)

---

## Objective

Define every Mongoose model + Zod validation + entity type for the migration. Write seed scripts that read existing `src/lib/data.ts` constants and populate MongoDB so dev work in later phases has realistic content from day one. **`src/lib/data.ts` stays in place until Phase 10** so today's static site keeps working through the migration.

## Prerequisites

- [x] Phase 02 (`User`, `Session` models + connection)

## Tasks

### Mongoose models (one file each in `src/lib/db/models/`)

**Singletons (one document — enforced via `key: "default"` unique index):**
- [ ] `site-setting.ts` — see REQUIREMENTS.md §2.1 for full field list
- [ ] `hero-content.ts`
- [ ] `about-content.ts`
- [ ] `education.ts`

**Collections:**
- [ ] `home-section.ts` — `{ key: unique, label, isVisible, orderIndex }`
- [ ] `nav-menu-item.ts` — `{ parentId?, label, href, icon?, location: enum, orderIndex, isActive, opensInNewTab }`
- [ ] `experience.ts`
- [ ] `skill-category.ts`
- [ ] `skill.ts` — `{ name, categoryId: ObjectId, production, orderIndex }`
- [ ] `project.ts`
- [ ] `publication.ts`
- [ ] `open-source-contribution.ts` — embedded `contributions: [{ id, title, severity, description, url }]`
- [ ] `award.ts`
- [ ] `certification.ts`
- [ ] `community-involvement.ts`
- [ ] `inquiry.ts`
- [ ] Barrel: `src/lib/db/models/index.ts`

Each model uses `{ timestamps: true }`. Sortable models include `orderIndex: { type: Number, default: 0 }`. Use `unique` indexes on `slug`, `key`, `email` as appropriate.

### Zod validations (one file each in `src/lib/validations/`)
- [ ] One Zod schema per model: `<entity>Schema`, `<entity>UpdateSchema` (`.partial()`), plus inferred `<Entity>Input` type.
- [ ] `lib/validations/shared.ts` — common pieces (`objectIdString`, `mediaRef`, `socialLink`, `urlOptional`).
- [ ] `lib/validations/site-settings.ts` — large; one Zod object per tab from REQUIREMENTS.md §3.1.
- [ ] `lib/validations/upload.ts` — `{ filename, contentType, size }` with size cap = `MAX_UPLOAD_BYTES`.

### Types (`src/types/<entity>.ts`)
- [ ] One file per entity. Export the Zod-inferred input type AND a `<Entity>` serialized type (post-`serialize()`).
- [ ] `src/types/api.ts` already from Phase 02.

### Public-side query helpers (`src/lib/queries/`)
Stub them now, implement properly in Phase 06/10. Each helper:
- `await getDb()`
- runs `.find().sort().lean()`
- `serialize()`s the result
- wraps in `unstable_cache(..., [key], { tags: ["<entity>"] })`

Files to stub:
- [ ] `lib/queries/site.ts` — `getSiteSettings()`, `getNavItems(location)`, `getHomeSections()`
- [ ] `lib/queries/home.ts` — `getHero()`, `getAbout()`, `getEducation()`, `getCommunityInvolvement()`
- [ ] `lib/queries/experience.ts`
- [ ] `lib/queries/skills.ts` — returns `{ categories, skills }`
- [ ] `lib/queries/projects.ts`
- [ ] `lib/queries/publications.ts`
- [ ] `lib/queries/open-source.ts`
- [ ] `lib/queries/awards.ts` — returns `{ awards, certifications }`

### Seeds (`scripts/seed-*.ts`)
Each script: `npm run db:seed:<name>`. Each reads from existing `src/lib/data.ts` (or hard-coded defaults for `site_settings`).

- [ ] `scripts/seed-site-settings.ts` — seeds the singleton with sane defaults pulled from current `app/layout.tsx` metadata
- [ ] `scripts/seed-home-sections.ts` — seeds 10 fixed keys (`hero`, `about`, `experience`, `skills`, `projects`, `publications`, `open-source`, `awards`, `education`, `contact`)
- [ ] `scripts/seed-navbar.ts` — seeds header items from `NAV_LINKS` + a default footer items list
- [ ] `scripts/seed-content.ts` — single big script that seeds Hero, About, Experiences, SkillCategories, Skills, Projects, Publications, OpenSource, Awards, Certifications, Education, Community
- [ ] All seeds are **idempotent** — they `upsert` by unique keys. Running twice is safe.

### npm scripts
- [ ] `"db:seed:settings": "tsx --env-file=.env.local scripts/seed-site-settings.ts"`
- [ ] `"db:seed:sections": "tsx --env-file=.env.local scripts/seed-home-sections.ts"`
- [ ] `"db:seed:navbar": "tsx --env-file=.env.local scripts/seed-navbar.ts"`
- [ ] `"db:seed:content": "tsx --env-file=.env.local scripts/seed-content.ts"`
- [ ] `"db:seed:all": "npm run db:seed:admin && npm run db:seed:settings && npm run db:seed:sections && npm run db:seed:navbar && npm run db:seed:content"`

### Verification
- [ ] `npm run db:seed:all` runs clean
- [ ] In Mongo Express, every collection has the expected document counts (counts table below)
- [ ] `npm run typecheck && npm run build` clean

| Collection | Expected count after seed |
|---|---|
| `users` | ≥1 (super_admin) |
| `site_settings` | 1 |
| `home_sections` | 10 |
| `nav_menu_items` | ~12 (9 header + 3 footer placeholders) |
| `hero_content` | 1 |
| `about_content` | 1 |
| `education` | 1 |
| `experiences` | 3 |
| `skill_categories` | 7 |
| `skills` | 41 |
| `projects` | 6 |
| `publications` | 4 |
| `open_source_contributions` | 1 |
| `awards` | 4 |
| `certifications` | 3 |
| `community_involvement` | 2 |

### Git
- [ ] Commit: `feat(phase-03): mongoose models + zod validations + seeds`

## Notes & Learnings

_(fill in as you go)_
