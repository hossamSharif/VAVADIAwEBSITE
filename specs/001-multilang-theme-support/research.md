# Phase 0 Research: Multi-Language (Arabic/English) and Light/Dark Theme

**Feature**: `001-multilang-theme-support`
**Date**: 2026-05-04
**Stack baseline (observed)**: React 19 + TypeScript + Vite 6 + Tailwind CSS v4 (`@theme` CSS-first config) + `motion/react` + `lucide-react` + `react-router-dom` v7. No test framework wired up.

This document resolves every NEEDS CLARIFICATION item implied by the Technical Context and records the design decisions that drive Phase 1 and the eventual `tasks.md`.

---

## R1. i18n approach: hand-rolled React Context vs. library

**Decision**: Use a hand-rolled `LanguageProvider` (React Context + flat JSON catalogs) — no `react-i18next` or `i18next` dependency.

**Rationale**:
- The spec scope is exactly two languages, no pluralization rules, no namespacing, no lazy locale loading, no ICU formatting beyond Western digits (FR-008a explicitly forbids Arabic-Indic digits). The library buys very little here.
- A ~50-line provider with `t(key, fallback?)` covers FR-008 (other-language fallback) directly and is trivial to reason about.
- Fewer dependencies = lower bundle and fewer upgrade landmines on top of a recently-released React 19.
- Hot-reload of catalogs works out of the box with Vite (plain TS imports).

**Alternatives considered**:
- `react-i18next` — adds ~30 KB gz + a second runtime config layer; no payoff at this scale.
- `react-intl` — heavier, ICU-focused; overkill for two languages with simple strings.
- URL-prefixed locales (`/en/`, `/ar/`) — explicitly out of scope per spec Assumptions.

**API shape** (used by Phase 1 contracts):
```ts
type Lang = 'en' | 'ar';
type Dir  = 'ltr' | 'rtl';
interface LanguageContextValue {
  lang: Lang;
  dir:  Dir;
  setLang(next: Lang): void;
  t(key: string, fallback?: string): string;
}
```

---

## R2. Right-to-left strategy

**Decision**:
1. Set `<html dir="rtl" lang="ar">` (or `ltr` / `en`) imperatively whenever language changes, plus once during the pre-mount bootstrap script.
2. Migrate physical Tailwind directional utilities (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, `text-right`, `left-*`, `right-*`, `border-l`, `border-r`, `space-x-*`) to **logical** equivalents (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `start-*`, `end-*`, `border-s`, `border-e`). Tailwind v4 ships these natively.
3. Use the `rtl:` and `ltr:` variants only for cases where mirroring requires more than direction-swap (e.g., decorative arrows, the rotate-45 squares, gradient skews).
4. `lucide-react` icons that imply direction (`ChevronRight`, `ChevronLeft`, `ArrowRight`) get `rtl:-scale-x-100` so they flip glyph-wise under RTL; non-directional icons (Globe, Sun, Moon, Mail) are left alone.

**Rationale**: Logical properties are the modern, low-friction approach and avoid the cost of duplicating every utility under `rtl:`. They keep the LTR baseline visually unchanged.

**Alternatives considered**:
- `dir="auto"` per element — fragile for mixed content, doesn't address layout flow.
- Keeping physical utilities + `rtl:` overrides everywhere — ~2× the class soup, error-prone.
- A separate stylesheet per direction — heavyweight; tooling cost not justified.

**Mixed-direction hardening** (spec Edge Cases):
- Inline English fragments inside Arabic text get `<bdi>` or `dir="ltr"`.
- Phone numbers, prices, and URLs are wrapped in `<span dir="ltr">` so digits and slashes don't flip.

---

## R3. Theme strategy: data-attribute + CSS variables (Tailwind v4)

**Decision**: Manual class strategy via a `data-theme` attribute on `<html>` (`data-theme="light"` or `data-theme="dark"`), with semantic CSS variables defined under each value and a Tailwind v4 `@custom-variant` so `dark:` utilities still work.

