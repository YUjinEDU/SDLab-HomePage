# SD Lab Homepage — 실적 구조 개편

## What This Is

대학교 연구실(SD Lab) 공개 홈페이지의 실적 콘텐츠 구조를 개편하는 작업.
현재 논문·특허·과제·SW 등록이 각각 분리된 페이지로 존재하는데,
**과제 → 결과물(논문/특허/SW)** 연결이 보이도록 재구성하고,
교수님 피드백 기반으로 일부 콘텐츠의 공개/비공개 경계를 확정한다.

## Core Value

방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를
한눈에 파악할 수 있어야 한다.

## Current Milestone: v1.1 실적 데이터 등록 및 표시 개선

**Goal:** 연구실적 문서의 논문/특허 데이터를 구조화하여 DB에 등록하고, 홈페이지에서 인덱스·저자·수록정보 등을 체계적으로 표시한다.

**Target features:**

- patents 별도 테이블 생성 (publications에서 분리)
- publications에 index_type, volume_info 컬럼 추가
- 연구실적 문서 파싱 → DB 자동 삽입 스크립트
- 논문 표시 개선 (인덱스 badge, 탭 필터, 상세 수록정보)
- 특허 표시 개선 (등록/출원 구분, 특허번호, 발명자)

## Requirements

### Validated

<!-- v1.0에서 구현 완료 -->

- ✓ 공개 포털 라우트 구조 — `(public)/[locale]/` 기반 i18n 적용
- ✓ Publications 페이지 — 논문 목록, 검색/필터, 상세 페이지
- ✓ Patents 페이지 — 특허 목록, 상세 페이지
- ✓ Projects 페이지 — 과제 목록, SW 실적 탭 포함
- ✓ Members 페이지 — 구성원 목록, 슬러그 기반 상세 페이지
- ✓ Auth 시스템 — Supabase Auth, member/professor/admin 역할 구분
- ✓ 내부 포털 — `(internal)` 라우트 그룹, 로그인 필요
- ✓ 교수 관리 포털 — `(professor)` 라우트 그룹, 데이터 CRUD
- ✓ 권한 유틸 (assertRole/requireRole) + Server Actions 권한 검사 — v1.0 Phase 1
- ✓ is_public 컬럼 + RLS 정책 + 캐시 무효화 — v1.0 Phase 1-2
- ✓ 과제-결과물 양방향 연결 UI + 모바일 반응형 — v1.0 Phase 3
- ✓ 교수 포털 공개/비공개 토글 — v1.0 Phase 4

### Active

<!-- v1.1에서 구현할 것들 -->

- [ ] patents 별도 테이블 생성 (publications 테이블에서 분리)
- [ ] publications 테이블에 index_type, volume_info 컬럼 추가
- [ ] 연구실적 문서 파싱 스크립트 (논문 4개 카테고리 + 특허)
- [ ] 논문 데이터 DB 삽입 (국제저널/국제학회/국내저널/국내학회)
- [ ] 특허 데이터 DB 삽입 (등록/출원)
- [ ] 논문 페이지 UI 개선 (인덱스 badge, 탭 필터, 수록정보 표시)
- [ ] 특허 페이지 UI 개선 (등록/출원 탭, 특허번호, 발명자)

### Out of Scope

- 완전한 i18n 번역 완성 — 별도 작업으로 분리
- 교수 포털에서 논문/특허 수동 추가/편집 — 이번은 데이터 일괄 등록이 우선
- 홈페이지 메인 페이지 섹션 업데이트 — 데이터 등록 후 별도 작업
- 디자인 시스템 전면 개편 — 현재 스타일 유지

## Context

**현재 상태:**

- Publications/Patents/Projects가 각각 독립 페이지로 분리되어 있음
- SW 실적은 최근 Projects 탭 아래로 이동된 상태
- 과제와 결과물(논문/특허/SW) 간 DB 관계는 존재하지만 UI에서 연결이 약함
- `lib/permissions/` 디렉터리가 비어 있어 권한 로직이 분산되어 있음
- 일부 콘텐츠의 공개/비공개 여부가 미확정 → 교수님 피드백 필요

**교수님 피드백 필요 항목 (설계 제안 후 확정):**

- SW 등록 실적의 최종 위치 (Projects 탭 vs 독립 섹션)
- 어떤 콘텐츠를 내부 전용으로 할지 (특허 상세? 과제 금액? SW 코드?)
- 홈페이지에서 어떤 실적을 가장 강조할지

## Constraints

- **Tech Stack**: Next.js 16, Supabase, Tailwind CSS v4 — 변경 없음
- **Auth**: Supabase Auth 기반 역할 시스템 유지
- **DB**: 기존 스키마 최대한 유지, 필요시 마이그레이션 추가
- **Design**: 학술적·차분한 톤 유지, 다크 테마 없음

## Key Decisions

| Decision                     | Rationale                                      | Outcome    |
| ---------------------------- | ---------------------------------------------- | ---------- |
| 과제 → 결과물 연결 방식      | 방문자가 연구 흐름을 이해하는 데 가장 직관적   | ✓ Good     |
| SW 실적 위치                 | Projects 탭 유지 — 교수님 피드백 대기 중       | ⚠️ Revisit |
| 공개/비공개 경계             | 콘텐츠별 `is_public` 필드로 관리               | ✓ Good     |
| `lib/permissions/` 구현 방식 | assertRole/requireRole 중앙화                  | ✓ Good     |
| patents 별도 테이블 분리     | 특허는 논문과 필드 구조가 다름 (등록번호/상태) | — Pending  |
| publications index_type 추가 | SCI/SCIE/SCOPUS 등 인덱스 표시 필요            | — Pending  |
| 데이터 입력 방식             | 실적 문서 파싱 스크립트로 자동 삽입            | — Pending  |

---

_Last updated: 2026-03-15 after v1.1 milestone start_
