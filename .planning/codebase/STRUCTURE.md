# Codebase Structure

**Analysis Date:** 2026-03-14

## Directory Layout

```
Homepage/                          # Repo root
├── frontend/                      # All application code (Next.js)
│   ├── src/
│   │   ├── app/                   # Next.js App Router routes
│   │   │   ├── (public)/          # Public portal — locale-routed
│   │   │   │   └── [locale]/      # e.g. /ko/, /en/
│   │   │   ├── (auth)/            # Login, account management
│   │   │   ├── (internal)/        # Member-only portal (/internal/*)
│   │   │   ├── (professor)/       # Professor/admin portal (/professor/*)
│   │   │   ├── api/               # API routes (auth, calendar, gpu)
│   │   │   ├── layout.tsx         # Root HTML shell
│   │   │   └── globals.css        # Global styles
│   │   ├── actions/               # Server Actions (writes)
│   │   ├── components/            # React UI components
│   │   │   ├── layout/            # SiteHeader, SiteFooter, sidebars
│   │   │   ├── navigation/        # MainNavigation, drawers, LanguageToggle
│   │   │   ├── shared/            # Reusable primitives (PageHero, Pagination, etc.)
│   │   │   ├── home/              # Homepage section components
│   │   │   ├── members/           # Member-domain components
│   │   │   ├── publications/      # Publication-domain components
│   │   │   ├── projects/          # Project-domain components
│   │   │   ├── patents/           # Patent-domain components
│   │   │   ├── research/          # Research area components
│   │   │   ├── contact/           # Contact/map components
│   │   │   ├── board/             # Board/notice components
│   │   │   ├── internal/          # Internal portal UI
│   │   │   ├── professor/         # Professor portal UI
│   │   │   ├── auth/              # Login form components
│   │   │   └── demos/             # Demo/experimental components
│   │   ├── lib/
│   │   │   ├── db/                # Supabase client factories
│   │   │   ├── auth/              # Auth session helpers
│   │   │   ├── permissions/       # Role checks, access control
│   │   │   ├── queries/           # Read-only DB query functions
│   │   │   ├── utils/             # Shared helpers (slug, etc.)
│   │   │   └── constants/         # Color tokens, config values
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── i18n/                  # next-intl config and utilities
│   │   ├── data/                  # Static/seed data files
│   │   └── middleware.ts          # Request routing middleware
│   ├── messages/                  # i18n translation JSON files
│   ├── public/                    # Static assets
│   │   └── images/members/        # Member profile photos
│   ├── supabase/migrations/       # SQL migration files
│   ├── docs/                      # Frontend-specific docs
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── docs/                          # Project planning documents
├── .planning/codebase/            # GSD codebase analysis docs
├── images/                        # Raw/source images
└── scripts/                       # Utility scripts
```

## Directory Purposes

**`frontend/src/app/(public)/[locale]/`:**

- Purpose: All publicly accessible pages, locale-prefixed URLs
- Contains: `page.tsx` per route, `layout.tsx`, `*PageClient.tsx` client wrappers
- Key files: `page.tsx` (home), `members/page.tsx`, `publications/page.tsx`, `projects/page.tsx`, `news/page.tsx`, `patents/page.tsx`, `research/page.tsx`, `contact/page.tsx`

**`frontend/src/app/(auth)/`:**

- Purpose: Authentication flows — login, account management
- Key files: `login/page.tsx`, `account/page.tsx`

**`frontend/src/app/(internal)/internal/`:**

- Purpose: Member-authenticated portal pages — profile, resources, calendar, GPU booking
- Key files: `layout.tsx` (auth gate), `profile/page.tsx`, `resources/page.tsx`, `calendar/page.tsx`, `gpu/page.tsx`

**`frontend/src/app/(professor)/professor/`:**

- Purpose: Professor/admin CRUD management pages for all content domains
- Key files: `layout.tsx` (auth gate), `members/`, `publications/`, `projects/`, `patents/`, `news/`, `contact/`, `lecture/` — each with `page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`

**`frontend/src/app/api/`:**

- Purpose: Next.js API routes for non-Supabase integrations
- Key files: `auth/route.ts`, `calendar/route.ts`, `gpu/route.ts`

**`frontend/src/actions/`:**

- Purpose: All database write operations as `"use server"` Server Actions
- Key files: `auth.ts`, `members.ts`, `publications.ts`, `projects.ts`, `news.ts`, `contact.ts`, `profile.ts`

**`frontend/src/lib/queries/`:**

- Purpose: All database read operations; called from Server Component pages only
- Key files: `members.ts`, `publications.ts`, `projects.ts`, `news.ts`, `research-areas.ts`, `contact.ts`, `index.ts` (barrel)

**`frontend/src/lib/db/`:**

