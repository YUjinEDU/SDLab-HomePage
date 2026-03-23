# Requirements: SD Lab Homepage

**Defined:** 2026-03-15
**Core Value:** 방문자가 "이 연구실이 어떤 과제를 수행했고, 그 결과로 무엇을 만들었는지"를 한눈에 파악할 수 있어야 한다.

## v1.0 Requirements (Validated)

### Security & Permissions

- [x] **SEC-01**: `lib/permissions/index.ts` 구현 — `assertRole()`, `requireRole()` 유틸 export
- [x] **SEC-02**: 모든 professor/admin Server Actions에 `assertRole` 역할 검사 추가
- [x] **SEC-03**: CVE-2025-29927 미들웨어 취약점 패치 적용

### DB Schema & RLS

- [x] **DB-01**: 논문·특허·과제 테이블에 `is_public BOOLEAN DEFAULT true` 컬럼 추가
- [x] **DB-02**: `is_public = true`인 행만 anon 역할에 노출하는 RLS 정책 추가
- [x] **DB-03**: `updatePublication` join table 업데이트를 Supabase RPC로 래핑

### Content Visibility

- [x] **VIS-01**: 공개 쿼리에 `is_public = true` 필터 적용
- [x] **VIS-02**: `revalidateTag()` 캐시 무효화
- [x] **VIS-03**: 교수 포털 `is_public` 토글 UI

### Project–Output Cross-Linking

- [x] **LINK-01**: `getProjectOutputs(projectId)` 쿼리 함수 구현
- [x] **LINK-02**: 과제 상세 페이지 `ProjectOutputsSection` 컴포넌트
- [x] **LINK-03**: 논문/특허 상세 역참조 링크 `ProjectBacklink`

### Mobile Responsiveness

- [x] **MOB-01**: 실적 카드 모바일 레이아웃 개선
- [x] **MOB-02**: 과제 상세 결과물 섹션 모바일 반응형

## v1.1 Requirements

Requirements for milestone v1.1. Each maps to roadmap phases.

### DB Schema

- [x] **SCHEMA-01**: patents 별도 테이블 생성 (id, title, title_en, inventors[], status, patent_number, date, note, is_public)
- [x] **SCHEMA-02**: publications에 index_type TEXT 컬럼 추가 (SCI/SCIE/SCOPUS/KCI/기타)
- [x] **SCHEMA-03**: publications에 volume_info TEXT 컬럼 추가 (권호·페이지 정보)
- [x] **SCHEMA-04**: 기존 publications에서 type='patent' 데이터 정리/제거

### Data Pipeline

- [x] **DATA-01**: 실적 문서(md) 논문 섹션 파싱 스크립트 (국제저널/국제학회/국내저널/국내학회)
- [ ] **DATA-02**: 파싱된 논문 JSON → Supabase INSERT 시드 스크립트

### Publications UI

- [ ] **PUB-01**: 논문 페이지 탭 필터 (국제저널/국제학회/국내저널/국내학회)
- [ ] **PUB-02**: 논문 인덱스 badge 표시 (SCI/SCIE/SCOPUS 등)
- [ ] **PUB-03**: 논문 수록정보 표시 (권호·페이지 별도)
- [ ] **PUB-04**: 논문 저자 전체 목록 표시 (김영국 교수 강조)
- [ ] **PUB-05**: 논문 DOI/PDF 링크 표시

### Patents UI

- [ ] **PAT-01**: 특허 페이지 탭 필터 (등록/출원)
- [ ] **PAT-02**: 특허 카드 UI (특허번호, 발명자, 상태 badge)
- [ ] **PAT-03**: 특허 상세 페이지

### Code Quality & Security (Phase 9)

- [ ] **CQ-01**: Middleware silent bypass 수정 — Supabase URL 누락 시 503 반환
- [ ] **CQ-02**: Profile INSERT policy 확인 및 문서화
- [ ] **CQ-03**: 중복 ContactForm 삭제 (orphaned copy)
- [ ] **CQ-04**: 모든 Server Action에 ActionResult 타입 통일
- [ ] **CQ-05**: Join-table 변경 시 에러 체크 추가 (비원자적 mutation 수정)
- [ ] **CQ-06**: Server Action 입력 검증 추가 (필수 필드, 숫자 형식)
- [ ] **CQ-07**: Next.js CVE 패치 (>=16.1.7 업그레이드)
- [ ] **CQ-08**: supabase/.temp/ 등 .gitignore 보강
- [ ] **CQ-09**: 루트 html에 lang 속성 추가
- [ ] **CQ-10**: 로그인 에러 메시지 일반화 (사용자 열거 방지)
- [ ] **CQ-11**: next.config.ts에 보안 헤더 추가
- [ ] **CQ-12**: 12개 shared 컴포넌트 interface→type 변환
- [ ] **CQ-13**: CLAUDE.md와 globals.css 기본 색상 일치화
- [ ] **CQ-14**: 하드코딩된 hex 색상을 디자인 토큰으로 교체
- [ ] **CQ-15**: Professor/internal 폼에서 raw Tailwind 색상 대신 토큰 사용 (문서화)
- [ ] **CQ-16**: img 태그를 next/image로 마이그레이션 (주요 이미지)
- [ ] **CQ-17**: revalidateTag 래퍼 함수로 8개 @ts-expect-error 제거
- [ ] **CQ-18**: 로그인 후 역할별 리다이렉트 (/professor vs /internal)
- [ ] **CQ-19**: Profile 업데이트에서 email 대신 member_id FK 사용
- [ ] **CQ-20**: Middleware 프로필 조회 중복 제거 (1회로 통합)
- [ ] **CQ-21**: Single-item 쿼리에서 not-found와 실제 에러 구분
- [ ] **CQ-22**: Query mapper 함수에서 Record<string, unknown> 대신 타입 사용
- [ ] **CQ-23**: deleteNews에서 CASCADE와 중복되는 수동 삭제 제거
- [ ] **CQ-24**: @types/three를 devDependencies로 이동
- [ ] **CQ-25**: .env.example 파일 생성 (필수 환경변수 문서화)
- [ ] **CQ-26**: 환경변수 런타임 검증 유틸리티 추가

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Data Pipeline

