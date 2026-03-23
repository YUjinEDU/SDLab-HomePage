---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: 실적 데이터 등록 및 표시 개선
status: executing
stopped_at: Completed 09-03-PLAN.md — HTML accessibility, image optimization, dead code removal
last_updated: "2026-03-23T06:14:56.108Z"
last_activity: 2026-03-16 — Completed 05-01 DB Schema (patents table + publications columns)
progress:
  total_phases: 9
  completed_phases: 5
  total_plans: 20
  completed_plans: 15
  percent: 57
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-16)

**Core value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다
**Current focus:** Phase 5 — DB Schema (v1.1 start)

## Current Position

Phase: 5 of 8 (DB Schema)
Plan: 1 of 1 in current phase (COMPLETE)
Status: In progress — Phase 5 done, ready for Phase 6
Last activity: 2026-03-16 — Completed 05-01 DB Schema (patents table + publications columns)

Progress: [█████░░░░░] 57% (v1.0 4/4 phases complete; v1.1 1/7 plans complete)

## Accumulated Context

### Roadmap Evolution

- Phase 9 added: Comprehensive code quality, security, and convention fixes (2026-03-23)

### Decisions

- **v1.0 01-01**: assertRole returns null|{error:'unauthorized'} — inline conditional checks in Server Actions
- **v1.0 01-01**: requireRole throws Error('unauthorized') — callers handle redirect/AccessDenied in try/catch
- **v1.0 01-02**: publications default is_public=true, projects default is_public=false
- **v1.0 01-02**: RPC signature uses `venue` not `journal/volume/issue/pages` (actual schema alignment)
- **v1.0 03-03**: AccessDenied gate removed from /projects and /projects/[slug]; is_public DB filter provides visibility control
- **v1.1**: patents를 별도 테이블로 분리 — 필드 구조가 논문과 다름 (등록번호/상태)
- **v1.1**: 특허 데이터 삽입은 v2로 연기 — 스키마만 이번에 생성 (SCHEMA-01은 v1.1, DATA-03은 v2)
- **v1.1**: 논문 데이터는 실적 문서(md) 파싱 스크립트로 자동 삽입 (수동 입력 없음)
- **05-01**: Patent TypeScript type separated from Publication — different field structure (inventors/status/patentNumber vs authors/venue/year)
- **05-01**: Professor patent management pages stubbed with amber notice — Phase 8 will rebuild against new patents table
- [Phase 06-01]: No npm dependencies — pure Node.js built-ins for publication parser
- [Phase 06-01]: Concatenated Korean names split greedily 3-then-2-char tokens in parser
- [Phase 09-03]: lang=ko hardcoded on root html — root layout has no locale param; ko is the primary language
- [Phase 09-03]: Supabase remotePatterns added to next.config.ts — enables Next.js image optimization for member photos

### Pending Todos

None yet.

### Blockers/Concerns

- ~~기존 type='patent' 데이터가 publications 테이블에 있을 수 있음~~ → RESOLVED: Migration 005 DELETE FROM publications WHERE type='patent'
- 실적 문서 OCR 아티팩트 — 국내 학술회의 데이터 품질 낮음, Phase 6 파싱 스크립트에서 정제 필요
- Phase 7과 Phase 8은 Phase 5 완료 후 병렬 진행 가능 (7은 6도 필요, 8은 5만 필요)

## Session Continuity

Last session: 2026-03-23T06:14:56.105Z
Stopped at: Completed 09-03-PLAN.md — HTML accessibility, image optimization, dead code removal
Resume file: None
