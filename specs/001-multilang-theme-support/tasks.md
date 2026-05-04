# Tasks: Multi-Language (Arabic/English) and Light/Dark Theme

**Input**: Design documents from `/specs/001-multilang-theme-support/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (i18n-provider.md, theme-provider.md, bootstrap-script.md, catalog-schema.md), quickstart.md

**Tests**: Per research.md R10 and plan.md, no unit-test framework is being added in this feature. Validation is via TypeScript strict mode (`tsc --noEmit`), the custom `scripts/verify-catalogs.ts` build-time validator, and the manual quickstart.md walkthrough. **No test tasks** are included below.

**Organization**: Tasks are grouped by user story (US1 = language switch, US2 = theme switch, US3 = combined independence) to enable independent implementation, validation, and incremental delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: User story label (US1, US2, US3) for story-phase tasks only
- File paths are absolute-from-repo-root and exact

## Path Conventions

Single-page Vite SPA with the existing layout (no new top-level dirs):

- New providers: `src/i18n/`, `src/theme/`
- Catalogs: `src/i18n/catalogs/{en,ar}.ts`
- Build-time validator: `scripts/verify-catalogs.ts`
- Migrations land in existing `src/components/`, `src/pages/`, `src/index.css`, `src/main.tsx`, `index.html`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the new dependency and the build-time guard rails before any provider/catalog code is authored.

- [ ] T001 Add `@fontsource-variable/cairo` to `dependencies` in `package.json` (Cairo Arabic webfont, self-hosted per FR-008b / research R6)
- [ ] T002 Add `tsx` to `devDependencies` in `package.json` (used to run the catalog validator at build time, per research R10)
- [ ] T003 Add `"prebuild": "tsx scripts/verify-catalogs.ts"` to the `scripts` section of `package.json` (wires the catalog validator into `npm run build`, per contracts/catalog-schema.md)
- [ ] T004 Run `npm install` at the repo root to lock the new dependencies into `package-lock.json`
- [ ] T005 [P] Create the empty directory layout `src/i18n/`, `src/i18n/catalogs/`, `src/theme/`, and `scripts/` (no files yet — this task only ensures the parents exist for downstream tasks)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the catalog files, both providers, the bootstrap IIFE, the semantic-token CSS layer, the validator script, and mount the providers. After this phase the toggles do not yet exist in the navbar and the pages have not yet been migrated, but the entire underlying mechanism is in place. **No user story can be implemented until this phase is complete** because every page migration calls `t(...)`, every theme switch reads `data-theme`, and the no-flash bootstrap is required by FR-014 from the very first commit.

**⚠️ CRITICAL**: All user-story phases below depend on this phase completing.

### Catalog files & validator (contract: catalogs-schema.md)

- [ ] T006 Create the source-of-truth English catalog at `src/i18n/catalogs/en.ts` with `as const` flat object covering nav (`nav.home`, `nav.about`, `nav.services`, `nav.network`, `nav.gvs`, `nav.contact`, `nav.cta.inquiry`, `nav.toggle.lang.toAr`, `nav.toggle.lang.toEn`, `nav.toggle.theme.toDark`, `nav.toggle.theme.toLight`) plus placeholder section keys for `home.*`, `about.*`, `services.*`, `network.*`, `gvs.*`, `contact.*`, `inquiry.*`, `footer.*`, `common.*` — and export `type CatalogKey = keyof typeof en`
- [ ] T007 Create the Arabic catalog at `src/i18n/catalogs/ar.ts` typed as `Record<CatalogKey, string>` (importing `CatalogKey` from `./en`) with Arabic translations for every key declared in T006 — TypeScript will fail the build if any key is missing
- [ ] T008 Create `scripts/verify-catalogs.ts` implementing the four checks from contracts/catalog-schema.md: (1) symmetric key sets between `en` and `ar`, (2) no empty values, (3) no value matching the dotted-key shape `/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]+)+$/i`, (4) `en[k] !== ar[k]` except for an allow-list constant containing brand names (`VAVADIA`, `GVS`) and similar — exit `0` on success, `1` with a per-key diff on failure

### Language provider (contract: i18n-provider.md)

- [ ] T009 [P] Create `src/i18n/LanguageProvider.tsx` exporting `Lang`, `Dir`, `LanguageContextValue`, `LanguageProviderProps`, `LanguageProvider`, and `useLanguage` per the contract — initial-value selection order (props.initialLang → `<html>.lang` → `localStorage['vavadia.lang']` → `navigator.language` Arabic-prefix detection → `'en'`); `setLang` is idempotent, writes `localStorage['vavadia.lang']` inside `try/catch`, and updates `<html lang>` + `<html dir>` inside a `useLayoutEffect`; `t(key, fallback?)` resolves catalog\[lang]\[key] → catalog\[other]\[key] → fallback → key (FR-008); `useLanguage()` outside provider throws `Error('useLanguage must be used within <LanguageProvider>')`

### Theme provider (contract: theme-provider.md)

- [ ] T010 [P] Create `src/theme/ThemeProvider.tsx` exporting `Theme`, `ThemeSource`, `ThemeContextValue`, `ThemeProviderProps`, `ThemeProvider`, and `useTheme` per the contract — initial-value selection (props.initialTheme → `<html data-theme>` paired with `localStorage['vavadia.theme']` presence to set `source: 'user' | 'system'` → `matchMedia('(prefers-color-scheme: dark)')`); `setTheme` updates state, sets `document.documentElement.dataset.theme`, writes `localStorage['vavadia.theme']` inside `try/catch`, promotes `source` to `'user'`, and is a no-op when `next === theme && source === 'user'`; `toggle()` flips theme; `matchMedia` change listener installed on mount, removed on unmount, gated on `source === 'system'` (FR-013); `useTheme()` outside provider throws `Error('useTheme must be used within <ThemeProvider>')`

### Pre-mount bootstrap IIFE (contract: bootstrap-script.md)

- [ ] T011 Edit `index.html` to add an inline blocking `<script>` IIFE inside `<head>`, placed after `<meta>` tags and before any CSS link or the `<script type="module" src="/src/main.tsx">` entry — the IIFE reads `localStorage['vavadia.lang']` and `localStorage['vavadia.theme']`, falls back to `navigator.language?.toLowerCase().startsWith('ar')` and `matchMedia('(prefers-color-scheme: dark)').matches` respectively, sets `document.documentElement.lang`, `.dir`, `.dataset.theme`, and adds `dataset.themeBootstrapped = ''`, all wrapped in `try { ... } catch (_) {}` so private-browsing storage failures degrade silently

### CSS token layer & font binding (research R3, R5, R6)

- [ ] T012 Edit `src/index.css` to (a) add `@import "@fontsource-variable/cairo";` at the top, (b) add `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));` after the `@import "tailwindcss";`, (c) declare semantic tokens inside the existing `@theme` block (`--color-bg`, `--color-surface`, `--color-surface-2`, `--color-foreground`, `--color-foreground-muted`, `--color-border`, `--color-border-strong`, `--color-accent`, `--color-accent-contrast`, plus `--font-arabic: "Cairo Variable", "Cairo", "Segoe UI", "Tahoma", sans-serif`) defaulted to dark values, (d) add a `[data-theme="light"] { ... }` override block with the light palette, (e) add a transition rule scoped to `html[data-theme-bootstrapped] *` covering only `background-color, color, border-color, fill, stroke` at `200ms ease` (FR-015a), (f) add `@media (prefers-reduced-motion: reduce) { html[data-theme-bootstrapped] * { transition: none; } }`, and (g) bind `:root[lang="ar"] body { font-family: var(--font-arabic); }`

### Provider mount

- [ ] T013 Edit `src/main.tsx` to wrap `<App />` (or its current root element) in `<ThemeProvider><LanguageProvider>...</LanguageProvider></ThemeProvider>` so every component below the root has access to both contexts — no other change

**Checkpoint**: Catalogs validated, both providers exported and mounted, bootstrap IIFE prevents flash, and the semantic-token CSS layer is live. `npm run build` should now succeed (with the prebuild validator passing) even though no UI surface is using `t(...)` yet. User-story phases below can begin in parallel.

---

## Phase 3: User Story 1 — Switch Site Language Between English and Arabic (Priority: P1) 🎯 MVP

**Goal**: Visitors can switch the entire site between English and Arabic via a navbar Globe toggle. Direction flips to RTL under Arabic, every visible string is translated, the choice persists across reloads, and the toggle never leaves visitors hanging on a partially-translated page (FR-001..FR-008b, FR-016/017 for the language half).

**Independent Test**: With Phase 2 mounted, click the Globe icon in the navbar; verify (1) every visible text in nav, hero, services, network, GVS, contact, footer, and inquiry-form labels updates to Arabic, (2) `<html dir="rtl">` and Cairo font apply, (3) directional chevrons on CTAs mirror, (4) reload preserves the choice, (5) `vavadia.lang` is set in `localStorage`, (6) digits stay Western (0–9), (7) inline English fragments like `info@vavadia.com` and phone numbers stay LTR.

### Navbar toggle UI (the visible control for US1)

- [ ] T014 [US1] Edit `src/components/Navbar.tsx` to add a Globe icon button to the navbar's right-hand cluster (outside the mobile hamburger overlay so it stays visible on mobile per FR-002), `aria-label` set to `t('nav.toggle.lang.toAr')` when `lang === 'en'` and `t('nav.toggle.lang.toEn')` when `lang === 'ar'`, optional `AR`/`EN` text label visible at desktop ≥ lg, click handler calls `setLang(lang === 'en' ? 'ar' : 'en')` from `useLanguage()`, with a 40×40 px tap target

### Translate the Navbar shell

- [ ] T015 [US1] In `src/components/Navbar.tsx` replace the hard-coded `navLinks` array literal labels (`Home`, `About`, `Services`, `Global Network`, `GVS (Sudan)`, `Contact`) and the `Submit Inquiry` CTA with `t('nav.home')`, `t('nav.about')`, `t('nav.services')`, `t('nav.network')`, `t('nav.gvs')`, `t('nav.contact')`, `t('nav.cta.inquiry')` respectively; mirror the directional Chevron icon used in the mobile overlay slide-in/-out using `rtl:-scale-x-100`

### Translate the Footer

- [ ] T016 [P] [US1] Edit `src/components/Footer.tsx` to wrap every visible string (column headings, link labels, copyright, status indicators) in `t('footer.*')` calls; replace any `text-left`/`text-right`/`ml-*`/`mr-*`/`pl-*`/`pr-*` directional utilities with logical equivalents (`text-start`/`text-end`/`ms-*`/`me-*`/`ps-*`/`pe-*`); wrap the email and any phone number / IP-style technical strings in `<span dir="ltr">…</span>` so digits and `@` do not reverse under RTL

### Translate Layout chrome

- [ ] T017 [P] [US1] Edit `src/components/Layout.tsx` to wrap any visible strings rendered directly by Layout (skip-to-content link, etc., if present) in `t(...)`, and replace physical directional utilities with logical equivalents

### Translate page sections (Home, About, Services, Network, GVS, Contact, Inquiry)

- [ ] T018 [US1] Edit `src/pages/index.tsx` Home section: replace every visible English string (hero headline, sub-headline, description, primary/secondary CTA labels) with `t('home.hero.*')` calls; replace `text-left`/`text-right`/`ml-*`/`mr-*` with logical equivalents; add `rtl:-scale-x-100` to any `ChevronRight`/`ArrowRight` icons inside CTAs
- [ ] T019 [US1] Edit `src/pages/index.tsx` About section: translate every visible string via `t('home.about.*')` (heading, body paragraphs, any feature bullets) and migrate directional utilities to logical equivalents
- [ ] T020 [US1] Edit `src/pages/index.tsx` Services section: translate every visible string via `t('home.services.*')` (section heading, each service card title and description, `Learn more` / `Read more` link labels), migrate directional utilities, mirror card-arrow chevrons with `rtl:-scale-x-100`
- [ ] T021 [US1] Edit `src/pages/index.tsx` Network section: translate every visible string via `t('home.network.*')`, including region names rendered as labels (region codes like `SD`, `CN`, `IN`, `AE` stay literal — they are codes, not language); migrate directional utilities; wrap any latency-style numeric values in `<span dir="ltr">` for safety
- [ ] T022 [US1] Edit `src/pages/index.tsx` GVS section: translate every visible string via `t('home.gvs.*')`, leaving the brand `GVS` literal; migrate directional utilities
- [ ] T023 [US1] Edit `src/pages/index.tsx` Contact section: translate every visible string via `t('home.contact.*')`; wrap `info@vavadia.com` and `+249 9XX XXX XXXX` (and any other phone/email) in `<span dir="ltr">…</span>` so they read correctly under RTL (spec Edge Case "Mixed-direction content")
- [ ] T024 [US1] Edit `src/pages/index.tsx` Inquiry-form section: translate every section header via `t('inquiry.section.{n}')`, every field label via `t('inquiry.field.{name}.label')`, every placeholder via `t('inquiry.field.{name}.placeholder')`, every validation/error string via `t('inquiry.field.{name}.error')`, and the submit button via `t('inquiry.submit')`; migrate directional utilities; ensure the form's controlled-input state stays mounted across language switches (no remount — `setLang` only changes context value)

**Checkpoint**: User Story 1 is independently demonstrable. Run quickstart.md checks 1, 2 (Globe half), 3 (lang half), 6, 7, 8 to validate before moving to Phase 4.

---

## Phase 4: User Story 2 — Switch Between Light and Dark Theme (Priority: P2)

**Goal**: Visitors can switch the entire site between light and dark themes via a navbar Sun/Moon toggle. Every surface (nav, hero, cards, body, form fields, footer) participates in a coordinated 200 ms color transition (FR-009..FR-015a, FR-016/017 for the theme half). Returning visitors see the saved theme from the first paint.

**Independent Test**: With Phase 2 mounted and Phase 3 complete, click the Sun/Moon icon; verify the entire UI transitions colors smoothly without partial leftovers, the toggle's icon flips to the opposite of the active theme, reload preserves the choice with no flash of the wrong theme, OS-preference changes after a manual selection do not override (FR-013), and reduced-motion users see an instant snap.

### Navbar toggle UI

- [ ] T025 [US2] Edit `src/components/Navbar.tsx` to add a Sun/Moon icon button to the right-hand cluster next to the Globe button (outside the mobile hamburger overlay per FR-010): show `Sun` when `theme === 'dark'` and `Moon` when `theme === 'light'`, `aria-label` set to `t('nav.toggle.theme.toLight')` or `t('nav.toggle.theme.toDark')` accordingly, click handler calls `toggle()` from `useTheme()`, 40×40 px tap target

### Migrate Navbar surfaces to semantic tokens

- [ ] T026 [US2] In `src/components/Navbar.tsx` replace hard-coded color utilities (`bg-brand-navy`/`bg-slate-{900,950}` → `bg-bg` or `bg-surface`, `text-slate-{300,400}` → `text-foreground-muted`, `text-white` → `text-foreground` where appropriate, `border-slate-800` → `border-border`, hover/focus colors via `hover:bg-surface-2` / `hover:text-foreground`) so the navbar visually flips with `data-theme`

### Migrate Footer surfaces

- [ ] T027 [P] [US2] In `src/components/Footer.tsx` replace `bg-slate-{900,950}` → `bg-surface`, `text-slate-{300,400,500}` → `text-foreground-muted`, `border-slate-800` → `border-border`, link `text-brand-yellow` stays (brand token is theme-invariant); ensure no `dark:` utilities remain — the variable layer handles both themes

### Migrate Layout surfaces

- [ ] T028 [P] [US2] In `src/components/Layout.tsx` replace `border-slate-900 bg-brand-navy` (and any sibling slate utilities) with `bg-bg` / `border-border`; keep the brand-tinted selection color literal

### Migrate HeroBackground

- [ ] T029 [P] [US2] In `src/components/HeroBackground.tsx` rewrite gradient overlays so their stop colors reference the semantic tokens (`var(--color-bg)`, `var(--color-surface)`, `var(--color-accent)`) instead of hard-coded navy/slate hex values, so the hero glow renders correctly under both themes

### Migrate page sections

- [ ] T030 [US2] In `src/pages/index.tsx` Home + About sections, replace every `bg-slate-{900,950}` → `bg-bg`/`bg-surface`, `bg-slate-800` → `bg-surface-2`, `text-slate-{300,400,500,600,700}` → `text-foreground-muted` (or `text-foreground` for primary copy), `border-slate-{700,800}` → `border-border`/`border-border-strong`; preserve `text-brand-yellow` / `bg-brand-yellow` literally
- [ ] T031 [US2] In `src/pages/index.tsx` Services + Network sections, perform the same slate-to-semantic-token migration described in T030; verify card backgrounds, hover overlays, divider lines all use semantic tokens
- [ ] T032 [US2] In `src/pages/index.tsx` GVS + Contact sections, perform the same slate-to-semantic-token migration described in T030; ensure the contact card and any map/illustration backdrop use semantic tokens
- [ ] T033 [US2] In `src/pages/index.tsx` Inquiry-form section, replace input/select `bg-slate-{800,900}`/`border-slate-{700,800}`/`text-slate-{300,400}` with `bg-surface`/`bg-surface-2`/`border-border`/`text-foreground`/`text-foreground-muted` (and adjust focus rings to `focus:border-accent` / `focus:ring-accent` so they remain visible on both themes)

**Checkpoint**: User Story 2 is independently demonstrable. Run quickstart.md checks 1 (theme half), 2 (Sun/Moon half), 3 (theme half), 5, 9, 10, 11 to validate before moving to Phase 5.

---

## Phase 5: User Story 3 — Combined Language and Theme Preferences Work Together (Priority: P3)

**Goal**: Both preferences coexist as independent state — switching one never resets the other, both survive reload independently, and both toggles are reachable on every page (FR-016, FR-017, US3 acceptance scenarios). This is largely an integration-guarantee phase; if Phases 3 and 4 were authored cleanly the work is verification + small polish.

**Independent Test**: Set Arabic + dark; reload, both persist. Toggle theme to light; language stays Arabic. Toggle language to English; theme stays light. Navigate to `/about`, `/services`, `/network`, `/gvs`, `/contact`, `/inquiry`; both toggles are visible, behave identically, and preferences remain consistent.

- [ ] T034 [US3] In `src/components/Navbar.tsx` confirm that Globe and Sun/Moon buttons sit as siblings in the right-hand cluster on both desktop (≥ 1024 px) and mobile (≤ 640 px) and are NEVER children of the mobile hamburger overlay; if any media-query class accidentally hides either toggle on a breakpoint, fix it
- [ ] T035 [US3] In `src/components/Navbar.tsx` verify both toggles render on every route by relying on the shared Navbar inside `src/components/Layout.tsx`; if the Navbar is conditionally rendered per route, remove the condition so the toggles are universal (FR-017)
- [ ] T036 [US3] Add a regression-guard comment block at the top of `src/i18n/LanguageProvider.tsx` and `src/theme/ThemeProvider.tsx` reminding future editors that the two providers MUST stay independent (no shared keys, no cross-writes), per FR-016 — single short comment, not a doc dump

**Checkpoint**: All three user stories are independently functional. Run the full quickstart.md (checks 1–13) to validate the feature end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build-time guard rails, contrast audit, mixed-direction edge-case sweeps, and final-mile cleanup that span all three stories.

- [ ] T037 [P] Run `npm run build` from the repo root and confirm the `prebuild` step executes `tsx scripts/verify-catalogs.ts` and passes; if any catalog asymmetry, empty value, or raw-key value is found, fix the catalog and re-run until clean
- [ ] T038 [P] Run `npm run lint` (which is wired to `tsc --noEmit`) from the repo root and resolve any TypeScript errors introduced by the migration, paying special attention to `src/i18n/catalogs/ar.ts` reporting missing `CatalogKey` properties
- [ ] T039 Sweep `src/pages/index.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/Layout.tsx`, `src/components/HeroBackground.tsx` for any remaining physical directional utilities (`ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`, `left-`, `right-`, `border-l`, `border-r`, `space-x-`) and replace with logical equivalents (`ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`, `start-`, `end-`, `border-s`, `border-e`, `space-s-` where supported) — research R2
- [ ] T040 Sweep the same files for any leftover `bg-slate-`, `text-slate-`, `border-slate-`, `bg-brand-navy` (used as a theme color rather than a brand accent), and `dark:` utility variants; replace with semantic tokens or remove the redundant `dark:` pair (the variable layer makes them unnecessary)
- [ ] T041 [P] Spot-check mixed-direction content under Arabic in browser: confirm `info@vavadia.com`, phone numbers, brand names (`VAVADIA`, `GVS`), and any URL-like strings render LTR via `<span dir="ltr">` wrappers; add the wrapper anywhere a regression is found (spec Edge Cases)
- [ ] T042 [P] Run Lighthouse Accessibility audit on `/`, `/about`, `/services`, `/inquiry` once in light theme and once in dark theme; verify zero contrast failures (FR-015, SC-005); if any fail, adjust the corresponding palette entry inside `src/index.css` (`--color-foreground-muted`, `--color-border`, etc.) until the audit is clean
- [ ] T043 Walk through the full quickstart.md script (all 13 checks) on Chromium ≥ 122 with mobile emulation (iPhone 14 Pro, Pixel 7); fix any failure at the source (do not paper over with conditional logic)
- [ ] T044 Subset the bundled Cairo font to keep payload ≤ 80 KB compressed (research R6) — verify by inspecting the built `dist/` output; if larger, configure `@fontsource-variable/cairo` to load only the Arabic + Latin Extended subset

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion. **Blocks all user stories** — no `t(...)` call works until the providers exist and are mounted, and no theme toggle can flip surfaces until the CSS variable layer is in place.
- **Phase 3 (US1, P1)**: Depends on Phase 2.
- **Phase 4 (US2, P2)**: Depends on Phase 2. **Independent of Phase 3** — can be implemented in parallel by a different developer; the Globe and Sun/Moon toggles touch the same `Navbar.tsx` so coordinate that file's edits, but page-section migrations split cleanly (US1 = strings, US2 = colors).
- **Phase 5 (US3, P3)**: Depends on Phases 3 and 4 — it is an integration-guarantee phase that mostly verifies independence.
- **Phase 6 (Polish)**: Depends on all desired user stories being complete.

### Within-Phase Dependencies

- T002–T004 depend on T001 (must add deps before installing).
- T005 depends on T001 (directories may already partially exist; this task is a parent-create idempotent step).
- T006 → T007 (TypeScript symmetry: `ar.ts` imports `CatalogKey` from `en.ts`).
- T008 depends on T006 + T007 (validator reads both catalogs).
- T009 depends on T006 (provider's `t` reads the catalogs); independent of T010.
- T010 has no catalog dependency; independent of T009.
- T011 has no React dependency; can land in parallel with T009/T010 but must precede T013.
- T012 has no React dependency; independent of T009/T010/T011.
- T013 depends on T009 + T010.
- T014 depends on T013 (needs `useLanguage` mounted) + T015's catalog keys; T015 depends on T006 catalog keys for `nav.*`.
- T018–T024 each depend on T013 + T006/T007 catalog keys for their section.
- T025 depends on T013 + T006 catalog keys for `nav.toggle.theme.*`.
- T026–T033 depend on T012 (semantic tokens defined).
- T034–T036 depend on Phase 3 + Phase 4 completion.
- T037–T044 each gate on the relevant prior phase content existing.

### Parallel Opportunities

**Within Phase 2** (after T006/T007 complete):

- T009 (LanguageProvider) ∥ T010 (ThemeProvider) ∥ T011 (bootstrap IIFE) ∥ T012 (CSS tokens) — four independent files.

**Within Phase 3** (after T013 + T014 complete):

- T016 (Footer) ∥ T017 (Layout) ∥ T018 (Home section) — three independent files; T019–T024 also each touch `src/pages/index.tsx` so they must land sequentially relative to each other but can interleave with T016/T017.

**Within Phase 4** (after T013 + T025 complete):

- T027 (Footer) ∥ T028 (Layout) ∥ T029 (HeroBackground) ∥ T030 (Home/About sections of pages/index.tsx) — four independent files; T031–T033 also each touch `src/pages/index.tsx` so sequential among themselves but can interleave with the others.

**Cross-phase parallel** (after Phase 2 completes):

- A developer can drive Phase 3 (translation work) while another drives Phase 4 (token migration); the only shared file is `Navbar.tsx` (T014/T015 ⇆ T025/T026), which should be coordinated via two consecutive PRs or a single PR doing the navbar end-to-end.

**Within Phase 6**:

- T037 ∥ T038 ∥ T041 ∥ T042 are independent; T039/T040/T043/T044 each touch shared surfaces and run sequentially.

---

## Parallel Example: Foundational (Phase 2)

```bash
# After T006 + T007 + T008 land, kick off the four independent foundation pieces:
Task: "Create src/i18n/LanguageProvider.tsx per contracts/i18n-provider.md"        # T009
Task: "Create src/theme/ThemeProvider.tsx per contracts/theme-provider.md"          # T010
Task: "Add inline pre-mount IIFE to index.html per contracts/bootstrap-script.md"   # T011
Task: "Add semantic-token layer + transitions to src/index.css per research R3/R5" # T012
```

## Parallel Example: User Story 1 page migration

```bash
# After T013 + T014 + T015 land, page sections migrate in parallel where they touch different files:
Task: "Translate src/components/Footer.tsx via t('footer.*')"  # T016
Task: "Translate src/components/Layout.tsx chrome strings"     # T017

