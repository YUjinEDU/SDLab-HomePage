# Architecture Research

**Domain:** 연구실 홈페이지 실적 구조 개편 — Project/Publication/Patent linking + visibility control + permissions
**Researched:** 2026-03-15
**Confidence:** HIGH (based on direct codebase inspection)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  ROUTING LAYER  (public)/(internal)/(professor) route groups        │
│  ┌───────────────┐  ┌─────────────────┐  ┌───────────────────────┐  │
│  │ /[locale]/    │  │ /internal/      │  │ /professor/           │  │
│  │ projects/[s]  │  │ (authenticated) │  │ projects/, pubs/, etc │  │
│  └──────┬────────┘  └────────┬────────┘  └──────────┬────────────┘  │
├─────────┴───────────────────┴──────────────────────┴───────────────┤
│  PERMISSIONS LAYER  lib/permissions/                                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  requireRole(supabase, roles[])  isPubliclyVisible(row)      │   │
│  │  getSessionOrRedirect()          assertRole(supabase, roles) │   │
│  └──────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│  QUERY LAYER  lib/queries/   (reads, Server Components only)        │
│  ┌───────────┐  ┌──────────────┐  ┌───────────────────────────┐    │
│  │projects.ts│  │publications  │  │ getProjectOutputs(slug)   │    │
│  │ +is_public│  │ +is_public   │  │ getPublicationWithProject │    │
│  └───────────┘  └──────────────┘  └───────────────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│  ACTIONS LAYER  actions/   (writes, Server Actions)                 │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  assertRole() at entry point of every write action            │   │
│  │  RPC-wrapped join table updates (transactional)               │   │
│  └──────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│  DATA LAYER  Supabase PostgreSQL + RLS                              │
│  publications  projects  patents(type='patent')  sw_registrations  │
│  publication_projects (join)   is_public on all content tables      │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component                                | Responsibility                                                            | Location                            |
| ---------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------- |
| `lib/permissions/index.ts`               | Central role-check utilities for actions and layouts                      | `frontend/src/lib/permissions/`     |
| `lib/queries/projects.ts`                | Add `is_public` filter, add `getProjectOutputs(slug)` for related content | `frontend/src/lib/queries/`         |
| `lib/queries/publications.ts`            | Add `is_public` filter, add `getPublicationWithProject(slug)`             | `frontend/src/lib/queries/`         |
| `ProjectOutputsSection`                  | UI component: tabs showing Publications/Patents/SW linked to a project    | `frontend/src/components/projects/` |
| `ProjectBacklink`                        | UI component: small card linking pub/patent detail back to its project    | `frontend/src/components/projects/` |
| Migration `004_add_is_public.sql`        | Adds `is_public BOOLEAN NOT NULL DEFAULT TRUE` to content tables          | `frontend/supabase/migrations/`     |
| Migration `005_add_sw_registrations.sql` | New `sw_registrations` table OR extend existing publications table        | `frontend/supabase/migrations/`     |

## DB Schema Changes

### What Already Exists (no change needed)

`publication_projects` join table already exists with `(publication_id, project_id)` PK. This is the correct many-to-many structure. Publications already carry `projectIds` in the TypeScript type and query layer. **No new join table is needed for the project → publication link.**

### Migration 004: `is_public` column

```sql
-- 004_add_is_public.sql
ALTER TABLE publications  ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE projects      ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT TRUE;

-- Update RLS: public SELECT policies now filter by is_public
DROP POLICY "Public read publications" ON publications;
CREATE POLICY "Public read publications" ON publications
  FOR SELECT USING (is_public = TRUE OR is_admin_or_professor());

DROP POLICY "Public read projects" ON projects;
CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (is_public = TRUE OR is_admin_or_professor());

-- Indexes for filtered queries
CREATE INDEX idx_publications_is_public ON publications(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_projects_is_public ON projects(is_public) WHERE is_public = TRUE;
```

**Why RLS, not just query-layer filtering:** Defense in depth. If a query accidentally omits the `.eq('is_public', true)` filter, the anon key still cannot retrieve private rows. The `is_admin_or_professor()` function already exists in the schema.

### Migration 005: SW Registrations

SW 등록 실적(`sw_registrations`)은 현재 Projects 탭에 표시 중. 두 가지 옵션:

**Option A (recommended): New table `sw_registrations`**

```sql
CREATE TABLE sw_registrations (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  registration_number TEXT,
  registered_date TEXT,
  authors TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE sw_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sw_registrations" ON sw_registrations
  FOR SELECT USING (is_public = TRUE OR is_admin_or_professor());
CREATE POLICY "Admin/Prof manage sw_registrations" ON sw_registrations
  FOR ALL USING (is_admin_or_professor());
```

