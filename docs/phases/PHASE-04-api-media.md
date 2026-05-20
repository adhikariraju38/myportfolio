# Phase 04 — API Layer & GridFS Media

> **Status:** pending
> **Estimated effort:** Days 4–5 (≈ 12 hrs)

---

## Objective

Implement the admin REST CRUD routes (skeleton handlers — fully wired in Phase 07–09 admin UIs) plus the GridFS upload + media-stream pipeline. By end of phase, `curl`-tested uploads return URLs that render images in a browser.

## Prerequisites

- [x] Phase 02 (auth helpers)
- [x] Phase 03 (models + validations)

## Tasks

### Upload route
- [ ] `src/lib/db/gridfs.ts`:
  ```ts
  import mongoose from "mongoose";
  export async function getBucket() {
    const conn = (await getDb()).connection;
    return new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "media" });
  }
  ```
- [ ] `src/app/api/admin/upload/route.ts`:
  - `POST` (wrapped in `withAdminAuth`)
  - `req.formData()` → `file: File`
  - Validate `file.size <= MAX_UPLOAD_BYTES` (10 MB) and `file.type` in whitelist (`image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`, `image/x-icon`, `application/pdf`)
  - Convert `Blob` → `Buffer`, upload via `bucket.openUploadStream(filename, { contentType, metadata: { uploaderId } })`
  - Return `{ id: "<ObjectId>", url: "/api/media/<id>", mimeType, size }`
- [ ] Edge case: errors during upload must `bucket.delete()` the partial file before responding.

### Media stream route
- [ ] `src/app/api/media/[id]/route.ts`:
  - `GET` (public — no auth)
  - Validate `id` is a valid ObjectId; 404 otherwise
  - `bucket.openDownloadStream(new ObjectId(id))`
  - Pipe to a `ReadableStream` and return with headers:
    - `Content-Type: <stored mimeType>`
    - `Content-Length: <stored size>`
    - `Cache-Control: public, max-age=31536000, immutable`
    - `ETag: <objectId>`
  - On stream error, respond 404

### `use-upload` hook
- [ ] `src/hooks/use-upload.ts` — client hook returning `{ upload, isUploading, error }`. Posts `FormData` to `/api/admin/upload`, returns the `{ id, url }` payload to caller.

### Admin CRUD route skeletons

For each module (16 collections + 4 singletons): create `src/app/api/admin/<resource>/route.ts` (list/create) and `[id]/route.ts` (detail/update/delete). Each handler:
- `withAdminAuth`
- Validate body via the entity Zod schema (`parseBody`)
- `await getDb()`, perform Mongoose CRUD
- After mutation: `revalidateTag("<entity>")` and `revalidateTag("public-data")`

Initial coverage (stubs OK — the UI in Phase 07–09 will exercise them):
- [ ] `/api/admin/settings` (GET, PATCH)
- [ ] `/api/admin/hero` (GET, PATCH)
- [ ] `/api/admin/about` (GET, PATCH)
- [ ] `/api/admin/education` (GET, PATCH)
- [ ] `/api/admin/navigation` (full CRUD + `/reorder` PATCH for bulk orderIndex)
- [ ] `/api/admin/sections` (GET, PATCH — only update isVisible + orderIndex)
- [ ] `/api/admin/experience` (full CRUD + `/reorder`)
- [ ] `/api/admin/skill-categories` (full CRUD + `/reorder`)
- [ ] `/api/admin/skills` (full CRUD + `/reorder`)
- [ ] `/api/admin/projects` (full CRUD + `/reorder`)
- [ ] `/api/admin/publications` (full CRUD + `/reorder`)
- [ ] `/api/admin/open-source` (full CRUD; nested `contributions[]` updated atomically via `$set`)
- [ ] `/api/admin/awards` (full CRUD + `/reorder`)
- [ ] `/api/admin/certifications` (full CRUD + `/reorder`)
- [ ] `/api/admin/community` (full CRUD + `/reorder`)
- [ ] `/api/admin/inquiries` (GET list + PATCH status + DELETE)
- [ ] `/api/admin/users` (super_admin only, full CRUD)
- [ ] `/api/admin/media` (GET list — admin-only browse of GridFS files; DELETE by id with reference-check warning)

### Public API
- [ ] `src/app/api/public/inquiries/route.ts` — POST with Zod, rate-limited (5/15min by IP), sanitizes message via `isomorphic-dompurify`, writes to `inquiries` collection. Returns `{ ok: true }`.

### Verification
- [ ] `curl -X POST -F file=@avatar.jpg http://localhost:3000/api/admin/upload -b "myportfolio_session=…"` → 200 + `{ id, url }`
- [ ] Open returned `url` in browser → image renders
- [ ] `curl http://localhost:3000/api/admin/upload` without cookie → 401
- [ ] Upload > 10 MB → 400 `"File too large"`
- [ ] Upload an `.exe` (or any non-whitelisted mime) → 400
- [ ] After deleting a media doc via DELETE route, GET returns 404
- [ ] Each admin GET endpoint returns `{ success: true, data: … }` with seeded content
- [ ] Each admin PATCH/POST returns the updated entity
- [ ] Hitting any admin route without cookie → 401; with wrong origin on POST/PATCH/DELETE → 403
- [ ] Public `/api/public/inquiries` accepts a valid submission and writes to DB; rate limit kicks at 6th in 15min

### Git
- [ ] Commit: `feat(phase-04): admin api skeletons + gridfs upload + media stream`

## Notes & Learnings

_(fill in as you go)_
