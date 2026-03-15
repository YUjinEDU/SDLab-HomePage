---
gsd_state_version: 1.0
milestone: v1.1
milestone_name: 실적 데이터 등록 및 표시 개선
status: defining-requirements
stopped_at: ""
last_updated: "2026-03-15"
last_activity: 2026-03-15 — Milestone v1.1 started
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-15)

**Core value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다
**Current focus:** Defining requirements for v1.1

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-03-15 — Milestone v1.1 started

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- **v1.0 01-01**: assertRole returns null|{error:'unauthorized'} — inline conditional checks in Server Actions
- **v1.0 01-01**: requireRole throws Error('unauthorized') — callers handle redirect/AccessDenied in try/catch
- **v1.0 01-02**: publications default is_public=true, projects default is_public=false
- **v1.0 01-02**: RPC signature uses `venue` not `journal/volume/issue/pages` (actual schema alignment)
- **v1.0 03-03**: AccessDenied gate removed from /projects and /projects/[slug]; is_public DB filter provides visibility control
- **v1.1**: patents 별도 테이블 분리 (publications에서 type='patent' → 독립 테이블)
- **v1.1**: publications에 index_type, volume_info 컬럼 추가
- **v1.1**: 데이터 입력은 실적 문서 파싱 스크립트로 자동 삽입

### Pending Todos

None yet.

### Blockers/Concerns

- 기존 type='patent' 데이터가 publications 테이블에 있을 수 있음 → 마이그레이션 시 처리 필요
- 실적 문서가 OCR 변환된 듯한 오타가 많음 → 파싱 스크립트에서 정제 필요

## Session Continuity

Last session: 2026-03-15
Stopped at: Milestone v1.1 started, defining requirements
Resume file: None
