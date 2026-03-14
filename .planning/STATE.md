# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-14)

**Core value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다
**Current focus:** Phase 1 — Security Foundation

## Current Position

Phase: 1 of 4 (Security Foundation)
Plan: 2 of 4 in current phase
Status: In progress
Last activity: 2026-03-15 — Completed 01-02 (is_public migration)

Progress: [██░░░░░░░░] 20%

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

### Pending Todos

None yet.

### Blockers/Concerns

- **Phase 1**: RLS 정책이 기존 마이그레이션(001-003)에 이미 존재하는지 확인 필요 — migration 004 작성 전 충돌 방지
- ~~**Phase 1**: `profiles` 테이블의 역할 컬럼명 확인 필요~~ — RESOLVED: column is `role`, type user_role enum, confirmed in 001_initial_schema.sql
- **Phase 4**: SW 등록 실적 위치(Projects 탭 vs 독립 섹션) — 교수님 피드백 후 확정 (v2 유지 중)

## Session Continuity

Last session: 2026-03-15
Stopped at: Completed 01-01-PLAN.md (permissions role guard: assertRole + requireRole)
Resume file: None
