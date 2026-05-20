# Phase 05 — Providers, Hooks & UniversalLoader

> **Status:** pending
> **Estimated effort:** Day 5 (≈ 6 hrs)

---

## Objective

Land the cross-cutting pieces the admin UI needs: React Query provider, theme provider (`next-themes`), Sonner toaster, Zustand UI store, generic resource hooks, query-key factory, skeleton primitives, the **`<UniversalLoader />`** component, and shared error boundary. After this phase any admin page can be authored without reinventing scaffolding.

## Prerequisites

- [x] Phase 04

## Tasks

### Providers
- [ ] `src/providers/query-provider.tsx`:
  - Singleton via `getQueryClient()` (client-only) with `staleTime: 60_000`, `retry: 1`
  - Includes `<ReactQueryDevtools />` only when `NODE_ENV !== "production"`
- [ ] `src/providers/theme-provider.tsx`:
  - Wraps `next-themes` `ThemeProvider attribute="class"` (current portfolio already toggles `.light` class — match that)
  - Reads `defaultTheme` from `site_settings.dark_mode_default` (server-fetched, passed as prop from `layout.tsx`)
- [ ] `src/lib/query-client.ts` — `getQueryClient()` singleton (uses `isServer` from RQ5).

### Toast
- [ ] `src/components/ui/sonner.tsx` — Toaster wrapper wired to CSS vars (copy from acmeadventuretreks).

### Stores
- [ ] `src/stores/ui-store.ts` — `sidebarCollapsed`, `mobileMenuOpen`, setters.
- [ ] `src/stores/admin-filter-store.ts` — search/filter state per admin module.

### Hooks
- [ ] `src/hooks/use-admin-data.ts` — `createResourceHooks<TList, TDetail, TFilters>({ listUrl, detailUrl, listKey, detailKey })` returning `useList`, `useDetail`. Plus `useSessionQuery()`.
- [ ] `src/hooks/use-admin-mutations.ts` — `createMutationHooks({ createUrl, updateUrl, deleteUrl, invalidate: ["<keys>"] })` returning `useCreate`, `useUpdate`, `useDelete`, all with Sonner toasts.
- [ ] `src/hooks/use-debounce.ts`
- [ ] `src/hooks/use-unsaved-warning.ts`
- [ ] `src/hooks/use-pending-upload-cleanup.ts` — tracks freshly uploaded media that wasn't ultimately saved, deletes them on unmount.
- [ ] `src/hooks/use-upload.ts` already from Phase 04 — confirm tracked.

### Query keys
- [ ] `src/lib/query-keys.ts` — exported object:
  ```ts
  export const queryKeys = {
    session: () => ["session"] as const,
    settings: () => ["settings"] as const,
    sections: () => ["sections"] as const,
    nav: (loc: string) => ["nav", loc] as const,
    hero: () => ["hero"] as const,
    about: () => ["about"] as const,
    education: () => ["education"] as const,
    experiences: { list: () => ["experiences"] as const, detail: (id: string) => ["experiences", id] as const },
    // …one entry per entity
  };
  ```

### Shared components
- [ ] `src/components/shared/universal-loader.tsx`:
  - Reads `site_settings.brand_short` via a small server-component wrapper that passes the wordmark string as prop
  - Visual: centered wordmark with pulsing accent ring + 3 dots animation
  - Used by every `loading.tsx` on the public side
- [ ] `src/components/shared/skeleton-list.tsx` — generic shimmer rows
- [ ] `src/components/shared/skeleton-form.tsx`
- [ ] `src/components/shared/skeleton-card.tsx`
- [ ] `src/components/shared/empty-state.tsx` — icon + title + description + optional action button
- [ ] `src/components/shared/error-boundary.tsx` — React error boundary with `componentDidCatch` + retry button
- [ ] `src/components/shared/confirm-delete-dialog.tsx`

### shadcn primitives
Copy these from acmeadventuretreks `components/ui/` (they only import `@/lib/utils`):
- [ ] `button.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx`, `switch.tsx`, `select.tsx`, `tabs.tsx`, `accordion.tsx`, `alert-dialog.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `tooltip.tsx`, `popover.tsx`, `badge.tsx`, `card.tsx`, `separator.tsx`, `checkbox.tsx`, `skeleton.tsx`, `sonner.tsx`, `sheet.tsx`, `avatar.tsx`
- Existing custom `Button.tsx`, `Card.tsx`, `Badge.tsx` in `src/components/ui/` are **kept** (they're the public-side stylized variants). The shadcn ones live alongside them and are used in the admin.

### Wire providers into root layout
- [ ] Update `src/app/layout.tsx`:
  - Wrap children in `<ThemeProvider><QueryProvider>{children}<Toaster /></QueryProvider></ThemeProvider>`
  - Inject theme CSS vars from DB (preview only — full implementation in Phase 06)

### Verification
- [ ] `npm run typecheck && npm run lint && npm run build` clean
- [ ] Visit `/` — site still works visually identical to current
- [ ] Visit `/admin` (logged in) — placeholder loads, Sonner toaster mounts (test by triggering a console.error)
- [ ] Switching theme via current ThemeToggle still works

### Git
- [ ] Commit: `feat(phase-05): providers, query hooks, universal loader, skeletons`

## Notes & Learnings

_(fill in as you go)_