SW는 publications와 달리 journal/conference 메타데이터가 없고, project와 1:1에 가깝기 때문에 별도 테이블이 더 명확하다. `project_id` FK로 단순 참조 (join table 불필요).

**Option B: Extend `publications` with `type='sw'`**

이미 `publication_type` ENUM이 있어 `sw` 값 추가가 가능하지만, SW 등록에만 필요한 `registration_number` 같은 필드를 publications에 추가하면 schema가 오염된다. 비추천.

## Query Layer Patterns

### Pattern 1: `getProjectOutputs(slug)` — 과제 결과물 일괄 조회

Project 상세 페이지에서 연결된 논문·특허·SW를 한 번에 로드한다.

```typescript
// lib/queries/projects.ts (추가)
export type ProjectOutputs = {
  publications: Publication[];
  patents: Publication[];
  swRegistrations: SwRegistration[];
};

export async function getProjectOutputs(
  projectId: string,
): Promise<ProjectOutputs> {
  const supabase = await createClient();

  // Single query: publications linked via publication_projects join
  const { data: pubRows } = await supabase
    .from("publications")
    .select(`${PUB_SELECT}`)
    .eq("type", "not.patent") // publications only
    .eq("is_public", true) // visibility filter AT QUERY LAYER
    .filter(
      "id",
      "in",
      `(SELECT publication_id FROM publication_projects WHERE project_id = '${projectId}')`,
    );

  // Better: use Supabase nested select to avoid raw SQL injection risk
  const { data: linkedPubs } = await supabase
    .from("publication_projects")
    .select(
      "publication_id, publications!inner(*,publication_authors(member_id,author_order),publication_research_areas(research_area_id),publication_projects(project_id))",
    )
    .eq("project_id", projectId);

  // ... map and return typed results
}
```

**Practical pattern (avoids N+1):** Use Supabase's `!inner` join syntax to fetch linked publications in a single round-trip from the join table side.

```typescript
// Cleaner approach: query from join table with embedded full records
const { data } = await supabase
  .from("publication_projects")
  .select(
    `
    publications!inner(
      *,
      publication_authors(member_id, author_order),
      publication_research_areas(research_area_id),
      publication_projects(project_id)
    )
  `,
  )
  .eq("project_id", projectId);
// Result: data[].publications is a fully-joined Publication row
```

### Pattern 2: `getPublicationWithProject(slug)` — 역참조

Publication/Patent 상세에서 연계 과제 링크를 표시한다. `projectIds` 는 이미 `Publication` 타입에 존재하므로, 별도 query 함수가 아니라 기존 `getPublicationBySlug` 반환값의 `projectIds`를 이용해 project 요약 정보를 추가 조회하면 된다.

```typescript
// page.tsx (Server Component) — 두 번의 query지만 slug 조회 이후라 순차적으로 허용
const pub = await getPublicationBySlug(slug);
const linkedProjects = pub?.projectIds?.length
  ? await getProjectSummariesByIds(pub.projectIds) // 신규 함수: id[] → Project[]
  : [];
```

`getProjectSummariesByIds(ids: string[])` 는 `projects.select('id,slug,title,status').in('id', ids)` 로 구현. 가볍고 충분하다.

### Pattern 3: `is_public` filtering

**Rule:** 모든 public 페이지 query 함수는 `.eq('is_public', true)` 를 명시적으로 포함해야 한다. Internal/Professor 포털 query는 필터 없이 전체 조회.

```typescript
// lib/queries/publications.ts — 기존 함수에 필터 추가
export async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select(PUB_SELECT)
    .neq("type", "patent")
    .eq("is_public", true) // 추가
    .order("year", { ascending: false });
  // ...
}

// lib/queries/publications-internal.ts — internal용은 필터 없음
export async function getAllPublicationsForAdmin(): Promise<Publication[]> {
  const supabase = await createClient();
  // no is_public filter — admins see everything
  // RLS의 is_admin_or_professor() 체크가 백업 역할
}
```

**두 함수를 분리하는 이유:** 같은 함수에 `showPrivate?: boolean` 옵션을 넣으면 호출 시 실수로 `showPrivate=true`가 public 페이지에 흘러들어갈 위험이 있다. 분리된 함수는 인터페이스 자체가 의도를 강제한다.

## Permissions Utility Pattern

### `lib/permissions/index.ts` 설계

현재 `lib/permissions/` 디렉터리가 완전히 비어 있다. Server Actions와 layout에서 각자 인라인으로 역할 확인을 하는 구조.

**권장 구현:**

