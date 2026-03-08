# homepage-mvp Planning Document

> **Summary**: 스마트데이터연구실 공개 포털 MVP - 6개 핵심 페이지 구현
>
> **Project**: SD Lab Homepage
> **Version**: 0.1.0
> **Author**: Claude Code
> **Date**: 2026-03-08
> **Status**: Draft

---

## Executive Summary

| Perspective            | Content                                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Problem**            | 스마트데이터연구실에 공식 웹사이트가 없어, 연구실의 정체성과 성과를 외부에 효과적으로 전달할 수단이 부재하다.                                                    |
| **Solution**           | Next.js App Router + Supabase 기반의 공개 포털 MVP를 구현하여 홈, Members, Research, Publications, Projects, Contact 6개 핵심 페이지를 제공한다.                 |
| **Function/UX Effect** | 방문자가 5초 안에 연구실의 정체성을 이해하고, 연구 분야/성과/구성원 정보를 카드 기반 UI로 탐색할 수 있다. 페이지 간 자연스러운 연결로 정보 흐름이 끊기지 않는다. |
| **Core Value**         | 연구실의 공식 얼굴을 만들어 대외 신뢰를 형성하고, 교수님이 즉시 확인할 수 있는 시안을 제공한다. 이후 내부 포털 확장의 기반이 된다.                               |

---

## 1. Overview

### 1.1 Purpose

스마트데이터연구실(충남대학교 컴퓨터융합학부)의 공식 공개 포털을 구축한다. 연구실 소개, 구성원 프로필, 연구 분야, 논문/프로젝트 이력, 연락처를 외부에 효과적으로 전달하는 것이 목표이다.

### 1.2 Background

- 스마트데이터연구실은 1996년 창설 이후 석사 60명, 박사 19명을 배출한 연구실이다.
- 현재 공식 웹사이트가 없어 연구 성과와 정보를 체계적으로 전달하기 어렵다.
- 교수님이 바로 확인할 수 있는 공개 홈페이지 시안이 최우선 결과물이다.
- 이후 내부 포털(로그인, GPU 모니터링, 캘린더 등)으로 확장할 계획이다.

### 1.3 Related Documents

- docs/09 공개 포털 MVP 및 연결 전략.md
- docs/02 사이트 구조 및 페이지 설계.md
- docs/08 UI UX 가이드.md
- docs/06 Next.js 폴더 구조 및 App Router 설계.md
- docs/10 연구실 기본 정보 정리.md
- docs/11 코딩 에이전트 작업 지시서.md

---

## 2. Scope

### 2.1 In Scope

- [x] 공통 레이아웃 (SiteHeader, MainNavigation, Footer)
- [ ] `/` 홈 페이지 (Hero, Research Areas, Featured Publications, Featured Projects, Members Snapshot, Latest News, Contact)
- [ ] `/members` 멤버 페이지 (그룹 탭, 프로필 상세, 카드 목록)
- [ ] `/research` 연구 분야 페이지 (3대 연구 분야 카드, 상세 설명, 관련 콘텐츠 연결)
- [ ] `/publications` 논문 페이지 (필터, 통계, 카드 목록, 상세 페이지)
- [ ] `/projects` 프로젝트 페이지 (카테고리 필터, 카드 그리드, 상세 페이지)
- [ ] `/contact` 연락처 페이지 (위치, 지도, 이메일, 연락처)
- [ ] 공통 UI 컴포넌트 (SearchInput, FilterBar, Pagination, EmptyState, 카드/배지 계열)
- [ ] 반응형 디자인 (모바일 1열, 태블릿 2열, 데스크톱 3열)
- [ ] 그린 브랜딩 디자인 시스템 적용

### 2.2 Out of Scope

