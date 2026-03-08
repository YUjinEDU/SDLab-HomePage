---
type: project
tags:
  - lab-website
  - nextjs
  - app-router
created: 2026-03-08
---

# Next.js 폴더 구조 및 App Router 설계

상위 문서: [[홈페이지 계획]]

관련 문서:

- [[07 인증 및 계정관리 설계]]

이 문서의 역할:

- 코딩 에이전트가 프로젝트 파일 구조를 일관되게 만들도록 기준을 주는 구현 문서

목적:

- 코딩 에이전트가 바로 구현에 들어갈 수 있도록 파일 배치 기준을 고정한다.
- 공개 사이트, 내부 포털, 교수님 전용 영역을 route group으로 분리한다.
- 공통 컴포넌트와 도메인 컴포넌트의 경계를 명확히 한다.

## 구현 상태

- **Phase 1 완료**: `(public)` 공개 포털 전체 구현 완료. 아래 폴더 트리는 실제 구현된 구조를 반영한다.
- **Phase 2 예정**: `(auth)`, `api/`, Supabase 연동, `lib/queries/` 데이터 조회
- **Phase 3 예정**: `(internal)` 내부 포털
- **Phase 4 예정**: `(professor)` 교수님 전용 영역
- **MVP 데이터 접근**: Phase 1에서는 `data/*.ts` 정적 데이터를 직접 import하여 사용. Phase 2에서 `lib/queries/*.ts` → Supabase 조회로 전환 예정.

## 최상위 구조

실제 구현 (`frontend/src/` 기준):

- `app/` — 라우트 및 페이지
- `components/` — UI 컴포넌트 (layout, navigation, shared, 도메인별)
- `data/` — 정적 데이터 (MVP용, Phase 2에서 `lib/queries/`로 전환 예정)
- `types/` — TypeScript 타입 정의
- `lib/` — 유틸리티, 상수, DB/Auth/권한 (Phase 2+)
- `actions/` — Server Actions (Phase 2+)
- `public/` — 정적 에셋

## `app/` 구조

```text
app/
  globals.css                      # Tailwind @theme, emerald design system
  layout.tsx                       # Root layout

  (public)/
    layout.tsx                     # PublicLayout: SiteHeader + SiteFooter
    page.tsx                       # Home — 8개 섹션 구성
    error.tsx                      # 전역 에러 핸들러
    loading.tsx                    # 전역 로딩 스켈레톤
    not-found.tsx                  # 404 페이지
    members/
      page.tsx                     # 교수 프로필 페이지
      students/
        page.tsx                   # 학생 목록 + GroupTabs
      [slug]/
        page.tsx                   # 멤버 상세 + cross-links
    research/
      page.tsx                     # 3개 연구 분야 카드
    publications/
      page.tsx                     # 필터/검색/페이지네이션
      loading.tsx                  # 카드 리스트 스켈레톤
      [slug]/
        page.tsx                   # 논문 상세 + cross-links
    projects/
      page.tsx                     # 카테고리/상태 필터 + 그리드
      loading.tsx                  # 카드 그리드 스켈레톤
      [slug]/
        page.tsx                   # 프로젝트 상세 + cross-links
    patents/
      page.tsx                     # 필터/검색/페이지네이션
      [slug]/
        page.tsx                   # 특허 상세 + cross-links
    contact/
      page.tsx                     # 위치 + 지도 + 교통편

  (auth)/                          # Phase 2 예정
    login/
      page.tsx
    account/
      page.tsx

  (internal)/                      # Phase 3 예정
    internal/
      page.tsx
      calendar/
        page.tsx
      gpu/
        page.tsx
      resources/
        page.tsx
      projects/
        page.tsx

  (professor)/                     # Phase 4 예정
    professor/
      page.tsx
      lecture/
        page.tsx

  api/                             # Phase 2+ 예정
    auth/
    gpu/
    calendar/
    demos/
```

주요 변경 사항 (계획 대비):

- `members/` 라우트 분리: `/members`(교수 프로필), `/members/students`(학생 목록), `/members/[slug]`(개인 상세)
- `patents/` 라우트 신규 추가 (계획에 없었으나 MVP에 포함)
- `board/`, `live-demo/` 라우트는 Phase 2+로 이동
- 각 도메인에 `[slug]` 상세 페이지 구현 완료
- `error.tsx`, `loading.tsx`, `not-found.tsx` 전역 에러/로딩 처리 추가

