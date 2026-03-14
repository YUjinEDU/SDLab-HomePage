# Feature Research

**Domain:** University research lab homepage — research outputs (publications, patents, SW, projects/grants)
**Researched:** 2026-03-15
**Confidence:** MEDIUM (pattern synthesis from lab site observation + domain knowledge; WebFetch blocked for deep page scraping)

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features that visitors to any credible research lab homepage assume exist. Missing these signals an unmaintained or unprofessional site.

| Feature                                                       | Why Expected                                                                  | Complexity | Notes                                                    |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------- | -------------------------------------------------------- |
| Publications list with year filter                            | Every academic lab has this; it is the primary credibility signal             | LOW        | Already implemented. Ensure year + type filters coexist. |
| Paper detail page (title, authors, venue, abstract, PDF link) | Visitors need enough to evaluate relevance before clicking external link      | LOW        | Already implemented. Add "Related Project" backlink.     |
| Member list with role/year                                    | Visitors (prospective students, collaborators) want to know who is in the lab | LOW        | Already implemented.                                     |
| Research areas overview                                       | Sets context for all outputs; labs without this feel unfocused                | LOW        | Already implemented via ResearchAreasSection.            |
| Mobile-responsive layout                                      | >50% of casual visitors are on mobile; broken mobile = no credibility         | MEDIUM     | Active gap — cards/lists need responsive audit.          |
| Contact information                                           | Collaborators, prospective students need a clear path to reach the lab        | LOW        | Already implemented.                                     |

### Differentiators (Competitive Advantage)

Features that most Korean university lab homepages do not have, directly serving the project's core value ("방문자가 연구 흐름을 이해할 수 있어야 한다").

| Feature                                                             | Value Proposition                                                                                                                   | Complexity | Notes                                                                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Project → outputs linkage (과제 상세에 논문/특허/SW 결과 표시)      | Lets visitors trace a full research lifecycle in one place. MIT CSAIL individual group pages do this; most Korean lab sites do not. | MEDIUM     | Requires DB relation (already exists) + UI section on project detail page. Core deliverable of this milestone. |
| Output → project back-reference (논문/특허 상세에 "연계 과제" 링크) | Bidirectional navigation; allows arriving via a paper and discovering the broader research program                                  | LOW        | Small UI addition once forward link exists; high perceived value.                                              |
| Public/internal content boundary (is_public per record)             | Sensitive info (grant amounts, unpublished SW code, pending patents) stays internal while the public story remains clean            | MEDIUM     | Requires DB migration + permission check at query layer. Foundational for trust with PI.                       |
| SW registration as first-class output                               | Korean labs rarely surface SW실적 prominently; positioning it alongside papers/patents signals engineering rigor                    | LOW        | Location decision pending (Projects tab vs. standalone section). Recommend Projects tab with badge.            |
| Bilingual output titles (i18n)                                      | International collaborators and prospective foreign students; Korean lab homepages almost never do this well                        | HIGH       | Explicitly out of scope for this milestone — note for future.                                                  |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature                                                  | Why Requested                      | Why Problematic                                                                                                  | Alternative                                                                           |
| -------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Full grant/contract financial details public             | Transparency feel                  | Contractually restricted; causes PI anxiety and will be reverted; creates maintenance burden                     | Use is_public=false for financial fields; show only project title and period publicly |
| Separate standalone SW registration page                 | SW실적 feels like its own category | Creates a fifth top-level nav item for sparse content (typically <20 items); fragments the research output story | Tab under Projects — co-located with the grant that produced it                       |
| Real-time publication import (ORCID/CrossRef sync)       | Reduces manual entry               | Complex integration, sync errors, formatting mismatches with Korean author names; high maintenance               | Manual entry via professor portal with structured form; acceptable for lab scale      |
| Comment/discussion on paper pages                        | Community feel                     | Zero usage at this scale; adds auth complexity to public pages                                                   | Link to external discussion (Twitter/X, OpenReview) if needed                         |
| Citation count display (Semantic Scholar/Google Scholar) | Impact signal                      | API rate limits, stale data, inconsistent coverage for Korean venues                                             | Show venue name + year; let visitors click through to Google Scholar                  |

---

## Feature Dependencies

```
[Project detail page]
    └──requires──> [Project → outputs relation in DB]  (already exists)
    └──requires──> [Output query by project_id]  (needs implementation in lib/queries/)
    └──displays──> [Publication cards (subset)]
    └──displays──> [Patent cards (subset)]
    └──displays──> [SW registration badges]

[Output → project back-reference]
    └──requires──> [Project → outputs linkage]  (must ship first)

[is_public content gating]
    └──requires──> [is_public DB field migration]
    └──requires──> [lib/permissions/ role check utilities]
    └──blocks──>   [Internal-only patent/project details]

[lib/permissions/ utilities]
    └──required by──> [is_public gating]
    └──required by──> [Server Actions auth checks]
```

