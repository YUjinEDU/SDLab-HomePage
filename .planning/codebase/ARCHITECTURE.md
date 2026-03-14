# Architecture

**Analysis Date:** 2026-03-14

## Pattern Overview

**Overall:** Role-gated portal monolith using Next.js App Router with route-group-based access separation.

**Key Characteristics:**

- Four distinct route groups enforce access boundaries at layout level: `(public)`, `(auth)`, `(internal)`, `(professor)`
- Server Components are the default; Client Components used only for interactivity
- Read/write responsibility is split: `lib/queries/` for reads (Server Components), `actions/` for writes (Server Actions)
- Supabase handles both database and auth; no separate API layer for internal data

## Layers

**Routing Layer:**

- Purpose: Defines URL structure and access boundaries via Next.js App Router route groups
- Location: `frontend/src/app/`
- Contains: `page.tsx`, `layout.tsx`, route group folders
- Depends on: auth session (layouts), query functions (pages)
- Used by: Browser requests, Next.js middleware

**Middleware Layer:**

- Purpose: Splits traffic — public paths get locale routing via next-intl, private paths get Supabase session refresh
- Location: `frontend/src/middleware.ts`
- Contains: Single middleware function with path-based branching
- Depends on: `lib/db/middleware.ts`, `i18n/config.ts`
- Used by: Every incoming request

**Query Layer (reads):**

- Purpose: All Supabase read operations — one file per domain
- Location: `frontend/src/lib/queries/`
- Contains: Async functions returning typed domain objects
- Depends on: `lib/db/supabase-server.ts`
- Used by: Server Component pages only

**Actions Layer (writes):**

- Purpose: All Supabase write operations as Next.js Server Actions
- Location: `frontend/src/actions/`
- Contains: `"use server"` functions, form data parsing, `revalidatePath` calls
- Depends on: `lib/db/supabase-server.ts`
- Used by: Client Components (forms), Server Components calling actions directly

**Component Layer:**

- Purpose: UI rendering — domain components, layout chrome, shared primitives
- Location: `frontend/src/components/`
- Contains: React components, split by domain subdirectory
- Depends on: Types, constants, actions (for form submissions)
- Used by: App route pages

**Library Layer:**

- Purpose: Infrastructure utilities — DB clients, auth helpers, permissions, constants
- Location: `frontend/src/lib/`
- Contains: Supabase client factories, auth session helpers, color constants
- Depends on: Environment variables, Supabase SDK
- Used by: All other layers

**Type Layer:**

- Purpose: Shared TypeScript type definitions (no runtime code)
- Location: `frontend/src/types/`
- Contains: `type` declarations for all domain entities
- Depends on: Nothing
- Used by: All layers

## Data Flow

**Public Page Read:**

1. Request arrives at middleware → locale detected → next-intl routes to `[locale]` segment
2. Server Component page (e.g., `(public)/[locale]/members/page.tsx`) calls query function
3. Query function (`lib/queries/members.ts`) creates server-side Supabase client, queries DB
4. Data mapped from snake_case DB rows to camelCase TypeScript types via inline mapper functions
5. Typed props passed to Client Component wrapper (e.g., `MembersPageClient`) for interactive UI

**Professor Write Flow:**

1. Professor visits `(professor)/professor/[domain]/` page
2. Layout (`(professor)/layout.tsx`) calls `getSession()` — redirects to `/login` if unauthenticated
3. Form rendered in Client Component (`MemberForm.tsx`)
4. On submit, Server Action called (e.g., `actions/members.ts → createMember`)
5. Action validates, writes to Supabase, calls `revalidatePath` to invalidate cache
6. Page re-renders with fresh data

**Authentication Flow:**

1. `/login` page submits credentials via `actions/auth.ts`
2. Supabase Auth issues session cookie
3. Middleware (`lib/db/middleware.ts`) refreshes session on every private-path request
4. Layouts read session via `getSession()` from `actions/auth.ts` and redirect if missing

**State Management:**

- No client-side global state library (no Redux, Zustand, etc.)
- Server state: Supabase PostgreSQL, invalidated via `revalidatePath`
- Local UI state: React `useState` within Client Components
- Auth state: Supabase session cookie, read server-side