```typescript
// lib/permissions/index.ts
import { createClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";

type Role = "member" | "professor" | "admin";

/**
 * Server Action용: 호출자 역할 확인.
 * 권한 없으면 { error: "Unauthorized" } 반환.
 * Action의 맨 첫 줄에서 호출.
 */
export async function assertRole(
  allowedRoles: Role[],
): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !allowedRoles.includes(profile.role as Role)) {
    return { error: "Forbidden" };
  }
  return { userId: user.id };
}

/**
 * Layout용: 세션 없거나 역할 부족하면 redirect.
 * layout.tsx에서 await requireRole([...]) 로 호출.
 */
export async function requireRole(
  allowedRoles: Role[],
): Promise<{ userId: string }> {
  const result = await assertRole(allowedRoles);
  if ("error" in result) redirect("/login");
  return result;
}

/**
 * 콘텐츠 가시성 체크: is_public이 false인 항목을
 * public 페이지에서 렌더링해도 되는지 확인 (방어 코드).
 */
export function assertPubliclyVisible(
  item: { isPublic: boolean },
  fallbackRedirect = "/",
) {
  if (!item.isPublic) redirect(fallbackRedirect);
}
```

**Server Action에서의 사용 패턴:**

```typescript
// actions/publications.ts
export async function createPublication(formData: FormData) {
  const auth = await assertRole(["professor", "admin"]);
  if ("error" in auth) return auth; // { error: "Forbidden" }

  // ... 나머지 로직
}
```

**Layout에서의 사용 패턴:**

```typescript
// app/(professor)/layout.tsx
import { requireRole } from "@/lib/permissions";

export default async function ProfessorLayout({ children }) {
  await requireRole(["professor", "admin"]);   // redirects if not authorized
  return <>{children}</>;
}
```

## Component Boundaries

### `ProjectOutputsSection` (신규)

```
components/projects/
├── ProjectCard.tsx          (기존)
├── ProjectFilters.tsx       (기존)
├── ProjectGrid.tsx          (기존)
├── ProjectOutputsSection.tsx   (신규 — project 상세용)
└── ProjectBacklink.tsx         (신규 — pub/patent 상세용)
```

`ProjectOutputsSection` props:

```typescript
type ProjectOutputsSectionProps = {
  publications: Publication[];
  patents: Publication[];
  swRegistrations: SwRegistration[];
};
```

탭 구조: [논문 (N)] [특허 (N)] [SW 등록 (N)]. 각 탭은 기존 `PublicationCard` / `PatentCard` 컴포넌트를 재사용.

`ProjectBacklink` props:

```typescript
type ProjectBacklinkProps = {
  projects: { id: string; slug: string; title: string; status: string }[];
};
```

pub/patent 상세 페이지 하단에 "관련 과제" 섹션으로 렌더링. 링크 카드 형태.

### Page/Client Split (기존 패턴 유지)

```
app/(public)/[locale]/projects/[slug]/
├── page.tsx           ← Server Component: getProjectBySlug + getProjectOutputs
└── (no PageClient)    ← 인터랙션이 탭 전환뿐이므로 탭 상태만 client-side
```

탭 전환을 위한 최소 Client Component:

```typescript
// components/projects/ProjectOutputsTabs.tsx ("use client")
// 탭 선택 상태만 useState로 관리
// 실제 데이터는 모두 props로 server에서 전달
```

## Build Order Dependencies

```
1. Migration 004 (is_public columns)
   ↓
2. lib/permissions/index.ts 구현
   ↓ (병렬 가능)
   ├── 3a. Query functions 업데이트 (is_public 필터 + getProjectOutputs + getProjectSummariesByIds)
   │        ↓
   │   3b. TypeScript 타입 업데이트 (Project, Publication에 isPublic 필드 추가)
   │        ↓
   │   3c. ProjectOutputsSection + ProjectBacklink 컴포넌트
   │        ↓
   │   3d. Project 상세 page.tsx 업데이트 (ProjectOutputsSection 연결)
   │        ↓
   │   3e. Publication/Patent 상세 page.tsx 업데이트 (ProjectBacklink 연결)
   │
   └── 4a. Server Actions에 assertRole() 추가 (publications, projects, members, news)
            ↓
        4b. Professor portal 관리 폼에 is_public 토글 UI 추가

5. Migration 005 (sw_registrations) — 교수님 피드백 후 위치 확정되면 진행
```

**Migration 004는 모든 작업의 전제조건.** `is_public` 컬럼 없이 query 함수를 먼저 수정하면 빌드 오류 발생. DB 마이그레이션을 Phase 1 첫 번째 태스크로 배치해야 한다.

**permissions 유틸은 actions보다 먼저.** actions에서 import하므로 `lib/permissions/index.ts` 가 존재해야 actions 수정이 가능하다.

## Anti-Patterns

### Anti-Pattern 1: `is_public` 필터를 UI 레이어에서만 처리

**What people do:** Server Component에서 모든 데이터를 fetch하고, 렌더링 시 `{publications.filter(p => p.isPublic).map(...)}` 로 숨김.

