# Phase 1 Data Model

**Feature**: `001-multilang-theme-support`
**Scope**: Client-side only. There is no server, no database, and no cross-device sync. All entities live in browser memory and (when permitted) `localStorage`.

---

## Entity: LanguagePreference

**Purpose**: Records the visitor's chosen display language; drives the active text catalog and the document reading direction.

**Fields**:
| Field | Type | Required | Notes |
|---|---|---|---|
| `lang` | `'en' \| 'ar'` | yes | The two-letter code of the active language. |

**Derived values** (not stored — computed from `lang`):
| Derived | Type | Formula |
|---|---|---|
| `dir` | `'ltr' \| 'rtl'` | `lang === 'ar' ? 'rtl' : 'ltr'` |
| `name` | `'English' \| 'العربية'` | static lookup, used for the "Switch to {name}" tooltip |

**Persistence**:
- Storage key: `vavadia.lang`
- Storage value: literal `"en"` or `"ar"` (no JSON wrapper).
- Read on bootstrap by the inline IIFE in `index.html`.
- Written by `LanguageProvider.setLang` whenever the visitor activates the toggle.
- If `localStorage` throws (private browsing, FR / Edge Case), the value is held only in React state for the session.

**State transitions**:
```
(unset) ──[bootstrap detect: nav.lang.startsWith('ar') ? 'ar' : 'en']──▶ en | ar
en ──[user activates Globe toggle]──▶ ar
ar ──[user activates Globe toggle]──▶ en
```

**Validation rules**:
- `lang` is constrained by the TypeScript union; any other value read from `localStorage` is treated as missing and falls back to detection (defensive parse in the bootstrap IIFE and in the provider's initializer).
- `lang` change MUST NOT trigger route navigation and MUST NOT remount form components, so in-progress input is preserved (FR-007).

**Spec mapping**: FR-001, FR-003, FR-004, FR-005, FR-006, FR-007, FR-016, FR-017.

---

## Entity: ThemePreference

**Purpose**: Records the visitor's chosen visual theme; drives the `data-theme` attribute on `<html>` and therefore the entire CSS-variable palette.

**Fields**:
| Field | Type | Required | Notes |
|---|---|---|---|
| `theme` | `'light' \| 'dark'` | yes | The active theme. |
| `source` | `'user' \| 'system'` | yes | Whether the current value came from explicit user action (`'user'`) or from initial OS-preference detection (`'system'`). Required to satisfy FR-013. |

**Persistence**:
- Storage key: `vavadia.theme`
- Storage value: literal `"light"` or `"dark"`. Absence of the key means *no manual choice has been made* (i.e., `source = 'system'`); presence means `source = 'user'`.
- Read on bootstrap by the inline IIFE in `index.html`.
- Written by `ThemeProvider.setTheme` only — the matchMedia change listener does **not** write to storage; it only updates in-memory state when `source === 'system'`.

**State transitions**:
```
(unset, source=system) ──[bootstrap detects matchMedia('(prefers-color-scheme: dark)')]──▶ light | dark   (source stays 'system')
light|dark, source=system ──[OS preference flips]──▶ flipped value   (source stays 'system')
light|dark, source=system ──[user activates Sun/Moon toggle]──▶ flipped value (source=user, write storage)
light|dark, source=user   ──[OS preference flips]──▶ NO CHANGE         (FR-013)
light|dark, source=user   ──[user activates Sun/Moon toggle]──▶ flipped value (source=user, write storage)
```

**Validation rules**:
- `theme` is constrained by the TS union; unknown stored values are treated as absent.
- The transition from `source: system` → `source: user` is one-way for the lifetime of the storage entry. Clearing `vavadia.theme` (via DevTools or a future "reset preferences" action) returns to `source: system`.
- The OS-preference media listener MUST be installed regardless of `source` (so re-renders happen if the user later clears storage), but its effect is gated on `source === 'system'`.

**Spec mapping**: FR-009, FR-011, FR-012, FR-013, FR-014, FR-015, FR-015a, FR-016, FR-017.

---

## Entity: TranslationCatalog

**Purpose**: The pair of static dictionaries that turn translation keys into displayable strings.

**Shape**:
```ts
type CatalogKey = string;             // e.g. "nav.home", "home.hero.title", "footer.network.online"
type CatalogValue = string;           // the displayable string, never empty
type Catalog = Record<CatalogKey, CatalogValue>;
```

**Storage**:
- Two `.ts` modules under `src/i18n/catalogs/`:
  - `en.ts` exports `const en: Catalog`.
  - `ar.ts` exports `const ar: Record<keyof typeof en, CatalogValue>` (so missing keys are a TypeScript error, satisfying R7 in research).
- Both files are bundled at build time. There is no runtime catalog fetch.

**Validation rules** (enforced by `scripts/verify-catalogs.ts`, invoked as `prebuild`):
- Every key in `en` is also in `ar` and vice versa. (TypeScript already enforces one direction; the script enforces the other.)
- No value is the empty string.
- No value contains an unescaped translation-key shaped placeholder (`/^[a-z][a-z0-9.]+$/`) — protects against pasting a key into a value by accident.

**Lookup contract** (`t(key, fallback?)` — see contracts/i18n-provider.md):
1. If `catalog[lang][key]` exists and is non-empty, return it.
2. Else if `catalog[other][key]` exists and is non-empty, return it. (FR-008.)
3. Else if `fallback` was passed, return `fallback`.
4. Else return the literal `key` (so the missing string is visible in QA, not a silent blank).

**Naming convention** (informational — keys are flat strings):
- `nav.{linkName}` — top-nav link labels.
- `nav.cta.inquiry` — the "Submit Inquiry" navbar button.
- `nav.toggle.lang.{en|ar}` — aria-label for the language switch.
- `nav.toggle.theme.{light|dark}` — aria-label for the theme switch.
- `home.{section}.{element}` — homepage content.
- `home.about.*`, `home.services.*`, `home.network.*`, `home.gvs.*`, `home.contact.*`, `home.inquiry.*` — per-page content (the homepage is large enough to merit a section level).
- `footer.{element}` — footer strings.
- `inquiry.section.{n}` — inquiry-form section headers.
- `inquiry.field.{name}.{label|placeholder|error}` — inquiry-form fields.
- `common.{element}` — strings shared across multiple pages (e.g., "Read more").

**Spec mapping**: FR-001, FR-008, FR-008a (numeric content is *not* in the catalog — it's rendered raw and Western-digit by default), FR-008b (font is bound to `lang`, not to the catalog), SC-001.

---

## Implicit entity: DocumentRoot attributes

Not strictly an entity, but the read/write surface that ties the two preferences to the DOM. Recorded here so contract tests can target it.

| Attribute on `<html>` | Domain | Owner | Cleared when |
|---|---|---|---|
| `lang` | `"en" \| "ar"` | `LanguageProvider` (and bootstrap) | never (always set) |
| `dir` | `"ltr" \| "rtl"` | `LanguageProvider` (and bootstrap) | never |
| `data-theme` | `"light" \| "dark"` | `ThemeProvider` (and bootstrap) | never |
| `data-theme-bootstrapped` | presence-only | bootstrap IIFE only | never (added once on first paint to enable CSS color transitions) |

These four attributes are the externally observable contract for any quickstart check or future automated test.

---

## Out of scope

- Server-stored preferences, user accounts, or cross-device sync (per spec Assumptions).
- URL-encoded language (`/ar/...`) or theme (`?theme=dark`) — preferences are per-device only.
- Additional languages beyond English and Arabic.
- Currency formatting, plural rules, gender-aware translations — none required by the spec.