- Purpose: Supabase client factory functions, one per execution context
- Key files: `supabase-server.ts` (SSR/cookie-based), `supabase-client.ts` (browser), `supabase-static.ts` (static build), `middleware.ts` (session refresh)

**`frontend/src/components/shared/`:**

- Purpose: Domain-agnostic UI primitives reused across pages
- Key files: `PageHero.tsx`, `Pagination.tsx`, `AccessDenied.tsx`

**`frontend/src/components/layout/`:**

- Purpose: Page-level chrome components
- Key files: `SiteHeader.tsx`, `SiteFooter.tsx`, `InternalSidebar.tsx`, `ProfessorSidebar.tsx`

**`frontend/src/types/`:**

- Purpose: All TypeScript `type` definitions, no runtime code
- Key files: `index.ts` (barrel), `member.ts`, `publication.ts`, `project.ts`, `research.ts`, `news.ts`, `contact.ts`

**`frontend/src/i18n/`:**

- Purpose: next-intl setup — locale list, default locale, routing config
- Key files: `config.ts`

**`frontend/messages/`:**

- Purpose: Translation JSON files for public portal i18n
- Contains: One JSON file per supported locale (e.g., `ko.json`, `en.json`)

**`frontend/supabase/migrations/`:**

- Purpose: Ordered SQL migration files for the Supabase/PostgreSQL schema
- Generated: No — hand-authored
- Committed: Yes

## Key File Locations

**Entry Points:**

- `frontend/src/middleware.ts`: Request routing — locale vs. session handling
- `frontend/src/app/layout.tsx`: Root HTML wrapper
- `frontend/src/app/(public)/[locale]/page.tsx`: Public homepage

**Configuration:**

- `frontend/next.config.ts`: Next.js config (Turbopack, plugins)
- `frontend/tsconfig.json`: TypeScript config with path aliases
- `frontend/src/i18n/config.ts`: Locale list and default locale

**Core Logic:**

- `frontend/src/lib/queries/index.ts`: Barrel export for all query functions
- `frontend/src/lib/db/supabase-server.ts`: Primary DB client for SSR
- `frontend/src/actions/auth.ts`: `getSession()` and login/logout actions

**Testing:**

- Not detected — no test files or test config found

## Naming Conventions

**Files:**

- React components: PascalCase — `MemberCard.tsx`, `PublicationFilters.tsx`
- Page-level client wrappers: PascalCase with `PageClient` suffix — `MembersPageClient.tsx`
- Form components: PascalCase with `Form` suffix — `MemberForm.tsx`, `NewsForm.tsx`
- Utilities and queries: camelCase — `slug.ts`, `members.ts`
- Route files: lowercase Next.js conventions — `page.tsx`, `layout.tsx`, `loading.tsx`

**Directories:**

- Route groups: lowercase in parentheses — `(public)`, `(internal)`, `(professor)`
- Component subdirectories: lowercase plural domain noun — `members/`, `publications/`
- Dynamic segments: bracket notation — `[locale]`, `[slug]`, `[id]`

## Where to Add New Code

**New public-facing page (e.g., `/[locale]/seminars`):**

- Route: `frontend/src/app/(public)/[locale]/seminars/page.tsx`
- Client wrapper: `frontend/src/app/(public)/[locale]/seminars/SeminarsPageClient.tsx`
- Query: `frontend/src/lib/queries/seminars.ts` + export from `frontend/src/lib/queries/index.ts`
- Components: `frontend/src/components/seminars/`
- Types: `frontend/src/types/seminar.ts` + export from `frontend/src/types/index.ts`

**New professor management page:**

- Route: `frontend/src/app/(professor)/professor/seminars/page.tsx`
- CRUD sub-routes: `new/page.tsx`, `[id]/edit/page.tsx`
- Server Action: `frontend/src/actions/seminars.ts`

**New shared UI component:**

- Location: `frontend/src/components/shared/ComponentName.tsx`

**New domain component:**

- Location: `frontend/src/components/{domain}/ComponentName.tsx`

**New utility:**

- Location: `frontend/src/lib/utils/helperName.ts`

**New DB migration:**

- Location: `frontend/supabase/migrations/00N_description.sql` (increment prefix)

**New translation key:**

- Location: `frontend/messages/ko.json` and `frontend/messages/en.json`

## Special Directories

**`.planning/codebase/`:**

- Purpose: GSD codebase analysis documents consumed by plan/execute commands
- Generated: By GSD map-codebase agent
- Committed: Yes

**`frontend/.next/`:**

- Purpose: Next.js build output
- Generated: Yes
- Committed: No

**`frontend/node_modules/`:**

- Purpose: pnpm package dependencies
- Generated: Yes
- Committed: No

**`frontend/supabase/.temp/`:**

- Purpose: Supabase CLI temporary files
- Generated: Yes
- Committed: No

---

_Structure analysis: 2026-03-14_
