# Phase 06 — Public Chrome: Dynamic Layout, Navbar, Footer, Favicon, OG, Theme

> **Status:** pending
> **Estimated effort:** Days 6–7 (≈ 12 hrs)

---

## Objective

Make every piece of the public-page chrome read from the database. After this phase: changing the site title in `/admin/settings` updates the browser tab; changing the favicon glyph updates the favicon; editing navbar items reorders the navbar; editing theme tokens updates the colors. The landing sections themselves are still backed by `src/lib/data.ts` (Phase 10 swaps them).

## Prerequisites

- [x] Phase 03 (settings/nav/sections seeded)
- [x] Phase 05 (UniversalLoader, providers)

## Tasks

### Layout
- [ ] `src/app/layout.tsx` becomes server-async:
  - `const settings = await getSiteSettings()`
  - Generate `metadata` from `settings.site_title`, `site_description`, OG fields, JSON-LD
  - Generate `viewport.themeColor` from `settings.theme_color_dark` + `theme_color_light`
  - Inject theme CSS vars into `<style>` in `<head>` from `settings.theme_dark` + `theme_light`
  - Inject the FOUC-prevention inline script (already present) — keep
  - Load fonts based on `settings.font_sans/display/mono`; use a **whitelist** mapping in `lib/theme.ts` (e.g. `{ Inter, "Space Grotesk", "JetBrains Mono", Roboto, "Playfair Display" }` — admin select is constrained to this list)
  - Render `<NavbarShell />` and `<FooterShell />` instead of static `<Navbar>` / `<Footer>`

### Navbar (server shell + client child)
- [ ] `src/components/layout/NavbarShell.tsx` (server) — `await getNavItems("header")`, pass items + `settings.brand_short` + `logo` to `<Navbar items={…} brand={…} logo={…} />`
- [ ] Refactor `src/components/layout/Navbar.tsx`:
  - Remove `import { NAV_LINKS } from "@/lib/data"`
  - Accept `items: NavItem[]`, `brand: string`, `logo?: { url, alt }` as props
  - If `logo.url` is set, render `<Image>` of logo on the left of the pill; otherwise show `brand` text wordmark
  - Magnetic links + ThemeToggle behavior unchanged

### Footer
- [ ] `src/components/layout/FooterShell.tsx` (server) — fetches `nav_menu_items` (footer location) + `site_settings.socials` + `footer_copyright_template`
- [ ] Refactor `src/components/layout/Footer.tsx`:
  - Remove `import { CONTACT } from "@/lib/data"`
  - Accept `links: NavItem[]`, `socials: Social[]`, `copyright: string` props
  - Render socials via `lib/icons.ts` `getIcon(platform)` map (Lucide first, custom BrandIcons fallback for Github/Linkedin)
  - Replace `{new Date().getFullYear()}` with `copyright` template that already has `{year}` substituted server-side

### Favicon (`src/app/icon.tsx`)
- [ ] Rewrite to server-async:
  - `const s = await getSiteSettings()`
  - If `s.favicon_image_id`: stream the GridFS file as the icon response (read into buffer, return as `new Response(buf, { headers: { "Content-Type": s.favicon_image_mime } })`). Note: `next/og` `ImageResponse` isn't required when the asset is already an image.
  - Else: build the `<ImageResponse>` from `s.favicon_glyph` + `s.favicon_bg_gradient` + `s.favicon_text_color`
  - Keep `runtime = "edge"` if no GridFS; if GridFS, switch to `runtime = "nodejs"` (GridFS needs Node)
- [ ] Honor existing cache header in `next.config.ts`

### OG image (`src/app/opengraph-image.tsx`)
- [ ] Rewrite to server-async:
  - Read `og_title`, `og_subtitle`, `og_chips`, `og_bg_gradient`, `og_text_color` from settings
  - Build `<ImageResponse>` accordingly
  - Same caching rules

### Sitemap & robots
- [ ] `src/app/sitemap.ts` — read `settings.site_url` and `home_sections` to emit one entry per published section anchor (`/`, `/#about`, `/#projects`, …)
- [ ] `src/app/robots.ts` — disallow `/admin/*` and `/api/admin/*`; `Sitemap: <site_url>/sitemap.xml`

### Section ordering on landing page
- [ ] `src/app/page.tsx`:
  - Becomes server-async
  - `const sections = await getHomeSections()` — sorted, only `isVisible`
  - Map section keys to components: `const COMPONENTS = { hero: HeroSection, about: AboutSection, … }`
  - Render `{sections.map(s => COMPONENTS[s.key]?.())}`
  - JSON-LD `<script>` block reads from `settings.json_ld_*`
- [ ] In this phase the section components themselves still import from `src/lib/data.ts` — that's fine; Phase 10 replaces it.

### loading.tsx + error.tsx
- [ ] `src/app/loading.tsx` — `<UniversalLoader />`
- [ ] `src/app/error.tsx` — friendly error + Retry button
- [ ] `src/app/not-found.tsx` — already exists; verify uses `settings.brand_short`

### Verification
- [ ] Change `site_settings.site_title` via Mongo Express → reload `/` → browser tab updates after revalidation (≤ 60s)
- [ ] Change `favicon_glyph` from "R" to "X" → favicon updates (devtools → Application → Manifest)
- [ ] Change `og_title` → `/opengraph-image` route renders the new title
- [ ] Drag a navbar item via direct DB edit → it moves position on reload
- [ ] Change `theme_dark.accent-blue` → `/` reflects new accent color
- [ ] Toggle `home_sections.about.isVisible: false` → About section disappears
- [ ] No regressions on Lighthouse Perf score (still ≥ 90)
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `feat(phase-06): db-driven chrome (layout, navbar, footer, icon, og, theme)`

## Notes & Learnings

_(fill in as you go)_
