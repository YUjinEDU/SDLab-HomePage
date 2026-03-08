# Frontend Architect Memory — SD Lab Homepage

## Project Identity

- Repo: `C:\Users\sdlab\workspace\Homepage\frontend`
- Stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4, Supabase
- Package manager: pnpm (never npm/yarn)

## Key File Locations

- Data files: `src/data/*.ts` (static mock data)
- Types: `src/types/index.ts` (barrel), individual files per domain
- Shared components: `src/components/shared/`
- Layout components: `src/components/layout/`
- CSS vars in use: `text-foreground`, `text-primary`, `text-text-secondary`, `bg-surface`, `bg-primary-muted`, `border-border`

## Confirmed Shared Components

- `Container` — `@/components/layout/Container` — max-w-7xl wrapper
- `PageHero` — `@/components/shared/PageHero` — props: `title, description?, breadcrumb?` (left-aligned, white bg, border-b)
- `SectionHeader` — `@/components/shared/SectionHeader` — props: `title, description?, actionLabel?, actionHref?, showDivider?`
- `TagBadge` — `@/components/shared/TagBadge` — props: `label, variant?: "default"|"primary"|"muted"` (default/muted use # prefix, no bg)
- `StatusBadge` — `@/components/shared/StatusBadge` — props: `status: "active"|"completed"|"planned"|"archived"`

## Conventions Confirmed

- `type` not `interface`; no `enum`
- Server Components by default; `"use client"` only when needed
- Korean content, English variable names
- Card pattern: `rounded-xl border border-border bg-surface p-6`
- Section pattern: `py-16` inside `<Container>`
- No dark mode support — light theme only

## Implementation Progress

- Phase 1-2: layout, shared components — done
- Phase 3 (Home Page): All 8 home sections + page.tsx — done (build verified, 0 TS errors)
  - `src/components/home/HomeHeroSection.tsx`
  - `src/components/home/StatsBarSection.tsx`
  - `src/components/home/ResearchAreasSection.tsx`
  - `src/components/home/FeaturedProjectsSection.tsx`
  - `src/components/home/FeaturedPublicationsSection.tsx`
  - `src/components/home/MembersSnapshotSection.tsx`
  - `src/components/home/LatestNewsSection.tsx`
  - `src/components/home/ContactSummarySection.tsx`
  - `src/app/(public)/page.tsx` (composed page)
- Phase 5: Research page + components — done
  - `src/components/research/ResearchAreaDetailCard.tsx`
  - `src/components/research/RelatedContentPreview.tsx`
  - `src/app/(public)/research/page.tsx`
- Phase 8: Contact page + components — done
  - `src/components/contact/ContactInfoCard.tsx`
  - `src/components/contact/MapSection.tsx`
  - `src/components/contact/DirectionsSection.tsx`
  - `src/app/(public)/contact/page.tsx`

## Design System (Redesigned — institutional style)

- Palette: background #ffffff, foreground #111827, primary #2d6a4f, surface #f9fafb, border #e5e7eb, text-secondary #6b7280
- Header: solid white, no backdrop-blur, border-b border-border, h-16, fixed z-50
- Logo: `<Image src="/images/logo.png" width={140} height={40}>` + "충남대학교 컴퓨터융합학부" subtitle
- Nav: gap-8, text-sm font-medium, active = text-primary + 2px bottom border (NOT pill shape), inactive = text-text-secondary
- Footer: bg-surface border-t, 3 columns, real contact data (ykim@cnu.ac.kr, 042-821-7441, 042-821-5450)
- PageHero: white bg, border-b, left-aligned, py-12, optional breadcrumb (Home > PageName)

## Section Layout Patterns

- Standard section: `<section className="py-16"><Container>...</Container></section>`
- Alternate bg sections: add `bg-surface border-y border-border`
- Card: `rounded-xl border border-border p-6 bg-surface hover:border-primary/30 transition-colors`
- Hero bg: `bg-white border-b border-border` (NOT bg-primary-muted anymore)
- CTA primary: `bg-primary text-primary-foreground rounded-lg px-5 py-2.5`
- CTA secondary: `bg-surface border border-border text-foreground rounded-lg px-5 py-2.5`

## Data Shape Notes

- `ResearchArea.icon` is a string slug: `"cpu"` | `"dna"` | `"leaf"` (map to emoji in UI)
- `Publication.researchAreaIds` and `Project.researchAreaIds` used for area filtering
- `ContactInfo.mapEmbedUrl` is currently `null` — always handle null case in MapSection
