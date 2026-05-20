# Phase 11 — SEO, Responsive, Performance & Polish

> **Status:** pending
> **Estimated effort:** Day 16 (≈ 8 hrs)

---

## Objective

Tighten everything before deploy.

## Prerequisites

- [x] Phase 10 (DB-driven public site)

## Tasks

### SEO
- [ ] `generateMetadata()` in `app/layout.tsx` returns the full Metadata derived from `site_settings` (already done in Phase 06 — double-check completeness here)
- [ ] `sitemap.ts` includes every section anchor + `/login`-excluded
- [ ] `robots.ts` excludes `/admin/*`, `/api/*`
- [ ] Verify JSON-LD validates via [Schema.org validator]
- [ ] Verify dynamic OG renders correctly when shared in Twitter/Facebook validators

### Responsive
- [ ] Spot-check every section at `375px`, `768px`, `1024px`, `1440px`
- [ ] Admin panel responsive enough for desktop only (≥1024px). Display a "use a larger screen" message below `lg`.

### Performance
- [ ] Lighthouse mobile ≥ 90 Perf, ≥ 95 SEO, ≥ 95 Accessibility
- [ ] Largest Contentful Paint < 2.5s on slow 4G
- [ ] Confirm `next/font` is loading only the families admin has selected (the whitelist trims bundle size)
- [ ] Confirm GridFS-served images set proper Cache-Control + are cached at the edge once Vercel CDN warms

### Security headers
- [ ] CSP added (`Content-Security-Policy`) — strict-ish: `default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://vercel.live https://*.vercel-insights.com; connect-src 'self' https://*.vercel-insights.com`
- [ ] Verify all responses still load with the CSP active

### Polish
- [ ] Replace any remaining `"use client"` on root section files with the server-shell pattern (audit)
- [ ] Add `app/admin/loading.tsx` and `app/admin/error.tsx`
- [ ] Add `app/admin/<resource>/loading.tsx` + `error.tsx` for every admin route (skeleton-list / skeleton-form)
- [ ] Audit all `alt` attributes on images for accessibility
- [ ] Audit color-contrast ratios per WCAG AA on both themes
- [ ] Confirm `prefers-reduced-motion` kills animations (existing logic preserved)

### Tests (optional but recommended)
- [ ] Add a smoke test script: hit `/`, `/api/public/inquiries` (POST), `/api/auth/session`, `/api/media/<id>` and assert 200 / expected body
- [ ] Optionally: Playwright login flow + edit-and-verify smoke test

### Verification
- [ ] Lighthouse run logged in `docs/CHANGELOG.md`
- [ ] Manual run-through of every public anchor + every admin route — none 500s
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `chore(phase-11): seo + responsive + perf + csp polish`

## Notes & Learnings

_(fill in as you go)_
