# Coding Conventions

**Analysis Date:** 2026-03-14

## Naming Patterns

**Files:**

- React components: PascalCase (`PublicationCard.tsx`, `PageHero.tsx`, `MemberForm.tsx`)
- Utility/lib functions: camelCase (`slug.ts`, `supabase-server.ts`, `supabase-client.ts`)
- Route files: Next.js conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`)
- Server actions: camelCase grouped by domain (`publications.ts`, `members.ts`, `auth.ts`)

**Functions:**

- camelCase for all functions: `createPublication`, `getPublicationBySlug`, `generateSlug`
- Query functions prefixed by intent: `get*`, `create*`, `update*`, `delete*`
- Handler functions prefixed by event: `handleYear`, `handleType`, `handleSearch`

**Variables:**

- camelCase throughout: `authorMemberIds`, `researchAreaIds`, `isFeatured`
- Boolean flags: `is*` prefix (`isFeatured`, `isInternational`)
- Raw form input: `*Raw` suffix before parsing (`authorsRaw`, `keywordsRaw`, `monthRaw`)

**Types:**

- PascalCase with `type` keyword (never `interface`): `Publication`, `PublicationType`, `FilterState`
- Props types: `*Props` suffix (`PublicationCardProps`, `PublicationFiltersProps`, `PageHeroProps`)
- DB row intermediaries: `*Row` suffix (`PubRow`)
- String literal unions instead of `enum`: `"journal" | "conference" | "patent" | ...`

## Code Style

**Formatting:**

- No Prettier config present — relies on ESLint (eslint-config-next/core-web-vitals + typescript)
- Trailing commas used in multi-line arrays/objects
- Single-quoted strings in TSX, double-quoted in JSX attributes

**Linting:**

- ESLint 9 with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Config: `frontend/eslint.config.mjs`
- Run: `pnpm lint`

**TypeScript:**

- `strict: true` in `frontend/tsconfig.json`
- Target: ES2017
- Path alias: `@/*` → `./src/*`

## Import Organization

**Order (observed pattern):**

1. Framework imports (`"use server"` / `"use client"` directive first)
2. Next.js/React imports
3. Third-party packages (`next-intl`, `@supabase/*`)
4. Internal `@/lib/*` imports
5. Internal `@/types` imports
6. Internal `@/components/*` imports

**Path Aliases:**

- Always use `@/` alias — never relative paths like `../../`
- Example: `import { createClient } from "@/lib/db/supabase-server"`
- i18n-aware navigation: `import { Link } from "@/i18n/navigation"` (not `next/link` directly in public pages)

## Type Definitions

**Prefer `type` over `interface`:**

```typescript
// Correct
type Publication = {
  id: string;
  slug: string;
  type: PublicationType;
};

// Incorrect — do not use
interface Publication { ... }
```

**String literal unions over `enum`:**

```typescript
// Correct
type PublicationType = "journal" | "conference" | "patent" | "sw_registration" | "report" | "thesis";

// Incorrect — do not use
enum PublicationType { Journal = "journal", ... }
```

**Optional fields use `| null` not `?`:**

```typescript
doi: string | null;
pdfUrl: string | null;
month: number | null;
```

## Server vs Client Components

**Default to Server Components.** Add `"use client"` only when needed:

- Interactive state (`useState`, `useEffect`, event handlers)
- Browser APIs
- Client-side filtering/search (e.g., `PublicationFilters`, `MembersPageClient`)

**Directive placement:**

- `"use server"` at top of actions files
- `"use client"` at top of interactive component files

**Pattern — page fetches, client component filters:**

```typescript
// page.tsx (Server Component) — fetches data
const publications = await getPublications();
return <PublicationsPageClient publications={publications} />;

// PublicationsPageClient.tsx ("use client") — handles filtering UI
```

## Data Layer Architecture

**Read path:** `lib/queries/*.ts` — async functions returning typed domain objects
**Write path:** `actions/*.ts` — Server Actions using FormData, returning `{ error }` or `{ success }`

**Query functions:**

```typescript
// lib/queries/publications.ts
export async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("publications").select(PUB_SELECT)...;
  if (error) throw error;
  return (data ?? []).map(toPublication);
}
```

**Action functions:**

```typescript
// actions/publications.ts
"use server";
export async function createPublication(formData: FormData) {
  const supabase = await createClient();
  // parse formData fields
  const { error } = await supabase.from("publications").insert({...});
  if (error) return { error: error.message };
  revalidatePath("/professor/publications");
  return { success: true, id };
}
```

**DB row mapping:** Always use a local `to*` mapper function to convert snake_case DB rows to camelCase domain types:

```typescript
function toPublication(row: PubRow): Publication {
  return {
    id: row.id as string,
    pdfUrl: (row.pdf_url as string) ?? null,
    isFeatured: (row.is_featured as boolean) ?? false,
    ...
  };
}
```

## Error Handling

**Queries (read):**

- Fatal errors: `if (error) throw error` — lets Next.js error boundary handle it
- Not-found: `if (error) return null` — for single-item lookups by slug/id

**Actions (write):**

- Return `{ error: error.message }` on failure — never throw
- Return `{ success: true }` or `{ success: true, id }` on success
- Caller checks `result.error` and displays to user

**Auth/redirect:**

- Layout-level auth guard: `if (!user) redirect("/login")`
- No try/catch blocks — rely on Supabase error objects

## Authentication & Permissions

**Server-side guard in layouts:**

```typescript
// app/(professor)/layout.tsx
const user = await getSession();
if (!user) redirect("/login");
```

**Permission checks:** Handled in `lib/permissions/` — server-side only

## i18n

**Public pages use `next-intl`:**

- Translations accessed via `useTranslations("namespace")` in client components
- Route: `app/(public)/[locale]/` structure
- Navigation: always `import { Link } from "@/i18n/navigation"` in public pages

**Internal/professor pages:** No i18n — Korean UI, no locale routing

## Styling

**Tailwind CSS v4 utility-first:**

- Color palette via CSS custom properties: `text-primary`, `bg-surface`, `border-border`, `text-text-secondary`
- Responsive: mobile-first, `sm:`, `lg:`, `xl:` breakpoints
- No dark mode support
- Common pattern for interactive elements: `hover:text-primary transition-colors`
- Card pattern: `rounded-xl border border-border bg-white p-4 sm:p-6`

**No CSS modules or styled-components** — Tailwind only.

## Module Design

**Exports:**

- Named exports only — no default exports for components
- Exception: route files (`page.tsx`, `layout.tsx`) use default export (Next.js requirement)

**Barrel files:**

- `lib/queries/index.ts` re-exports all query functions
- `types/index.ts` re-exports all types

**Constants:**

- Shared constants in `lib/constants/` (e.g., `colors.ts`)
- Local constants (like `PUB_SELECT`) defined at module top, SCREAMING_SNAKE_CASE

## Comments

**When to comment:**

- Brief inline comments for non-obvious logic: `// Update join tables: delete then re-insert`
- Section labels in JSX: `{/* Year select */}`
- No JSDoc used — TypeScript types provide the documentation

---

_Convention analysis: 2026-03-14_