- `/board` 게시판 (2차 확장)
- `/live-demo` 데모 페이지 (2차 확장)
- 로그인/인증 기능 (`(auth)` 라우트 그룹)
- 내부 포털 (`(internal)` 라우트 그룹)
- 교수님 전용 도구 (`(professor)` 라우트 그룹)
- Supabase DB 연동 (MVP는 정적 데이터/JSON으로 시작)
- 검색엔진 최적화 (SEO 메타태그 기본만)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID    | Requirement                                                      | Priority | Status  |
| ----- | ---------------------------------------------------------------- | -------- | ------- |
| FR-01 | 홈 Hero 섹션: 연구실명, 한 줄 소개, 키워드, CTA 표시             | High     | Pending |
| FR-02 | 홈 Research Areas 섹션: 3대 연구 분야 카드 표시                  | High     | Pending |
| FR-03 | 홈 Featured 섹션: 대표 논문, 프로젝트, 멤버 미리보기             | High     | Pending |
| FR-04 | 홈 Latest News 섹션: 최근 소식 표시                              | Medium   | Pending |
| FR-05 | Members 그룹별 탭 (Professor, Ph.D, M.S., Undergraduate, Alumni) | High     | Pending |
| FR-06 | Members 상세 프로필 (학력, 경력, 키워드, 링크, 논문 연결)        | High     | Pending |
| FR-07 | Research 분야별 카드 + 상세 설명 + 관련 콘텐츠 연결              | High     | Pending |
| FR-08 | Publications 필터 (연도, 타입, venue, 연구분야, 저자)            | High     | Pending |
| FR-09 | Publications 상세 (초록, BibTeX, 관련 프로젝트/멤버)             | Medium   | Pending |
| FR-10 | Projects 카테고리/상태 필터 + 카드 그리드                        | High     | Pending |
| FR-11 | Projects 상세 (개요, 기간, 기관, 멤버, 논문, 데모)               | Medium   | Pending |
| FR-12 | Contact 정보 표시 (위치, 지도, 이메일, 전화)                     | High     | Pending |
| FR-13 | 페이지 간 연결 (멤버->논문, 프로젝트->논문, 연구분야->멤버 등)   | High     | Pending |
| FR-14 | 공통 검색/필터/페이지네이션 패턴                                 | Medium   | Pending |
| FR-15 | 빈 상태, 오류 상태, 검색 결과 없음 상태                          | Medium   | Pending |

### 3.2 Non-Functional Requirements

| Category           | Criteria                                   | Measurement Method |
| ------------------ | ------------------------------------------ | ------------------ |
| Performance        | First Contentful Paint < 1.5s              | Lighthouse         |
| Performance        | Largest Contentful Paint < 2.5s            | Lighthouse         |
| Responsiveness     | 모바일(360px)~데스크톱(1920px) 지원        | 수동 검증          |
| Accessibility      | 시맨틱 HTML, alt 텍스트, 키보드 네비게이션 | Lighthouse         |
| SEO                | 기본 메타태그, Open Graph 태그             | 수동 검증          |
| Design Consistency | 모든 페이지 동일 카드/필터/검색 패턴       | 수동 검증          |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 6개 페이지 모두 구현 (/, /members, /research, /publications, /projects, /contact)
- [ ] 공통 레이아웃 (Header, Navigation, Footer) 적용
- [ ] 반응형 디자인 모바일/태블릿/데스크톱 확인
- [ ] 그린 브랜딩 디자인 토큰 적용
- [ ] 페이지 간 연결 동작 확인
- [ ] 빈 상태/오류 상태 구현 확인
- [ ] `pnpm build` 성공

### 4.2 Quality Criteria

- [ ] Zero TypeScript 에러
- [ ] Zero ESLint 에러
- [ ] Lighthouse Performance 80+
- [ ] 모든 페이지 모바일 뷰 확인

---

## 5. Risks and Mitigation

| Risk                                         | Impact | Likelihood | Mitigation                                               |
| -------------------------------------------- | ------ | ---------- | -------------------------------------------------------- |
| 실제 콘텐츠 부족 (논문/프로젝트 데이터 없음) | Medium | High       | 정적 샘플 데이터로 시작, 추후 Supabase 연동              |
| 멤버 정보 부족 (교수님만 상세, 학생 없음)    | Medium | High       | 교수님 프로필 먼저 구현, 나머지는 placeholder            |
| 디자인 일관성 유지 어려움                    | Medium | Medium     | 공통 컴포넌트(카드, 필터, 배지) 먼저 구현 후 페이지 조합 |
| 페이지 간 연결 복잡도                        | Low    | Medium     | 1차는 단방향 링크, 2차에서 양방향 완성                   |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level          | Characteristics             | Recommended For                  | Selected |
| -------------- | --------------------------- | -------------------------------- | :------: |
| **Starter**    | Simple structure            | Static sites, portfolios         |          |
| **Dynamic**    | Feature-based modules, BaaS | Web apps with backend, fullstack |    x     |
| **Enterprise** | Strict layer separation, DI | High-traffic, complex systems    |          |

### 6.2 Key Architectural Decisions

| Decision         | Options                         | Selected                          | Rationale                        |
| ---------------- | ------------------------------- | --------------------------------- | -------------------------------- |
| Framework        | Next.js / React / Vue           | Next.js 16 (App Router)           | SSR/SSG 지원, 기획 문서 기준     |
| Styling          | Tailwind / CSS Modules / styled | Tailwind CSS v4                   | 빠른 프로토타이핑, 유틸리티 우선 |
| Backend          | Supabase / bkend.ai / Custom    | Supabase                          | PostgreSQL + Auth + Storage 통합 |
| Data (MVP)       | DB 연동 / 정적 JSON             | 정적 JSON → Supabase 마이그레이션 | MVP 속도 우선                    |
| State Management | Context / Zustand / None        | Server Components 기본            | MVP에서 클라이언트 상태 최소화   |
| Testing          | Vitest / Playwright             | Vitest + Playwright (2차)         | MVP 이후 추가                    |