- **DATA-03**: 특허 데이터 파싱 및 DB 삽입 (이번에는 스키마만 생성)
- **DATA-04**: 교수 포털에서 논문/특허 수동 추가/편집 UI

### UI

- **UI-01**: 홈페이지 메인 최신 논문/특허 섹션 업데이트

### SW 등록 실적

- **SW-01**: SW 등록 실적 전용 테이블 신설
- **SW-02**: SW 등록 실적 최종 위치 확정

### Data 정리

- **DATA-05**: `frontend/src/data/` 정적 파일 → `lib/queries/` 마이그레이션 후 삭제

### i18n 완성

- **I18N-01**: `localePrefix: "as-needed"` 전환
- **I18N-02**: `en.json` 번역 완성도 감사

## Out of Scope

| Feature                        | Reason                               |
| ------------------------------ | ------------------------------------ |
| ORCID/CrossRef 자동 동기화     | 연구실 규모에서 과도한 복잡도        |
| 인용 수(citation count) 표시   | 외부 API 의존성, 과도한 복잡도       |
| 교수 포털 논문/특허 CRUD       | 이번은 데이터 일괄 등록 우선         |
| i18n 번역 완성                 | 별도 작업으로 분리                   |
| 디자인 시스템 전면 개편        | 현재 스타일 유지                     |
| 국내 학술회의 데이터 수동 교정 | OCR 오류 많아 파싱 후 별도 검토 필요 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| SCHEMA-01   | Phase 5 | Complete |
| SCHEMA-02   | Phase 5 | Complete |
| SCHEMA-03   | Phase 5 | Complete |
| SCHEMA-04   | Phase 5 | Complete |
| DATA-01     | Phase 6 | Complete |
| DATA-02     | Phase 6 | Pending  |
| PUB-01      | Phase 7 | Pending  |
| PUB-02      | Phase 7 | Pending  |
| PUB-03      | Phase 7 | Pending  |
| PUB-04      | Phase 7 | Pending  |
| PUB-05      | Phase 7 | Pending  |
| PAT-01      | Phase 8 | Pending  |
| PAT-02      | Phase 8 | Pending  |
| PAT-03      | Phase 8 | Pending  |
| CQ-01       | Phase 9 | Pending  |
| CQ-02       | Phase 9 | Pending  |
| CQ-03       | Phase 9 | Pending  |
| CQ-04       | Phase 9 | Pending  |
| CQ-05       | Phase 9 | Pending  |
| CQ-06       | Phase 9 | Pending  |
| CQ-07       | Phase 9 | Pending  |
| CQ-08       | Phase 9 | Pending  |
| CQ-09       | Phase 9 | Pending  |
| CQ-10       | Phase 9 | Pending  |
| CQ-11       | Phase 9 | Pending  |
| CQ-12       | Phase 9 | Pending  |
| CQ-13       | Phase 9 | Pending  |
| CQ-14       | Phase 9 | Pending  |
| CQ-15       | Phase 9 | Pending  |
| CQ-16       | Phase 9 | Pending  |
| CQ-17       | Phase 9 | Pending  |
| CQ-18       | Phase 9 | Pending  |
| CQ-19       | Phase 9 | Pending  |
| CQ-20       | Phase 9 | Pending  |
| CQ-21       | Phase 9 | Pending  |
| CQ-22       | Phase 9 | Pending  |
| CQ-23       | Phase 9 | Pending  |
| CQ-24       | Phase 9 | Pending  |
| CQ-25       | Phase 9 | Pending  |
| CQ-26       | Phase 9 | Pending  |

**Coverage:**

- v1.1 requirements: 14 total
- Mapped to phases: 14
- Unmapped: 0

- Phase 9 (code quality): 26 total
- Mapped to plans: 26
- Unmapped: 0

---

_Requirements defined: 2026-03-15 (v1.0), 2026-03-16 (v1.1)_
_Phase 9 requirements added: 2026-03-23_
