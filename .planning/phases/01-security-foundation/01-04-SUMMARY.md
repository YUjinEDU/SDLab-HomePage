---
phase: 01-security-foundation
plan: 04
subsystem: infra
tags: [nextjs, middleware, cve, security, headers]

requires:
  - phase: 01-security-foundation
    provides: auth middleware (updateSession), role guards on internal/professor routes

provides:
  - CVE-2025-29927 x-middleware-subrequest header block in middleware.ts
  - Defense-in-depth redirect to /login when bypass header detected

affects:
  - all future plans that rely on middleware auth enforcement

tech-stack:
  added: []
  patterns:
    - "CVE header block: check request.headers.has('x-middleware-subrequest') at top of middleware before any routing"

key-files:
  created: []
  modified:
    - frontend/src/middleware.ts

key-decisions:
  - "Applied manual CVE-2025-29927 patch as defense-in-depth even though Next.js 16.1.6 likely includes upstream fix"
  - "Redirect to /login (not 400/403) to preserve UX: attacker or misconfigured client lands on login page"

patterns-established:
  - "Security header checks go at the very top of middleware(), before locale routing and session logic"

requirements-completed:
  - SEC-03

duration: 10min
completed: 2026-03-15
---

# Phase 1 Plan 04: CVE-2025-29927 Middleware Patch Summary

**x-middleware-subrequest bypass header blocked in Next.js middleware, redirecting to /login as defense-in-depth against CVE-2025-29927**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-15T00:00:00Z
- **Completed:** 2026-03-15
- **Tasks:** 1 of 1 auto tasks complete (checkpoint pending human verify)
- **Files modified:** 1

## Accomplishments

- Added CVE-2025-29927 mitigation block at top of middleware.ts
- Imported NextResponse for redirect capability
- TypeScript compiles cleanly with no errors

## Task Commits

1. **Task 1: Check Next.js 16.x CVE status and apply patch** - `3b9d0f2` (feat)

## Files Created/Modified

- `frontend/src/middleware.ts` - Added x-middleware-subrequest header check + NextResponse import

## Decisions Made

- Next.js 16.1.6 is a post-CVE major version (CVE disclosed March 2025, 16.x released after), so the upstream fix is likely included. Manual patch applied anyway as defense-in-depth — it is harmless if redundant.
- Redirect target is `/login` rather than a 400/403 response, preserving UX for misconfigured legitimate clients while still blocking exploit attempts.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CVE-2025-29927 mitigation is in place
- Human must verify bypass is blocked via curl test (see checkpoint below)
- After verification, Phase 1 Security Foundation is complete

---

_Phase: 01-security-foundation_
_Completed: 2026-03-15_
