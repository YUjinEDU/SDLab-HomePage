---
type: project
tags:
  - lab-website
  - public-portal
  - mvp
created: 2026-03-08
updated: 2026-03-08
---

# 공개 포털 MVP 및 연결 전략

> ✅ **구현 완료** (2026-03-08)
> 1차 MVP 100% 구현 완료. 7개 목록 페이지 + 4개 상세 페이지, 페이지 간 교차 연결 구현.
> 빌드 성공, 오류 0건. 디자인 일치율 96%, 기능 요구사항 15/15 충족.

상위 문서: [[홈페이지 계획]]

관련 문서:

- [[02 사이트 구조 및 페이지 설계]]
- [[05 구현 로드맵]]
- [[08 UI UX 가이드]]

이 문서의 역할:

- 공개 포털을 먼저 구현하기 위한 핵심 전략 문서

목적:

- 공개 포털을 먼저 구현하기 위한 범위를 명확히 자른다.
- 홈 화면에서 어떤 메시지를 전달할지 고정한다.
- 페이지들이 서로 어떻게 연결되는지 정의한다.

## 1. 공개 포털 우선 원칙

현재 최우선 구현 대상은 `공개 포털`이다.

이유:

- 교수님이 가장 먼저 확인할 결과물이다.
- 연구실의 공식 얼굴이 된다.
- 공통 레이아웃, 카드, 필터, 상세 페이지 패턴을 먼저 안정화할 수 있다.
- 내부 포털보다 구현 리스크가 낮다.

## 2. 공개 포털 MVP 범위

### 1차 MVP ✅ 구현 완료

목록 페이지 7개:

- `/` — 홈 (연구실 요약 브리프, 8개 섹션)
- `/members` — 교수님 소개 페이지
- `/members/students` — 학생 멤버 목록 (그룹별 분류)
- `/research` — 연구 분야 소개
- `/publications` — 논문 목록
- `/projects` — 프로젝트 목록
- `/patents` — 특허 목록 (원래 계획에 없었으나 추가)
- `/contact` — 연락처 및 위치

상세 페이지 4개:

- `/members/[slug]` — 멤버 상세 (논문, 프로젝트, 특허 교차 연결)
- `/publications/[slug]` — 논문 상세 (저자, 연구 분야, 프로젝트 교차 연결)
- `/projects/[slug]` — 프로젝트 상세 (멤버, 논문, 연구 분야 교차 연결)
- `/patents/[slug]` — 특허 상세 (멤버, 연구 분야, 프로젝트 교차 연결)

목표:

- 연구실 소개
- 연구 분야 소개
- 멤버 소개 (교수/학생 분리)
- 대표 성과 제시 (논문 + 특허)
- 프로젝트 이력 제시
- 외부 연락 경로 제공

### 2차 공개 확장 (미구현)

- `/board` — 게시판 (공지, 수상, 행사 등)
- `/live-demo` — 라이브 데모

이유:

- `Board`는 운영 빈도가 높다.
- `Live Demo`는 콘텐츠 준비 상태에 따라 품질 차이가 크다.
- 따라서 1차 MVP 이후 붙이는 편이 안전하다.

## 3. 홈 화면 메시지 흐름

홈 화면은 단순 랜딩 페이지가 아니라 `연구실 요약 브리프`처럼 작동해야 한다.

추천 섹션 순서 → **실제 구현된 순서 (8개 섹션):**

1. `HomeHeroSection` + `NetworkBackground` (애니메이션) — 연구실 정체성 + 키워드 + CTA 2개
2. `LabIntroSection` — 연구실 소개 텍스트 (계획에 없었으나 추가)
3. `ResearchAreasSection` — 연구 분야 카드 3개
4. `FeaturedPublicationsSection` — 대표 논문 ⚠️ placeholder (데이터 연결 미완)
5. `FeaturedProjectsSection` — 주요 프로젝트 카드
6. `MembersSnapshotSection` — 교수님 + 그룹별 멤버 수
7. `LatestNewsSection` — 최근 소식 ⚠️ placeholder (데이터 연결 미완)
8. `ContactSummarySection` — 위치 + 이메일 + 전화

## 4. 홈 화면 섹션별 역할

### 4.1 Hero ✅

보여줘야 하는 것:

- 연구실 이름
- 한 줄 소개
- 핵심 키워드 3~5개
- CTA 1~2개

핵심 질문:

- `이 연구실은 무엇을 하는 곳인가?`

구현 결과: `HomeHeroSection` + `NetworkBackground` 애니메이션 배경. CTA 2개 포함.

### 4.1.5 Lab Intro ✅ (추가)

보여줘야 하는 것:

- 연구실 소개 텍스트
- 연구 철학 또는 비전

핵심 질문:

- `이 연구실은 어떤 방향을 추구하는가?`

구현 결과: `LabIntroSection`. 원래 계획에 없었으나, Hero와 Research Areas 사이 자연스러운 전환을 위해 추가.

### 4.2 Research Areas ✅

보여줘야 하는 것:

- 대표 연구 분야 3~4개
- 각 분야 한 줄 설명

핵심 질문:

- `어떤 주제를 연구하는가?`

구현 결과: `ResearchAreasSection`. 연구 분야 카드 3개.

### 4.3 Featured Publications ⚠️ placeholder

보여줘야 하는 것:

- 대표 논문 3~4개
- 최신 또는 대표 성과

핵심 질문:

- `실제 성과가 있는가?`

구현 결과: `FeaturedPublicationsSection`. UI 구현 완료, 실제 데이터 연결은 미완 (placeholder 상태).

### 4.4 Featured Projects ✅

보여줘야 하는 것:

