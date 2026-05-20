# Phase 10 — Refactor Public Sections to Server-Driven

> **Status:** pending
> **Estimated effort:** Days 14–16 (≈ 16 hrs)

---

## Objective

Replace every section component's import of `src/lib/data.ts` with a server-component fetch from the corresponding `lib/queries/*` helper. After this phase, **`src/lib/data.ts` is deleted** and the public landing page is purely API/DB-driven.

## Prerequisites

- [x] Phase 08, 09 (DB has real data via admin UI)
- [x] Phase 06 (chrome already dynamic)

## Tasks

### Pattern for every section
For each existing `components/sections/<Name>Section.tsx`:

1. Rename file → `components/sections/<Name>Section/client.tsx`. Add `"use client"`. Remove imports from `@/lib/data`. Accept the data as props (e.g. `{ hero, about, experiences, … }`).
2. Create new `components/sections/<Name>Section/index.tsx` (server component, no `"use client"`):
   ```tsx
   import { getHero } from "@/lib/queries/home";
   import { HeroClient } from "./client";
   export async function HeroSection() {
     const hero = await getHero();
     if (!hero) return null;
     return <HeroClient hero={hero} />;
   }
   ```
3. Update `src/app/page.tsx`'s `COMPONENTS` map to point at the new `index.tsx`.

### Per-section refactors

- [ ] **HeroSection** — props: `{ hero }`. Replaces `HERO.name`, `HERO.title`, `HERO.tagline`, CTAs. The 3D canvas mount stays — gated by `hero.enable3dCanvas`.
- [ ] **AboutSection** — props: `{ about }`. Profile image src becomes `about.profileImage.url`. Stats array from `about.stats`.
- [ ] **ExperienceSection** — props: `{ experiences }`. Iterates over the array.
- [ ] **SkillsSection** — props: `{ categories, skills }`. Builds tab list from `categories`, filters skills by `categoryId`.
- [ ] **ProjectsSection** — props: `{ projects }`. Renders only `isPublished` projects, sorted by `orderIndex`.
- [ ] **PublicationsSection** — props: `{ publications }`.
- [ ] **OpenSourceSection** — props: `{ contributions }`.
- [ ] **AwardsSection** — props: `{ awards, certifications }`.
- [ ] **EducationSection** — props: `{ education, community }`.
- [ ] **ContactSection** — props: `{ contact, socials, enable3dCanvas }`. Email-mailto template uses `contact.email`. Form submits to `/api/public/inquiries` instead of `mailto:` (Phase 04 endpoint).

### Public contact form
- [ ] Update `ContactSection` to submit via `apiClient.post("/api/public/inquiries", body)` with success/error toasts. Keep the magnetic-icon animations and 3D mesh untouched.
- [ ] Optional: keep a `mailto:` fallback link below the form.

### Query helpers
- [ ] Each `lib/queries/*.ts` helper is now real (no stub). All wrapped in `unstable_cache(..., [key], { tags: ["<entity>"] })`.
- [ ] `lib/queries/skills.ts` returns `{ categories, skills }` already sorted.

### Page composition
- [ ] `src/app/page.tsx`:
  ```tsx
  export default async function Home() {
    const [sections, settings, hero, about, experiences, skillsData, projects, publications, openSource, awards, certifications, education, community] = await Promise.all([
      getHomeSections(), getSiteSettings(),
      getHero(), getAbout(), getExperiences(), getSkills(),
      getProjects(), getPublications(), getOpenSource(),
      getAwards(), getCertifications(), getEducation(), getCommunity(),
    ]);
    // …render sections in order from sections[] filtered by isVisible
  }
  ```
- [ ] JSON-LD `<script>` reads from `settings.jsonLd`.

### Delete `src/lib/data.ts`
- [ ] Final step: delete the file. Verify no remaining imports via `grep -r "from \"@/lib/data\"" src`.
- [ ] Delete `src/types/index.ts` if all types have moved to `src/types/<entity>.ts`. Otherwise keep what's still referenced.

### Verification
- [ ] `/` renders identical pixels to pre-migration (compare screenshots)
- [ ] Lighthouse Perf ≥ 90, SEO ≥ 95
- [ ] Editing any field in admin → public reflects within revalidate window
- [ ] Disable a section in `/admin/sections` → section vanishes
- [ ] Submit contact form → entry appears in `/admin/inquiries`
- [ ] `grep -r "@/lib/data" src` returns no results
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `feat(phase-10): server-driven public sections, remove lib/data.ts`

## Notes & Learnings

_(fill in as you go)_
