# CLAUDE.md — Agent & Developer Conventions

> Read this file first. It is the law of the repo. Anything in here overrides general training knowledge or habits from other projects.

## Project identity

- **Name:** Raju Kumar Yadav — Portfolio CMS
- **Type:** Full-stack personal portfolio with **fully dynamic CMS** (public site + admin panel).
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5.7 strict · Tailwind CSS 4 · shadcn/ui · **MongoDB 7 · Mongoose 8** · React Query 5 · Zustand 5 · Zod 3 · React Hook Form 7 · Sonner · Framer Motion 12 · React Three Fiber (3D only)
- **Reference implementation:** `/Users/rajuyadav/Documents/Documents/Extras/acmeadventuretreks/` — mirror its patterns for folder layout, theming, API auth helpers, React Query, skeleton/error boundaries, admin shell, media upload pipeline. Deviate only where this file explicitly says to (most notably: **MongoDB+Mongoose**, not Postgres+Drizzle; **GridFS or local-disk media**, not S3).
- **Scope:** 1 public landing page composed of 10 toggleable sections + 17 admin CMS modules (enumerated in `REQUIREMENTS.md §2-§3`).
- **Goal of this migration:** Replace every hardcoded constant in `src/lib/data.ts` with database-driven content, plus make site chrome (logo, favicon, site title, navbar, footer, theme tokens, SEO metadata, OG image text) admin-editable.

## Hard rules (never violate)

1. **No hardcoded visible content.** Anything that appears on the public site — name, title, tagline, section headings, navbar labels, footer text, social links, logo image, favicon glyph, theme colors, project list, skill list, experience entries, publications, awards, education, contact info, SEO copy, OG image content — must live in MongoDB and be admin-editable. **The only exceptions** are the Three.js 3D scene geometry (`HeroScene`, `ContactMesh`) and pure-presentation CSS animations.
2. **Palette and typography live in `app/globals.css` only.** CSS variables on `:root` and `.light` are the single source. The fallback values stay in `globals.css`; admin-overridable values are injected from `site_settings.theme_*` into a `<style>` tag in `app/layout.tsx`. Components reference Tailwind utilities (`bg-bg`, `text-text`, `border-border`) that resolve through those variables. Never hardcode hex values or font families in a component.
3. **Public pages = Server Components by default.** No `"use client"` at the top of `app/page.tsx` or any `app/(public)/**/page.tsx`. Data is fetched directly via Mongoose in `async` server components using helpers in `lib/queries/`. Add `"use client"` only for leaf interactive components (Navbar magnetic links, smooth-scroll, theme toggle, contact form, 3D canvases, framer-motion animation wrappers) and keep them as small as possible.
4. **Admin pages use React Query, always with skeletons.** Every list/detail admin screen has a loading skeleton (`components/shared/skeleton-*.tsx`). Every mutation shows a Sonner toast on success and error. No raw `fetch()` calls from components — go through `hooks/use-admin-data.ts` and `hooks/use-admin-mutations.ts`, which use `lib/api-client.ts`.
5. **Every route segment has `loading.tsx` + `error.tsx`.** Missing either is a bug. Error boundaries must offer a "Retry" action and log to console in dev.
6. **Universal loader.** All public-side loading states use the single `<UniversalLoader />` component from `components/shared/universal-loader.tsx`. All admin loading uses `components/shared/skeleton-*.tsx`. Never invent a one-off spinner or `<div>Loading...</div>` literal.
7. **Media upload pipeline (MongoDB GridFS).**
   - **Dev + prod both use GridFS** (a MongoDB bucket called `media`). No S3, no Cloudinary — the user has free MongoDB Atlas and wants media co-located.
   - Two distinct URLs per asset, both stable:
     - **Upload URL** — `POST /api/admin/upload` (multipart). Returns `{ id, url, mimeType, size }`.
     - **Public URL** — `/api/media/[id]` (GET, streams the file via GridFS, sets `Cache-Control: public, max-age=31536000, immutable`).
   - The DB stores `{ url: "/api/media/<id>", mediaId: ObjectId }` pairs on every record that owns an asset.
   - When replacing an asset, the save endpoint deletes the old GridFS file by `mediaId`.
   - **Never POST a file to a non-upload route** and stream it manually. Always use `hooks/use-upload.ts`.
8. **Every form + API endpoint validates with Zod.** Schemas live in `lib/validations/*.ts`. Forms use React Hook Form + `@hookform/resolvers/zod`. API routes `safeParse` the body and return `errorResponse(parsed.error.issues[0].message)` on failure.
9. **Safe errors only.** API routes return `{ success: false, error: "human message" }`. Never expose stack traces, Mongoose errors, or raw exception `.message` values to clients. Log the real error server-side, return a sanitized one.
10. **No inline `style=` and no ad-hoc CSS files.** Tailwind utilities + `app/globals.css` component classes (`@layer components`) only. If you need a repeating pattern (section padding, card surface, glass pill), promote it to a global utility class — don't duplicate Tailwind chains across files.
11. **3D scenes (`HeroScene`, `ContactMesh`) are the only static visuals.** Their geometry, particle counts, and shader logic stay in code — they're not configurable. Their *visibility* (whether the scene mounts at all) **is** an admin toggle from `site_settings.enable_3d_hero` / `enable_3d_contact`.