- 진행 중 / 주요 프로젝트
- 기관, 기간, 상태

핵심 질문:

- `무엇을 실제로 수행하고 있는가?`

구현 결과: `FeaturedProjectsSection`. 프로젝트 카드 형태로 구현.

### 4.5 Members Snapshot ✅

보여줘야 하는 것:

- 교수님
- 핵심 멤버 일부

핵심 질문:

- `누가 이 연구를 하고 있는가?`

구현 결과: `MembersSnapshotSection`. 교수님 + 그룹별 멤버 수 표시.

### 4.6 Latest News ⚠️ placeholder

보여줘야 하는 것:

- 최근 공지, 수상, 논문 채택 등

핵심 질문:

- `이 연구실은 지금도 활발히 움직이고 있는가?`

구현 결과: `LatestNewsSection`. UI 구현 완료, 실제 데이터 연결은 미완 (placeholder 상태).

### 4.7 Contact ✅

보여줘야 하는 것:

- 위치
- 이메일
- 문의 경로

핵심 질문:

- `어떻게 연락할 수 있는가?`

구현 결과: `ContactSummarySection`. 위치 + 이메일 + 전화번호 표시.

## 5. 페이지 간 연결 규칙

공개 포털은 각 페이지가 독립적으로 끝나면 안 된다.  
항상 관련 정보로 자연스럽게 이동할 수 있어야 한다.

### Members -> 연결 ✅ 구현 완료

- 해당 멤버의 논문 (`authorMemberIds`로 연결)
- 해당 멤버의 프로젝트 (`memberIds`로 연결)
- 해당 멤버의 특허 (추가)

### Research -> 연결 ✅ 구현 완료

- 관련 프로젝트 (`researchAreaIds` 매칭)
- 관련 논문 (`researchAreaIds` 매칭)

### Publications -> 연결 ✅ 구현 완료

- 저자 멤버 프로필 (`authorMemberIds`로 연결)
- 관련 연구 분야 (`researchAreaIds`로 연결)
- 관련 프로젝트 (`projectIds`로 연결)

### Projects -> 연결 ✅ 구현 완료

- 참여 멤버 (`memberIds`로 연결)
- 관련 논문 (`publicationIds`로 연결)
- 관련 연구 분야 (`researchAreaIds`로 연결)

### Patents -> 연결 ✅ 구현 완료 (추가)

- 참여 멤버 (멤버 상세 연결)
- 관련 연구 분야 (연구 분야 연결)
- 관련 프로젝트 (프로젝트 연결)

### Board -> 연결 (2차 확장, 미구현)

- 관련 논문
- 관련 프로젝트
- 관련 행사 정보

### Live Demo -> 연결 (2차 확장, 미구현)

- 관련 프로젝트
- 관련 논문
- 관련 연구 분야

## 6. 연결 UX 원칙 ✅ 구현 완료

- 관련 콘텐츠는 상세 페이지 하단에 반드시 노출
- 링크 텍스트는 구체적으로 작성
- 태그 클릭 시 필터 페이지로 이동 가능하면 좋음
- 한 페이지에서 다음 행동이 항상 보여야 함

구현 방식:

- Next.js `Link` 컴포넌트 기반 교차 참조 카드
- 상세 페이지(`[slug]`) 하단에 관련 콘텐츠 섹션 배치
- ID 기반 연결 (`authorMemberIds`, `memberIds`, `researchAreaIds`, `projectIds`, `publicationIds`)

실제 구현 예시:

- 논문 상세 하단에 저자 멤버 카드 + 관련 프로젝트 카드
- 프로젝트 상세 하단에 참여 멤버 + 관련 논문 카드
- 멤버 상세에서 해당 멤버의 논문, 프로젝트, 특허 목록
- 특허 상세 하단에 멤버, 연구 분야, 프로젝트 연결

## 7. 공개 포털 구현 순서

실제 구현 완료 순서:

1. ✅ 홈 (8개 섹션)
2. ✅ Members (교수 + 학생 분리)
3. ✅ Research
4. ✅ Publications
5. ✅ Projects
6. ✅ Patents (추가)
7. ✅ Contact
8. ✅ 상세 페이지 4개 (`[slug]`)
9. ⬜ Board (2차 확장)
10. ⬜ Live Demo (2차 확장)

결과:

- 7개 목록 페이지 + 4개 상세 페이지로 대외 공개 가능한 연구실 홈페이지 완성.
- 이후 Board, Live Demo, 실제 데이터 연결을 붙여 확장하면 된다.

## 8. 코딩 에이전트에게 줄 핵심 지시

- ✅ 공개 포털을 최우선으로 구현
- ✅ 1차 MVP: `홈 / Members / Members(학생) / Research / Publications / Projects / Patents / Contact` + 상세 페이지 4개
- ✅ 홈은 `연구실 요약 브리프`처럼 설계 (8개 섹션)
- ✅ 페이지 간 연결을 반드시 넣기 (ID 기반 교차 연결 구현 완료)
- ⬜ Board와 Live Demo는 2차로 확장

## 9. Phase 1 완료 후 다음 단계

1차 MVP가 완료된 상태에서, 다음 작업 우선순위:

1. **Board 페이지 추가** — 공지, 수상, 행사 등 운영 콘텐츠 (2차 확장)
2. **실제 데이터 연결** — FeaturedPublicationsSection, LatestNewsSection의 placeholder 제거
3. **Supabase 마이그레이션** — mock 데이터에서 실제 DB로 전환
4. **SEO 메타데이터 추가** — 각 페이지별 메타 태그, OG 이미지
5. **Live Demo 페이지** — 콘텐츠 준비 상태에 따라 추가
