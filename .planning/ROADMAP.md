# Roadmap: SD Lab Homepage — 실적 구조 개편

## Milestones

- ✅ **v1.0 실적 구조 개편** - Phases 1-4 (shipped 2026-03-15)
- 🚧 **v1.1 실적 데이터 등록 및 표시 개선** - Phases 5-8 (in progress)

## Phases

<details>
<summary>✅ v1.0 실적 구조 개편 (Phases 1-4) - SHIPPED 2026-03-15</summary>

### Phase 1: Security Foundation

**Goal**: 모든 쓰기 작업이 역할 검사로 보호되고 DB에 is_public 컬럼과 RLS 정책이 존재한다
**Depends on**: Nothing (first phase)
**Requirements**: SEC-01, SEC-02, SEC-03, DB-01, DB-02, DB-03
**Success Criteria** (what must be TRUE):

1. `lib/permissions/index.ts`의 `assertRole()`을 Server Action 첫 줄에서 호출하면 미인가 역할 접근이 차단된다
2. `member` 역할 사용자가 professor/admin 전용 Server Action을 직접 호출하면 권한 오류가 반환된다
3. `publications`, `patents`, `projects` 테이블에 `is_public` 컬럼이 존재하고 기본값이 true다
4. Supabase anon 키로 직접 REST API를 호출해도 `is_public = false` 행이 반환되지 않는다
5. Next.js CVE-2025-29927 패치가 적용되어 `x-middleware-subrequest` 헤더로 미들웨어를 우회할 수 없다

**Plans**: 4 plans

Plans:

- [x] 01-01-PLAN.md — lib/permissions assertRole/requireRole (TDD)
- [x] 01-02-PLAN.md — Migration 004: is_public columns + RLS policies + RPC function
- [x] 01-03-PLAN.md — Apply assertRole to all professor/admin Server Actions + professor layout
- [x] 01-04-PLAN.md — CVE-2025-29927 middleware patch + human verification

### Phase 2: Content Visibility

**Goal**: 비로그인 방문자에게 is_public = false 콘텐츠가 노출되지 않고, 교수 포털에서 변경 시 즉시 반영된다
**Depends on**: Phase 1
**Requirements**: VIS-01, VIS-02
**Success Criteria** (what must be TRUE):

1. 로그인하지 않은 방문자가 논문/특허/과제 목록을 열면 `is_public = false` 항목이 보이지 않는다
2. 교수 포털에서 항목을 비공개로 변경한 직후 공개 페이지를 새로고침하면 해당 항목이 사라진다
3. 내부 포털에서는 is_public 여부와 관계없이 모든 항목이 표시된다

**Plans**: 3 plans

Plans:

- [x] 02-01-PLAN.md — VIS-01/VIS-02 test scaffold (TDD RED phase)
- [x] 02-02-PLAN.md — lib/queries is_public filter + unstable_cache; open /publications and /patents pages
- [x] 02-03-PLAN.md — actions revalidateTag cache invalidation

### Phase 3: Project–Output Linking

**Goal**: 방문자가 과제 상세 페이지에서 연결된 논문·특허를 확인하고, 논문·특허 상세에서 연계 과제로 이동할 수 있다
**Depends on**: Phase 2
**Requirements**: LINK-01, LINK-02, LINK-03, MOB-01, MOB-02
**Success Criteria** (what must be TRUE):

1. 과제 상세 페이지에 연결된 논문과 특허 카드가 섹션으로 표시된다
2. 논문/특허 상세 페이지에 "연계 과제" 링크가 표시되고 클릭하면 해당 과제 상세로 이동한다
3. 모바일(375px)에서 실적 카드 목록이 가로 넘침 없이 정상 렌더링된다

**Plans**: 3 plans

Plans:

- [x] 03-01-PLAN.md — getProjectOutputs query function (TDD)
- [x] 03-02-PLAN.md — Mobile overflow fixes: PublicationCard, PatentCard, ProjectCard
- [x] 03-03-PLAN.md — ProjectOutputsSection + ProjectBacklink components + page wiring + remove AccessDenied gate

### Phase 4: Professor Portal UX

**Goal**: 교수님이 코드 또는 DB 직접 접근 없이 포털에서 각 항목의 공개 여부를 관리할 수 있다
**Depends on**: Phase 3
**Requirements**: VIS-03
**Success Criteria** (what must be TRUE):

1. 교수 포털 논문/특허/과제 목록에 is_public 토글이 표시되고 클릭 한 번으로 전환된다
2. 토글 변경 후 공개 페이지에 즉시 반영된다 (캐시 무효화 연동)

**Plans**: 2 plans

Plans:

- [x] 04-01-PLAN.md — Type extension (isPublic) + getAllProjects + visibility Server Actions (TDD)
- [x] 04-02-PLAN.md — VisibilityToggleButton component + wire into professor publications/patents/projects pages

</details>

### 🚧 v1.1 실적 데이터 등록 및 표시 개선 (In Progress)

**Milestone Goal:** 연구실적 문서의 논문/특허 데이터를 구조화하여 DB에 등록하고, 홈페이지에서 인덱스·저자·수록정보 등을 체계적으로 표시한다

## Phase Details

### Phase 5: DB Schema