# Within src/pages/index.tsx, sections migrate sequentially (same file):
Task: "Translate Home section in src/pages/index.tsx"          # T018
Task: "Translate About section in src/pages/index.tsx"         # T019
# ... T020 → T021 → T022 → T023 → T024
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup) — adds Cairo font dep + tsx + prebuild hook.
2. Complete Phase 2 (Foundational) — providers, IIFE, CSS tokens, mount. **CRITICAL — blocks every story.**
3. Complete Phase 3 (US1 — Language toggle + page translation). Bilingual Arabic/English MVP is shippable here.
4. **STOP and VALIDATE**: walk quickstart.md sections 1, 2 (Globe), 3 (lang), 6, 7, 8 — confirm the bilingual experience is solid.
5. Deploy/demo if ready: visitors get the language feature; the site continues to render in its original (dark-only) palette via the semantic-token defaults from T012.

### Incremental Delivery

1. Setup + Foundational → foundation ready, no user-visible change yet.
2. + User Story 1 → bilingual site with persistent language preference. Demo this. (MVP)
3. + User Story 2 → light theme is now available; visitors can pick. Demo this.
4. + User Story 3 → integration-guarantee verified across pages. Final demo.
5. + Polish → contrast clean, mixed-direction clean, build pipeline catches future regressions.

