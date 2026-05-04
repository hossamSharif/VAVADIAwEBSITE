# Contract: ThemeProvider

**File**: `src/theme/ThemeProvider.tsx` (to be created)
**Consumer surface**: a React context + hook + provider component.

The provider owns the `data-theme` attribute on `<html>` and the system-preference media listener. No other component writes to `data-theme`.

## Public types

```ts
export type Theme = 'light' | 'dark';
export type ThemeSource = 'user' | 'system';

export interface ThemeContextValue {
  /** Currently applied theme. */
  readonly theme: Theme;

  /**
   * Where the current value came from.
   *  - 'system' = derived from prefers-color-scheme; will track OS changes.
   *  - 'user'   = explicit toggle activation; ignores OS changes (FR-013).
   */
  readonly source: ThemeSource;

  /**
   * Switch to the given theme. Promotes source to 'user' and persists.
   *  - Sets <html data-theme>.
   *  - Writes 'vavadia.theme' to localStorage (silently no-ops if storage unavailable).
   *  - Triggers the CSS color transition described in FR-015a.
   */
  setTheme(next: Theme): void;

  /** Convenience: setTheme(theme === 'dark' ? 'light' : 'dark'). */
  toggle(): void;
}
```

## Provider component

```ts
export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Test-only override; production reads from <html data-theme>. */
  initialTheme?: Theme;
}

export function ThemeProvider(props: ThemeProviderProps): JSX.Element;

/** Hook. Throws if called outside <ThemeProvider>. */
export function useTheme(): ThemeContextValue;
```

## Behavioral contract

1. **Initial value selection** (in this order):
   1. `props.initialTheme` if provided → `source: 'user'`.
   2. `<html>.dataset.theme` if it parses to `'light' | 'dark'` AND `localStorage['vavadia.theme']` exists with the same value → `source: 'user'`.
   3. `<html>.dataset.theme` if it parses to `'light' | 'dark'` AND `localStorage['vavadia.theme']` is absent → `source: 'system'`.
   4. `matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'` → `source: 'system'`.

   In production, the bootstrap IIFE in `index.html` has already set `<html data-theme>` before React mounts, so step 2 or 3 always succeeds.

2. **`setTheme(next)`**:
   - If `next === theme` AND `source === 'user'`, no-op.
   - Otherwise: update state, set `document.documentElement.dataset.theme = next`, write `localStorage['vavadia.theme'] = next`, set `source = 'user'`.

3. **`toggle()`**: calls `setTheme(theme === 'dark' ? 'light' : 'dark')`.

4. **System-preference listener**:
   - On mount, `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handler)`.
   - On change: if `source === 'system'`, update `theme` (and `<html data-theme>`) to match. If `source === 'user'`, ignore (FR-013).
   - On unmount, removeEventListener.

5. **Pre-mount transitions are suppressed**: the bootstrap IIFE adds `data-theme-bootstrapped` to `<html>`, and the global CSS scopes the `transition` rule to `html[data-theme-bootstrapped] *`. Consequently:
   - First paint after a hard reload: instant (no blend).
   - Every subsequent `setTheme` / system-driven change: 200 ms color transition (FR-015a).

6. **Error contract**:
   - `useTheme()` outside the provider throws `Error('useTheme must be used within <ThemeProvider>')`.
   - Storage failures are caught silently.

## Acceptance checks (mapped to spec scenarios)

| Spec scenario | Contract assertion |
|---|---|
| US2 #1 (light OS → light theme on first load) | With no storage and `matchMedia.matches=false`: bootstrap sets `data-theme='light'`, provider reads it, `theme='light'`, `source='system'`. |
| US2 #2 (dark OS → dark theme on first load) | Same with `matchMedia.matches=true`: `theme='dark'`, `source='system'`. |
| US2 #3 (toggle flips entire UI in coordinated transition) | `toggle()` flips `data-theme` once; CSS transition rule applies to `*` so background, surface, text, border colors blend together over 200 ms. |
| US2 #4 (no flash on returning load) | `vavadia.theme='dark'` set ⇒ next reload's bootstrap IIFE sets `data-theme='dark'` *before* React mounts ⇒ first paint is dark. The `data-theme-bootstrapped` flag is added in the same IIFE so the transition rule is *not* active during the initial paint, preventing a 200 ms light→dark blend. |
| US2 #5 (manual choice survives OS change) | Sequence: user calls `setTheme('dark')` (source promoted to 'user'); then OS change fires the media listener; provider sees `source='user'` and ignores the change. |

## Out of contract

- More than two themes.
- Per-page or per-route theme overrides.
- Animated transitions for non-color properties.
- Server-side persistence.
