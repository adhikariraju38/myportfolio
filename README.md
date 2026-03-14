<div align="center">

# Raju Kumar Yadav — Portfolio

**Full Stack Engineer** | Microservices | React/Next.js | Cloud Infrastructure

[![Live Site](https://img.shields.io/badge/Live-portfolio.rajukumaryadav38.com.np-3B82F6?style=for-the-badge&logo=vercel&logoColor=white)](https://portfolio.rajukumaryadav38.com.np)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js)](https://threejs.org)

</div>

---

A performance-first portfolio built with **Next.js 15**, **React Three Fiber**, and **Framer Motion** — featuring interactive 3D scenes, buttery smooth scroll, and tactile micro-interactions that make every click and hover feel physical.

## Preview

| Dark Mode | Light Mode |
|-----------|------------|
| ![Dark](https://img.shields.io/badge/Theme-Dark-0A0A0F?style=for-the-badge) | ![Light](https://img.shields.io/badge/Theme-Light-FAFAFA?style=for-the-badge&labelColor=555) |

## Highlights

- **3D Hero Scene** — Hexagonal architecture rings with orbiting particles and stars, built with React Three Fiber. Deferred loading ensures zero jank on page load.
- **Buttery Smooth Scroll** — Lenis-powered lerp-based scrolling at 120fps with scroll-linked parallax on every section.
- **Tactile Interactions** — Spring-physics button presses, magnetic hover on nav links, 3D card tilt following cursor, word-by-word text reveals.
- **Dark/Light Theme** — Instant switch with zero FOUC (inline script in `<head>`), respects system preference.
- **Pure CSS Hero Animations** — Compositor-only `opacity` + `transform` keyframes — no JS during critical paint path.
- **Accessible** — Skip-to-content, `aria-current` on nav, focus-visible rings, `prefers-reduced-motion` kills all animations.
- **SEO Ready** — JSON-LD Person schema, dynamic OG image generation, sitemap, robots.txt.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript |
| 3D | React Three Fiber + @react-three/drei |
| Animation | Framer Motion 12 + CSS Keyframes |
| Styling | Tailwind CSS 4 |
| Scroll | Lenis |
| Fonts | Space Grotesk, Inter, JetBrains Mono (via `next/font`) |
| Deploy | Vercel |

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Fonts, metadata, providers
│   ├── page.tsx            # Home — JSON-LD + lazy sections
│   ├── globals.css         # Theme tokens, animations
│   └── opengraph-image.tsx # Dynamic OG image
├── components/
│   ├── 3d/                 # Three.js scenes + error boundaries
│   ├── layout/             # Navbar, Footer, SmoothScroll, ScrollProgress
│   ├── sections/           # 8 page sections
│   └── ui/                 # Button, Card, Badge, ThemeToggle, Counter
├── lib/
│   └── data.ts             # All content as typed constants
├── hooks/                  # useScrollSection
├── styles/
│   └── animations.ts       # Framer Motion variant presets
└── types/                  # TypeScript interfaces
```

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Performance

- Hero text animations use **pure CSS** (compositor-only) — zero main thread work
- 3D canvas **deferred 800ms** after page load to avoid jank during text reveal
- `staggerContainer` uses empty `hidden` state (no opacity:0 on parent) to prevent double-fade
- Three.js loaded via `next/dynamic` with `ssr: false` — not in initial bundle
- `antialias: false` + `powerPreference: "high-performance"` on WebGL context
- All Framer Motion hover/tilt effects use `useMotionValue` — zero React re-renders

## Sections

| # | Section | Features |
|---|---------|----------|
| 1 | **Hero** | 3D hexagonal rings, CSS word reveal, deferred canvas |
| 2 | **About** | Profile photo with gradient ring, animated stat counters |
| 3 | **Experience** | Timeline with staggered bullets, expandable entries |
| 4 | **Skills** | Filterable category tabs, production badges, layout animations |
| 5 | **Projects** | 3D tilt cards with spotlight effect, tech badges |
| 6 | **Awards** | Rank-colored cards (gold/silver/bronze), certifications |
| 7 | **Education** | Academic + community involvement |
| 8 | **Contact** | Magnetic social icons, animated form inputs, connection mesh |

## License

MIT

---

<div align="center">

**Built by [Raju Kumar Yadav](https://github.com/adhikariraju38)**

</div>
