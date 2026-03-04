# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Working principles

- **Read before you write.** Understand the schema, component, or action before modifying it.
- **Follow good patterns, not just existing ones.** Check existing code for conventions, but if you find a poor pattern, flag it and use a better approach — do not perpetuate bugs or anti-patterns.
- **Minimal footprint.** Only change what is needed. Delete dead code after refactoring.
- **Flag issues proactively.** If you notice a bug, security issue, or design problem adjacent to your task, mention it even if not asked.
- **Clean codebase.** Always follow (or improve) existing coding patterns and best practices. Do not leave boilerplate code explaining new changes unless helpful in a future context.

## Project Overview

A high-performance, multilingual **scrollytelling report** for [Chayn](https://www.chayn.co/), built with Next.js 16 App Router, React 19, TypeScript 5, and Tailwind CSS 4.

### Directory Structure

- `app/` — All routes and layouts (App Router)
  - `layout.tsx` — Root layout; sets up Geist fonts and global styles
  - `page.tsx` — Home route (`/`)
  - `globals.css` — Tailwind import and CSS variables
- `public/` — Static assets served at `/`
- Path alias `@/*` maps to the project root

## Core Architecture Strictures & Requirements

You are an expert Next.js (App Router) architect building a high-performance, multilingual scrollytelling report for Chayn. You must strictly adhere to the following rules:

1. **Interactive Islands (CRITICAL):**
   - Default all components to React Server Components (RSC). Ship zero JavaScript for static layouts, typography, and text.
   - Any component using hooks (`useState`, `useRef`), browser APIs, or animation/math libraries (GSAP, Lenis, Visx, Howler, D3) MUST be isolated into a separate file starting with `"use client"`.
   - Heavy client components MUST be dynamically imported using `next/dynamic` with `ssr: false`.

2. **Styling & Dependencies:**
   - Use standard Tailwind CSS template literals. Do not use `clsx` or `tailwind-merge`.
   - Rely on native semantic HTML and ARIA attributes for Accessibility (A11y).
   - **A11y Mandate:** You must leave explicit code comments (e.g., `// TODO (A11y): ...`) on any component where accessibility gaps might exist or where screen-reader testing is required.
   - For state, use Zustand.

3. **Internationalization (i18n):**
   - The app uses `next-intl`. Default locale is `en` (UK English). The secondary locale stub is `hi` (Hindi written in Latin script).
   - All code, variable names, and default copy must be written in UK English (GB_en).
   - All copy must be trauma-informed and adhere to intersectional feminist principles
   - Ensure dynamic support for `dir="ltr"` and `dir="rtl"` (even though both current target languages are LTR, the architecture must support future RTL languages).

4. **Privacy & GDPR Compliance (Strict):**
   - The app must comply strictly with EU/UK GDPR.
   - ALL analytics, error logging (Rollbar), and tracking must be configured to anonymize data. IP tracking and user fingerprinting must be explicitly disabled in the configuration of these tools.
   - No tracking scripts may load without explicit cookie consent.

5. **Latest packages and configuration:**
   - ALL newly installed packages must be latest versions
   - Check latest package documentation from official sources (package website or github repo)
   - Ensure setup is optimised to Next.js and consider if additional server component setup is required.

6. **Test new functionality with Cypress:**
   - New moderate-significant changes should be tested with cypress in the appropriate (possibly new) test file.
   - Test effort is medium - test the core functionality but do not overengineer, test times and bloat are important
   - Follow a similar structure as the existing tests to keep consistency.
