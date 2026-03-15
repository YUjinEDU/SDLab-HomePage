---
phase: 03-project-output-linking
plan: "03"
subsystem: public-portal
tags: [cross-linking, components, i18n, access-control]
dependency_graph:
  requires: [03-01, 03-02]
  provides: [ProjectOutputsSection, ProjectBacklink, public-project-pages]
  affects: [projects-detail, publications-detail, patents-detail]
tech_stack:
  added: []
  patterns: [server-component, i18n-translation, bidirectional-cross-link]
key_files:
  created:
    - frontend/src/components/projects/ProjectOutputsSection.tsx
    - frontend/src/components/shared/ProjectBacklink.tsx
  modified:
    - frontend/src/app/(public)/[locale]/projects/page.tsx
    - frontend/src/app/(public)/[locale]/projects/[slug]/page.tsx
    - frontend/src/app/(public)/[locale]/publications/[slug]/page.tsx
    - frontend/src/app/(public)/[locale]/patents/[slug]/page.tsx
    - frontend/messages/ko.json
    - frontend/messages/en.json
decisions:
  - AccessDenied gate removed from /projects and /projects/[slug]; is_public filter in DB query provides visibility control
  - ProjectBacklink accepts pre-translated label string (not t function) to keep component dependency-free
  - getProjectOutputs called after notFound() check to avoid fetching for non-existent projects
metrics:
  duration: ~20min
  completed_date: "2026-03-15"
  tasks_completed: 2
  files_changed: 8
requirements: [LINK-02, LINK-03, MOB-02]
---

# Phase 3 Plan 03: Project Output Linking — Cross-link UI Components Summary

One-liner: Bidirectional project-output cross-linking via ProjectOutputsSection and ProjectBacklink server components, with AccessDenied gates removed from public project pages.

## What Was Built

Two reusable server components wired into three detail pages:

- **ProjectOutputsSection** (`components/projects/ProjectOutputsSection.tsx`): Splits `getProjectOutputs` results into publications and patents sub-sections. Renders conditional "관련 논문" and "관련 특허" sections with `min-w-0 w-full` for MOB-02 mobile overflow compliance.
- **ProjectBacklink** (`components/shared/ProjectBacklink.tsx`): Renders linked projects as card links on publication and patent detail pages. Accepts a pre-translated `label` string.

## Pages Modified

| Page                           | Change                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `projects/page.tsx`            | Removed `getSession()` + `AccessDenied` gate                                                                      |
| `projects/[slug]/page.tsx`     | Removed gate; replaced inline publications list with `ProjectOutputsSection`; uses `getProjectOutputs`            |
| `publications/[slug]/page.tsx` | Replaced inline related-projects section with `ProjectBacklink`                                                   |
| `patents/[slug]/page.tsx`      | Replaced inline related-projects section with `ProjectBacklink`; replaced hardcoded Korean strings with i18n keys |

## i18n Keys Added

- `projects.sectionRelatedPatents` (ko: "관련 특허", en: "Related Patents")
- `patents.sectionAbstract`, `patents.sectionKeywords`, `patents.sectionResearchAreas`, `patents.sectionRelatedProjects`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing i18n] patents/[slug]/page.tsx had hardcoded strings**

- **Found during:** Task 2
- **Issue:** "Abstract", "키워드", "연구 분야", "관련 프로젝트" were hardcoded — plan noted this as a known issue to fix
- **Fix:** Added i18n keys to patents namespace in ko.json/en.json; replaced hardcoded strings with `t()` calls
- **Files modified:** `frontend/messages/ko.json`, `frontend/messages/en.json`, `patents/[slug]/page.tsx`
- **Commit:** 2bda3f6

**2. [Rule 1 - Design] ProjectBacklink uses label prop instead of t function**

- **Found during:** Task 1
- **Issue:** Plan suggested passing `t` to ProjectBacklink, but this couples the component to a specific namespace
- **Fix:** Component accepts pre-translated `label: string` — caller passes `t("sectionRelatedProjects")`. Keeps component reusable across namespaces (publications and patents both use it).

## Self-Check

- [x] `frontend/src/components/projects/ProjectOutputsSection.tsx` — FOUND
- [x] `frontend/src/components/shared/ProjectBacklink.tsx` — FOUND
- [x] `frontend/src/app/(public)/[locale]/projects/page.tsx` — FOUND (no AccessDenied)
- [x] `frontend/src/app/(public)/[locale]/projects/[slug]/page.tsx` — FOUND (no AccessDenied, uses ProjectOutputsSection)
- [x] Commits 263e05f and 2bda3f6 — verified

## Self-Check: PASSED
