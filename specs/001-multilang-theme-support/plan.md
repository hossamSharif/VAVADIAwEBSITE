# Implementation Plan: Multi-Language (Arabic/English) and Light/Dark Theme

**Branch**: `001-multilang-theme-support` | **Date**: 2026-05-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-multilang-theme-support/spec.md`

## Summary

Add bilingual (English / Arabic, with full RTL support) and light/dark theming to the existing single-page React site. Both preferences are independent, persisted per-device, detected from the browser/OS on first visit, and overridable by visible navbar toggles (Globe for language, Sun/Moon for theme) that stay outside the mobile hamburger overlay.

**Technical approach** (resolved in [research.md](./research.md)):
- A hand-rolled `LanguageProvider` (React Context + flat TS catalogs) with compile-time symmetry between `en` and `ar` — no `react-i18next` dependency.
- A `ThemeProvider` driving `<html data-theme>` plus a Tailwind v4 `@custom-variant dark` and a layer of semantic CSS variables (`--color-bg`, `--color-surface`, `--color-foreground`, `--color-border`, etc.) so pages migrate to theme-agnostic tokens once instead of doubling every dark utility with a `dark:` sibling.
- A pre-mount inline IIFE in `index.html` that resolves `lang` / `dir` / `data-theme` synchronously before the first paint, eliminating any flash of the wrong theme/language (FR-014).
- Self-hosted Cairo variable font, applied only when `<html lang="ar">`.
- A 200 ms color-only CSS transition gated behind a `data-theme-bootstrapped` flag, so user-driven theme switches blend smoothly while the *initial* paint stays instant.
- Tailwind v4 logical properties (`ms-*`, `me-*`, `text-start`, `border-s`) replacing physical equivalents across pages, with `rtl:-scale-x-100` reserved for icons that imply direction.
- A `prebuild` `verify-catalogs.ts` step that fails the build on missing or empty translations (FR-001 / SC-001 enforcement).

## Technical Context

**Language/Version**: TypeScript ~5.8 (strict), React 19.0.1, Node ≥ 20 (Vite 6 requirement).
**Primary Dependencies** (existing): `react`, `react-dom`, `react-router-dom@7`, `motion`, `lucide-react`, `tailwindcss@4`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`, `vite@6`. **New**: `@fontsource-variable/cairo` (Arabic webfont, self-hosted).
**Storage**: Browser `localStorage` only (`vavadia.lang`, `vavadia.theme`). No server state.
**Testing**: TypeScript strict-mode + `tsc --noEmit` (already wired as `npm run lint`) + a custom `scripts/verify-catalogs.ts` invoked at `prebuild`. No Vitest/Jest in this feature; manual quickstart drives behavioral verification.
**Target Platform**: Modern evergreen browsers — Chromium ≥ 122, Firefox ≥ 124, Safari ≥ 17. Mobile (iOS Safari / Chrome Android) and desktop both in scope.
**Project Type**: Single-page web application (Vite SPA). No backend in scope of this feature.
**Performance Goals**: First paint matches saved preferences (zero theme/lang flash). Theme-toggle transition completes in 200 ms. Cairo font subset ≤ 80 KB compressed. No measurable input-latency increase during the transition.
**Constraints**: WCAG 2.1 Level AA contrast (≥ 4.5:1 body, ≥ 3:1 large/UI) on both themes. Western Arabic digits (0–9) only — never `٠–٩`. No URL-encoded locale; no server-side rendering; no third-party font CDN at runtime. Must degrade gracefully when `localStorage` is unavailable (private mode).
**Scale/Scope**: 7 routes (`/`, `/about`, `/services`, `/network`, `/gvs`, `/contact`, `/inquiry`), one shared `Navbar` + `Footer` + `Layout`, ~150 user-facing strings to translate. No data layer beyond the existing inquiry-form `localStorage` snapshot.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The repository's `.specify/memory/constitution.md` is the unfilled template (placeholder `[PRINCIPLE_X_NAME]` entries) — no concrete principles have been ratified. There are therefore no project-specific gates to evaluate.

Generic discipline applied anyway:
- **Simplicity** — chose hand-rolled providers over a third-party i18n library; chose `data-theme` over inventing a class-based system.
- **Reversibility** — every change is bounded: provider components, catalog files, a CSS variable layer, an inline bootstrap script. No persistent server state or schema changes.
- **YAGNI** — no plural rules, no ICU formatting, no per-page lazy locales, no test framework introduction. All deferred.

