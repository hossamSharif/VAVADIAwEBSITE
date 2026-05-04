# Contract: LanguageProvider

**File**: `src/i18n/LanguageProvider.tsx` (to be created)
**Consumer surface**: a React context + hook + provider component.

The provider is the *only* component that owns the `lang` / `dir` document attributes. Every other component reads through the hook.

## Public types

```ts
export type Lang = 'en' | 'ar';
export type Dir  = 'ltr' | 'rtl';

export interface LanguageContextValue {
  /** Current language. Always 'en' or 'ar'. */
  readonly lang: Lang;

  /** Reading direction derived from lang. 'ar' → 'rtl', 'en' → 'ltr'. */
  readonly dir: Dir;

  /**
   * Switch to the given language.
   *  - Updates React state.
   *  - Sets <html lang> and <html dir>.
   *  - Persists to localStorage under 'vavadia.lang' (silently no-ops if storage unavailable).
   *  - Does NOT trigger router navigation, scroll change, or unmount form components (FR-007).
   */
  setLang(next: Lang): void;

  /**
   * Translate a catalog key.
   * Resolution order (FR-008):
   *   1. catalog[lang][key]      if present and non-empty
   *   2. catalog[otherLang][key] if present and non-empty
   *   3. fallback                if provided
   *   4. key                     (so missing strings are visible in QA, not blank)
   */
  t(key: string, fallback?: string): string;
}
```

## Provider component

```ts
export interface LanguageProviderProps {
  children: React.ReactNode;
  /**
   * Optional override of the initial language. Used by tests; in production
   * the bootstrap IIFE in index.html has already set <html lang>, and the
   * provider reads that as its initial value, so this prop is rarely passed.
   */
  initialLang?: Lang;
}

export function LanguageProvider(props: LanguageProviderProps): JSX.Element;

/** Hook. Throws if called outside <LanguageProvider>. */
export function useLanguage(): LanguageContextValue;
```

## Behavioral contract

1. **Initial value selection** (in this order):
   1. `props.initialLang` if provided.
   2. `<html>.lang` (set by the bootstrap IIFE).
   3. `localStorage['vavadia.lang']` if it parses to `'en' | 'ar'`.
   4. `navigator.language?.toLowerCase().startsWith('ar')` ? `'ar'` : `'en'`.

2. **`setLang(next)`** is idempotent: calling it with the current value is a no-op (no re-render, no storage write).

3. **DOM side effects** (run inside a `useLayoutEffect` so the DOM update lands in the same frame as the React state change):
   - `document.documentElement.lang = next;`
   - `document.documentElement.dir  = next === 'ar' ? 'rtl' : 'ltr';`

4. **`t(key, fallback?)`**:
   - Pure function (no side effects).
   - Re-runs when `lang` changes (the value identity changes) so consumers re-render.
   - Returns `string`, never `undefined` or `null`.

5. **Error contract**:
   - `useLanguage()` outside the provider throws `Error('useLanguage must be used within <LanguageProvider>')`.
   - `setLang` accepts only `'en' | 'ar'`; TypeScript prevents anything else at compile time. (No runtime validation needed in production code paths.)

6. **Storage failure tolerance**:
   - All `localStorage.getItem` / `setItem` calls are wrapped in `try/catch`.
   - On failure, the provider continues to function for the current session; the choice simply isn't remembered across reloads.

## Acceptance checks (mapped to spec scenarios)

| Spec scenario | Contract assertion |
|---|---|
| US1 #1 (English browser → English LTR on first load) | After mount with no storage and `navigator.language='en-US'`: `lang === 'en'`, `dir === 'ltr'`, `<html lang>='en'`, `<html dir>='ltr'`. |
| US1 #2 (Arabic browser → Arabic RTL on first load) | After mount with no storage and `navigator.language='ar-SD'`: `lang === 'ar'`, `dir === 'rtl'`, `<html dir>='rtl'`. |
| US1 #3 (toggle re-renders all translatable text) | `setLang('ar')` causes `t('nav.home')` to return the Arabic value; React re-renders consumers. |
| US1 #4 (persists across reloads) | `setLang('ar')` writes `'ar'` to `localStorage['vavadia.lang']`. Next page load reads it back via the bootstrap IIFE → provider initial. |
| US1 #5 (no scroll jump, no navigation) | `setLang` does not call `useNavigate` or `window.scrollTo`. The active route remains the same. |
| FR-008 fallback | When `ar` catalog is missing key `home.hero.cta` but `en` has it, calling `t('home.hero.cta')` while `lang='ar'` returns the English string. |

## Out of contract

- Catalog hot-swapping at runtime (catalogs are static imports).
- Pluralization, gender, ICU formatting.
- Lazy-loading translations (catalogs are small and bundled).
