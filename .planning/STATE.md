---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: 실적 데이터 등록 및 표시 개선
status: ready-to-plan
stopped_at: ""
last_updated: "2026-03-16"
last_activity: 2026-03-16 — v1.1 roadmap created (Phases 5-8)
progress:
  total_phases: 4
  completed_phases: 0
  total_plans: 7
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-16)

**Core value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다
**Current focus:** Phase 5 — DB Schema (v1.1 start)

## Current Position

Phase: 5 of 8 (DB Schema)
Plan: 0 of 1 in current phase
Status: Ready to plan
Last activity: 2026-03-16 — v1.1 roadmap created (Phases 5-8)

Progress: [████░░░░░░] 50% (v1.0 4/4 phases complete; v1.1 not started)

## Accumulated Context

### Decisions

- **v1.0 01-01**: assertRole returns null|{error:'unauthorized'} — inline conditional checks in Server Actions
- **v1.0 01-01**: requireRole throws Error('unauthorized') — callers handle redirect/AccessDenied in try/catch
- **v1.0 01-02**: publications default is_public=true, projects default is_public=false
- **v1.0 01-02**: RPC signature uses `venue` not `journal/volume/issue/pages` (actual schema alignment)
- **v1.0 03-03**: AccessDenied gate removed from /projects and /projects/[slug]; is_public DB filter provides visibility control
- **v1.1**: patents를 별도 테이블로 분리 — 필드 구조가 논문과 다름 (등록번호/상태)
- **v1.1**: 특허 데이터 삽입은 v2로 연기 — 스키마만 이번에 생성 (SCHEMA-01은 v1.1, DATA-03은 v2)
- **v1.1**: 논문 데이터는 실적 문서(md) 파싱 스크립트로 자동 삽입 (수동 입력 없음)

### Pending Todos

None yet.

### Blockers/Concerns

- 기존 type='patent' 데이터가 publications 테이블에 있을 수 있음 → Phase 5 마이그레이션 시 처리 필요 (SCHEMA-04)
- 실적 문서 OCR 아티팩트 — 국내 학술회의 데이터 품질 낮음, Phase 6 파싱 스크립트에서 정제 필요
- Phase 7과 Phase 8은 Phase 5 완료 후 병렬 진행 가능 (7은 6도 필요, 8은 5만 필요)

## Session Continuity

Last session: 2026-03-16
Stopped at: v1.1 roadmap created — ready to plan Phase 5
Resume file: None
