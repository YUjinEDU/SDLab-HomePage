---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: verifying
stopped_at: "Completed 04-02-PLAN.md — VisibilityToggleButton wired. Checkpoint:human-verify pending before 04-03."
last_updated: "2026-03-15T11:41:43.821Z"
last_activity: 2026-03-15 — Completed 04-02 visibility toggle UI
progress:
  total_phases: 4
  completed_phases: 4
  total_plans: 12
  completed_plans: 12
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-14)

**Core value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다
**Current focus:** Phase 4 — Professor Portal UX

## Current Position

Phase: 4 of 4 (Professor Portal UX) — IN PROGRESS
Plan: 2 of 3 in current phase — COMPLETE (awaiting human verify checkpoint)
Status: 04-02 done (VisibilityToggleButton + professor list pages). Ready for human verify then 04-03.
Last activity: 2026-03-15 — Completed 04-02 visibility toggle UI

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
| ----- | ----- | ----- | -------- |
| -     | -     | -     | -        |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **01-01**: assertRole returns null|{error:'unauthorized'} — inline conditional checks in Server Actions
- **01-01**: requireRole throws Error('unauthorized') — callers handle redirect/AccessDenied in try/catch
- **01-01**: Role as string literal union (not enum); ROLE_HIERARCHY numeric map: member=0, professor=1, admin=2
- **01-02**: publications default is_public=true, projects default is_public=false (공개/비공개 경계 확정)
- **01-02**: RPC signature uses `venue` not `journal/volume/issue/pages` (actual schema alignment)
- **01-02**: update_publication_with_relations preserves author_order via generate_subscripts()
- **01-03**: contact.ts updateContact guarded with assertRole('professor') — writes lab info, professor-only
- **01-03**: Professor layout uses requireRole + redirect('/login') over AccessDenied (i18n context unavailable)
- **01-04**: CVE-2025-29927 manual patch applied as defense-in-depth; redirect to /login on x-middleware-subrequest header
- **02-01**: vi.hoisted() required for mockChain in vitest — vi.mock factory hoisted above const declarations
- **02-01**: order() mock returns thenable (Object.assign Promise + chain) to handle both chained and terminal query patterns
- **02-03**: @ts-expect-error on revalidateTag calls — Next.js 16 type requires 2 args but runtime accepts 1; test contract expects single-arg call
- **03-02**: min-w-0 on h3 (flex child) prevents overflow without wrapper div; break-words on title, truncate on single-line metadata (venue, org)
- **03-03**: ProjectBacklink accepts pre-translated label string (not t fn) — keeps component reusable across publications and patents namespaces
- **03-03**: AccessDenied gate removed from /projects and /projects/[slug]; is_public DB filter provides visibility control
- **04-01**: @ts-expect-error on revalidateTag confirmed pattern; assertRole null|{error} guard inline in visibility actions
- [Phase 04-professor-portal-ux]: 04-02: Patents professor page uses getAllPublications filtered by type='patent' client-side — no getAllPatents needed
- [Phase 04-professor-portal-ux]: 04-02: No router.refresh() in VisibilityToggleButton — revalidateTag in Server Action handles cache invalidation

### Pending Todos

None yet.

### Blockers/Concerns

- **Phase 1**: RLS 정책이 기존 마이그레이션(001-003)에 이미 존재하는지 확인 필요 — migration 004 작성 전 충돌 방지
- ~~**Phase 1**: `profiles` 테이블의 역할 컬럼명 확인 필요~~ — RESOLVED: column is `role`, type user_role enum, confirmed in 001_initial_schema.sql
- **Phase 4**: SW 등록 실적 위치(Projects 탭 vs 독립 섹션) — 교수님 피드백 후 확정 (v2 유지 중)

## Session Continuity

Last session: 2026-03-15
Stopped at: Completed 04-02-PLAN.md — VisibilityToggleButton wired. Checkpoint:human-verify pending before 04-03.
Resume file: None
