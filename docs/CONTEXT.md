# Context — Why & What

## Why we're doing this

The portfolio at `https://portfolio.rajukumaryadav38.com.np` currently ships every visible string as a TypeScript constant in `src/lib/data.ts`. Updating any content (a new project, a CV bullet, a new publication, the site title) requires a git commit and a redeploy. The goal of this migration is to:

1. Move **every** piece of content into MongoDB so updates happen via an admin panel — no redeploy.
2. Add a fully editable site chrome: logo, favicon glyph, OG image text, theme tokens, navbar items, footer items, social icons.
3. Keep the **public surface server-rendered** (no client-side data fetching) so SEO, performance, and the dynamic OG/icon routes continue to work.
4. Keep the **3D scenes** code-driven (their geometry is the design — only the on/off toggle is dynamic).
5. Mirror the proven patterns from the sibling repo at `Extras/acmeadventuretreks` so the codebase stays consistent across the engineer's portfolio of side projects.

## What "done" looks like

- `src/lib/data.ts` no longer exists.
- The owner logs in at `/login`, edits any field via the admin panel, and within seconds the public site reflects the change.
- Public landing page Lighthouse perf ≥ 95.
- All 17 admin modules pass manual smoke tests in `docs/phases/PHASE-12-deploy.md`.
- Production runs on Vercel + MongoDB Atlas with zero hardcoded secrets in source.

## Constraints

- **Free tier MongoDB Atlas** is the only persistent storage. No S3 / R2 / Cloudinary. Media lives in GridFS.
- The dev environment must work offline: `docker compose up -d` + `npm run dev` and the site is fully usable, including media uploads.
- The migration happens incrementally on branch `feat/dynamic-cms-mongodb`. Each phase ends with a clean `npm run build` and a commit. The branch is merged to `main` only at the end of Phase 12.

## Out of scope

- Multilingual content. The current portfolio is English-only.
- A blog / article system. Publications cover this need.
- Newsletter. Inquiries form is the only public write.
- Multi-user editing — there's one owner, optionally a second `admin` for delegated content edits.
