# Requirements: SD Lab Homepage — 실적 구조 개편

**Defined:** 2026-03-15
**Core Value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다.

## v1 Requirements

### Security & Permissions

- [x] **SEC-01**: `lib/permissions/index.ts` 구현 — `assertRole()` (Server Actions용), `requireRole()` (레이아웃용) 유틸 export
- [x] **SEC-02**: 모든 professor/admin Server Actions(`publications`, `projects`, `members`, `news`, `patents`)에 `assertRole` 역할 검사 추가
- [x] **SEC-03**: Next.js 15.2.3+ 업그레이드 또는 CVE-2025-29927 미들웨어 취약점 패치 적용

### DB Schema & RLS

- [x] **DB-01**: 논문(`publications`), 특허(`patents`), 과제(`projects`) 테이블에 `is_public BOOLEAN DEFAULT true` 컬럼 추가 (Migration 004)
- [x] **DB-02**: `is_public = true`인 행만 anon 역할에 노출하는 Supabase RLS 정책 추가 — 앱 레이어 필터만으로는 불충분
- [x] **DB-03**: `updatePublication`, `updateProject` join table 업데이트를 Supabase RPC(PostgreSQL 함수)로 래핑 — 비트랜잭션 데이터 손실 방지

### Content Visibility (is_public)

- [x] **VIS-01**: 공개 쿼리 함수(`lib/queries/`)에 `is_public = true` 필터 적용 — 비로그인 방문자에게 비공개 콘텐츠 미노출
- [x] **VIS-02**: `next/cache` `revalidateTag()` 태그 기반 캐시 무효화 — write action 후 is_public 변경이 즉시 반영되도록
- [ ] **VIS-03**: 교수 포털에서 각 항목의 `is_public` 토글 UI 제공 (논문, 특허, 과제)

### Project–Output Cross-Linking

- [ ] **LINK-01**: `getProjectOutputs(projectId)` 쿼리 함수 구현 — 과제에 연결된 논문·특허 목록 반환 (`publication_projects` 조인 테이블 활용, 이미 존재)
- [ ] **LINK-02**: 과제 상세 페이지에 `ProjectOutputsSection` 컴포넌트 추가 — 연결된 논문/특허 카드 표시
- [ ] **LINK-03**: 논문/특허 상세 페이지에 연계 과제 역참조 링크(`ProjectBacklink`) 표시

### Mobile Responsiveness

- [x] **MOB-01**: 실적 카드(PublicationCard, PatentCard, ProjectCard) 모바일 레이아웃 검토 및 개선
- [ ] **MOB-02**: 과제 상세 페이지의 결과물 섹션 모바일 반응형 적용

## v2 Requirements

### SW 등록 실적 (교수님 피드백 후 확정)

- **SW-01**: SW 등록 실적 전용 테이블(`sw_registrations`) 신설 — publications 스키마 오염 방지
- **SW-02**: SW 등록 실적의 최종 위치 확정 (Projects 탭 vs 독립 섹션)
- **SW-03**: SW 등록 실적 공개/비공개 제어

### Data 정리

- **DATA-01**: `frontend/src/data/` 정적 파일 소비처 감사 → `lib/queries/` 마이그레이션 후 삭제
- **DATA-02**: `actions/members.ts` 인라인 `generateSlug` 제거 → `lib/utils/slug.ts` 통합

### i18n 완성

- **I18N-01**: `localePrefix: "as-needed"` 전환 — 기본 한국어 URL에서 `/ko/` 접두사 제거
- **I18N-02**: `en.json` 번역 완성도 감사

## Out of Scope

| Feature                      | Reason                                                     |
| ---------------------------- | ---------------------------------------------------------- |
| ORCID/CrossRef 자동 동기화   | 연구실 규모에서 과도한 복잡도 — 교수 포털 수동 입력이 적합 |
| 인용 수(citation count) 표시 | 외부 API 의존성, 과도한 복잡도                             |
| 새 콘텐츠 타입 추가          | 이번 작업은 기존 타입 재구조화에 집중                      |
| 디자인 시스템 전면 개편      | 현재 스타일 유지                                           |
| 완전한 i18n 번역             | 별도 작업으로 분리                                         |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| SEC-01      | Phase 1 | Complete |
| SEC-02      | Phase 1 | Complete |
| SEC-03      | Phase 1 | Complete |
| DB-01       | Phase 1 | Complete |
| DB-02       | Phase 1 | Complete |
| DB-03       | Phase 1 | Complete |
| VIS-01      | Phase 2 | Complete |
| VIS-02      | Phase 2 | Complete |
| VIS-03      | Phase 4 | Pending  |
| LINK-01     | Phase 3 | Pending  |
| LINK-02     | Phase 3 | Pending  |
| LINK-03     | Phase 3 | Pending  |
| MOB-01      | Phase 3 | Complete |
| MOB-02      | Phase 3 | Pending  |

**Coverage:**

- v1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0 ✓

---

_Requirements defined: 2026-03-15_
_Last updated: 2026-03-15 after roadmap creation_
