# SD Lab Homepage

## Project Overview

대학교 연구실(SD Lab) 공식 홈페이지. 공개 포털 + 내부 포털 구조.
코드는 `frontend/` 디렉토리에 위치. 기획 문서는 `docs/`에 위치.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## Project Structure

```
frontend/src/
  app/
    (public)/     # 공개 포털 (/, /members, /research, /publications, /projects, /contact)
    (auth)/       # 로그인, 계정 관리
    (internal)/   # 내부 포털 (member 이상)
    (professor)/  # 교수님 전용 (professor, admin만)
    api/          # API routes
  components/
    layout/       # SiteHeader, Footer, InternalSidebar 등
    navigation/   # MainNavigation, RoleAwareMenu
    shared/       # 공통 UI (카드, 필터, 검색, 배지)
    {domain}/     # 도메인별 컴포넌트 (members/, research/ 등)
  lib/
    auth/         # 세션 조회, 로그인 유틸
    db/           # Supabase 클라이언트 (client, server, middleware)
    permissions/  # 역할 검사, 접근 제어
    queries/      # 페이지별 데이터 조회 함수
    utils/        # 공통 헬퍼
    constants/    # 색상 토큰, 설정값
  actions/        # Server Actions (auth/, board/, resources/, professor/)
  types/          # TypeScript 타입 정의
```

## Development Rules

### Package Manager

- **pnpm 사용** (npm, yarn 금지)

### Coding Conventions

- `type` 사용 (`interface` 지양)
- `enum` 금지 → string literal union 사용
- Server Components 기본, 필요시에만 `"use client"`
- 한국어 콘텐츠, 코드/변수명은 영어
- 데이터 읽기는 `lib/queries/`, 쓰기는 `actions/`로 분리

### Styling

- Tailwind CSS utility-first (v4 @theme inline 사용)
- 밝은 배경(#FAFAF8) + 차분한 포레스트 그린(#2D6A4F) 포인트
- 카드형 정보 구조, 반응형 필수 (모바일 우선)
- 다크 테마 지원 안 함 (밝은 테마만)

### File Naming

- 컴포넌트: PascalCase (`MemberCard.tsx`)
- 유틸/훅: camelCase (`useMembers.ts`)
- 라우트 파일: `page.tsx`, `layout.tsx`, `loading.tsx`

### UI Principles

- 과장된 스타트업 스타일 금지 — 학술적이고 차분한 톤
- 검색/필터 패턴을 페이지마다 일관되게 유지
- 빈 상태, 오류 상태, 검색 결과 없음 상태 항상 포함
- 한 화면에 CTA 최대 2개

### Content

- 실제 연구실 정보는 `docs/10 연구실 기본 정보 정리.md` 우선 참조
- 정보 없는 섹션은 억지로 채우지 않음

### Auth & Permissions

- 공개 회원가입 없음 — 관리자 발급 방식
- 역할: member, professor, admin
- 권한 검사는 `lib/permissions/`에서 서버 사이드로 처리

## Planning Documents

구현 전 반드시 참고:

1. `docs/11 코딩 에이전트 작업 지시서.md` (최우선)
2. `docs/09 공개 포털 MVP 및 연결 전략.md`
3. `docs/02 사이트 구조 및 페이지 설계.md`
4. `docs/08 UI UX 가이드.md`
5. `docs/06 Next.js 폴더 구조 및 App Router 설계.md`
6. `docs/10 연구실 기본 정보 정리.md`

## Implementation Priority

1. (public) 공개 포털 먼저
2. components/shared/ + components/layout/ 확정
3. (auth) 추가
4. (internal) 추가
5. (professor) 추가
