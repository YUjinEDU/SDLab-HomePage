# Phase 4: Professor Portal UX - Research

**Researched:** 2026-03-15
**Domain:** Next.js App Router Server Actions + "use client" toggle components + revalidateTag cache invalidation
**Confidence:** HIGH

---

<phase_requirements>

## Phase Requirements

| ID     | Description                                                         | Research Support                                                                                                                                                |
| ------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VIS-03 | 교수 포털에서 각 항목의 `is_public` 토글 UI 제공 (논문, 특허, 과제) | New Server Actions (`togglePublicationVisibility`, `toggleProjectVisibility`) + "use client" toggle button components embedded in existing professor list pages |

</phase_requirements>

---

## Summary

Phase 4 adds a single-click `is_public` toggle to the three professor portal list pages (publications, patents, projects). The toggle is a lightweight "use client" button component that calls a new Server Action, which performs a targeted `.update({ is_public })` on the relevant Supabase table and then fires `revalidateTag()` so the public-facing cached queries immediately reflect the change.

The existing patterns are already established: the `DeletePublicationButton` component (lines 1-47) demonstrates the exact shape — a `"use client"` component that imports a Server Action, calls it, and calls `router.refresh()`. The toggle follows the same pattern with one addition: it must also show the current state visually and optimistically update to avoid a full round-trip delay.

Both `Publication` type and `Project` type are missing `isPublic` in their TypeScript shapes. The DB column (`is_public`) exists and is selected via `*` in the queries, but `toPublication()` and `toProject()` never map it to the TS type. Phase 4 must add `isPublic: boolean` to both types and map it in both `toPublication` and `toProject` so the professor list pages can render the current toggle state.

**Primary recommendation:** Add `isPublic` to `Publication` and `Project` types, add two focused Server Actions (`togglePublicationVisibility`, `toggleProjectVisibility`), and create one `VisibilityToggleButton` client component reusable across all three pages (publications, patents, projects).

---

## Standard Stack

### Core

| Library                  | Version      | Purpose                               | Why Standard                                |
| ------------------------ | ------------ | ------------------------------------- | ------------------------------------------- |
| Next.js Server Actions   | 16 (current) | Toggle `is_public` in DB              | Already used for all writes in this project |
| `revalidateTag`          | next/cache   | Invalidate cached public queries      | Already used in all existing write actions  |
| `"use client"` component | —            | Render toggle button with local state | Same pattern as `DeletePublicationButton`   |
| Supabase JS              | current      | `.update({ is_public }).eq("id", id)` | Already used throughout                     |

### Supporting

| Library                 | Version | Purpose                               | When to Use                                     |
| ----------------------- | ------- | ------------------------------------- | ----------------------------------------------- |
| `useTransition` (React) | 18+     | Show pending state during action call | Use to disable button while action is in-flight |
| `useOptimistic` (React) | 18+     | Optimistic UI before server confirms  | Optional — only if UX latency is noticeable     |

**Installation:** No new packages required.

---

## Architecture Patterns

### Recommended New Files

```
frontend/src/
  actions/
    visibility.ts              # togglePublicationVisibility, toggleProjectVisibility
  components/professor/
    VisibilityToggleButton.tsx  # "use client" reusable toggle
  app/(professor)/professor/
    publications/page.tsx       # add VisibilityToggleButton column (modify existing)
    patents/page.tsx            # add VisibilityToggleButton column (modify existing)
    projects/page.tsx           # add VisibilityToggleButton column (modify existing)
  types/
    publication.ts              # add isPublic: boolean
    project.ts (or index.ts)    # add isPublic: boolean
```

### Pattern 1: Focused Visibility Server Action

**What:** A dedicated Server Action that only updates `is_public` — does not touch other fields. Separate from `updatePublication`/`updateProject` to avoid re-validating join tables.

**When to use:** Any single-field toggle where a full form update would be wasteful.

```typescript
// actions/visibility.ts
"use server";

import { createClient } from "@/lib/db/supabase-server";
import { revalidateTag } from "next/cache";
import { assertRole } from "@/lib/permissions";

export async function togglePublicationVisibility(
  id: string,
  isPublic: boolean,
) {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  const { error } = await supabase
    .from("publications")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) return { error: error.message };

  // @ts-expect-error: Next.js 16 type requires 2 args but revalidateTag("tag") works at runtime
  revalidateTag("publications");
  return { success: true };
}

export async function toggleProjectVisibility(id: string, isPublic: boolean) {
  const authError = await assertRole("professor");
  if (authError) return authError;

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_public: isPublic })
    .eq("id", id);

  if (error) return { error: error.message };

  // @ts-expect-error: Next.js 16 type requires 2 args but revalidateTag("tag") works at runtime
  revalidateTag("projects");
  return { success: true };
}
```

### Pattern 2: VisibilityToggleButton Client Component