**Result**: PASS (no constitution gates exist; design choices are conservative).

**Re-evaluation after Phase 1**: PASS. Phase 1 design (data model + four contracts + quickstart) introduces no new dependencies beyond Cairo and no new architectural complexity beyond the two providers and the bootstrap IIFE.

## Project Structure

### Documentation (this feature)

```text
specs/001-multilang-theme-support/
├── plan.md                       # This file (/speckit-plan command output)
├── spec.md                       # Feature specification (already exists)
├── research.md                   # Phase 0 output — design decisions
├── data-model.md                 # Phase 1 output — LanguagePreference, ThemePreference, TranslationCatalog
├── quickstart.md                 # Phase 1 output — 13-step manual verification
├── contracts/                    # Phase 1 output — public surfaces of new modules
│   ├── i18n-provider.md          # LanguageProvider + useLanguage hook
│   ├── theme-provider.md         # ThemeProvider + useTheme hook
│   ├── bootstrap-script.md       # Pre-mount inline IIFE in index.html
│   └── catalog-schema.md         # en.ts / ar.ts shape + verify-catalogs.ts
└── tasks.md                      # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

The project is an existing single Vite SPA — no new top-level directories. New files live alongside their existing siblings.

```text
src/
├── i18n/                         # NEW — language layer
│   ├── LanguageProvider.tsx      # Context + provider + useLanguage hook (contract: i18n-provider.md)
│   └── catalogs/
│       ├── en.ts                 # Source-of-truth flat key set (contract: catalog-schema.md)
│       └── ar.ts                 # Arabic translations, shape-checked against en.ts
├── theme/                        # NEW — theme layer
│   └── ThemeProvider.tsx         # Context + provider + useTheme hook (contract: theme-provider.md)
├── components/
│   ├── Layout.tsx                # MIGRATE — semantic tokens
│   ├── Navbar.tsx                # MIGRATE — translate strings, add Globe + Sun/Moon toggles, RTL-mirror chevrons, semantic tokens
│   ├── Footer.tsx                # MIGRATE — translate strings, semantic tokens
│   ├── HeroBackground.tsx        # MIGRATE — gradient overlays referencing semantic tokens for theme-correct hero glow
│   └── ...                       # any future shared components
├── pages/
│   └── index.tsx                 # MIGRATE — every page (Home, About, Services, Network, GVS, Contact, Inquiry):
│                                 #   - swap bg-slate-* / text-slate-* / border-slate-* → bg-surface / text-foreground / border-border
│                                 #   - swap ml-*/mr-*/pl-*/pr-*/text-left/text-right → ms-*/me-*/ps-*/pe-*/text-start/text-end
│                                 #   - wrap every visible string in t('...')
│                                 #   - rtl:-scale-x-100 on directional ChevronRight/ArrowRight icons
├── lib/utils.ts                  # unchanged
├── types.ts                      # unchanged
├── App.tsx                       # MINIMAL — no change unless the providers are mounted here instead of main.tsx
├── main.tsx                      # MINIMAL — wrap <App/> in <ThemeProvider><LanguageProvider>
└── index.css                     # MIGRATE — add @fontsource-variable/cairo import,
                                  #   @custom-variant dark, semantic CSS-variable tokens (default = dark),
                                  #   [data-theme="light"] override block,
                                  #   transition rule scoped to html[data-theme-bootstrapped] *,
                                  #   :root[lang="ar"] body font-family binding

scripts/
└── verify-catalogs.ts            # NEW — build-time catalog validator (contract: catalog-schema.md)

index.html                        # MIGRATE — add inline bootstrap IIFE inside <head> (contract: bootstrap-script.md)
package.json                      # MIGRATE — add @fontsource-variable/cairo dep, "prebuild": "tsx scripts/verify-catalogs.ts"
```

**Structure Decision**: Reuse the existing single-project Vite SPA layout. Two new feature folders (`src/i18n/`, `src/theme/`) keep the providers and catalogs cohesive without introducing a new top-level directory or a workspace split. Page and component migrations stay in their existing files; no relocation. The only new top-level artifact is `scripts/verify-catalogs.ts`, intentionally outside `src/` because it's a build-time tool, not application code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations to justify (no principles ratified). Table left empty intentionally.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _(none)_  |            |                                      |