## Key Abstractions

**Route Groups:**

- Purpose: Enforce access boundaries and shared layout chrome without affecting URL segments
- Examples: `frontend/src/app/(public)/`, `frontend/src/app/(internal)/`, `frontend/src/app/(professor)/`
- Pattern: Layout file in each group calls `getSession()` and redirects unauthorized users

**Domain Query Functions:**

- Purpose: Typed, reusable Supabase queries per domain entity
- Examples: `frontend/src/lib/queries/members.ts`, `frontend/src/lib/queries/publications.ts`
- Pattern: Each file exports named async functions returning typed arrays or single objects; includes inline row-mapper function converting snake_case to camelCase

**Server Actions:**

- Purpose: Validated write operations with cache invalidation
- Examples: `frontend/src/actions/members.ts`, `frontend/src/actions/publications.ts`
- Pattern: `"use server"` directive, `FormData` parsing, Supabase write, `revalidatePath`, return `{ success: true }` or `{ error: string }`

**Page/Client Split:**

- Purpose: Allows Server Components to fetch data while Client Components handle interactivity
- Examples: `(public)/[locale]/members/page.tsx` + `MembersPageClient.tsx`
- Pattern: `page.tsx` is async Server Component fetching data; passes typed props to a `*PageClient.tsx` Client Component

**Supabase Client Factory:**

- Purpose: Context-appropriate Supabase clients
- Examples: `lib/db/supabase-server.ts` (cookie-based, SSR), `lib/db/supabase-client.ts` (browser), `lib/db/supabase-static.ts` (static/ISR), `lib/db/middleware.ts` (session refresh)
- Pattern: Each exported `createClient()` wraps `@supabase/ssr` with appropriate cookie strategy

## Entry Points

**Root Layout:**

- Location: `frontend/src/app/layout.tsx`
- Triggers: All page requests
- Responsibilities: HTML shell, global CSS, metadata defaults

**Middleware:**

- Location: `frontend/src/middleware.ts`
- Triggers: Every request matching the config matcher (excludes static assets)
- Responsibilities: Route bifurcation — locale routing for public, session refresh for private

**Public Home:**

- Location: `frontend/src/app/(public)/[locale]/page.tsx`
- Triggers: `GET /[locale]`
- Responsibilities: Homepage assembly from multiple query calls

**Auth Login:**

- Location: `frontend/src/app/(auth)/login/page.tsx`
- Triggers: `GET /login`
- Responsibilities: Login form rendering; `actions/auth.ts` handles submission

**Internal Portal:**

- Location: `frontend/src/app/(internal)/layout.tsx`
- Triggers: Any `/internal/*` request
- Responsibilities: Session gate (redirect if unauthenticated), sidebar layout

**Professor Portal:**

- Location: `frontend/src/app/(professor)/layout.tsx`
- Triggers: Any `/professor/*` request
- Responsibilities: Session gate, professor sidebar layout

## Error Handling

**Strategy:** Defensive returns rather than thrown exceptions in query/action layer.

**Patterns:**

- Query functions: `if (error) return null` or `if (error) throw error` (throw used when missing data is unexpected)
- Server Actions: Return `{ error: error.message }` on failure, `{ success: true }` on success
- Layouts: `redirect()` on missing session — no error page rendered
- Pages: Missing data renders empty states; no global error boundary beyond Next.js defaults

## Cross-Cutting Concerns

**Logging:** No structured logging library detected. Errors surface via Supabase error objects returned to callers.

**Validation:** No dedicated validation library (e.g., Zod) detected. Server Actions parse `FormData` fields directly with type casts.

**Authentication:** Server-side only. `getSession()` in `actions/auth.ts` reads Supabase session from cookies. Layouts enforce auth gate via redirect. No client-side auth state.

**Internationalisation:** `next-intl` applied to `(public)` route group only via `[locale]` dynamic segment and `intlMiddleware`. Private portals (`/internal`, `/professor`) are Korean-only with no locale routing.

**Cache Invalidation:** `revalidatePath` called in Server Actions after writes. No manual cache tags or on-demand ISR detected.

---

_Architecture analysis: 2026-03-14_