## route group 원칙

### `(public)`

- 공개 홈페이지 전용
- 공통 공개 레이아웃 사용
- SEO와 정적 렌더링 우선

### `(auth)`

- 로그인 / 계정 관리
- 인증 관련 최소 UI만 제공

### `(internal)`

- `member` 이상만 접근
- 내부 사이드바 레이아웃 사용

### `(professor)`

- `professor`, `admin`만 접근
- 내부 포털과 분리된 보호 레이아웃 사용

## `components/` 구조

```text
components/
  layout/                          # 페이지 뼈대
    SiteHeader.tsx                 # 로고 + 네비게이션
    SiteFooter.tsx                 # 연구실 정보 + 빠른 링크 + 저작권
    Container.tsx                  # max-w-7xl 래퍼
  navigation/                      # 네비게이션 전용 (layout/과 분리)
    MainNavigation.tsx             # 데스크톱 GNB — 개별 드롭다운, Members 서브링크
    MobileNavigationDrawer.tsx     # 모바일 아코디언 메뉴 + Members 서브링크
  shared/                          # 공통 UI (14개)
    SearchInput.tsx                # 검색 입력 (client)
    FilterBar.tsx                  # 필터 드롭다운 (client)
    FilterChips.tsx                # 선택된 필터 칩 (client)
    Pagination.tsx                 # 페이지네이션 (client)
    EmptyState.tsx                 # 빈 상태 + SVG
    SectionHeader.tsx              # 섹션 제목 + "더보기" 링크
    PageHero.tsx                   # 페이지 타이틀 영역
    TagBadge.tsx                   # 키워드/태그 배지
    StatusBadge.tsx                # 상태 배지 (active/completed)
    CategoryBadge.tsx              # 카테고리 배지
    StatCard.tsx                   # 숫자 하이라이트 카드
    ExternalLinkButton.tsx         # 외부 링크 버튼
    CopyButton.tsx                 # 클립보드 복사 (client)
  home/                            # 홈 섹션 (10개)
    HomeHeroSection.tsx
    NetworkBackground.tsx          # 애니메이션 배경 (client)
    LabIntroSection.tsx
    ResearchAreasSection.tsx
    StatsBarSection.tsx            # 존재하나 홈에서 미사용
    FeaturedPublicationsSection.tsx
    FeaturedProjectsSection.tsx
    MembersSnapshotSection.tsx
    LatestNewsSection.tsx
    ContactSummarySection.tsx
  members/                         # 멤버 도메인 (7개)
    ProfessorProfile.tsx
    MemberCard.tsx
    MemberGrid.tsx
    MemberGroupTabs.tsx            # client — 탭 전환
    MemberEducationTimeline.tsx
    MemberCareerTimeline.tsx
    MemberContactLinks.tsx
  research/                        # 연구 도메인 (2개)
    ResearchAreaDetailCard.tsx
    RelatedContentPreview.tsx
  publications/                    # 논문 도메인 (6개)
    PublicationCard.tsx
    PublicationList.tsx
    PublicationFilters.tsx         # client
    PublicationStatsPanel.tsx
    PublicationExternalLinks.tsx
    BibtexCopyButton.tsx           # client
  projects/                        # 프로젝트 도메인 (3개)
    ProjectCard.tsx
    ProjectGrid.tsx
    ProjectFilters.tsx             # client
  patents/                         # 특허 도메인 (1개)
    PatentCard.tsx
  contact/                         # 연락처 도메인 (3개)
    ContactInfoCard.tsx
    MapSection.tsx
    DirectionsSection.tsx
  auth/                            # Phase 2 예정
  internal/                        # Phase 3 예정
  professor/                       # Phase 4 예정
```

원칙:

- 페이지 도메인 기준으로 묶는다.
- 완전히 공통인 것은 `shared/`에 둔다.
- `layout/`은 페이지 뼈대(Header, Footer, Container), `navigation/`은 네비게이션 전용으로 분리한다.
- 상태 관리가 필요한 컴포넌트만 `"use client"` 사용 (검색, 필터, 탭 등).
- 내부 포털 전용 UI는 `internal/` (Phase 3)
- 교수님 전용 도구 UI는 `professor/` (Phase 4)

## `data/` 구조 (MVP 전용)