**Why it's wrong:** 비공개 데이터가 이미 네트워크를 타고 클라이언트로 전달됨. Next.js Server Component라도 hydration payload에 포함될 수 있음. RLS 없이 anon key 노출 시 완전히 무방비.

**Do this instead:** Query 함수에서 `.eq('is_public', true)` 필터 + RLS 정책 업데이트. 데이터는 DB에서 이미 걸러져서 나와야 한다.

### Anti-Pattern 2: join table 업데이트를 세 개의 독립 Supabase 호출로 처리

**What people do:** (현재 코드가 이 패턴) `delete join rows → insert join rows` 를 두 번의 별도 호출로.

**Why it's wrong:** CONCERNS.md에 이미 기록됨 — re-insert 실패 시 join rows가 영구 삭제됨. 논문-과제 링크 소실.

**Do this instead:** Supabase RPC (PostgreSQL 함수)로 트랜잭션 래핑. 또는 `upsert` + 남은 레코드만 개별 delete하는 패턴 (delete-all보다 안전).

```sql
-- Supabase function: replace_publication_projects(pub_id, new_project_ids[])
CREATE OR REPLACE FUNCTION replace_publication_projects(
  p_pub_id TEXT,
  p_project_ids TEXT[]
) RETURNS void AS $$
BEGIN
  DELETE FROM publication_projects WHERE publication_id = p_pub_id;
  INSERT INTO publication_projects (publication_id, project_id)
  SELECT p_pub_id, unnest(p_project_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Anti-Pattern 3: `requireRole` 를 Server Action에서 사용

**What people do:** Action에서 `await requireRole(...)` 호출 — 권한 없으면 `redirect()` 실행.

**Why it's wrong:** Server Action에서 `redirect()` 는 호출 클라이언트가 fetch로 action을 직접 호출할 경우 `NEXT_REDIRECT` 예외가 누출되어 500 오류로 보임. Action은 응답 값을 반환해야 한다.

**Do this instead:** Layout/page에서는 `requireRole()` (redirect), Action에서는 `assertRole()` (return error object) 를 구분해서 사용.

### Anti-Pattern 4: 역참조 쿼리를 project 상세 페이지에서 별도 `useEffect`로 처리

**What people do:** Project 상세를 Client Component로 만들고, 관련 publications를 `useEffect + fetch`로 클라이언트에서 조회.

**Why it's wrong:** 이 프로젝트의 아키텍처 원칙에 위배됨 — 읽기는 Server Component에서. SEO 손실, 초기 로딩 시 콘텐츠 누락.

**Do this instead:** `page.tsx`(Server Component)에서 `getProjectBySlug` + `getProjectOutputs`를 병렬 `Promise.all`로 실행 후 props 전달.

## Integration Points

### Internal Boundaries

| Boundary                                                  | Communication                  | Notes                                                                                                            |
| --------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `lib/permissions` → `actions/`                            | Direct import of `assertRole`  | permissions가 먼저 구현되어야 함                                                                                 |
| `lib/permissions` → `app/*/layout.tsx`                    | Direct import of `requireRole` | 기존 inline 세션 체크를 대체                                                                                     |
| `lib/queries/projects.ts` → `lib/queries/publications.ts` | 없음 (독립)                    | `getProjectOutputs`는 projects.ts에 위치, publications query를 내부에서 호출하지 않음 — join table에서 직접 조회 |
| `publication_projects` join table                         | 이미 존재, 양방향 조회 가능    | 추가 마이그레이션 불필요                                                                                         |

### External Services

| Service      | Integration Pattern                      | Notes                                     |
| ------------ | ---------------------------------------- | ----------------------------------------- |
| Supabase RLS | `is_admin_or_professor()` 함수 이미 존재 | `is_public` 정책 추가 시 기존 함수 재사용 |
| Supabase RPC | 트랜잭션 join table 업데이트용           | migration 파일에 함수 정의 추가           |

## Sources

- 직접 코드 분석: `frontend/supabase/migrations/001_initial_schema.sql` — 실제 스키마 확인
- 직접 코드 분석: `frontend/src/lib/queries/projects.ts`, `publications.ts` — 기존 query 패턴
- 직접 코드 분석: `frontend/src/actions/publications.ts` — join table 업데이트 패턴 (안티패턴 확인)
- `.planning/codebase/CONCERNS.md` — 기존 기술 부채 목록
- `.planning/codebase/ARCHITECTURE.md` — 기존 아키텍처 레이어 구조
- Supabase Docs: Nested selects with `!inner` join syntax (MEDIUM confidence — based on known Supabase PostgREST patterns)

---

_Architecture research for: SD Lab Homepage — 실적 구조 개편_
_Researched: 2026-03-15_
