# Technology Stack

**Analysis Date:** 2026-03-14

## Languages

**Primary:**

- TypeScript 5.x - All source code in `frontend/src/`

**Secondary:**

- SQL - Supabase migrations in `frontend/supabase/migrations/`

## Runtime

**Environment:**

- Node.js (LTS - no `.nvmrc` detected)

**Package Manager:**

- pnpm (enforced by project rules; npm/yarn forbidden)
- Lockfile: `frontend/pnpm-lock.yaml` present

## Frameworks

**Core:**

- Next.js 16.1.6 - App Router, Turbopack dev server; configured in `frontend/next.config.ts`
- React 19.2.3 - UI rendering

**Internationalization:**

- next-intl 4.8.3 - i18n routing and translations; config in `frontend/src/i18n/config.ts`, `frontend/src/i18n/request.ts`, `frontend/src/i18n/navigation.ts`
- Locales: `ko` (default), `en`; message files at `frontend/messages/ko.json`, `frontend/messages/en.json`
- Public routes use locale prefix (`/ko/...`, `/en/...`); internal/auth routes bypass locale routing

**Build/Dev:**

- Tailwind CSS 4.x - Utility-first styling; configured via `@tailwindcss/postcss` in `frontend/postcss.config.mjs`
- ESLint 9 + eslint-config-next 16.1.6 - Linting; config in `frontend/eslint.config.mjs`
- TypeScript strict mode - `frontend/tsconfig.json`

## Key Dependencies

**Critical:**

- `@supabase/supabase-js` 2.98.0 - Primary database and auth client
- `@supabase/ssr` 0.9.0 - SSR-compatible Supabase session management; used in `frontend/src/lib/db/supabase-client.ts`, `frontend/src/lib/db/supabase-server.ts`, `frontend/src/lib/db/middleware.ts`
- `next-intl` 4.8.3 - Locale routing middleware and translation hooks

**3D / Visualization:**

- `three` 0.183.2 - 3D rendering engine
- `@react-three/fiber` 9.5.0 - React renderer for Three.js
- `@react-three/drei` 10.7.7 - Three.js helpers/abstractions
- `@react-three/postprocessing` 3.0.4 - Post-processing effects
- `@types/three` 0.183.1 - Type definitions for Three.js

## Configuration

**Environment:**

- `.env.local` present at `frontend/.env.local` (never read; contains secrets)
- Required public vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Additional server-side Supabase vars likely present (service role key for server client)

**Build:**

- `frontend/next.config.ts` - Wraps config with `createNextIntlPlugin`
- `frontend/tsconfig.json` - Path alias `@/*` → `./src/*`; strict mode; target ES2017

## Platform Requirements

**Development:**

- pnpm required
- Node.js LTS
- Supabase project (local or remote) with `.env.local` populated

**Production:**

- Vercel (deployment target per CLAUDE.md)
- Supabase hosted project for database and auth

---

_Stack analysis: 2026-03-14_