Phase 1에서는 Supabase 연동 없이 정적 데이터 파일로 운영한다. Phase 2에서 `lib/queries/`로 전환 예정.

```text
data/
  members.ts                       # Member[] — 6명
  research-areas.ts                # ResearchArea[] — 3개 분야
  publications.ts                  # Publication[] — 6편
  patents.ts                       # Publication[] type="patent" — 3건
  projects.ts                      # Project[] — 4개
  news.ts                          # NewsItem[] — 4개
  contact.ts                       # ContactInfo
  stats.ts                         # labStats, groupLabels, groupLabelsShort
```

## `types/` 구조

```text
types/
  index.ts                         # barrel export
  member.ts                        # Member, MemberGroup
  research.ts                      # ResearchArea
  publication.ts                   # Publication, PublicationType
  project.ts                       # Project, ProjectStatus
  news.ts                          # NewsItem, BoardCategory
  contact.ts                       # ContactInfo
```

## `lib/` 구조

현재 구현:

- `lib/constants/colors.ts` — 색상 토큰

Phase 2+ 예정:

- `lib/auth/` — 세션 조회, 로그인 유틸
- `lib/db/` — Supabase 클라이언트 (client, server, middleware)
- `lib/permissions/` — 역할 검사, 접근 제어
- `lib/queries/` — 페이지별 데이터 조회 함수 (현재 `data/*.ts` → 전환 대상)
- `lib/utils/` — 공통 헬퍼

## `actions/` 구조 (Phase 2+ 예정)

Phase 1은 읽기 전용이므로 action 미구현. Phase 2에서 아래 구조로 추가 예정:

- `actions/auth/`
- `actions/board/`
- `actions/resources/`
- `actions/professor/`

원칙:

- 쓰기 작업은 server action 또는 API route 중 하나로 일관되게 관리
- 초기에는 읽기 중심이므로 action은 최소화

## 데이터 접근 원칙

### Phase 1 (현재 — 정적 데이터)

- 페이지에서 `data/*.ts`를 직접 import하여 사용
- Server Component에서 데이터를 읽고 Client Component에 props로 전달
- 클라이언트 컴포넌트는 UI 상호작용에만 집중 (검색, 필터, 탭 전환 등)

### Phase 2 (예정 — Supabase 연동)

- 목록 페이지는 `lib/queries/`에서 읽기 함수로 관리
- 권한 체크가 필요한 데이터는 페이지 진입 전에 서버에서 검사
- `data/*.ts` import를 `lib/queries/*.ts` 호출로 전환

예시 (Phase 2):

- `lib/queries/publications.ts`
- `lib/queries/projects.ts`
- `lib/queries/internal-dashboard.ts`
- `lib/permissions/require-role.ts`

인증 상세는 [[07 인증 및 계정관리 설계]]에서 분리 관리한다.

## 레이아웃 구조

### 공개 레이아웃 (구현 완료)

- `SiteHeader` (`components/layout/`) — 로고 + 네비게이션 통합
- `MainNavigation` (`components/navigation/`) — 데스크톱 GNB
- `MobileNavigationDrawer` (`components/navigation/`) — 모바일 메뉴
- `SiteFooter` (`components/layout/`) — 연구실 정보 + 링크

### 내부 레이아웃 (Phase 3 예정)

- `InternalSidebar`
- `InternalTopbar`
- `RoleAwareMenu`

### 교수님 레이아웃 (Phase 4 예정)

- `ProfessorSidebar`
- `ProfessorTopbar`

## 구현 우선순위

1. ~~`(public)` 먼저 구현~~ — 완료
2. ~~`components/shared/`와 `components/layout/` 확정~~ — 완료 (shared 14개, layout 3개, navigation 2개)
3. `(auth)` 추가 — Phase 2
4. `(internal)` 추가 — Phase 3
5. `(professor)` 추가 — Phase 4

## 코딩 에이전트에게 줄 때 중요한 기준

- 새 페이지는 먼저 `app/`에 라우트 생성
- 그다음 도메인별 `components/`에 UI 배치
- 데이터 읽기는 `data/*.ts` (Phase 1) → `lib/queries/` (Phase 2)
- 권한 검사는 `lib/permissions/`
- 쓰기 작업은 `actions/` 또는 `api/`로 분리
- 타입 정의는 `types/`에 도메인별 파일로 관리

이 기준만 지켜도 구조가 쉽게 무너지지 않는다.
