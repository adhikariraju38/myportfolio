# Phase 02 — Auth, Middleware & Security

> **Status:** pending
> **Estimated effort:** Day 2 (≈ 8 hrs)

---

## Objective

Stand up session-based admin authentication backed by MongoDB. Land `users` + `sessions` Mongoose models (the only DB work in Phase 02 — the rest of the schema is Phase 03). Add `proxy.ts` to guard `/admin/*`. Wire `withAdminAuth` API helper, rate limiter, security headers. After this phase the `/login` page works end-to-end and the placeholder `/admin` page is reachable only when logged in.

## Prerequisites

- [x] Phase 01 complete
- [ ] `docker compose up -d` — Mongo running

## Tasks

### Mongoose connection
- [ ] `src/lib/db/index.ts`:
  ```ts
  import mongoose from "mongoose";
  const MONGODB_URI = process.env.MONGODB_URI!;
  let cached = (global as any)._mongoose;
  if (!cached) cached = (global as any)._mongoose = { conn: null, promise: null };
  export async function getDb() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI, { dbName: "myportfolio" });
    cached.conn = await cached.promise;
    return cached.conn;
  }
  ```
- [ ] `src/lib/db/serialize.ts` — `serialize(doc)` converts `_id` + nested `ObjectId` fields to strings; converts `Date` to ISO string.

### Models (only `User` + `Session` in this phase)
- [ ] `src/lib/db/models/user.ts`:
  ```ts
  email: { type: String, required, unique, lowercase, trim },
  name: { type: String, required },
  passwordHash: { type: String, required },
  role: { type: String, enum: ["super_admin", "admin"], default: "admin" },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  { timestamps: true }
  ```
- [ ] `src/lib/db/models/session.ts`:
  ```ts
  userId: { type: ObjectId, ref: "User", required, index },
  token: { type: String, required, unique },
  expiresAt: { type: Date, required, index: { expireAfterSeconds: 0 } },  // TTL
  userAgent: String,
  ipAddress: String,
  { timestamps: true }
  ```
- [ ] `src/lib/db/models/index.ts` — re-export

### Auth lib
- [ ] `src/lib/auth-constants.ts` — `export const SESSION_COOKIE_NAME = "myportfolio_session"` (Edge-safe; no Mongo imports)
- [ ] `src/lib/auth.ts`:
  - `hashPassword(plain)` — bcrypt 12 rounds
  - `verifyPassword(plain, hash)`
  - `createSession(userId, meta)` — 96-char hex token, 7-day TTL
  - `getSessionWithUser(token)` — joined lookup (`.populate("userId")` or two queries); rejects expired or inactive users
  - `deleteSession(token)`
  - `getCurrentUser()` reads `myportfolio_session` cookie → user or null
  - `setSessionCookie(token, expires)` / `clearSessionCookie()` / `getSessionCookie()` — HttpOnly, SameSite=Lax, Secure in prod
- [ ] `src/lib/validations/auth.ts` — `loginSchema` (email + password)

### API helpers
- [ ] `src/lib/api-helpers.ts` — `successResponse`, `errorResponse`, `withAdminAuth`, `withSuperAdminAuth`, `parseBody`, `getClientIp`. Origin check on mutation methods.
- [ ] `src/lib/api-client.ts` — typed `fetch` wrapper + `ApiClientError`
- [ ] `src/types/api.ts` — `ApiResponse<T>` discriminated union

### Rate limiter
- [ ] `src/lib/rate-limit.ts` — in-memory sliding-window keyed by `<action>:<ip>`; 5/15min on login

### Login / logout / session routes
- [ ] `src/app/api/auth/login/route.ts` — POST, Zod, rate-limited, constant-time bcrypt (use dummy hash when user missing), creates session + cookie, updates `lastLoginAt`
- [ ] `src/app/api/auth/logout/route.ts` — POST: deletes session + clears cookie
- [ ] `src/app/api/auth/session/route.ts` — GET: returns current user or 401

### Login page
- [ ] `src/app/(auth)/login/page.tsx` — server component; if already authed redirect to `/admin`; reads `?redirect=`
- [ ] `src/components/auth/login-form.tsx` — RHF + Zod + shadcn `Input` + `Button`; success → router.push + toast
- [ ] `src/components/auth/logout-button.tsx`

### Proxy (Next 16)
- [ ] `proxy.ts` at repo root — matcher `['/admin/:path*']`, redirects to `/login?redirect=…` when cookie absent. Zero DB calls; Edge-safe.

### Security headers (`next.config.ts`)
- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- [ ] `Strict-Transport-Security` (prod only)
- [ ] Existing `Cache-Control` rules preserved for `/icon`, `/opengraph-image`

### Seed super-admin
- [ ] `scripts/seed-super-admin.ts` — reads `INITIAL_ADMIN_EMAIL` + `INITIAL_ADMIN_PASSWORD`, upserts a `super_admin` user
- [ ] npm script: `"db:seed:admin": "tsx --env-file=.env.local scripts/seed-super-admin.ts"`
- [ ] Run it once, then update `docs/CREDENTIALS.md`

### Admin stub
- [ ] `src/app/admin/page.tsx` — temp placeholder greeting current user + logout button (real dashboard in Phase 07)

## Testing Checklist

- [ ] Unauthenticated `GET /admin` → 307 → `/login?redirect=/admin`
- [ ] Unauthenticated `GET /api/auth/session` → 401
- [ ] `POST /api/auth/login` wrong creds → 401 `"Invalid email or password"`
- [ ] `POST /api/auth/login` correct creds → 200 + `Set-Cookie: myportfolio_session=…; HttpOnly`
- [ ] `GET /api/auth/session` with cookie → 200 + `{ user }`
- [ ] `GET /admin` with cookie → 200, placeholder renders
- [ ] 6th bad login in 15 min → 429
- [ ] `POST /api/admin/ping` (temp route) without cookie → 401
- [ ] Same with cookie + cross-origin header → 403
- [ ] `POST /api/auth/logout` → 200, cookie cleared, session row deleted
- [ ] Security headers present on `/`
- [ ] `npm run build && npm run typecheck && npm run lint` clean

### Git
- [ ] Commit: `feat(phase-02): mongodb auth + middleware + security headers`

## Notes & Learnings

_(fill in as you go)_