### Parallel Team Strategy

With two developers after Phase 2:

- Developer A drives Phase 3 (US1) — focuses on catalog content + page strings. Touches `src/components/{Navbar,Footer,Layout}.tsx` and `src/pages/index.tsx` (string-substitution edits) and `src/i18n/catalogs/{en,ar}.ts`.
- Developer B drives Phase 4 (US2) — focuses on color migration. Touches the same files but only color utilities. Coordinate the two PRs (or land them in sequence) to avoid merge churn on `Navbar.tsx` and `pages/index.tsx`.
- Both rendezvous on Phase 5 (light verification work) and Phase 6 (audits + sweeps).

---

## Notes

- **Tests intentionally absent**: per plan.md and research.md R10, no Vitest/RTL/Playwright is being added in this feature. Validation flows through TypeScript strict mode (compile-time catalog symmetry), `scripts/verify-catalogs.ts` (build-time semantic checks), and the manual quickstart.md walkthrough.
- **`[P]` means the task is safe to parallelize** because it touches a different file or has no incomplete dependencies. Within a single file (`src/pages/index.tsx`, `src/components/Navbar.tsx`), tasks are sequential to avoid merge conflicts even if they belong to different stories.
- **Each user story phase is independently testable** at its checkpoint via the quickstart.md sections cited there.
- **Avoid**: vague tasks ("update colors"), same-file conflicts (always note the file path), cross-story dependencies that would couple the language and theme provider state (FR-016 forbids this).
- **Commit cadence**: one commit per task or per logical group of `[P]` tasks. The `after_tasks` git hook (see `.specify/extensions.yml`) will offer to commit the generated `tasks.md` itself.
