# External Integrations

**Analysis Date:** 2026-03-14

## APIs & External Services

**Internationalization:**

- next-intl - Locale-based routing and server-side translation loading
  - SDK/Client: `next-intl` 4.8.3
  - Config: `frontend/src/i18n/request.ts`, `frontend/src/i18n/config.ts`
  - Messages: `frontend/messages/ko.json`, `frontend/messages/en.json`

## Data Storage

**Databases:**

- Supabase (PostgreSQL) - Primary data store for all content (members, publications, projects, news, research areas, contact info)
  - Connection env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Server-side client: `frontend/src/lib/db/supabase-server.ts` (uses `createServerClient` from `@supabase/ssr`)
  - Browser client: `frontend/src/lib/db/supabase-client.ts` (uses `createBrowserClient` from `@supabase/ssr`)
  - Static/build-time client: `frontend/src/lib/db/supabase-static.ts`
  - Middleware session refresh: `frontend/src/lib/db/middleware.ts`
  - Schema migrations: `frontend/supabase/migrations/001_initial_schema.sql`, `002_seed_data.sql`, `003_add_is_international.sql`
  - Supabase CLI used locally (`.temp/` files present at `frontend/supabase/.temp/`)

**File Storage:**

- Not detected (no explicit storage bucket usage found; profile images likely stored via Supabase Storage or external URL strings)

**Caching:**

- None (Next.js default fetch caching)

## Authentication & Identity

**Auth Provider:**

- Supabase Auth - Email/password login; no public sign-up (admin-issued accounts only)
  - Implementation: `@supabase/ssr` cookie-based session management
  - Session refresh: middleware at `frontend/src/middleware.ts` calls `updateSession` from `frontend/src/lib/db/middleware.ts` for `/login`, `/internal`, `/professor`, `/api` paths
  - Server Actions for auth: `frontend/src/actions/auth.ts`
  - Roles: `member`, `professor`, `admin` — enforced server-side in `frontend/src/lib/permissions/`

## Monitoring & Observability

**Error Tracking:**

- None detected

**Logs:**

- Console-based (no external logging service detected)

## CI/CD & Deployment

**Hosting:**

- Vercel (declared in CLAUDE.md; no `vercel.json` found in explored files)

**CI Pipeline:**

- None detected (no `.github/workflows/` or similar)

## Environment Configuration

**Required env vars:**

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public, used in browser client)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key (public, used in browser client)
- Additional server-only vars expected: `SUPABASE_SERVICE_ROLE_KEY` (for admin operations in server client)

**Secrets location:**

- `frontend/.env.local` (local dev; not committed)
- Vercel environment variables dashboard (production)

## Webhooks & Callbacks

**Incoming:**

- None detected

**Outgoing:**

- None detected

## Third-Party Rendering

**3D Visualization:**

- Three.js / React Three Fiber stack (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`) used for visual components
- Runs entirely client-side; no external API calls

---

_Integration audit: 2026-03-14_