### 6.3 Clean Architecture Approach

```
Selected Level: Dynamic

Folder Structure (확정):
frontend/src/
  app/
    (public)/     -> 공개 포털 6개 페이지
    (auth)/       -> 로그인/계정 (Out of Scope)
    (internal)/   -> 내부 포털 (Out of Scope)
    (professor)/  -> 교수 전용 (Out of Scope)
  components/
    layout/       -> SiteHeader, Footer
    navigation/   -> MainNavigation, MobileDrawer
    shared/       -> SearchInput, FilterBar, Pagination, EmptyState, 카드/배지
    {domain}/     -> home/, members/, research/, publications/, projects/, contact/
  lib/
    db/           -> Supabase 클라이언트
    queries/      -> 페이지별 데이터 조회
    constants/    -> 컬러 토큰, 설정값
    utils/        -> 공통 헬퍼
  types/          -> 타입 정의
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists
- [ ] ESLint configuration (`.eslintrc.*`) - Next.js 기본 설정 존재
- [ ] Prettier configuration (`.prettierrc`)
- [x] TypeScript configuration (`tsconfig.json`)

### 7.2 Conventions to Define/Verify

| Category                  | Current State       | To Define                               | Priority |
| ------------------------- | ------------------- | --------------------------------------- | :------: |
| **Naming**                | CLAUDE.md에 정의됨  | PascalCase 컴포넌트, camelCase 유틸     |   High   |
| **Folder structure**      | docs/06에 정의됨    | 도메인별 components/ 분리               |   High   |
| **Import order**          | missing             | React > Next > lib > components > types |  Medium  |
| **Environment variables** | .env.local 존재     | NEXT*PUBLIC_SUPABASE*\*                 |  Medium  |
| **Error handling**        | docs/08에 원칙 정의 | EmptyState, ErrorState 컴포넌트화       |  Medium  |

### 7.3 Environment Variables Needed

| Variable                        | Purpose               | Scope  | To Be Created |
| ------------------------------- | --------------------- | ------ | :-----------: |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase 프로젝트 URL | Client |  x (생성됨)   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키      | Client |  x (생성됨)   |

---

## 8. Implementation Strategy

### 8.1 Data Strategy (MVP)

MVP에서는 Supabase DB 연동 대신 **정적 데이터 파일**을 사용한다.

```
frontend/src/
  data/
    members.ts      -> 교수님 + 샘플 멤버 데이터
    research.ts     -> 3대 연구 분야 데이터
    publications.ts -> 샘플 논문 데이터
    projects.ts     -> 샘플 프로젝트 데이터
    news.ts         -> 샘플 뉴스 데이터
    contact.ts      -> 연락처/위치 데이터
```

이점:

- Supabase 설정 없이 바로 UI 개발 가능
- 교수님 확인 후 실제 데이터로 교체 용이
- `data/` → `lib/queries/` 전환 시 컴포넌트 변경 최소화

### 8.2 Implementation Order

| Phase | Task                          | Components                                                                       | Dependencies |
| ----- | ----------------------------- | -------------------------------------------------------------------------------- | ------------ |
| 1     | 공통 레이아웃 + 디자인 시스템 | SiteHeader, MainNavigation, Footer, Container                                    | 없음         |
| 2     | 공통 UI 컴포넌트              | SearchInput, FilterBar, Pagination, EmptyState, 카드/배지                        | Phase 1      |
| 3     | 홈 페이지                     | HomeHero, ResearchAreas, Featured\*, MembersSnapshot, LatestNews, ContactSummary | Phase 1, 2   |
| 4     | Members 페이지                | MemberGroupTabs, MemberCard, MemberProfile                                       | Phase 1, 2   |
| 5     | Research 페이지               | ResearchAreaCard, ResearchDetail, RelatedContent                                 | Phase 1, 2   |
| 6     | Publications 페이지           | PublicationCard, Filters, Detail, BibTeX                                         | Phase 1, 2   |
| 7     | Projects 페이지               | ProjectCard, CategoryFilter, Detail                                              | Phase 1, 2   |
| 8     | Contact 페이지                | LocationMap, ContactInfo, Directions                                             | Phase 1      |
| 9     | 통합 & 페이지 간 연결         | 크로스 페이지 링크, 브레드크럼                                                   | Phase 3-8    |

---

## 9. Next Steps

1. [ ] Design 문서 작성 (`/pdca design homepage-mvp`)
2. [ ] 공통 레이아웃 + 디자인 시스템 구현
3. [ ] 페이지별 순차 구현
4. [ ] Gap Analysis (`/pdca analyze homepage-mvp`)

---

## Version History

| Version | Date       | Changes                                  | Author      |
| ------- | ---------- | ---------------------------------------- | ----------- |
| 0.1     | 2026-03-08 | Initial draft - 기획 문서 11개 기반 작성 | Claude Code |
