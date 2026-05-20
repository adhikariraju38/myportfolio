# Phase 09 — Content Modules pt.2: Publications, Open Source, Awards, Certifications, Education, Community, Inquiries

> **Status:** pending
> **Estimated effort:** Days 12–14 (≈ 14 hrs)

---

## Objective

Finish the remaining admin modules.

## Prerequisites

- [x] Phase 08

## Tasks

### Publications (`/admin/publications`)
- [ ] DataTable + edit page: title, authors, venue, year, doi, description (Tiptap), orderIndex, isVisible
- [ ] Default sort: year desc, orderIndex asc

### Open Source (`/admin/open-source`)
- [ ] List page: parent records (project, organization, repoUrl)
- [ ] Edit page nested: contributions[] CRUD (id, title, severity select, description, url)
- [ ] `severity` enum: critical | high | medium

### Awards (`/admin/awards`)
- [ ] DataTable + edit: title, event, rank select (winner | runner-up | 2nd-runner-up | top-5), orderIndex, isVisible

### Certifications (`/admin/certifications`)
- [ ] DataTable + edit: title, issuer, link, orderIndex, isVisible

### Education (`/admin/education`)
- [ ] Singleton form: school, degree, grade, period, location, logoImage (ImageUpload optional)
- [ ] Plus inline `community_involvement[]` CRUD section: role, org, year, description, orderIndex

### Community Involvement (`/admin/education` shares this — covered above)

### Inquiries (`/admin/inquiries`)
- [ ] DataTable: name, email, message preview, status, createdAt
- [ ] Detail drawer: full message + sender meta (IP, user-agent)
- [ ] Mark read / archive buttons → PATCH status
- [ ] Delete

### Verification
- [ ] Add a publication → appears in admin list, sorted by year desc
- [ ] Edit an open-source contribution's nested severity → persists
- [ ] Toggle an award's `isVisible: false` → it's filtered out of public-side query
- [ ] Submit the public contact form → row appears in `/admin/inquiries` with `status: "new"`
- [ ] Archive an inquiry → status updates; refilter list works
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `feat(phase-09): publications, open-source, awards, certs, education, inquiries admin`

## Notes & Learnings

_(fill in as you go)_