**What:** A "use client" component that receives `id`, `isPublic`, and `onToggle` (a Server Action or wrapper). Shows current state, calls action on click, uses `useTransition` for pending state.

**When to use:** Inline in table rows on the professor list pages.

```typescript
// components/professor/VisibilityToggleButton.tsx
"use client";

import { useTransition, useState } from "react";

type Props = {
  id: string;
  initialIsPublic: boolean;
  toggle: (id: string, isPublic: boolean) => Promise<{ error?: string } | { success: boolean }>;
};

export default function VisibilityToggleButton({ id, initialIsPublic, toggle }: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !isPublic;
    setIsPublic(next); // optimistic
    startTransition(async () => {
      const result = await toggle(id, next);
      if ("error" in result && result.error) {
        setIsPublic(!next); // revert on error
        alert(result.error);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium transition-colors ${
        isPublic
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      {isPublic ? "공개" : "비공개"}
    </button>
  );
}
```

### Pattern 3: Type Extension

**What:** Add `isPublic: boolean` to `Publication` and `Project` types, and map `row.is_public` in `toPublication()` and `toProject()`.

**Critical:** The professor-facing queries (`getAllPublications`, `getPublicationById`, `getAllProjects`, `getProjectById`) do NOT filter by `is_public`, so they already return all rows. The `toPublication`/`toProject` mappers just need to expose the field.

### Anti-Patterns to Avoid

- **Reusing `updatePublication` for toggle:** It re-processes join tables unnecessarily. Use the dedicated `togglePublicationVisibility` action.
- **Server Component toggle:** Cannot have interactive state. Must be "use client".
- **Calling `revalidatePath` instead of `revalidateTag`:** `revalidateTag` is cheaper and already the project standard. No `revalidatePath` calls needed in the toggle action.
- **Forgetting patents use the `publications` table:** Patents are `type = 'patent'` rows in `publications`. `togglePublicationVisibility` handles patents too — no separate action needed.

---

## Don't Hand-Roll

| Problem            | Don't Build                | Use Instead                                      | Why                                          |
| ------------------ | -------------------------- | ------------------------------------------------ | -------------------------------------------- |
| Optimistic UI      | Custom fetch + state sync  | `useState` + revert on error                     | Pattern is sufficient for low-latency action |
| Cache invalidation | Manual path revalidation   | `revalidateTag("publications")`                  | Already established project standard         |
| Auth guard         | Re-implementing role check | `assertRole("professor")` from `lib/permissions` | Single source of truth                       |

---

## Common Pitfalls

### Pitfall 1: `isPublic` Missing from TypeScript Type

**What goes wrong:** `pub.isPublic` is `undefined` at runtime even though DB returns the column, because `toPublication()` never maps `row.is_public`.

**Why it happens:** `*` in the SELECT fetches all columns, but the mapper function only maps fields explicitly listed. The `Publication` type also lacks the field.

**How to avoid:** Add `isPublic: boolean` to `Publication` and `Project` types. Add `isPublic: (row.is_public as boolean) ?? true` in `toPublication`. Add `isPublic: (row.is_public as boolean) ?? false` in `toProject` (projects default to false per prior decision in STATE.md).

**Warning signs:** TypeScript error on `pub.isPublic` in the page component.

### Pitfall 2: Professor List Queries Are Cached with `unstable_cache`

**What goes wrong:** The professor list pages call `getPublications()` and `getProjects()` which are `unstable_cache` functions filtering by `is_public = true`. After toggling, the professor page would not show updated state.

**Why it happens:** The professor pages reuse the public cached queries. These filter out non-public items, so toggling something to private would make it disappear from the professor list.

**How to avoid:** The professor list pages should use the uncached variants (`getAllPublications`, and the equivalent `getAllProjects` non-cached function). Check `projects.ts` for whether `getAllProjects` exists; if not, add it following the same pattern as `getAllPublications`.

**Warning signs:** After toggling an item to "비공개", it disappears from the professor management table.

### Pitfall 3: `@ts-expect-error` on `revalidateTag`

**What goes wrong:** TypeScript error on `revalidateTag("publications")` because Next.js 16 types require 2 arguments.

**Why it happens:** Type definition mismatch in Next.js 16.

**How to avoid:** Add `// @ts-expect-error: Next.js 16 type requires 2 args but revalidateTag("tag") works at runtime` comment above each call. This is the established project pattern (confirmed in `actions/publications.ts` line 95-96).

### Pitfall 4: Patents Page Reuses `DeletePublicationButton` Incorrectly

**What goes wrong:** `patents/page.tsx` already reuses `DeletePublicationButton` from the publications folder. The toggle component must work correctly for patent IDs too.

**How to avoid:** `VisibilityToggleButton` passes the action as a prop — pass `togglePublicationVisibility` for both publications and patents tables rows (same underlying table).

