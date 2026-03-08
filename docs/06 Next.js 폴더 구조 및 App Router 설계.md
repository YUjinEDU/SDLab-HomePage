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

## 최상위 구조

추천:

- `app/`
- `components/`
- `lib/`
- `actions/`
- `types/`
- `prisma/` 또는 `supabase/`
- `public/`
- `content/` 또는 `data/`

## `app/` 구조

```text
app/
  (public)/
    layout.tsx
    page.tsx
    members/
      page.tsx
    research/
      page.tsx
    publications/
      page.tsx
      [slug]/
        page.tsx
    projects/
      page.tsx
      [slug]/
        page.tsx
    board/
      page.tsx
      [slug]/
        page.tsx
    live-demo/
      page.tsx
      [slug]/
        page.tsx
    contact/
      page.tsx
  (auth)/
    login/
      page.tsx
    account/
      page.tsx
  (internal)/
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
  (professor)/
    professor/
      page.tsx
      lecture/
        page.tsx
  api/
    auth/
    gpu/
    calendar/
    demos/
```

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
  layout/
  navigation/
  shared/
  home/
  members/
  research/
  publications/
  projects/
  board/
  demos/
  contact/
  auth/
  internal/
  professor/
```

원칙:

- 페이지 도메인 기준으로 묶는다.
- 완전히 공통인 것은 `shared/`에 둔다.
- 내부 포털 전용 UI는 `internal/`
- 교수님 전용 도구 UI는 `professor/`

## `lib/` 구조

추천:

- `lib/auth/`
- `lib/db/`
- `lib/permissions/`
- `lib/queries/`
- `lib/utils/`
- `lib/constants/`

역할:

- `auth`: 세션 조회, 로그인 유틸
- `db`: DB 클라이언트
- `permissions`: 역할 검사, 접근 제어
- `queries`: 페이지별 데이터 조회 함수
- `utils`: 공통 헬퍼

## `actions/` 구조

추천:

- `actions/auth/`
- `actions/board/`
- `actions/resources/`
- `actions/professor/`

원칙:

- 쓰기 작업은 server action 또는 API route 중 하나로 일관되게 관리
- 초기에는 읽기 중심이므로 action은 최소화

## 데이터 접근 원칙

- 목록 페이지는 `lib/queries/`에서 읽기 함수로 관리
- 권한 체크가 필요한 데이터는 페이지 진입 전에 서버에서 검사
- 클라이언트 컴포넌트는 UI 상호작용에만 집중

예시:

- `lib/queries/publications.ts`
- `lib/queries/projects.ts`
- `lib/queries/internal-dashboard.ts`
- `lib/permissions/require-role.ts`

인증 상세는 [[07 인증 및 계정관리 설계]]에서 분리 관리한다.

## 레이아웃 구조

### 공개 레이아웃

- `SiteHeader`
- `MainNavigation`
- `Footer`

### 내부 레이아웃

- `InternalSidebar`
- `InternalTopbar`
- `RoleAwareMenu`

### 교수님 레이아웃

- `ProfessorSidebar`
- `ProfessorTopbar`

## 구현 우선순위

1. `(public)` 먼저 구현
2. `components/shared/`와 `components/layout/` 확정
3. `(auth)` 추가
4. `(internal)` 추가
5. `(professor)` 추가

## 코딩 에이전트에게 줄 때 중요한 기준

- 새 페이지는 먼저 `app/`에 라우트 생성
- 그다음 도메인별 `components/`에 UI 배치
- 데이터 읽기는 `lib/queries/`
- 권한 검사는 `lib/permissions/`
- 쓰기 작업은 `actions/` 또는 `api/`로 분리

이 기준만 지켜도 구조가 쉽게 무너지지 않는다.
