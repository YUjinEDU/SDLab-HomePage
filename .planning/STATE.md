---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
stopped_at: Completed 02-01-PLAN.md — VIS-01/VIS-02 test scaffold (RED state)
last_updated: "2026-03-15T01:51:00.000Z"
last_activity: 2026-03-15 — Completed 02-01 test scaffold (13 failing tests, 11 passing)
progress:
  total_phases: 4
  completed_phases: 1
  total_plans: 7
  completed_plans: 5
  percent: 71
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-14)

**Core value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다
**Current focus:** Phase 2 — Content Visibility

## Current Position

Phase: 2 of 4 (Content Visibility) — IN PROGRESS
Plan: 1 of 3 in current phase — COMPLETE
Status: 02-01 test scaffold done (RED). Ready for 02-02 (query filters) and 02-03 (revalidateTag).
Last activity: 2026-03-15 — Completed 02-01 VIS-01/VIS-02 test scaffold

Progress: [███████░░░] 71%

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

### Pending Todos

None yet.

### Blockers/Concerns

- **Phase 1**: RLS 정책이 기존 마이그레이션(001-003)에 이미 존재하는지 확인 필요 — migration 004 작성 전 충돌 방지
- ~~**Phase 1**: `profiles` 테이블의 역할 컬럼명 확인 필요~~ — RESOLVED: column is `role`, type user_role enum, confirmed in 001_initial_schema.sql
- **Phase 4**: SW 등록 실적 위치(Projects 탭 vs 독립 섹션) — 교수님 피드백 후 확정 (v2 유지 중)

## Session Continuity

Last session: 2026-03-15
Stopped at: Completed 02-01-PLAN.md — VIS-01/VIS-02 test scaffold (RED state)
Resume file: None
