# Contract: Translation Catalog Files

**Files**:
- `src/i18n/catalogs/en.ts`
- `src/i18n/catalogs/ar.ts`
- `scripts/verify-catalogs.ts` (build-time validator, run via `tsx` as a `prebuild` npm script)

The catalogs are the only place text content for the site lives. Every visible string in JSX flows through `t(key)`; no inline literals.

## File shape

### `en.ts` — the source of truth for the key set

```ts
export const en = {
  'nav.home':                'Home',
  'nav.about':               'About',
  'nav.services':            'Services',
  'nav.network':             'Global Network',
  'nav.gvs':                 'GVS (Sudan)',
  'nav.contact':             'Contact',
  'nav.cta.inquiry':         'Submit Inquiry',
  'nav.toggle.lang.toAr':    'Switch to Arabic',
  'nav.toggle.lang.toEn':    'Switch to English',
  'nav.toggle.theme.toDark': 'Switch to dark theme',
  'nav.toggle.theme.toLight':'Switch to light theme',
  // ... home.*, about.*, services.*, network.*, gvs.*, contact.*, inquiry.*, footer.*, common.*
} as const;

export type CatalogKey = keyof typeof en;
```

The `as const` plus `keyof typeof en` is what makes `ar.ts` a compile-time check.

### `ar.ts` — must cover every key from `en`

```ts
import type { CatalogKey } from './en';

export const ar: Record<CatalogKey, string> = {
  'nav.home':                'الرئيسية',
  'nav.about':               'من نحن',
  'nav.services':            'الخدمات',
  'nav.network':             'الشبكة العالمية',
  'nav.gvs':                 'GVS (السودان)',
  'nav.contact':             'تواصل معنا',
  'nav.cta.inquiry':         'تقديم طلب',
  'nav.toggle.lang.toAr':    'التبديل إلى العربية',
  'nav.toggle.lang.toEn':    'التبديل إلى الإنجليزية',
  'nav.toggle.theme.toDark': 'التبديل إلى المظهر الداكن',
  'nav.toggle.theme.toLight':'التبديل إلى المظهر الفاتح',
  // ... must cover every key declared in en.ts
};
```

If a key is missing here, TypeScript fails the build (`tsc --noEmit`).

## Validation script: `scripts/verify-catalogs.ts`

Runs as a Node script via `tsx scripts/verify-catalogs.ts`. Wired to `package.json` as a `prebuild` step.

### Required checks

1. **Symmetry**: `Object.keys(en).sort()` deep-equals `Object.keys(ar).sort()`.
   - The TS type already enforces "every English key is in Arabic". This adds the reverse: Arabic mustn't have stray keys.
2. **Non-empty values**: `Object.values(en).every(v => v.trim().length > 0)` and same for `ar`.
3. **No raw key in value**: no value matches `/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]+)+$/i` (i.e., looks like `nav.home`) — protects against accidentally pasting a key into a value.
4. **No untranslated mirror**: for every key, `en[k]` !== `ar[k]` UNLESS the value is one of an allow-listed set (brand names, e.g. `"VAVADIA"`, `"GVS"`, phone numbers, or values intentionally identical like an `@` symbol). The allow-list is a constant inside the script.
5. Exit code: `0` on success, `1` on any failure with a human-readable diff per failing key.

### Why this exists

Spec FR-001 and SC-001 demand 100% translation coverage with no untranslated strings. The TS check catches one direction; the script catches the rest. Running it as `prebuild` means a missing translation fails the deploy pipeline rather than reaching production.

## Acceptance checks

| Scenario | Assertion |
|---|---|
| Developer adds `'home.hero.subtitle'` to `en.ts` and forgets `ar.ts` | `tsc --noEmit` (i.e., `npm run lint` and `npm run build`) fails with "Property 'home.hero.subtitle' is missing in type ..." |
| Developer adds a new key to `ar.ts` that isn't in `en.ts` | The validator script's symmetry check fails the build. |
| Developer leaves an empty Arabic value | Validator's non-empty check fails the build. |
| Developer pastes the key as the value (e.g. `'home.hero.cta': 'home.hero.cta'`) | Validator's "no raw key in value" check fails the build. |
| Developer uses the brand name `'VAVADIA'` in both languages | Allow-listed → no failure. |

## Out of contract

- ICU plural / gender forms (no consumer needs them at this scale).
- Lazy-loaded catalogs split by route.
- Inline placeholders (`{name}`) — none of the spec strings need them; if a future need arises, extend the catalog format then.