**Why this and not `class="dark"` strategy**:
- `data-theme` reads more clearly when introspecting in DevTools and doesn't collide with the existing `cn()` class-merging logic.
- One attribute is easier to set atomically in the inline bootstrap script (FR-014 — no flash).

**Rationale for CSS-variable tokens** (rather than rewriting every page with `dark:bg-slate-950`):
- The site's pages are written against hard-coded `bg-slate-900`, `bg-slate-950`, `border-slate-800`, `text-slate-400`, etc. Doubling those to `dark:` variants is mechanical drudgery and leaves the *light* theme un-designed (we'd have to invent a light palette in dozens of files).
- A semantic-token layer lets us declare, once: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-foreground`, `--color-foreground-muted`, `--color-border`, `--color-border-strong`, `--color-accent` (= brand-gold/yellow), `--color-accent-contrast`, plus a couple of overlay/glass tokens. Each page then uses `bg-surface`, `text-foreground`, `border-border` and theme-switches automatically.
- Brand tokens (`--color-brand-yellow`, `--color-brand-blue`, `--color-brand-navy`) stay constant across themes. Only the neutral spine changes.

**Tailwind v4 wiring** (in `src/index.css`):
```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme {
  /* invariant brand */
  --color-brand-yellow: #ffc424;
  --color-brand-blue:   #1e5bc6;
  --color-brand-navy:   #0b1b3f;
  --color-brand-gold:   #ffc424;   /* alias kept */

  /* semantic tokens — dark defaults below; light overrides under [data-theme="light"] */
  --color-bg:                 #0b1b3f;
  --color-surface:            #0f172a;
  --color-surface-2:          #1e293b;
  --color-foreground:         #f1f5f9;
  --color-foreground-muted:   #94a3b8;
  --color-border:             #1e293b;
  --color-border-strong:      #334155;
  --color-accent:             var(--color-brand-yellow);
  --color-accent-contrast:    var(--color-brand-navy);
}

