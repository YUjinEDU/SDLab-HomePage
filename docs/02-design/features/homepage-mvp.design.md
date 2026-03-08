# homepage-mvp Design Document

> **Summary**: 스마트데이터연구실 공개 포털 MVP - 6개 페이지 + 공통 컴포넌트 상세 설계
>
> **Project**: SD Lab Homepage
> **Version**: 0.2.0
> **Author**: Claude Code
> **Date**: 2026-03-08
> **Status**: Implemented
> **Planning Doc**: [homepage-mvp.plan.md](../../01-plan/features/homepage-mvp.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 기획 문서 11개를 코드로 변환할 수 있는 구체적 설계 제공
- 공통 컴포넌트를 먼저 확정하여 페이지별 조합만으로 빠르게 구현
- 정적 데이터(data/)로 시작하되, Supabase 전환이 쉬운 구조 설계
- 그린 브랜딩 디자인 시스템을 Tailwind CSS v4 테마로 구현

### 1.2 Design Principles

- **컴포넌트 재사용**: 카드, 필터, 배지, 검색은 공통 컴포넌트로 통일
- **Server Components 우선**: 데이터 조회는 서버에서, 상호작용만 클라이언트
- **점진적 확장**: 정적 데이터 -> Supabase -> 내부 포털 순서로 확장 가능한 구조
- **정보 위계 명확화**: 모든 페이지에서 "이게 뭔지 → 뭘 할 수 있는지 → 핵심 정보 → 탐색" 순서 유지

---

## 2. Architecture

### 2.1 Component Diagram

```
┌──────────────────────────────────────────────────────────┐
│  Browser                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Next.js App (Server Components + Client Islands)  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │  │
│  │  │ (public) │ │  (auth)  │ │   (internal)     │   │  │
│  │  │ 6 pages  │ │ Out/Scope│ │   Out/Scope      │   │  │
│  │  └────┬─────┘ └──────────┘ └──────────────────┘   │  │
│  │       │                                             │  │
│  │  ┌────▼─────────────────────────────────────────┐  │  │
│  │  │  components/ (shared + domain-specific)       │  │  │
│  │  └────┬─────────────────────────────────────────┘  │  │
│  │       │                                             │  │
│  │  ┌────▼──────┐  ┌──────────┐  ┌───────────────┐   │  │
│  │  │  data/    │  │  lib/    │  │  types/        │   │  │
│  │  │ (static)  │  │ (utils)  │  │ (TypeScript)   │   │  │
│  │  └───────────┘  └──────────┘  └───────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow (MVP)

```
Static Data (data/*.ts)
  → Server Component (page.tsx)
    → Section Components (HomeHeroSection, etc.)
      → Shared UI Components (Card, Badge, etc.)
        → Rendered HTML
```

### 2.3 Dependencies

| Component          | Depends On                    | Purpose          |
| ------------------ | ----------------------------- | ---------------- |
| Page Components    | data/, components/            | 페이지 조합      |
| Section Components | shared components, data types | 섹션별 UI        |
| Shared Components  | types/, lib/constants         | 재사용 UI 단위   |
| data/              | types/                        | 정적 데이터 정의 |

---

## 3. Data Model

### 3.1 Core Types

```typescript
// types/member.ts
type MemberGroup = "professor" | "phd" | "ms" | "undergraduate" | "alumni";

type Member = {
  id: string;
  slug: string;
  nameKo: string;
  nameEn: string;
  group: MemberGroup;
  position: string;
  department: string;
  image: string | null;
  email: string | null;
  links: {
    github?: string;
    scholar?: string;
    homepage?: string;
    orcid?: string;
    dblp?: string;
  };
  researchKeywords: string[];
  bio: string | null;
  education: {
    degree: string;
    institution: string;
    field: string;
    year: string;
  }[];
  career: { period: string; role: string; organization: string }[];
  displayOrder: number;
};

// types/research.ts
type ResearchArea = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string | null;
  keywords: string[];
  applications: string[];
  displayOrder: number;
};

// types/publication.ts
type Publication = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  authorMemberIds: string[];
  type: PublicationType;
  venue: string;
  year: number;
  month: number | null;
  doi: string | null;
  pdfUrl: string | null;
  abstract: string | null;
  keywords: string[];
  bibtex: string | null;
  researchAreaIds: string[];
  projectIds: string[];
  isFeatured: boolean;
};

// types/project.ts
type Project = {
  id: string;
  slug: string;
  title: string;
  status: ProjectStatus;
  category: string;
  shortDescription: string;
  fullDescription: string | null;
  organization: string;
  programType: string | null;
  budget: string | null;
  startDate: string;
  endDate: string | null;
  thumbnail: string | null;
  tags: string[];
  memberIds: string[];
  publicationIds: string[];
  researchAreaIds: string[];
  demoUrl: string | null;
  isFeatured: boolean;
};

// types/news.ts
type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: BoardCategory;
  date: string;
  isPinned: boolean;
  relatedProjectIds: string[];
  relatedPublicationIds: string[];
};

// types/contact.ts
type ContactInfo = {
  labName: { ko: string; en: string };
  professor: { name: string; title: string; email: string };
  location: {
    building: string;
    professorOffice: string;
    lab: string;
    professorPhone: string;
    labPhone: string;
  };
  department: string;
  university: string;
  address: string;
  mapEmbedUrl: string | null;
};
```

### 3.2 Entity Relationships

```
[Member] N ──── N [Publication] (via authorMemberIds)
   │
   └── N ──── N [Project] (via memberIds)

[ResearchArea] 1 ──── N [Publication] (via researchAreaIds)
      │
      └── 1 ──── N [Project] (via researchAreaIds)

[Project] N ──── N [Publication] (via publicationIds)

[NewsItem] ──── [Project] (via relatedProjectIds)
     └──── [Publication] (via relatedPublicationIds)
```

### 3.3 Static Data Files

```
frontend/src/data/
  members.ts        -> Member[] (교수님 실제 데이터 + 샘플 2~3명)
  research-areas.ts -> ResearchArea[] (3대 분야)
  publications.ts   -> Publication[] (샘플 5~6편)
  projects.ts       -> Project[] (샘플 3~4개)
  news.ts           -> NewsItem[] (샘플 3~4개)
  contact.ts        -> ContactInfo (실제 데이터)
  stats.ts          -> labStats (연구실 통계), groupLabels/groupLabelsShort (그룹명 매핑)
```

---

## 4. UI/UX Design

### 4.1 Design System Tokens

#### Colors (Tailwind @theme inline)

| Token                | Value     | Usage                                |
| -------------------- | --------- | ------------------------------------ |
| `primary`            | `#059669` | 에메랄드 그린 - CTA, 활성 메뉴, 강조 |
| `primary-foreground` | `#FFFFFF` | 그린 배경 위 텍스트                  |
| `primary-muted`      | `#ecfdf5` | 연한 그린 틴트 - 카드 배경, 태그     |
| `accent`             | `#10b981` | 에메랄드 - 보조 강조, 호버           |
| `background`         | `#ffffff` | 화이트 전체 배경                     |
| `surface`            | `#f9fafb` | 카드, 패널 배경                      |
| `border`             | `#e5e7eb` | 그레이 경계선                        |
| `foreground`         | `#111827` | 다크 그레이 본문                     |
| `text-secondary`     | `#4b5563` | 그레이 보조 텍스트                   |
| `dark-bg`            | `#022c22` | 다크 그린 배경 (푸터 등)             |
| `hero-bg`            | `#f3f4f6` | 히어로 섹션 배경                     |

#### Typography

| Element            | Size                | Weight   | Color          |
| ------------------ | ------------------- | -------- | -------------- |
| Page Title (H1)    | text-3xl / text-4xl | bold     | foreground     |
| Section Title (H2) | text-2xl            | semibold | foreground     |
| Card Title (H3)    | text-lg             | semibold | foreground     |
| Body               | text-base           | normal   | foreground     |
| Caption            | text-sm             | normal   | text-secondary |
| Badge              | text-xs             | medium   | varies         |

#### Spacing & Radius

| Element             | Value              |
| ------------------- | ------------------ |
| Section gap         | py-16 (64px)       |
| Card padding        | p-6 (24px)         |
| Card radius         | rounded-xl (12px)  |
| Badge radius        | rounded-full       |
| Button radius       | rounded-lg (8px)   |
| Container max-width | max-w-7xl (1280px) |

### 4.2 Global Layout

```
┌─────────────────────────────────────────────────┐
│  SiteHeader                                      │
│  ┌─────────────────────────────────────────────┐│
│  │ Logo    Nav(Home Members Research ... )  CTA ││
│  └─────────────────────────────────────────────┘│
├─────────────────────────────────────────────────┤
│                                                  │
│  <Container max-w-7xl mx-auto px-4>             │
│    {Page Content}                                │
│  </Container>                                    │
│                                                  │
├─────────────────────────────────────────────────┤
│  SiteFooter                                      │
│  ┌─────────────────────────────────────────────┐│
│  │ Lab Info   Quick Links   Contact   Copyright ││
│  └─────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

#### Mobile (< 768px)

```
┌─────────────────────┐
│ Logo    ☰ (Hamburger)│
├─────────────────────┤
│ {Page Content}       │
│ 1 column grid        │
├─────────────────────┤
│ Footer (stacked)     │
└─────────────────────┘
```

### 4.3 Page Designs

#### Home `/`

```
┌─────────────────────────────────────────────────┐
│ [HomeHeroSection + NetworkBackground]             │
│  연구실명 (h1)                                    │
│  한 줄 소개                                       │
│  키워드 배지 x 5                                  │
│  [연구 분야 보기] [연락하기]                        │
├─────────────────────────────────────────────────┤
│ [LabIntroSection] - 연구실 소개 텍스트             │
├─────────────────────────────────────────────────┤
│ [ResearchAreasSection] - 3 cards (1x3 grid)      │
│  ┌──────┐ ┌──────┐ ┌──────┐                     │
│  │ icon │ │ icon │ │ icon │                     │
│  │title │ │title │ │title │                     │
│  │desc  │ │desc  │ │desc  │                     │
│  └──────┘ └──────┘ └──────┘                     │
├─────────────────────────────────────────────────┤
│ [FeaturedPublicationsSection] - 3 cards           │
├─────────────────────────────────────────────────┤
│ [FeaturedProjectsSection] - 3 cards               │
├─────────────────────────────────────────────────┤
│ [MembersSnapshotSection] - 교수님 + 핵심 멤버      │
├─────────────────────────────────────────────────┤
│ [LatestNewsSection] - 3~4 list items              │
├─────────────────────────────────────────────────┤
│ [ContactSummarySection] - 위치 + 이메일 + 연락처   │
└─────────────────────────────────────────────────┘

Note: StatsBarSection 컴포넌트는 존재하지만 현재 홈 페이지에서는 사용되지 않음.
```

#### Members (Professor) `/members`

```
┌─────────────────────────────────────────────────┐
│ [PageHero] 지도교수                               │
├─────────────────────────────────────────────────┤
│ [Professor Section] - full-width profile         │
│  ┌──────────────────────────────────────────┐   │
│  │ 사진 | 이름, 직위, 소속                    │   │
│  │      | 연구 키워드 배지                    │   │
│  │      | 이메일, 링크 아이콘                 │   │
│  │      | 학력 타임라인                       │   │
│  │      | 주요 경력 타임라인                   │   │
│  │      | 주요 수상                           │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

#### Members (Students) `/members/students`

```
┌─────────────────────────────────────────────────┐
│ [PageHero] 연구실 구성원                          │
├─────────────────────────────────────────────────┤
│ [GroupTabs] Ph.D | M.S. | 석박통합 | UG | Alumni │
├─────────────────────────────────────────────────┤
│ [Member Grid] - 3 col cards                      │
│  ┌────┐ ┌────┐ ┌────┐                           │
│  │card│ │card│ │card│                           │
│  └────┘ └────┘ └────┘                           │
└─────────────────────────────────────────────────┘
```

#### Member Detail `/members/[slug]`

```
┌─────────────────────────────────────────────────┐
│ [MemberDetailPage]                               │
│  이름, 직위, 소속                                │
│  연구 키워드 배지                                │
│  bio, 학력, 경력                                 │
│  관련 논문 크로스 링크                             │
│  관련 프로젝트 크로스 링크                         │
└─────────────────────────────────────────────────┘
```

#### Research `/research`

```
┌─────────────────────────────────────────────────┐
│ [PageHero] Research Areas                        │
├─────────────────────────────────────────────────┤
│ [ResearchAreaGrid] - 3 large cards               │
│  ┌─────────────────────────────────────────┐    │
│  │ 아이콘 + 제목                             │    │
│  │ 상세 설명                                 │    │
│  │ 키워드 배지들                              │    │
│  │ 응용 분야                                 │    │
│  │ [관련 프로젝트] [관련 논문] [관련 멤버]      │    │
│  └─────────────────────────────────────────┘    │
│  (repeat x 3)                                    │
└─────────────────────────────────────────────────┘
```

#### Publications `/publications`

```
┌─────────────────────────────────────────────────┐
│ [PageHero] Publications                          │
│ [ExternalLinks] Scholar | DBLP | ORCID | Scopus  │
├─────────────────────────────────────────────────┤
│ [StatsPanel] 전체 N편 | Journal N | Conference N  │
├─────────────────────────────────────────────────┤
│ [SearchInput] 논문 제목, 저자, 키워드 검색         │
│ [FilterBar] 연도 | 타입 | venue | 연구분야         │
│ [FilterChips] 선택된 필터 표시 + 초기화            │
├─────────────────────────────────────────────────┤
│ [ResultCount] 검색 결과 N건                       │
│ [PublicationList] - card list                     │
│  ┌─────────────────────────────────────────┐    │
│  │ [타입배지] 제목                           │    │
│  │ 저자 목록 (멤버 링크)                     │    │
│  │ venue · 연도                              │    │
│  │ 키워드 배지들                              │    │
│  │ [PDF] [DOI] [BibTeX 복사]                 │    │
│  └─────────────────────────────────────────┘    │
├─────────────────────────────────────────────────┤
│ [Pagination]                                     │
└─────────────────────────────────────────────────┘
```

#### Projects `/projects`

```
┌─────────────────────────────────────────────────┐
│ [PageHero] Projects                              │
├─────────────────────────────────────────────────┤
│ [SearchInput]                                    │
│ [FilterBar] 카테고리 | 상태 | 연구분야             │
│ [ResultCount + SortDropdown]                     │
├─────────────────────────────────────────────────┤
│ [ProjectGrid] - 3 col cards                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ thumbnail│ │ thumbnail│ │ thumbnail│        │
│  │ [status] │ │ [status] │ │ [status] │        │
│  │ title    │ │ title    │ │ title    │        │
│  │ org·기간  │ │ org·기간  │ │ org·기간  │        │
│  │ tags     │ │ tags     │ │ tags     │        │
│  └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────┤
│ [Pagination]                                     │
└─────────────────────────────────────────────────┘
```

#### Contact `/contact`

```
┌─────────────────────────────────────────────────┐
│ [PageHero] Contact                               │
├─────────────────────────────────────────────────┤
│ [ContactGrid] 2 columns                         │
│  ┌──────────────────┐ ┌──────────────────┐      │
│  │ 연구실 정보        │ │ 지도교수 연구실   │      │
│  │ 실험실: 532호      │ │ 교수실: 516호     │      │
│  │ 전화: 821-7441    │ │ 전화: 821-5450   │      │
│  │ 이메일 링크        │ │                  │      │
│  └──────────────────┘ └──────────────────┘      │
├─────────────────────────────────────────────────┤
│ [MapSection] 지도 임베드 또는 이미지               │
├─────────────────────────────────────────────────┤
│ [DirectionsSection] 오시는 길                     │
└─────────────────────────────────────────────────┘
```

---

## 5. Component Specification

### 5.1 Layout Components

| Component                | File                                               | Props                  | Responsibility                                    |
| ------------------------ | -------------------------------------------------- | ---------------------- | ------------------------------------------------- |
| `SiteHeader`             | `components/layout/SiteHeader.tsx`                 | -                      | 로고 + 네비게이션 + 모바일 메뉴                   |
| `SiteFooter`             | `components/layout/SiteFooter.tsx`                 | -                      | 연구실 정보 + 퀵링크 + 저작권                     |
| `Container`              | `components/layout/Container.tsx`                  | `children, className?` | max-w-7xl 래퍼                                    |
| `MainNavigation`         | `components/navigation/MainNavigation.tsx`         | `currentPath`          | 데스크톱 GNB (mega menu + subLinks)               |
| `MobileNavigationDrawer` | `components/navigation/MobileNavigationDrawer.tsx` | `isOpen, onClose`      | 모바일 사이드 메뉴 (Professor/Students 분리 링크) |
| `PageHero`               | `components/shared/PageHero.tsx`                   | `title, description?`  | 페이지 상단 타이틀 영역                           |

### 5.2 Shared Components

| Component            | File                                       | Props                            | Responsibility                  |
| -------------------- | ------------------------------------------ | -------------------------------- | ------------------------------- |
| `SearchInput`        | `components/shared/SearchInput.tsx`        | `placeholder, value, onChange`   | 검색창 (client)                 |
| `FilterBar`          | `components/shared/FilterBar.tsx`          | `filters, selected, onChange`    | 필터 드롭다운 바 (client)       |
| `FilterChips`        | `components/shared/FilterChips.tsx`        | `chips, onRemove, onClear`       | 선택된 필터 칩 (client)         |
| `Pagination`         | `components/shared/Pagination.tsx`         | `total, page, perPage, onChange` | 페이지네이션 (client)           |
| `EmptyState`         | `components/shared/EmptyState.tsx`         | `title, description, action?`    | 빈 상태                         |
| `SectionHeader`      | `components/shared/SectionHeader.tsx`      | `title, description?, action?`   | 섹션 제목 + "더보기" 링크       |
| `TagBadge`           | `components/shared/TagBadge.tsx`           | `label, variant?`                | 키워드/태그 배지                |
| `StatusBadge`        | `components/shared/StatusBadge.tsx`        | `status`                         | 상태 배지 (active/completed 등) |
| `CategoryBadge`      | `components/shared/CategoryBadge.tsx`      | `category`                       | 카테고리 배지                   |
| `StatCard`           | `components/shared/StatCard.tsx`           | `value, label, icon?`            | 숫자 강조 카드                  |
| `ExternalLinkButton` | `components/shared/ExternalLinkButton.tsx` | `href, label, icon`              | 외부 링크 버튼                  |
| `CopyButton`         | `components/shared/CopyButton.tsx`         | `text, label`                    | 클립보드 복사 (client)          |

### 5.3 Domain Components

#### Home (`components/home/`)

| Component                     | Props                                  | Client? | Note                      |
| ----------------------------- | -------------------------------------- | ------- | ------------------------- |
| `HomeHeroSection`             | `labInfo, keywords, ctaLinks`          | No      | NetworkBackground 포함    |
| `NetworkBackground`           | -                                      | Yes     | 히어로 배경 애니메이션    |
| `LabIntroSection`             | -                                      | No      | 연구실 소개 텍스트        |
| `ResearchAreasSection`        | `areas: ResearchArea[]`                | No      |                           |
| `StatsBarSection`             | `stats: StatItem[]`                    | No      | 존재하나 홈 페이지 미사용 |
| `FeaturedPublicationsSection` | `publications: Publication[]`          | No      |                           |
| `FeaturedProjectsSection`     | `projects: Project[]`                  | No      |                           |
| `MembersSnapshotSection`      | `professor: Member, members: Member[]` | No      |                           |
| `LatestNewsSection`           | `news: NewsItem[]`                     | No      |                           |
| `ContactSummarySection`       | `contact: ContactInfo`                 | No      |                           |

#### Members (`components/members/`)

| Component                 | Props                           | Client? |
| ------------------------- | ------------------------------- | ------- |
| `MemberGroupTabs`         | `groups, activeGroup, onChange` | Yes     |
| `ProfessorProfile`        | `professor: Member`             | No      |
| `MemberCard`              | `member: Member`                | No      |
| `MemberGrid`              | `members: Member[]`             | No      |
| `MemberEducationTimeline` | `education`                     | No      |
| `MemberCareerTimeline`    | `career`                        | No      |
| `MemberContactLinks`      | `links, email`                  | No      |

#### Research (`components/research/`)

| Component                | Props                                | Client? |
| ------------------------ | ------------------------------------ | ------- |
| `ResearchAreaDetailCard` | `area: ResearchArea`                 | No      |
| `RelatedContentPreview`  | `projects?, publications?, members?` | No      |

#### Publications (`components/publications/`)

| Component                  | Props                        | Client? |
| -------------------------- | ---------------------------- | ------- |
| `PublicationCard`          | `publication: Publication`   | No      |
| `PublicationFilters`       | `filters, onChange`          | Yes     |
| `PublicationStatsPanel`    | `stats`                      | No      |
| `PublicationExternalLinks` | `links`                      | No      |
| `BibtexCopyButton`         | `bibtex: string`             | Yes     |
| `PublicationList`          | `publications, emptyMessage` | No      |

#### Projects (`components/projects/`)

| Component        | Props                    | Client? |
| ---------------- | ------------------------ | ------- |
| `ProjectCard`    | `project: Project`       | No      |
| `ProjectFilters` | `filters, onChange`      | Yes     |
| `ProjectGrid`    | `projects, emptyMessage` | No      |

#### Contact (`components/contact/`)

| Component           | Props               | Client? |
| ------------------- | ------------------- | ------- |
| `ContactInfoCard`   | `info: ContactInfo` | No      |
| `MapSection`        | `embedUrl`          | No      |
| `DirectionsSection` | `address`           | No      |

---

## 6. Page Route Structure

### 6.1 Route Files

```
frontend/src/app/
  (public)/
    layout.tsx          -> PublicLayout (SiteHeader + Footer)
    page.tsx            -> HomePage
    members/
      page.tsx          -> MembersPage (교수님 전용 프로필)
      students/
        page.tsx        -> StudentsPage (학생 목록 + GroupTabs)
      [slug]/
        page.tsx        -> MemberDetailPage (크로스 링크 포함)
    research/
      page.tsx          -> ResearchPage
    publications/
      page.tsx          -> PublicationsPage
      [slug]/
        page.tsx        -> PublicationDetailPage (크로스 링크 포함)
    projects/
      page.tsx          -> ProjectsPage
      [slug]/
        page.tsx        -> ProjectDetailPage (크로스 링크 포함)
    contact/
      page.tsx          -> ContactPage
```

### 6.2 Page Data Flow

| Page               | Data Source (MVP)                                                                                                                           | Server/Client                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Home               | `data/members.ts`, `data/research-areas.ts`, `data/publications.ts`, `data/projects.ts`, `data/news.ts`, `data/contact.ts`, `data/stats.ts` | Server                          |
| Members (Prof)     | `data/members.ts`                                                                                                                           | Server                          |
| Members (Students) | `data/members.ts`, `data/stats.ts`                                                                                                          | Server + Client (tab switching) |
| Member Detail      | `data/members.ts`, `data/publications.ts`, `data/projects.ts`                                                                               | Server (크로스 링크)            |
| Research           | `data/research-areas.ts`, `data/projects.ts`, `data/publications.ts`                                                                        | Server                          |
| Publications       | `data/publications.ts`                                                                                                                      | Server + Client (filter/search) |
| Publication Detail | `data/publications.ts`, `data/members.ts`, `data/projects.ts`                                                                               | Server (크로스 링크)            |
| Projects           | `data/projects.ts`                                                                                                                          | Server + Client (filter)        |
| Project Detail     | `data/projects.ts`, `data/members.ts`, `data/publications.ts`                                                                               | Server (크로스 링크)            |
| Contact            | `data/contact.ts`                                                                                                                           | Server                          |

---

## 7. Error Handling & State Screens

### 7.1 State Components

| State      | Component                         | Message Example                                              |
| ---------- | --------------------------------- | ------------------------------------------------------------ |
| Empty      | `EmptyState`                      | "아직 등록된 논문이 없습니다."                               |
| No Results | `EmptyState` variant              | "검색 결과가 없습니다. 필터를 줄이거나 검색어를 바꿔보세요." |
| Loading    | Skeleton (page.tsx `loading.tsx`) | Skeleton cards                                               |
| Error      | `error.tsx`                       | "데이터를 불러오지 못했습니다. 잠시 후 다시 시도하세요."     |
| 404        | `not-found.tsx`                   | "페이지를 찾을 수 없습니다."                                 |

### 7.2 Loading States

```
frontend/src/app/(public)/
  loading.tsx               -> 전체 페이지 스켈레톤
  publications/loading.tsx  -> 카드 목록 스켈레톤
  projects/loading.tsx      -> 카드 그리드 스켈레톤
```

---

## 8. Coding Convention Reference

### 8.1 This Feature's Conventions

| Item              | Convention Applied                                              |
| ----------------- | --------------------------------------------------------------- |
| Component naming  | PascalCase (`MemberCard.tsx`)                                   |
| File organization | 도메인별 `components/{domain}/`                                 |
| State management  | Server Components 기본, URL params for filter state             |
| Error handling    | `EmptyState` + `error.tsx` + `not-found.tsx`                    |
| Data access       | `data/*.ts` import (MVP) → `lib/queries/*.ts` (Supabase 전환시) |
| Styling           | Tailwind utility classes, @theme CSS variables                  |
| Client components | 최소 범위 - 필터/검색/탭/복사 버튼만                            |

### 8.2 Import Order

```typescript
// 1. React / Next.js
import Link from "next/link";

// 2. Internal absolute imports
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";

// 3. Data / Lib
import { members } from "@/data/members";

// 4. Types
import type { Member } from "@/types/member";
```

---

## 9. Implementation Guide

### 9.1 Phase 1: Foundation (공통 레이아웃 + 디자인 시스템)

```
Priority: CRITICAL
Estimated files: ~10

1. [x] types/ - 모든 타입 정의 (member, research, publication, project, news, contact)
2. [x] data/ - 정적 데이터 파일 7개 (실제 연구실 정보 기반, stats.ts 추가)
3. [x] components/layout/Container.tsx
4. [x] components/layout/SiteHeader.tsx
5. [x] components/navigation/MainNavigation.tsx (mega menu + subLinks)
6. [x] components/navigation/MobileNavigationDrawer.tsx (Professor/Students 분리)
7. [x] components/layout/SiteFooter.tsx
8. [x] app/(public)/layout.tsx - PublicLayout 조합
9. [x] components/shared/PageHero.tsx
10.[x] components/shared/SectionHeader.tsx
```

### 9.2 Phase 2: Shared UI Components

```
Priority: HIGH
Estimated files: ~12

1. [x] components/shared/TagBadge.tsx
2. [x] components/shared/StatusBadge.tsx
3. [x] components/shared/CategoryBadge.tsx
4. [x] components/shared/StatCard.tsx
5. [x] components/shared/SearchInput.tsx (client)
6. [x] components/shared/FilterBar.tsx (client)
7. [x] components/shared/FilterChips.tsx (client)
8. [x] components/shared/Pagination.tsx (client)
9. [x] components/shared/EmptyState.tsx
10.[x] components/shared/ExternalLinkButton.tsx
11.[x] components/shared/CopyButton.tsx (client)
12.[x] app/(public)/not-found.tsx
```

### 9.3 Phase 3: Home Page

```
Priority: HIGH
Estimated files: ~9

1. [x] components/home/HomeHeroSection.tsx (NetworkBackground 포함)
2. [x] components/home/LabIntroSection.tsx (신규 추가)
3. [x] components/home/ResearchAreasSection.tsx
4. [x] components/home/StatsBarSection.tsx (컴포넌트 존재, 홈 페이지 미사용)
5. [x] components/home/FeaturedPublicationsSection.tsx
6. [x] components/home/FeaturedProjectsSection.tsx
7. [x] components/home/MembersSnapshotSection.tsx
8. [x] components/home/LatestNewsSection.tsx
9. [x] components/home/ContactSummarySection.tsx
10.[x] app/(public)/page.tsx - 홈페이지 조합
```

### 9.4 Phase 4: Members Page

```
Priority: HIGH
Estimated files: ~8

1. [x] components/members/ProfessorProfile.tsx
2. [x] components/members/MemberCard.tsx
3. [x] components/members/MemberGrid.tsx
4. [x] components/members/MemberGroupTabs.tsx (client)
5. [x] components/members/MemberEducationTimeline.tsx
6. [x] components/members/MemberCareerTimeline.tsx
7. [x] components/members/MemberContactLinks.tsx
8. [x] app/(public)/members/page.tsx (교수님 전용)
9. [x] app/(public)/members/students/page.tsx (학생 목록 + GroupTabs, 신규)
10.[x] app/(public)/members/[slug]/page.tsx (상세 + 크로스 링크, 신규)
```

### 9.5 Phase 5: Research Page

```
Priority: HIGH
Estimated files: ~4

1. [x] components/research/ResearchAreaDetailCard.tsx
2. [x] components/research/RelatedContentPreview.tsx
3. [x] app/(public)/research/page.tsx
4. [x] (ResearchAreaCard는 home/에서 재사용)
```

### 9.6 Phase 6: Publications Page

```
Priority: HIGH
Estimated files: ~8

1. [x] components/publications/PublicationCard.tsx
2. [x] components/publications/PublicationList.tsx
3. [x] components/publications/PublicationFilters.tsx (client)
4. [x] components/publications/PublicationStatsPanel.tsx
5. [x] components/publications/PublicationExternalLinks.tsx
6. [x] components/publications/BibtexCopyButton.tsx (client)
7. [x] app/(public)/publications/page.tsx
8. [x] app/(public)/publications/[slug]/page.tsx (크로스 링크 포함)
```

### 9.7 Phase 7: Projects Page

```
Priority: HIGH
Estimated files: ~5

1. [x] components/projects/ProjectCard.tsx
2. [x] components/projects/ProjectGrid.tsx
3. [x] components/projects/ProjectFilters.tsx (client)
4. [x] app/(public)/projects/page.tsx
5. [x] app/(public)/projects/[slug]/page.tsx (크로스 링크 포함)
```

### 9.8 Phase 8: Contact Page

```
Priority: MEDIUM
Estimated files: ~4

1. [x] components/contact/ContactInfoCard.tsx
2. [x] components/contact/MapSection.tsx
3. [x] components/contact/DirectionsSection.tsx
4. [x] app/(public)/contact/page.tsx
```

### 9.9 Phase 9: Integration & Polish

```
Priority: MEDIUM
Estimated files: ~3

1. [x] 페이지 간 크로스 링크 확인 및 보완 (detail 페이지들에 크로스 링크 구현 완료)
2. [x] app/(public)/loading.tsx (전체 스켈레톤)
3. [x] 반응형 최종 확인 (모바일/태블릿/데스크톱)
```

### Total Estimated Files: ~63

---

## 10. Security Considerations

- [x] MVP는 공개 데이터만 제공 (인증 불필요)
- [x] 사용자 입력 없음 (검색은 클라이언트 필터링)
- [ ] 이후 Supabase 연동 시 RLS(Row Level Security) 적용 필요
- [ ] Contact 폼 추가 시 rate limiting 필요

---

## 11. Test Plan (Post-MVP)

### 11.1 MVP Test Scope

| Type       | Target               | Tool |
| ---------- | -------------------- | ---- |
| Build      | `pnpm build` 성공    | CI   |
| Visual     | 반응형 레이아웃 확인 | 수동 |
| Navigation | 페이지 간 링크 동작  | 수동 |
| States     | 빈 상태, 404 확인    | 수동 |

### 11.2 Post-MVP Test Cases

- [ ] E2E: 홈 → Members → 교수님 프로필 → 논문 링크 이동
- [ ] E2E: Publications 필터 → 카드 클릭 → 상세 → BibTeX 복사
- [ ] E2E: 모바일 메뉴 열기 → 페이지 이동 → 메뉴 닫힘

---

## Version History

| Version | Date       | Changes                                                                                                                                                                                                                                                                               | Author      |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 0.1     | 2026-03-08 | Initial draft - Plan 문서 + 기획 문서 기반 상세 설계                                                                                                                                                                                                                                  | Claude Code |
| 0.2     | 2026-03-08 | Updated to reflect actual implementation - members split (professor/students), detail pages ([slug] with cross-links), design tokens updated, data/stats.ts added, home page sections revised (LabIntroSection/NetworkBackground added, StatsBarSection unused), navigation mega menu | Claude Code |
