# SD Lab Homepage — 실적 구조 개편

## What This Is

대학교 연구실(SD Lab) 공개 홈페이지의 실적 콘텐츠 구조를 개편하는 작업.
현재 논문·특허·과제·SW 등록이 각각 분리된 페이지로 존재하는데,
**과제 → 결과물(논문/특허/SW)** 연결이 보이도록 재구성하고,
교수님 피드백 기반으로 일부 콘텐츠의 공개/비공개 경계를 확정한다.

## Core Value

방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를
한눈에 파악할 수 있어야 한다.

## Requirements

### Validated

<!-- 이미 구현된 기능들 -->

- ✓ 공개 포털 라우트 구조 — `(public)/[locale]/` 기반 i18n 적용
- ✓ Publications 페이지 — 논문 목록, 검색/필터, 상세 페이지
- ✓ Patents 페이지 — 특허 목록, 상세 페이지
- ✓ Projects 페이지 — 과제 목록, SW 실적 탭 포함
- ✓ Members 페이지 — 구성원 목록, 슬러그 기반 상세 페이지
- ✓ Auth 시스템 — Supabase Auth, member/professor/admin 역할 구분
- ✓ 내부 포털 — `(internal)` 라우트 그룹, 로그인 필요
- ✓ 교수 관리 포털 — `(professor)` 라우트 그룹, 데이터 CRUD

### Active

<!-- 이번 작업에서 구현할 것들 -->

- [ ] 과제(Project) 상세 페이지에서 연결된 논문·특허·SW 결과물 표시
- [ ] 논문/특허 상세 페이지에서 연계 과제 역참조 링크
- [ ] 공개/비공개 콘텐츠 경계 설계 (교수님 피드백 반영)
  - [ ] 공개 여부 필드(`is_public`) DB 스키마 추가
  - [ ] 비공개 콘텐츠는 내부 포털에서만 노출
- [ ] 모바일 레이아웃 개선 — 실적 카드/목록의 반응형 최적화
- [ ] SW 실적 위치 확정 (Projects 탭 유지 또는 별도 분리)
- [ ] `lib/permissions/` 구현 — 역할 기반 접근 제어 유틸 생성
- [ ] Server Actions 권한 검사 추가 (현재 누락)

### Out of Scope

- 완전한 i18n 번역 완성 — 별도 작업으로 분리
- 새로운 콘텐츠 타입 추가 (이번은 기존 타입 재구조화)
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

| Decision                     | Rationale                                     | Outcome   |
| ---------------------------- | --------------------------------------------- | --------- |
| 과제 → 결과물 연결 방식      | 방문자가 연구 흐름을 이해하는 데 가장 직관적  | — Pending |
| SW 실적 위치                 | Projects 탭 vs 독립 분리 — 교수님 피드백 필요 | — Pending |
| 공개/비공개 경계             | 콘텐츠별 `is_public` 필드로 관리              | — Pending |
| `lib/permissions/` 구현 방식 | 역할 검사 중앙화 vs 각 action 인라인          | — Pending |

---

_Last updated: 2026-03-14 after initialization_
