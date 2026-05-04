# Contract: Pre-mount Bootstrap IIFE

**File**: inline `<script>` tag in `index.html`, placed inside `<head>`, after `<meta>` tags and *before* the `<div id="root">` and the React entry script.

This script runs synchronously during HTML parse, before any CSS paint. Its job is to set the document's `lang`, `dir`, and `data-theme` so that the very first paint matches the visitor's saved or inferred preferences (FR-014, no flash).

## Required behavior

1. Read `localStorage['vavadia.lang']`.
   - If it equals `'en'` or `'ar'`, use it.
   - Otherwise: if `navigator.language?.toLowerCase().startsWith('ar')`, use `'ar'`; else `'en'`.
2. Read `localStorage['vavadia.theme']`.
   - If it equals `'light'` or `'dark'`, use it.
   - Otherwise: if `matchMedia('(prefers-color-scheme: dark)').matches` is `true`, use `'dark'`; else `'light'`.
3. Set on `document.documentElement`:
   - `lang` = the resolved language.
   - `dir`  = `'rtl'` if language is `'ar'`, else `'ltr'`.
   - `dataset.theme` = the resolved theme.
   - `dataset.themeBootstrapped` = `''` (presence flag — value irrelevant).
4. The entire body of the IIFE is wrapped in `try { ... } catch (_) { /* swallow */ }`. Storage access can throw in some private-browsing modes; we degrade silently to the detection branch and continue.
5. The script must NOT touch `document.body` (which doesn't exist yet at this point in the parse).
6. The script must NOT depend on any external module — it's a pure inline IIFE.

## Why a pre-mount script (and not a React effect)

A React effect runs after the first paint. That means a returning visitor with `theme='dark'` saved would see ~50–200 ms of the default light theme before React fixes it — exactly the FOUC that FR-014 forbids. A synchronous inline script is the only mechanism that can set `data-theme` before paint.

## Acceptance checks

| Scenario | Assertion |
|---|---|
| Returning visitor saved `theme='dark'` | `<html data-theme='dark'>` is set before any paint; no flash of light. |
| Returning visitor saved `lang='ar'` | `<html lang='ar' dir='rtl'>` is set before any paint; layout flows RTL from first paint. |
| First-time visitor in dark-mode OS, English browser | `<html lang='en' dir='ltr' data-theme='dark'>`. |
| First-time visitor with private-browsing storage error | Script catches; falls back to navigator + matchMedia detection; React never sees a partial state. |
| Developer manually clearing storage between reloads | Bootstrap re-derives from media + navigator; no stale state. |

## Out of contract

- Setting any class names (theme is data-attribute only).
- Animating anything (the `data-theme-bootstrapped` flag is the *gate* that enables the CSS transition rule; the IIFE itself does not animate).
- Loading fonts (Cairo is loaded by the CSS bundle in the normal way).
