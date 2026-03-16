---
phase: 06-data-pipeline
plan: 01
subsystem: scripts
tags: [data-pipeline, parser, publications, node-script]
dependency_graph:
  requires: []
  provides: [scripts/publications.json]
  affects: [06-02-seed-script]
tech_stack:
  added: []
  patterns:
    [ES-module Node.js script, regex HTML parsing, OCR artifact normalization]
key_files:
  created:
    - scripts/parse-publications.mjs
    - scripts/publications.json
  modified: []
decisions:
  - "No npm dependencies — pure Node.js built-ins (fs, path, crypto)"
  - "Section boundaries identified by <div align='center'> Roman numeral headers"
  - "Concatenated Korean names split greedily into 3-then-2-char tokens (imperfect but usable)"
  - "is_featured: intl_journal + year>=2020 + major publisher (IEEE/Elsevier/Springer/MDPI/Nature/ACM)"
metrics:
  duration_minutes: 15
  completed_date: "2026-03-16"
  tasks_completed: 1
  tasks_total: 1
  files_created: 2
  files_modified: 0
---

# Phase 06 Plan 01: Publication Parser Script Summary

**One-liner:** Node.js ES module parsing OCR'd MD HTML tables into 344 structured publication JSON records across 4 academic sections.

## What Was Built

`scripts/parse-publications.mjs` — a dependency-free Node.js script that:

1. Reads `연구실적-김영국-20251217-2026-03-15_09-47-50.md` directly via `fs.readFileSync`
2. Splits the document into 4 sections using `<div align="center">` Roman numeral headers (II–V)
3. Parses all `<table border="1">` blocks with a lightweight regex-based HTML parser (no cheerio)
4. Normalizes OCR artifacts: concatenated Korean names, corrupted column headers, multi-line cells
5. Extracts: `title`, `authors[]`, `type`, `is_international`, `venue` (cleaned), `publisher`, `year`, `month`, `doi`, `index_type`, `volume_info`, `is_featured`, `section`
6. Writes `scripts/publications.json` (344 entries, 2-space indent)

## Output Stats

| Section         | Count   |
| --------------- | ------- |
| intl_journal    | 40      |
| intl_conference | 91      |
| dom_journal     | 45      |
| dom_conference  | 168     |
| **Total**       | **344** |

## Verification

- `node scripts/parse-publications.mjs` exits without error
- `scripts/publications.json` created with 344 entries (> 50 threshold)
- All 4 sections populated
- Every entry has `title`, `year`, `authors.length > 0`
- `index_type` extracted for SCI/SCIE/SCOPUS papers (e.g., "SCIE", "SCI", "SCOPUS")
- `doi` extracted where present (doi.org/ and direct 10.xxx formats)

## Decisions Made

- **No npm deps:** Pure `fs`, `path`, `crypto` — avoids `cheerio` dependency and keeps script portable
- **Section splitting:** `<div align="center">` + Roman numeral regex; robust to OCR text corruption in section headers
- **Author parsing:** Comma → space-separated Korean → concatenated Korean (3-then-2-char greedy split) → English pair → mixed fallback
- **Venue cleaning:** Strips `(SCI)`, `(SCIE)`, `(SCOPUS)`, `(KCI)`, `(ISSN...)`, `(IF...)` annotations from venue field; moves index info to `index_type`
- **is_featured heuristic:** `section=intl_journal AND year>=2020 AND publisher∈{IEEE,Elsevier,Springer,MDPI,Nature,ACM}`

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `scripts/parse-publications.mjs` exists
- [x] `scripts/publications.json` exists
- [x] Commit `d4f00ba` present
- [x] 344 entries > 50 minimum
- [x] All entries pass title/year/authors assertion

## Self-Check: PASSED
