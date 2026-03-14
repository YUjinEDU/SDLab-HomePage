---
phase: 1
slug: security-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-15
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property               | Value                                                  |
| ---------------------- | ------------------------------------------------------ |
| **Framework**          | vitest (existing Next.js project)                      |
| **Config file**        | frontend/vitest.config.ts (Wave 0 installs if missing) |
| **Quick run command**  | `cd frontend && pnpm test --run`                       |
| **Full suite command** | `cd frontend && pnpm test --run --coverage`            |
| **Estimated runtime**  | ~15 seconds                                            |

---

## Sampling Rate

- **After every task commit:** Run `cd frontend && pnpm test --run`
- **After every plan wave:** Run `cd frontend && pnpm test --run --coverage`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command              | File Exists | Status     |
| ------- | ---- | ---- | ----------- | --------- | ------------------------------ | ----------- | ---------- |
| 1-01-01 | 01   | 1    | SEC-01      | unit      | `pnpm test --run permissions`  | ❌ W0       | ⬜ pending |
| 1-01-02 | 01   | 1    | SEC-01      | unit      | `pnpm test --run permissions`  | ❌ W0       | ⬜ pending |
| 1-02-01 | 02   | 1    | SEC-02      | unit      | `pnpm test --run actions`      | ❌ W0       | ⬜ pending |
| 1-02-02 | 02   | 1    | SEC-02      | unit      | `pnpm test --run actions`      | ❌ W0       | ⬜ pending |
| 1-03-01 | 03   | 2    | SEC-03      | manual    | N/A — header bypass check      | N/A         | ⬜ pending |
| 1-04-01 | 04   | 1    | DB-01       | manual    | psql/Supabase dashboard verify | N/A         | ⬜ pending |
| 1-05-01 | 05   | 2    | DB-02       | manual    | anon REST API call test        | N/A         | ⬜ pending |
| 1-06-01 | 06   | 2    | DB-03       | manual    | anon REST API call test        | N/A         | ⬜ pending |

_Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky_

---

## Wave 0 Requirements

- [ ] `frontend/src/lib/permissions/__tests__/permissions.test.ts` — unit tests for `assertRole()` (SEC-01)
- [ ] `frontend/src/actions/__tests__/professor-actions.test.ts` — role guard tests for Server Actions (SEC-02)
- [ ] vitest + @testing-library/react install if not present

_If none: "Existing infrastructure covers all phase requirements."_

---

## Manual-Only Verifications

| Behavior                                       | Requirement  | Why Manual                                              | Test Instructions                                                                                                |
| ---------------------------------------------- | ------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `is_public = false` rows hidden from anon REST | DB-02, DB-03 | Requires live Supabase instance with anon key           | `curl -H "apikey: <anon>" https://<project>.supabase.co/rest/v1/publications?is_public=eq.false` — expect 0 rows |
| CVE-2025-29927 middleware bypass blocked       | SEC-03       | Requires HTTP header injection test against running app | `curl -H "x-middleware-subrequest: 1" http://localhost:3000/internal` — expect redirect to login, not 200        |
| `member` role blocked from professor actions   | SEC-02       | Requires auth session with member role                  | Log in as member, call professor Server Action directly — expect permission error                                |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