[data-theme="light"] {
  --color-bg:                 #ffffff;
  --color-surface:            #f8fafc;
  --color-surface-2:          #f1f5f9;
  --color-foreground:         #0b1b3f;
  --color-foreground-muted:   #475569;
  --color-border:             #e2e8f0;
  --color-border-strong:      #cbd5e1;
  --color-accent:             var(--color-brand-yellow);
  --color-accent-contrast:    var(--color-brand-navy);
}
```

This gives us utilities like `bg-bg`, `bg-surface`, `text-foreground`, `border-border`, `text-foreground-muted` for free in Tailwind v4. Pages migrate from `bg-slate-900` → `bg-surface`, `text-slate-400` → `text-foreground-muted`, `border-slate-800` → `border-border`, etc.

**Alternatives considered**:
- `class="dark"` strategy — works but couples theme switching to className composition; less ergonomic for an attribute that lives at the document root.
- Keeping hardcoded slate utilities and adding `dark:` variants — see above; unworkable amount of edit volume per page and forces invention of a light palette element-by-element.
- CSS-only theming via `prefers-color-scheme` media query — fails FR-013 (manual override must persist after OS change).

---

## R4. Persistence + bootstrap (no flash of wrong theme/lang)

**Decision**:
- Persist preferences in `localStorage` under two stable keys: `vavadia.lang` and `vavadia.theme`.
- Add an inline blocking IIFE to `index.html` *before* `<div id="root">` that:
  1. Reads `vavadia.theme`; if absent, reads `matchMedia('(prefers-color-scheme: dark)')`; default `light`.
  2. Reads `vavadia.lang`; if absent, defaults to `'ar'` if `navigator.language` starts with `ar`, else `'en'`.
  3. Sets `document.documentElement.dataset.theme`, `.lang`, `.dir` accordingly.
  4. Adds a `data-theme-bootstrapped` flag that the CSS uses to *enable* theme transitions (the very first paint runs without transitions so a returning visitor doesn't see a 200 ms color blend on load).
- Catch and swallow exceptions (private/incognito with storage disabled — spec Edge Case): the IIFE falls through to media/navigator detection silently and runs in-memory only for that session.

**Rationale**: A ~25-line synchronous script in `index.html` is the canonical solution and is the only way to guarantee FR-014 (no flash). Deferring this to React effects would always paint once with the wrong theme.

**Alternatives considered**:
- SSR-injected attribute — site is a Vite SPA; no SSR pipeline.
- Cookies — overkill, server-irrelevant.
- IndexedDB — async, defeats the purpose of bootstrap.

---

## R5. Theme transition (FR-015a: 150–250 ms smooth color blend)

**Decision**: A single CSS rule scoped to `html[data-theme-bootstrapped]` adds `transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease, fill 200ms ease, stroke 200ms ease;` to `*` (all elements). Honored by `prefers-reduced-motion: reduce` → `transition: none`.

**Rationale**:
- `200 ms` is the midpoint of the 150–250 ms band specified in FR-015a.
- Limiting the transition to color-family properties avoids re-laying-out anything (no width/height/transform animation) so interaction latency is zero (FR-015a second clause).
- Bootstrapped flag prevents the *initial* paint from blending — only user-driven theme switches transition.

**Alternatives considered**:
- `motion/react` view transitions — adds JS overhead for a job CSS handles natively.
- `View Transitions API` — Chromium-only at the time of writing; nice-to-have, not portable.

---

## R6. Arabic webfont loading (FR-008b)

**Decision**: Self-host the **Cairo** variable font via `@fontsource-variable/cairo` (npm), imported once at the top of `src/index.css`. Apply via:
```css
@theme {
  --font-arabic: "Cairo Variable", "Cairo", "Segoe UI", "Tahoma", sans-serif;
}
:root[lang="ar"] body,
:root[lang="ar"] {
  font-family: var(--font-arabic);
}
```

**Rationale**:
- Self-hosting means no Google Fonts request (privacy, predictable LCP, works offline-first if cached).
- Variable font keeps weight range covered with one file (the design uses 400, 700, 900).
- Subset to the Arabic + Latin Extended A range to keep payload < 80 KB compressed.

**Alternatives considered**:
- Tajawal / IBM Plex Sans Arabic — both equally acceptable; Cairo chosen because its display-weight pairs naturally with the existing Inter/Outfit display sans.
- Loading from Google Fonts CSS API — third-party request and a possible FOIT during bootstrap.

---

## R7. Translation catalog organization

**Decision**:
- Catalogs live under `src/i18n/catalogs/`.
- Two files: `en.ts` and `ar.ts`. Each exports a flat object `Record<string, string>` keyed by dotted paths: e.g. `nav.home`, `home.hero.title`, `inquiry.section.contact`.
- A type guard (`Catalog`) is generated from `en.ts` so the Arabic file is checked for missing keys at compile time (TypeScript: `type CatalogKey = keyof typeof en;` then `const ar: Record<CatalogKey, string> = { ... }`).
- The `t(key, fallback?)` function returns: catalog\[lang]\[key] ?? catalog\[other]\[key] ?? fallback ?? key. (FR-008.)

**Rationale**:
- Flat keys are easier to grep and refactor than nested objects.
- The TypeScript invariant catches "I added an English string but forgot Arabic" at build time — exactly the kind of regression FR-001/SC-001 are written to prevent.

**Alternatives considered**:
- JSON files — fine, but loses the compile-time check; we'd need a separate validation step.
- Per-page catalogs — premature; site is small enough for one file per language.

---

## R8. Numeric content (FR-008a — Western digits in both languages)

**Decision**: Render numbers as plain JavaScript numbers/strings; do **not** use `Intl.NumberFormat('ar-SA')` or `'ar-EG'` (which would produce Arabic-Indic digits). For dates, use `Intl.DateTimeFormat('en')` regardless of active language, or hand-format. Phone numbers stored as literal strings already in Western digits.

**Rationale**: Spec is explicit. The default JS `String(n)` already emits 0–9.

**Alternatives considered**: `new Intl.NumberFormat('ar', { numberingSystem: 'latn' })` — equivalent output but slower and unnecessary.

---

## R9. Toggle UX & placement (Q5 from clarifications, FR-002 / FR-010)

**Decision**:
- Two distinct icon buttons in the navbar's right-hand cluster, **outside** the mobile hamburger overlay so they remain visible at all viewport widths.
- Language toggle: `lucide-react` `Globe` icon. `aria-label` = "Switch to {other-language-name}". Optional small text label (`AR` / `EN`) to the right at desktop ≥ lg.
- Theme toggle: `lucide-react` `Sun` (when current = dark — clicking switches to light) / `Moon` (when current = light — clicking switches to dark). `aria-label` = "Switch to {opposite-theme} theme".
- Both buttons sit between the desktop nav links and the "Submit Inquiry" CTA on desktop, and between the logo and the hamburger button on mobile. Icons are 20 px with a 40×40 px tap target.

**Rationale**: The clarification explicitly disallows hiding either toggle inside an overflow menu, and the existing navbar already has `Globe` imported (unused) — placement is natural.

---

## R10. Testing strategy (no framework currently installed)

**Decision**: Defer adding a unit-test framework to a future PR. For this feature, validation is:
- TypeScript `tsc --noEmit` (already wired as `npm run lint`) catches catalog key mismatches.
- Manual quickstart.md walkthrough exercises every acceptance scenario.
- A one-shot script `scripts/verify-catalogs.ts` (run with `tsx`) asserts at build time that every key present in `en.ts` is also in `ar.ts` and vice-versa, and that no value is empty. This is invoked as a `prebuild` npm script.
- WCAG audit (SC-005) is performed with Lighthouse + axe DevTools manually on light and dark themes.

**Rationale**: Adding Vitest + jsdom for a feature this UI-shaped has poor return; the type checker plus a tiny custom assertion script catches the most likely regression class (missing translation). UI behavior is best verified by the quickstart steps.

**Alternatives considered**:
- Vitest + React Testing Library — appropriate eventually; out of scope here to avoid inflating the change.
- Playwright — also out of scope; manual quickstart is sufficient for one feature.

---

## R11. Pages migration scope (impact on existing components)

The following files reference physical / dark-only colors and directional utilities and will need migration during implementation. (Listed here to make the scope visible during planning, not to enumerate every line.)

- `index.html` — add lang/dir bootstrap script.
- `src/index.css` — add `@custom-variant dark`, semantic tokens, `[data-theme="light"]` block, transition rule, Cairo `@import`, `:root[lang="ar"]` font binding.
- `src/main.tsx` — wrap `<App/>` in `<ThemeProvider>` and `<LanguageProvider>`.
- `src/components/Navbar.tsx` — replace hard navy bg with `bg-bg`/`bg-surface`, add language + theme toggle buttons, translate `navLinks`, add `rtl:` mirroring for the chevron and mobile-overlay slide direction.
- `src/components/Footer.tsx` — translate strings, swap slate utilities to semantic tokens.
- `src/components/Layout.tsx` — replace `border-slate-900 bg-brand-navy` with semantic tokens; selection color stays brand.
- `src/components/HeroBackground.tsx` — gradient overlays referencing `--color-bg` instead of literal navy so the hero glows correctly under light theme.
- `src/pages/index.tsx` — every hard-coded `bg-slate-{900,950}`, `border-slate-800`, `text-slate-{300,400,500,600,700}` pair → semantic equivalents; every `text-left`/`text-right` / `ml-*` / `mr-*` → `text-start`/`text-end` / `ms-*` / `me-*`; every `ChevronRight` decorating "next" gets `rtl:-scale-x-100`; every visible string flows through `t(...)`.

This is mechanical but page-heavy. The eventual `tasks.md` breaks the migration into one task per surface so progress is visible.

---

## Outstanding NEEDS CLARIFICATION

None. All five spec clarifications are reflected in the decisions above (digits, font, contrast standard, transition timing, toggle layout). All technical unknowns are resolved.
