# Quickstart: Multi-Language + Light/Dark Theme

This document is the manual verification script for feature `001-multilang-theme-support`. Run after implementation; every check maps to one or more spec acceptance scenarios.

## Setup

```sh
npm install
npm run dev
```

Open `http://localhost:3000` in a fresh Chrome window (Profile → Guest is fastest for "first-time visitor" checks).

You'll be doing a lot of "clear storage and reload" — keep DevTools open with the **Application → Local Storage → http://localhost:3000** panel pinned. The two keys to watch are:

- `vavadia.lang`  — should be `"en"` or `"ar"`, or absent on first visit.
- `vavadia.theme` — should be `"light"` or `"dark"`, or absent on first visit.

## Checks

### 1. Default selection from browser/OS preferences

Maps to: **US1 #1, US1 #2, US2 #1, US2 #2.**

1. In DevTools → Application → Storage → "Clear site data". Reload.
2. With Chrome → Settings → Appearance set to "Light", and primary browser language English: page renders in English LTR with the light theme. Both `localStorage` keys are absent (`source = 'system'`).
3. With Chrome → Settings → Appearance set to "Dark": clear storage, reload — page renders dark.
4. With browser language set to Arabic (chrome://settings/languages, drag العربية to top): clear storage, reload — page renders in Arabic with `<html dir="rtl">`.

**Verify in DOM**: `<html lang="..." dir="..." data-theme="..." data-theme-bootstrapped>` is set on first paint. Inspect the `<html>` element while frozen via `Sources → Pause on next` to confirm there's no flash.

### 2. Toggle interactions

Maps to: **US1 #3, US2 #3.**

1. Click the **Globe** icon in the navbar. Every visible string changes from English to Arabic; layout flips to RTL; the navbar button now shows an aria-label of "Switch to English". Numbers (e.g., footer "Latency: 42ms", inquiry IDs, dates in admin view) stay as Western digits 0–9.
2. Click the **Sun/Moon** icon. The whole UI — page background, hero, cards, navbar, footer, form fields — transitions colors smoothly over ~200 ms (no abrupt snap, no half-themed leftover panel).
3. Both buttons are visible at desktop (≥ 1024 px) and mobile (≤ 640 px) — they are NOT hidden inside the hamburger overlay. (Resize to 375 px wide and confirm.)
4. While Arabic is active, the chevron decorations on call-to-action buttons (e.g., the "→" inside `Submit Inquiry` and Services card arrows) point left visually (mirrored).

### 3. Persistence across reloads

Maps to: **US1 #4, US2 #4, US3 #1.**

1. Toggle to Arabic + dark. Confirm `localStorage` has `vavadia.lang="ar"` and `vavadia.theme="dark"`.
2. Hard reload (`Ctrl+F5`). Page paints directly in Arabic + dark with no visible flash of English or light.
3. **Frame-by-frame check** (recommended): DevTools → Performance → record a reload. The first paint in the timeline should already be themed correctly. If you see a light frame followed by a dark frame, the bootstrap IIFE is missing or running too late.

### 4. Independence of the two preferences

Maps to: **US3 #2, US3 #3, FR-016.**

1. Starting from Arabic + dark: click theme toggle. Theme changes to light; language stays Arabic; storage now has `vavadia.lang="ar"`, `vavadia.theme="light"`.
2. Click language toggle. Language changes to English; theme stays light.
3. Reload. Both preferences load correctly together.

### 5. OS preference does not override manual choice

Maps to: **US2 #5, FR-013.**

1. Set OS / Chrome theme to Dark. Clear storage. Reload — page renders dark (source: system).
2. Click theme toggle to switch to light. Storage now has `vavadia.theme="light"`.
3. Change OS theme back to Light, then back to Dark, while the page is open. The page MUST stay light. (The provider's media-query listener is active but gated on `source === 'system'`.)

### 6. Switching mid-page does not lose state

Maps to: **US1 #5, FR-007, SC-007.**

1. Navigate to `/inquiry`. Type into "Full Legal Name", "WhatsApp", and "Volume Depth".
2. Scroll to the middle of the form.
3. Click the language toggle. Verify:
   - You stay on `/inquiry` (URL unchanged).
   - Your scroll position is preserved (within a few pixels — minor reflow is OK; no jump to top).
   - Your typed values are still in the inputs.
4. Click the theme toggle. Same checks.

### 7. Translation coverage

Maps to: **FR-001, FR-008, SC-001.**

1. With Arabic active, walk through every page: `/`, `/about`, `/services`, `/network`, `/gvs`, `/contact`, `/inquiry`. No English text should appear in primary content — except brand names (`VAVADIA`, `GVS`), email addresses, phone numbers, technical labels you've intentionally allow-listed, and digits (which are Western per FR-008a).
2. To test fallback (FR-008): in `src/i18n/catalogs/ar.ts`, comment out one key (say `home.hero.cta`). Reload Arabic. The corresponding button should fall back to its English value, NOT be blank or show the literal key.
3. Restore the catalog before continuing.

### 8. Mixed-direction content

Maps to: spec Edge Case "Mixed-direction content".

1. In Arabic mode, view the `Contact` page. The email `info@vavadia.com` and the phone `+249 9XX XXX XXXX` must render left-to-right (digits and `@` not reversed).
2. The footer "Network Online: Active" (or its Arabic equivalent), "Latency: 42ms", and "Regions: SD, CN, IN, AE" must show Western digits and ASCII codes correctly oriented.

### 9. Theme transition is non-blocking

Maps to: **FR-015a (transition must not delay interaction).**

1. In dark mode, open `/inquiry` and start clicking the theme toggle rapidly while moving the mouse and clicking form fields.
2. The form is interactive throughout — no perceivable input lag during the 200 ms blend. If clicks are dropped or focus jumps, the transition is being applied to layout-affecting properties; check `src/index.css` and ensure the rule is scoped to color/border/fill/stroke only.

### 10. Reduced motion

Spec doesn't explicitly require this, but the implementation honors `prefers-reduced-motion: reduce`:

1. DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce".
2. Click theme toggle. Color change should be instant, no blend.

### 11. Contrast audit

Maps to: **FR-015, SC-005.**

1. Run Lighthouse on `/`, `/about`, `/services`, `/inquiry` once in light mode and once in dark mode.
2. Each report's Accessibility section should show 0 contrast failures.
3. Spot-check with axe DevTools as well — particularly the hero section (gold text on navy, gold text on white, slate text on slate), inquiry-form labels (slate-500 on white in light mode is the most likely failure point), and the footer micro-text.

### 12. Build-time catalog validation

Maps to: contract "catalog-schema.md".

1. `npm run build`.
2. Output should include the `verify-catalogs` step running and passing.
3. To prove it actually catches regressions: temporarily delete one key from `ar.ts` (e.g., `'nav.home'`). Run `npm run build`. The build MUST fail with a TypeScript error. Restore the key.
4. Temporarily set `'nav.home': ''` in `ar.ts`. Run `npm run build`. The validator script MUST fail with "empty value at key nav.home". Restore.

### 13. Persistence horizon

Maps to: **SC-006.**

This isn't directly testable in a manual session, but the implementation uses `localStorage` (which has no expiry under default browser settings); 30+ days persistence follows from that choice. If you want to spot-check, advance the system clock or use `chrome://settings/content/all` to confirm storage isn't site-data-purged.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Flash of light theme on dark-mode reload | Bootstrap IIFE missing from `index.html`, or placed *after* a CSS link tag instead of inside `<head>`. |
| Layout still LTR while `<html dir="rtl">` is set | A page is using physical utilities like `ml-4` instead of `ms-4`. Grep for `(ml|mr|pl|pr|text-left|text-right)-` and migrate to logical equivalents. |
| Theme toggle blends colors *and* shifts layout | Transition rule in `index.css` is targeting `*` without restricting properties. Restrict to `background-color, color, border-color, fill, stroke`. |
| Toggle inside hamburger menu on mobile | Toggle buttons must be siblings of the hamburger trigger, not children of the mobile overlay. |
| Arabic text rendering with system font | Cairo `@import` missing from `src/index.css`, or the `:root[lang="ar"]` rule isn't scoping `--font-arabic`. |
| Numbers showing Arabic-Indic digits in Arabic mode | Somewhere `Intl.NumberFormat('ar')` (without `numberingSystem: 'latn'`) is being called. Use plain `String(n)` or set the numbering system to `'latn'`. |

## Done criteria

All thirteen checks above pass on a Chromium browser (Chrome ≥ 122 / Edge ≥ 122) and on Firefox ≥ 124. Mobile is verified via Chrome DevTools device emulation (iPhone 14 Pro and Pixel 7).