**Goal**: patents가 별도 테이블로 분리되고, publications 테이블이 인덱스·수록정보 컬럼을 갖춘다
**Depends on**: Phase 4
**Requirements**: SCHEMA-01, SCHEMA-02, SCHEMA-03, SCHEMA-04
**Success Criteria** (what must be TRUE):

1. `patents` 테이블이 독립적으로 존재하고 `id, title, inventors[], status, patent_number, date, is_public` 컬럼을 포함한다
2. `publications` 테이블에 `index_type` 컬럼이 존재하여 SCI/SCIE/SCOPUS/KCI/기타 값을 저장할 수 있다
3. `publications` 테이블에 `volume_info` 컬럼이 존재하여 권호·페이지 정보를 저장할 수 있다
4. 기존 `publications` 테이블의 `type='patent'` 데이터가 제거되어 publications 테이블에 논문 데이터만 남는다

**Plans**: 1 plan

Plans:

- [x] 05-01-PLAN.md — patents table + publications columns (index_type, volume_info) + patent data cleanup + TS types + query updates

### Phase 6: Data Pipeline

**Goal**: 실적 문서의 논문 데이터가 파싱되어 Supabase publications 테이블에 삽입된다
**Depends on**: Phase 5
**Requirements**: DATA-01, DATA-02
**Success Criteria** (what must be TRUE):

1. 실적 문서(md)에서 국제저널/국제학회/국내저널/국내학회 4개 섹션의 논문을 추출하는 스크립트가 실행 가능하다
2. 파싱 스크립트가 OCR 아티팩트(깨진 문자, 불규칙 공백)를 처리하고 구조화된 JSON을 출력한다
3. 시드 스크립트 실행 후 Supabase publications 테이블에 논문 데이터가 삽입되어 홈페이지 목록에 표시된다

**Plans**: 2 plans

Plans:

- [ ] 06-01-PLAN.md — 실적 문서 파싱 스크립트 (md -> JSON, 4개 카테고리)
- [ ] 06-02-PLAN.md — Supabase 시드 스크립트 (JSON -> publications INSERT)

### Phase 7: Publications UI

**Goal**: 방문자가 논문 목록에서 카테고리 탭으로 필터링하고, 각 논문의 인덱스·수록정보·저자를 확인할 수 있다
**Depends on**: Phase 6
**Requirements**: PUB-01, PUB-02, PUB-03, PUB-04, PUB-05
**Success Criteria** (what must be TRUE):

1. 논문 페이지에서 국제저널/국제학회/국내저널/국내학회 탭을 클릭하면 해당 카테고리 논문만 표시된다
2. SCI/SCIE/SCOPUS 인덱스가 있는 논문 카드에 해당 badge가 시각적으로 표시된다
3. 논문 카드 또는 상세 페이지에서 권호·페이지 정보(volume_info)가 별도 항목으로 표시된다
4. 논문 저자 전체 목록이 표시되고, 김영국 교수가 강조(bold 등) 처리된다
5. DOI 또는 PDF 링크가 있는 논문에 외부 링크 버튼이 표시된다

**Plans**: TBD

Plans:

- [ ] 07-01-PLAN.md — PublicationCard 개선 (index badge, volume_info, 저자 강조, DOI 링크)
- [ ] 07-02-PLAN.md — 논문 페이지 카테고리 탭 필터 + lib/queries 업데이트

### Phase 8: Patents UI

**Goal**: 방문자가 특허 목록에서 등록/출원을 구분하고, 각 특허의 번호·발명자·상태를 확인할 수 있다
**Depends on**: Phase 5
**Requirements**: PAT-01, PAT-02, PAT-03
**Success Criteria** (what must be TRUE):

1. 특허 페이지에서 등록/출원 탭을 클릭하면 해당 상태의 특허만 표시된다
2. 특허 카드에 특허번호, 발명자 목록, 등록/출원 상태 badge가 표시된다
3. 특허 상세 페이지가 존재하고 슬러그 기반 URL로 접근할 수 있다

**Plans**: TBD

Plans:

- [ ] 08-01-PLAN.md — PatentCard 컴포넌트 + patents 쿼리 함수 (새 테이블 기반)
- [ ] 08-02-PLAN.md — 특허 페이지 탭 필터 + 특허 상세 페이지

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
(Phase 8 can start after Phase 5; Phases 7 and 8 are independent after their dependencies)

| Phase                     | Milestone | Plans Complete | Status      | Completed  |
| ------------------------- | --------- | -------------- | ----------- | ---------- |
| 1. Security Foundation    | v1.0      | 4/4            | Complete    | 2026-03-15 |
| 2. Content Visibility     | v1.0      | 3/3            | Complete    | 2026-03-15 |
| 3. Project–Output Linking | v1.0      | 3/3            | Complete    | 2026-03-15 |
| 4. Professor Portal UX    | v1.0      | 2/2            | Complete    | 2026-03-15 |
| 5. DB Schema              | v1.1      | 1/1            | Complete    | 2026-03-15 |
| 6. Data Pipeline          | v1.1      | 0/2            | Not started | -          |
| 7. Publications UI        | v1.1      | 0/2            | Not started | -          |
| 8. Patents UI             | v1.1      | 0/2            | Not started | -          |

---

_Roadmap created: 2026-03-15 (v1.0)_
_v1.1 phases added: 2026-03-16_
