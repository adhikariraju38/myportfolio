# Phase 12 — Deploy & Handover

> **Status:** pending
> **Estimated effort:** Day 17 (≈ 6 hrs)

---

## Objective

Ship the rebuilt portfolio to production with zero downtime.

## Prerequisites

- [x] Phase 11 (polished + smoke-tested)

## Tasks

### MongoDB Atlas
- [ ] Create a free-tier M0 cluster in the closest region (e.g. ap-southeast-1)
- [ ] Whitelist `0.0.0.0/0` (or specifically Vercel egress IPs — preferred)
- [ ] Create DB user `myportfolio_admin` with a strong password
- [ ] Copy connection string into the local `.env.production.local` for Vercel import (NOT committed)

### Seed production
- [ ] Run `MONGODB_URI=<atlas-uri> tsx --env-file=.env.production.local scripts/seed-super-admin.ts`
- [ ] Run `MONGODB_URI=<atlas-uri> tsx --env-file=.env.production.local scripts/seed-site-settings.ts` (with prod values: site_url, og_*, theme_*)
- [ ] Run `npm run db:seed:sections`, `db:seed:navbar`, `db:seed:content` against prod
- [ ] Verify in Mongo Atlas UI

### Vercel
- [ ] Connect the GitHub repo to a new Vercel project (`raju-portfolio`)
- [ ] Set env vars in Vercel:
  - `MONGODB_URI` = Atlas connection string
  - `NEXT_PUBLIC_SITE_URL` = `https://portfolio.rajukumaryadav38.com.np`
  - `SESSION_COOKIE_NAME` = `myportfolio_session`
  - `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD` (only if doing first-deploy seed via Vercel Cron once)
  - `MAX_UPLOAD_BYTES` = `10485760`
- [ ] Deploy. Confirm preview build passes.
- [ ] Promote to production. Confirm domain `portfolio.rajukumaryadav38.com.np` resolves and serves HTTPS.

### Verification (production)
- [ ] `/` loads in <2s on cold cache
- [ ] `/admin` requires login
- [ ] Login with super-admin → can edit + see changes reflect on public site (≤60s revalidate)
- [ ] Upload a 2MB image → loads via `/api/media/<id>` with correct Content-Type and Cache-Control
- [ ] Public contact form submit → row appears in `/admin/inquiries`
- [ ] OG image scrape via opengraph.xyz shows the new dynamic OG
- [ ] Favicon visible in browser tab
- [ ] Lighthouse mobile ≥ 90 Perf

### Handover
- [ ] Merge `feat/dynamic-cms-mongodb` → `main` via squash-merge PR titled `feat: dynamic CMS-driven portfolio (MongoDB)`
- [ ] Update README.md with admin instructions + screenshots
- [ ] Update `docs/CREDENTIALS.md` (gitignored) with the production admin login
- [ ] Tag release `v2.0.0`
- [ ] Add monitoring: Vercel Analytics + Speed Insights already in `app/layout.tsx`. Confirm both report data.

### Git
- [ ] Commit: `chore(phase-12): production deploy + handover`
- [ ] Push branch + open PR + squash-merge

## Notes & Learnings

_(fill in as you go)_
