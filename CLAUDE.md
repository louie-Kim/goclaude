# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Info

- **Project**: blogposter
- **Level**: Dynamic (Fullstack with Supabase)
- **Stack**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Supabase

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16** project using the **App Router** with the following stack:
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **React 19**
- **Supabase** for backend (auth, PostgreSQL database, storage)

### Directory Structure

- `src/app/` — App Router root. Each folder becomes a route segment.
  - `(auth)/` — Auth routes (login, register)
  - `(main)/` — Main routes (dashboard, settings)
  - `layout.tsx` — Root layout (applies to all pages). Sets global fonts (Geist Sans/Mono) and metadata.
  - `page.tsx` — Home page (`/`)
  - `globals.css` — Global styles and Tailwind base imports
- `src/components/` — UI components (`ui/` for base, `features/` for feature-specific)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utilities (`supabase.ts` for Supabase client)
- `src/stores/` — State management (Zustand)
- `src/types/` — TypeScript type definitions
- `public/` — Static assets served at `/`
- `docs/` — PDCA documents (`01-plan/`, `02-design/`, `03-analysis/`, `04-report/`)
- `next.config.ts` — Next.js configuration
- `postcss.config.mjs` — PostCSS config (required for Tailwind v4 via `@tailwindcss/postcss`)

### App Router Conventions

- New pages: create `src/app/<route>/page.tsx`
- Layouts: create `src/app/<route>/layout.tsx`
- Server Components are the default; add `"use client"` only when needed (event handlers, hooks, browser APIs)
- Path alias `@/*` maps to `src/*`

## Backend (Supabase)

- Supabase client: `src/lib/supabase.ts`
- DB types: `src/types/database.ts`
- Environment: `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Skills

커스텀 검증 및 유지보수 스킬은 `.claude/skills/`에 정의되어 있습니다.

| Skill | Purpose |
|-------|---------|
| `verify-implementation` | 프로젝트의 모든 verify 스킬을 순차 실행하여 통합 검증 보고서를 생성합니다 |
| `manage-skills` | 세션 변경사항을 분석하고, 검증 스킬을 생성/업데이트하며, CLAUDE.md를 관리합니다 |