### Dependency Notes

- **Project → outputs linkage requires lib/queries/ extension:** The DB relation exists but `lib/queries/` needs a function like `getProjectOutputs(projectId)` that joins publications, patents, SW records filtered by project.
- **is_public gating requires lib/permissions/ first:** Showing/hiding content server-side only works after `lib/permissions/` provides `canViewInternal(role)` and similar checks. Build permissions before adding gating logic to queries.
- **Output back-reference is cheap once forward link exists:** It is a single join already available — purely a UI addition. Do not block it behind a separate phase.

---

## MVP Definition

This milestone adds to an existing working product. MVP here means: minimum change set that delivers the core value ("연구 흐름 파악").

### Launch With (v1 — this milestone)

- [ ] Project detail page shows linked publications, patents, SW registrations — core value delivered
- [ ] Publication/patent detail shows "연계 과제" back-link — bidirectional navigation
- [ ] `lib/permissions/` role check utilities — foundational, unblocks everything below
- [ ] `is_public` field on publications and patents with gating in queries — sensitive content control
- [ ] Server Actions permission checks — security correctness (currently missing)
- [ ] Mobile layout fix for output cards/lists — table stakes gap

### Add After Validation (v1.x)

- [ ] SW registration location decision — defer until professor feedback received; default to Projects tab
- [ ] Professor portal UI for setting is_public per record — currently requires DB direct edit

### Future Consideration (v2+)

- [ ] Bilingual output titles (EN/KO per field) — high value, high complexity, explicitly out of scope now
- [ ] Bulk import / ORCID sync — only worth it if manual entry becomes the bottleneck

---

## Feature Prioritization Matrix

| Feature                            | User Value      | Implementation Cost | Priority                        |
| ---------------------------------- | --------------- | ------------------- | ------------------------------- |
| Project → outputs linkage          | HIGH            | MEDIUM              | P1                              |
| Output → project back-reference    | HIGH            | LOW                 | P1                              |
| lib/permissions/ utilities         | HIGH (security) | MEDIUM              | P1                              |
| is_public content gating           | HIGH (PI trust) | MEDIUM              | P1                              |
| Server Actions auth checks         | HIGH (security) | LOW                 | P1                              |
| Mobile layout fix                  | MEDIUM          | MEDIUM              | P1                              |
| Professor portal is_public toggle  | MEDIUM          | LOW                 | P2                              |
| SW registration location finalized | MEDIUM          | LOW                 | P2 (pending professor feedback) |
| Bilingual output titles            | HIGH            | HIGH                | P3                              |
| Citation count display             | LOW             | HIGH                | P3                              |

**Priority key:** P1 = must have for this milestone / P2 = should have, add when possible / P3 = future

---

## Competitor Feature Analysis

Observations from MIT CSAIL, SKKU IRIS Lab, and typical Korean CS lab sites (MEDIUM confidence — based on site structure observation, not exhaustive audit).

| Feature               | MIT CSAIL (group pages)                                          | Typical Korean CS lab                                              | Our Approach                                                           |
| --------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Project → papers link | Yes — individual group pages list papers under each project area | Rarely — papers and projects are separate pages with no cross-link | Implement bidirectional linking                                        |
| Patent display        | Not prominent (institute-level, not group-level)                 | Present on ~50% of lab sites, usually a flat list                  | Flat list with is_public gating for sensitive fields                   |
| SW registration       | Not standard in US labs                                          | Present in Korean labs (SW등록 실적), usually buried               | Surface in Projects tab with clear badge                               |
| Public/internal split | No (everything public or nothing)                                | No (usually everything public)                                     | Differentiated — our advantage given Supabase Auth is already in place |
| Mobile experience     | Adequate                                                         | Often poor (table-heavy layouts)                                   | Target good — fix current gaps                                         |
| i18n                  | English only                                                     | Korean only or incomplete EN                                       | Full i18n deferred; EN metadata fields planned                         |

---

## Sources

- [MIT CSAIL Research](https://www.csail.mit.edu/research) — group page structure observation (MEDIUM confidence)
- [SKKU IRIS Lab](https://iris.skku.edu/) — Korean lab structure (MEDIUM confidence, fetch blocked)
- [Impact Media Lab — Top Research Lab Websites 2024](https://www.impactmedialab.com/scicomm/top-research-lab-websites-2024) — design/structure best practices
- PROJECT.md — existing feature inventory and active requirements (HIGH confidence)
- CLAUDE.md — tech constraints and design principles (HIGH confidence)

---

_Feature research for: University research lab homepage — research outputs restructuring_
_Researched: 2026-03-15_