## Local development stack

- MongoDB runs in Docker via `docker-compose.yml` at the repo root.
- `docker compose up -d` starts MongoDB on `localhost:27017` + Mongo Express UI on `localhost:8081`.
- The first start creates a `myportfolio_dev` database with an `admin` user (creds in `.env.local`).
- Do **not** point dev against the production MongoDB Atlas cluster — use the Docker Mongo to avoid polluting live data.
- Production swap is env-only: change `MONGODB_URI` to the Atlas connection string. No code changes.

## Folder placement rules

When you're about to create a new file, consult this table first. If none fits, add a section to this file describing the new pattern before creating the file.

| Thing | Goes in |
|---|---|
| The single public landing page | `app/page.tsx` (async server component) |
| A new public route segment | `app/(public)/<route>/page.tsx` (async server component) |
| A new admin page | `app/admin/<route>/page.tsx` (`"use client"` shell) |
| A new admin API endpoint | `app/api/admin/<resource>/route.ts` wrapped in `withAdminAuth` |
| A new public API endpoint | `app/api/public/<resource>/route.ts` |
| Media stream endpoint | `app/api/media/[id]/route.ts` |
| A new Mongoose model | `lib/db/models/<entity>.ts` + re-export from `models/index.ts` |
| A new Zod schema | `lib/validations/<entity>.ts` |
| A new public query function | `lib/queries/<entity>.ts` (server-only, cached via `unstable_cache` + tag) |
| A new React Query hook | extend `hooks/use-admin-data.ts` or `use-admin-mutations.ts` + add to `lib/query-keys.ts` |
| A new Zustand store | `stores/<domain>-store.ts` |
| A reusable low-level UI element (button, input) | `components/ui/` (shadcn convention) |
| Site-wide layout (Navbar, Footer, ScrollProgress) | `components/layout/` |
| Cross-feature reusable (skeletons, error boundary, UniversalLoader) | `components/shared/` |
| Admin-only widget (sidebar, topbar, data-table, image-upload) | `components/admin/` |
| Public landing-page section | `components/sections/` |
| 3D Three.js scene | `components/3d/` |
| A type that describes an entity | `types/<entity>.ts` (coexists with Mongoose-inferred types) |
| A constant or helper used everywhere | `lib/<name>.ts` |

## Database conventions (MongoDB + Mongoose)

- One model file per entity in `lib/db/models/`. Filename = kebab-case singular (`experience.ts`, `nav-menu-item.ts`).
- **camelCase in TypeScript and in MongoDB documents.** No snake_case in fields. Mongoose handles `_id` (ObjectId) for us.
- Every document has `createdAt` and `updatedAt` via `{ timestamps: true }`.
- Every entity with admin-editable ordering has `orderIndex: Number` (default 0). List queries `.sort({ orderIndex: 1, createdAt: 1 })`.
- Every entity with publish workflow has `isPublished: Boolean` (default `false`) + `publishedAt: Date` (nullable).
- Every entity with SEO has optional `metaTitle`, `metaDescription`, `ogImageUrl`, `ogImageId`.
- Media fields store both `{ url, mediaId }`. `mediaId` is the GridFS `ObjectId`; `url` is the public `/api/media/<id>` URL.
- Self-references (`navMenuItems.parentId`, `usefulInfoPages.parentId`) use `Schema.Types.ObjectId` with a `ref` to the same model.
- **No global Mongoose connection import in components.** Only `lib/db/index.ts` calls `mongoose.connect()`, and `lib/queries/*` + API routes `await getDb()` before any model use. This keeps server-only DB code out of client bundles.
- `lib/db/index.ts` uses the `global` cache pattern (`global._mongoose`) so HMR doesn't open a new connection on every reload.

## Mongoose gotchas

- **Always `await getDb()` at the top of every query helper / route handler** — the first call connects, subsequent calls reuse.
- Use `.lean()` on every read query that returns to a route handler (no Mongoose document hydration cost). Hydrated docs only when you need `.save()`.
- Convert ObjectId → string before sending JSON: wrap selects with a `serialize()` helper in `lib/db/serialize.ts`.
- For atomic updates use `findOneAndUpdate({ _id }, { $set }, { new: true, runValidators: true })`. Plain `.save()` skips schema-level validators on existing docs.
- GridFS bucket: instantiate once per request via `new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "media" })`. Streams must be drained on errors.

## Tailwind v4 gotchas (carry-over from acmeadventuretreks)

- `@apply` cannot reference custom utility classes defined in the same `@layer components` block. Self-referencing classes must inline their values.
- Prefer **`bg-linear-to-b`** over the legacy `bg-gradient-to-b`.
- Tailwind v4 reads CSS variables directly — no need to extend `theme.colors` in a config file. Define vars in `globals.css`, use `bg-bg` directly.

