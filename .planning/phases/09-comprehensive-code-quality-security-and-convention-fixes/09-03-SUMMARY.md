---
phase: 09-comprehensive-code-quality-security-and-convention-fixes
plan: "03"
subsystem: frontend-accessibility-images
tags: [accessibility, wcag, next-image, performance, dead-code]
dependency_graph:
  requires: []
  provides: [accessible-html-lang, optimized-images, clean-contact-form-tree]
  affects:
    [
      frontend/src/app/layout.tsx,
      frontend/src/components/layout/SiteHeader.tsx,
      frontend/src/components/members/ProfessorProfile.tsx,
      frontend/src/components/members/MemberCard.tsx,
    ]
tech_stack:
  added: [next/image Image component, Supabase remotePatterns config]
  patterns: [next/image for all user-facing photos, lang attribute on root html]
key_files:
  created: []
  modified:
    - frontend/src/app/layout.tsx
    - frontend/next.config.ts
    - frontend/src/components/layout/SiteHeader.tsx
    - frontend/src/components/home/HomeHeroSection.tsx
    - frontend/src/components/members/ProfessorProfile.tsx
    - frontend/src/components/members/MemberCard.tsx
    - frontend/src/app/(public)/[locale]/members/MembersPageClient.tsx
    - frontend/src/app/(public)/[locale]/members/[slug]/page.tsx
    - frontend/src/app/(internal)/internal/profile/ProfileForm.tsx
  deleted:
    - frontend/src/app/(professor)/contact/ContactForm.tsx
decisions:
  - lang=ko hardcoded on root html (not dynamic) — root layout has no locale param access; next-intl provides locale lower in [locale] segment; ko is the default/primary language
  - Supabase remotePatterns added to next.config.ts (not unoptimized) — enables Next.js image optimization for member photos from Supabase storage
  - suppressHydrationWarning retained — next-intl may cause hydration mismatches; safe to keep per framework guidance
metrics:
  duration: "15 minutes"
  completed: "2026-03-23"
  tasks_completed: 2
  tasks_total: 2
  files_changed: 10
---

# Phase 09 Plan 03: HTML Accessibility, Image Optimization, Dead Code Removal Summary

WCAG 2.1 Level A lang attribute added to root html, 7 img tags migrated to next/image with Supabase remotePatterns, orphaned duplicate ContactForm deleted.

## Tasks Completed

| #   | Task                                                  | Commit  | Files                                           |
| --- | ----------------------------------------------------- | ------- | ----------------------------------------------- |
| 1   | Add lang=ko to root html, delete orphaned ContactForm | 0e5833b | layout.tsx, (professor)/contact/ContactForm.tsx |
| 2   | Migrate key images from img to next/image             | 3d9cc37 | next.config.ts + 7 component/page files         |

## What Was Built

**Task 1 — Accessibility & Dead Code**

- Added `lang="ko"` to `<html>` element in root layout (`frontend/src/app/layout.tsx`)
- Deleted `frontend/src/app/(professor)/contact/ContactForm.tsx` — orphaned file with no imports; the active form lives at `(professor)/professor/contact/ContactForm.tsx`
- Verified no other file imported from the deleted path before deletion

**Task 2 — Image Optimization**

- Added Supabase storage domain to `next.config.ts` `images.remotePatterns` so Next.js can optimize member photos from external URLs
- Migrated 7 `<img>` tags to `next/image` `<Image>`:
  - `SiteHeader.tsx`: logo (130×40)
  - `HomeHeroSection.tsx`: logo (160×50)
  - `ProfessorProfile.tsx`: professor photo (280×360) with `priority` prop (above the fold)
  - `MemberCard.tsx`: member avatar (80×80)
  - `MembersPageClient.tsx`: professor card photo (80×80)
  - `members/[slug]/page.tsx`: member detail sidebar photo (224×224)
  - `ProfileForm.tsx`: profile preview (80×80)
- Removed all `// eslint-disable-next-line @next/next/no-img-element` comments from migrated files
- Build verified: `pnpm build` passes with no errors

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- layout.tsx: FOUND
- next.config.ts: FOUND
- SiteHeader.tsx: FOUND
- Orphaned ContactForm deleted: CONFIRMED
- Commit 0e5833b: FOUND
- Commit 3d9cc37: FOUND