---

## Code Examples

### Adding isPublic to Professor Query (uncached)

```typescript
// lib/queries/projects.ts — add after existing cached functions
export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJ_SELECT)
    .order("start_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toProject);
}
```

### Using Toggle in Professor Page (table row)

```tsx
// In the <td> "작업" column, add before existing links:
<VisibilityToggleButton
  id={pub.id}
  initialIsPublic={pub.isPublic}
  toggle={togglePublicationVisibility}
/>
```

---

## State of the Art

| Old Approach                         | Current Approach                     | When Changed | Impact                                            |
| ------------------------------------ | ------------------------------------ | ------------ | ------------------------------------------------- |
| Full form submit to toggle one field | Dedicated single-field Server Action | Next.js 13+  | Less DB work, no join table re-processing         |
| `router.refresh()` after action      | `revalidateTag` in action            | Next.js 14+  | Smarter cache invalidation, less full-page reload |

---

## Open Questions

1. **Does `getAllProjects` (uncached) exist in `projects.ts`?**
   - What we know: `getAllPublications` exists (uncached, uses `createClient`). `projects.ts` was only read to line 60.
   - What's unclear: Whether the uncached equivalent for projects exists.
   - Recommendation: Planner should verify lines 60+ of `projects.ts`. If `getAllProjects` is absent, Wave 0 of the plan must add it.

2. **Should the professor list pages show ALL items (including private) or only public?**
   - What we know: Current pages call `getPublications()` / `getProjects()` which filter `is_public = true`.
   - What's unclear: This was not explicitly stated — but for a management interface, showing all items (including private) is the correct UX.
   - Recommendation: Switch professor pages to the uncached `getAllPublications` / `getAllProjects`. This is implied by VIS-03 success criteria ("토글이 표시되고" — you can't toggle what's hidden).

---

## Validation Architecture

### Test Framework

| Property           | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| Framework          | vitest (node environment)                                       |
| Config file        | `frontend/vitest.config.ts`                                     |
| Quick run command  | `cd frontend && pnpm vitest run src/actions/visibility.test.ts` |
| Full suite command | `cd frontend && pnpm vitest run`                                |

### Phase Requirements → Test Map

| Req ID | Behavior                                                                                    | Test Type | Automated Command                                               | File Exists? |
| ------ | ------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------- | ------------ |
| VIS-03 | `togglePublicationVisibility` updates `is_public` and calls `revalidateTag("publications")` | unit      | `cd frontend && pnpm vitest run src/actions/visibility.test.ts` | Wave 0       |
| VIS-03 | `toggleProjectVisibility` updates `is_public` and calls `revalidateTag("projects")`         | unit      | `cd frontend && pnpm vitest run src/actions/visibility.test.ts` | Wave 0       |
| VIS-03 | assertRole check blocks unauthorized callers                                                | unit      | same file                                                       | Wave 0       |

### Sampling Rate

- **Per task commit:** `cd frontend && pnpm vitest run src/actions/visibility.test.ts`
- **Per wave merge:** `cd frontend && pnpm vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `frontend/src/actions/visibility.test.ts` — covers VIS-03 Server Action behavior
- [ ] `frontend/src/actions/__tests__/` directory (or co-locate with source)

_(Existing vitest infrastructure in `src/lib/queries/` pattern can be followed — mock `@/lib/db/supabase-server` and `next/cache`.)_

---

## Sources

### Primary (HIGH confidence)

- Direct code inspection: `frontend/src/actions/publications.ts` — Server Action shape, assertRole pattern, revalidateTag usage
- Direct code inspection: `frontend/src/actions/projects.ts` — Same patterns for projects
- Direct code inspection: `frontend/src/app/(professor)/professor/publications/DeletePublicationButton.tsx` — "use client" + Server Action call pattern
- Direct code inspection: `frontend/src/lib/queries/publications.ts` — unstable_cache, public vs uncached query separation, `toPublication` mapper
- Direct code inspection: `frontend/src/types/publication.ts` — confirms `isPublic` is MISSING from type
- Direct code inspection: `frontend/src/lib/queries/projects.ts` (lines 1-60) — confirms `isPublic` missing from `toProject`
- Direct code inspection: `.planning/STATE.md` — publications default `is_public=true`, projects default `is_public=false`
- Direct code inspection: `.planning/config.json` — `nyquist_validation: true`

### Secondary (MEDIUM confidence)

- React `useTransition` for pending state in client components — React 18 docs pattern, widely established

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all patterns directly observed in existing codebase
- Architecture: HIGH — direct code inspection of existing professor portal files
- Pitfalls: HIGH — type gap confirmed by reading `toPublication` mapper; professor query caching confirmed by reading `publications.ts`

**Research date:** 2026-03-15
**Valid until:** 2026-04-15 (stable Next.js App Router patterns)