## Next.js 16 gotchas

- `cookies()`, `headers()`, `params`, and `searchParams` in App Router are **async** — always `await` them.
- The Edge `middleware.ts` is renamed `proxy.ts` in Next 16, and the exported function must be `proxy` (not `middleware`).
- Route handlers can stream; for media downloads we stream GridFS through the route. For uploads, multipart parsing happens server-side in the same handler — keep file size limit at **10 MB** (`MAX_UPLOAD_BYTES` constant).
- `revalidatePath` / `revalidateTag` only work inside server actions or route handlers; call them from admin mutation endpoints after DB writes.
- Public pages are wrapped with `unstable_cache(..., [key], { tags: ["<entity>"] })` so admin mutations invalidate them via `revalidateTag()`.

## React Query conventions

- Query keys come from `lib/query-keys.ts` factory — never build inline keys.
- `staleTime: 60_000`, `retry: 1` is the default in the provider.
- Mutations invalidate specific keys on success + show toast. Use `useMutation({ onSuccess, onError })`.
- Never disable `queryFn` error throwing — let it propagate to the error boundary unless explicitly handled.

## State management boundary

- **Server state** (data from DB) → React Query (admin) / direct server-component fetch (public).
- **UI state** (sidebar open, filter selections, modal toggle, mobile-menu open) → Zustand.
- **Form state** → React Hook Form.
- **URL state** (admin pagination, filter) → `useSearchParams` + router.

Never duplicate server state into Zustand.

## Admin auth

- Session-based. `myportfolio_session` httpOnly cookie, 7-day expiry. Sessions stored in MongoDB `sessions` collection.
- `proxy.ts` redirects unauthenticated `/admin/*` requests to `/login`.
- API routes use `withAdminAuth(handler)` from `lib/api-helpers.ts`. This also validates same-origin on mutation methods.
- Two roles: `super_admin` (manages users + all content) and `admin` (content only). The owner of the portfolio is seeded as `super_admin`.
- Bcrypt hashing, 12 rounds.

## Site chrome — what "fully dynamic" means

These are the things that look "hardcoded" in a typical portfolio but **must** come from the DB:

| Element | Source |
|---|---|
| Browser tab title | `site_settings.site_title` |
| Browser tab favicon | `app/icon.tsx` renders from `site_settings.favicon_glyph` + `favicon_bg_gradient` (or `favicon_image_id` GridFS image if uploaded) |
| OG image | `app/opengraph-image.tsx` renders from `site_settings.og_title`, `og_subtitle`, `og_chips`, `og_bg_gradient` |
| Logo in navbar (if any) | `site_settings.logo_image_id` (optional; if absent, falls back to a wordmark of `site_settings.brand_short`) |
| Brand wordmark | `site_settings.brand_short` (e.g. "RKY") |
| Site description meta | `site_settings.site_description` |
| Theme colors | `site_settings.theme_dark.*` + `theme_light.*` injected into `<style>` in `layout.tsx` (overrides `globals.css` defaults) |
| Font family choices | `site_settings.font_sans`, `font_display`, `font_mono` (loaded via `next/font/google` with a default list of allowed families) |
| Navbar items | `nav_menu_items` collection filtered by `location: "header"`, sorted by `orderIndex` |
| Footer links + copyright text | `nav_menu_items` (`location: "footer"`) + `site_settings.footer_copyright_template` (string with `{year}` token) |
| Social icons in footer/contact | `site_settings.socials` (array of `{ platform, url, label }`) |
| JSON-LD Person schema | `site_settings.json_ld_*` fields |
| Sitemap entries | `sitemap.ts` reads `site_settings.site_url` + page list from `home_sections` (only published sections become anchor links) |
| Section visibility + order on landing | `home_sections` collection (`{ key, isVisible, orderIndex }`) |

## When you finish a phase

1. Check the phase's `docs/phases/PHASE-XX-*.md` — tick the Tasks checkboxes.
2. Fill the "Notes & Learnings" section with anything that surprised you.
3. Add a line to `docs/CHANGELOG.md` with date + summary.
4. Ensure `npm run lint && npm run build && npm run typecheck` pass clean.
5. Commit with a phase-scope message and push.

## Git conventions

- Branching: `main` (production) + feature branches `feat/<area>`, `fix/<bug>`, `docs/<what>`.
- Active migration branch: `feat/dynamic-cms-mongodb`.
- Commits: conventional commits — `feat(admin): add navigation manager`, `fix(api): media stream content-type`, `docs(phase-07): testing checklist`, `chore(deps): add mongoose`.
- Small commits. Squash-merge PRs.
- Never commit `.env.local` or `docs/CREDENTIALS.md`.

## When you're uncertain

Read the relevant phase doc in `docs/phases/`. Then re-read `REQUIREMENTS.md` for the entity-level spec. If still unclear, look at the acmeadventuretreks implementation for the same pattern (folder paths in `Reference implementation` above). Only then ask.
