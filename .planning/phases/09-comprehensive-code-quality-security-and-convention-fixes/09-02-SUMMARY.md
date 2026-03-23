---
phase: 09-comprehensive-code-quality-security-and-convention-fixes
plan: "02"
subsystem: frontend-conventions
tags: [refactor, conventions, design-tokens, typescript]
dependency_graph:
  requires: []
  provides:
    [
      convention-compliant-shared-components,
      reconciled-color-tokens,
      tokenized-form-styles,
    ]
  affects:
    [
      frontend/src/components/shared,
      frontend/src/app/(professor),
      frontend/src/app/(internal),
    ]
tech_stack:
  added: []
  patterns: [design-token-css-variables, type-over-interface]
key_files:
  created: []
  modified:
    - frontend/src/components/shared/CategoryBadge.tsx
    - frontend/src/components/shared/CopyButton.tsx
    - frontend/src/components/shared/ExternalLinkButton.tsx
    - frontend/src/components/shared/FilterBar.tsx
    - frontend/src/components/shared/FilterChips.tsx
    - frontend/src/components/shared/PageHero.tsx
    - frontend/src/components/shared/Pagination.tsx
    - frontend/src/components/shared/SearchInput.tsx
    - frontend/src/components/shared/SectionHeader.tsx
    - frontend/src/components/shared/StatCard.tsx
    - frontend/src/components/shared/StatusBadge.tsx
    - frontend/src/components/shared/TagBadge.tsx
    - CLAUDE.md
    - frontend/src/components/home/HomeHeroSection.tsx
    - frontend/src/app/(professor)/professor/contact/ContactForm.tsx
    - frontend/src/app/(professor)/professor/members/MemberForm.tsx
    - frontend/src/app/(professor)/professor/news/NewsForm.tsx
    - frontend/src/app/(professor)/professor/projects/ProjectForm.tsx
    - frontend/src/app/(professor)/professor/publications/PublicationForm.tsx
    - frontend/src/app/(internal)/internal/profile/ProfileForm.tsx
decisions:
  - "Primary color documented as #059669 (emerald-600) in CLAUDE.md, matching globals.css --primary token"
  - "bg-background used for HomeHeroSection instead of hardcoded bg-[#fafdfb]"
  - "Red error classes (bg-red-50, text-red-700, border-red-200) preserved unchanged — no error design token exists"
  - "bg-white preserved in form card sections — white is not a design-token candidate for card backgrounds"
metrics:
  duration: "~25 minutes"
  completed_date: "2026-03-23"
  tasks_completed: 3
  tasks_total: 3
  files_modified: 20
---

# Phase 09 Plan 02: Convention Fixes (interface→type, color tokens, design tokens) Summary

Mechanical convention alignment: replaced `interface` with `type` in 12 shared components, reconciled the primary color mismatch between CLAUDE.md and globals.css, removed one hardcoded hex color, and migrated 6 professor/internal form components from raw Tailwind color classes to CSS design tokens.

## Tasks Completed

| Task | Name                                                    | Commit  | Files                          |
| ---- | ------------------------------------------------------- | ------- | ------------------------------ |
| 1    | Convert interface to type in 12 shared components       | dd8f5ce | 12 shared component files      |
| 2    | Reconcile color tokens and fix hardcoded hex values     | 7708b2a | CLAUDE.md, HomeHeroSection.tsx |
| 3    | Replace raw Tailwind colors with design tokens in forms | 2127bd0 | 6 form files                   |

## What Was Done

**Task 1** — All 12 `components/shared/` files had `interface XxxProps {` changed to `type XxxProps = {`. This is a purely mechanical TypeScript convention change with no runtime impact. Zero `interface` declarations remain in the shared directory.

**Task 2** — CLAUDE.md was documenting `#2D6A4F` (forest green) as the primary color while `globals.css` defined `--primary: #059669` (emerald-600). Updated CLAUDE.md to match the actual implementation. Also replaced `bg-[#fafdfb]` in HomeHeroSection with `bg-background` token.

**Task 3** — Six form components were using raw Tailwind color classes instead of design tokens. Applied systematic substitution:

- `focus:border-green-500 / focus:border-emerald-500 / focus:border-slate-500` → `focus:border-primary`
- `focus:ring-*` equivalents → `focus:ring-primary`
- `text-gray-900` → `text-foreground`
- `text-gray-700 / text-gray-500` → `text-text-secondary`
- `border-gray-300 / border-gray-200` → `border-border`
- `bg-gray-50 / bg-gray-100` → `bg-surface`
- `bg-green-50` → `bg-primary-muted`, `text-green-700` → `text-primary-dark`
- `bg-green-600/700 / bg-emerald-600` → `bg-primary`, hover variants → `bg-primary-dark`
- `bg-slate-700` (ProfileForm save button) → `bg-primary`
- Red error classes (`bg-red-50`, `text-red-700`, `border-red-200`) preserved — no red design token

## Deviations from Plan

**1. [Rule 3 - Blocking] Linter auto-applied next/image migration during Task 2/3**

- **Found during:** Task 2 (HomeHeroSection) and Task 3 (ProfileForm)
- **Issue:** A linter running in the background converted bare `<img>` tags to `next/image` `<Image>` components and added the import, causing "file modified since read" errors
- **Fix:** Re-read files after linter changes and incorporated the linter's `Image` import into the final written content
- **Files modified:** HomeHeroSection.tsx, ProfileForm.tsx
- **Impact:** No functional change — linter improvements are compatible with this plan's changes

None — plan executed as written. All success criteria met.

## Decisions Made

1. Primary color is `#059669` (emerald-600) — CLAUDE.md updated to match globals.css
2. Red error feedback classes preserved without substitution — universally understood, no design token equivalent
3. `bg-white` kept in form card section backgrounds — white card backgrounds are not design-token candidates in this theme

## Self-Check

Verifications run post-completion:

- `grep -r "^interface " frontend/src/components/shared/` → 0 matches
- `grep "#2D6A4F" CLAUDE.md` → 0 matches
- `grep "#059669" CLAUDE.md` → 1 match
- `grep "bg-\[#" frontend/src/components/home/HomeHeroSection.tsx` → 0 matches
- Raw color class grep across all 6 form files → 0 matches each

## Self-Check: PASSED
