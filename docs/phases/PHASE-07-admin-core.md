# Phase 07 — Admin Core: Shell, Settings, Navigation, Sections, Media, Users

> **Status:** pending
> **Estimated effort:** Days 7–10 (≈ 24 hrs)

---

## Objective

Build the admin shell + the 6 "chrome control" modules so the owner can edit every piece of site chrome through a real UI. After this phase, no Mongo-Express edits are needed to update the public site's chrome.

## Prerequisites

- [x] Phase 04 (admin API stubs)
- [x] Phase 05 (providers + skeletons + hooks)
- [x] Phase 06 (DB-driven public chrome)

## Tasks

### Admin shell
- [ ] `src/app/admin/layout.tsx` (`"use client"`) — uses `useSessionQuery`; loading → `<SkeletonLayout>`; no user → redirect `/login`; otherwise:
  ```tsx
  <div className="flex min-h-screen">
    <AdminSidebar />
    <div className="flex flex-1 flex-col">
      <AdminTopbar user={user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
  ```
- [ ] `src/components/admin/admin-sidebar.tsx`:
  - Collapsed state from `ui-store`
  - Groups:
    - **Site** — Settings, Navigation, Sections, Media
    - **Content** — Hero, About, Experience, Skills, Projects, Publications, Open Source, Awards, Certifications, Education, Community
    - **Ops** — Inquiries
    - **Admin** — Users (super_admin only)
  - Active item highlight via `usePathname`
  - Brand wordmark at top (reads from settings query — `useQuery(queryKeys.settings, ...)`)
- [ ] `src/components/admin/admin-topbar.tsx` — breadcrumbs, user menu with logout
- [ ] `src/components/admin/data-table.tsx` — columns + data + actions + sort + paginate + empty + skeleton
- [ ] `src/components/admin/confirm-delete-dialog.tsx`
- [ ] `src/components/admin/image-upload.tsx` — consumes `use-upload.ts`; shows current image + replace button; on replace, calls upload then writes `{ url, mediaId }` into the parent form
- [ ] `src/components/admin/multi-image-upload.tsx` — for gallery-type fields (future-proofing, optional in v1)
- [ ] `src/components/admin/rich-text-editor.tsx` — Tiptap with starter-kit + image + link + underline + placeholder
- [ ] `src/components/admin/unsaved-changes-guard.tsx`

### Dashboard (`/admin`)
- [ ] Stat cards: total projects, total experiences, sections visible, inquiries-this-week
- [ ] Recent inquiries (last 5)
- [ ] Quick actions: "Edit Hero", "New project", "View inquiries"

### Module 1 — Site Settings (`/admin/settings`)
- [ ] Tabs: Branding · SEO · Contact · Social · Theme · OG/Favicon · Toggles · JSON-LD
- [ ] Each tab is a `<form>` with RHF + Zod (one Zod schema per tab in `lib/validations/site-settings.ts`)
- [ ] Save → `PATCH /api/admin/settings` with the tab payload
- [ ] On success: toast + invalidate `queryKeys.settings()`
- [ ] Branding tab logo upload via `<ImageUpload>`; OG/Favicon image upload similarly
- [ ] Theme tab: color pickers via simple `<input type="color">`; preview panel showing how the bg/foreground/border combo looks
- [ ] Social tab: array editor — drag-reorder rows, each row has `platform` (select from `lib/icons.ts` known socials), `url`, `label`

### Module 2 — Navigation (`/admin/navigation`)
- [ ] Tabs: Header · Footer
- [ ] Per tab: drag-reorder list (`@dnd-kit`) of items
- [ ] Create/Edit dialog: label, href, icon (select from `lib/icons.ts`), isActive, opensInNewTab
- [ ] Save reorder → `PATCH /api/admin/navigation/reorder` (bulk)
- [ ] Delete with confirm
- [ ] `revalidateTag("nav")` on every mutation

### Module 3 — Section Order (`/admin/sections`)
- [ ] Single screen — drag-reorder the 10 fixed section keys, toggle `isVisible` per row
- [ ] Save → `PATCH /api/admin/sections` (bulk)
- [ ] `revalidateTag("sections")`

### Module 4 — Media Library (`/admin/media`)
- [ ] Grid of all GridFS files (paginated)
- [ ] Filter by mimeType (image / pdf)
- [ ] Copy URL button
- [ ] Delete with reference-check warning (server scans all collections for `mediaId` matches; lists them in the confirm dialog before delete)

### Module 5 — Users (`/admin/users`) — super_admin only
- [ ] Table of users (email, name, role, isActive, lastLoginAt)
- [ ] Create/Edit dialog: email, name, role, password (only on create / via "Reset" button)
- [ ] Toggle isActive
- [ ] Delete (with `cannot-delete-self` guard server-side)

### Verification
- [ ] Log in → `/admin` dashboard loads with skeletons → real data
- [ ] Edit site title in Settings → see browser tab change after ≤60s
- [ ] Upload a logo → it appears in the public navbar
- [ ] Drag a header nav item → public site reflects the new order
- [ ] Hide the "About" section in Sections → it disappears from public landing
- [ ] Upload an image → it appears in Media Library; deleting it shows a reference list before confirmation
- [ ] Create a new `admin` user → log in as them → confirm they cannot access `/admin/users`
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `feat(phase-07): admin shell + settings + navigation + sections + media + users`

## Notes & Learnings

_(fill in as you go)_
