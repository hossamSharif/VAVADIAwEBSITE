# Feature Specification: Multi-Language (Arabic/English) and Light/Dark Theme

**Feature Branch**: `001-multilang-theme-support`
**Created**: 2026-05-03
**Status**: Draft
**Input**: User description: "add multi langauge arabic and english and also add a light dark theme feature"

## Clarifications

### Session 2026-05-03

- Q: When the site renders in Arabic, how should numeric content (prices, statistics, phone numbers, dates) be displayed? → A: Always use Western Arabic digits (0–9) in both languages.
- Q: How should the site source fonts for Arabic text? → A: Bundle a dedicated Arabic webfont (e.g., Cairo / Tajawal / IBM Plex Sans Arabic) used whenever the active language is Arabic.
- Q: Which contrast standard should the audit verify against for both themes? → A: WCAG 2.1 Level AA (4.5:1 normal text, 3:1 large text and UI components).
- Q: Should the theme switch animate or snap instantly? → A: Smooth color transition of ~150–250ms on background, surface, and text colors.
- Q: How should the language and theme toggles be laid out in the navbar across desktop and mobile? → A: Two separate icon buttons (globe for language, sun/moon for theme), always visible in both desktop and mobile headers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Site Language Between English and Arabic (Priority: P1)

A visitor lands on the Vavadia website and wants to read it in their preferred language. They use a clearly visible language toggle in the site navigation to switch between English and Arabic. When Arabic is selected, the entire page — navigation, headings, body copy, buttons, form labels, and any inline messaging — appears in Arabic, and the page layout flips to right-to-left so text alignment, menu order, icons that imply direction, and component flow all read naturally for an Arabic reader. The visitor's choice is remembered for future visits on the same device.

**Why this priority**: Language is the gating accessibility constraint for the site's intended audience. Without it, Arabic-speaking visitors cannot meaningfully use the site, and English-only delivery fails the core "multi-language" requirement of this feature. This story alone — even without the theme toggle — delivers complete usable value to the bilingual audience and is therefore the MVP slice.

**Independent Test**: Load the site fresh, confirm it renders in the default language with the correct layout direction. Use the language toggle to switch to the other language; verify every visible piece of text changes, the layout direction flips appropriately (LTR for English, RTL for Arabic), and the toggle now indicates the new active language. Reload the page; verify the chosen language persists. The story is complete and demonstrable on its own.

**Acceptance Scenarios**:

1. **Given** a first-time visitor whose browser language is English, **When** the page finishes loading, **Then** all content is shown in English with a left-to-right layout, and the language toggle indicates that switching to Arabic is available.
2. **Given** a first-time visitor whose browser language is Arabic, **When** the page finishes loading, **Then** all content is shown in Arabic with a right-to-left layout, and the language toggle indicates that switching to English is available.
3. **Given** a visitor viewing the site in English, **When** they activate the language toggle to Arabic, **Then** every translatable text element on the current page updates to Arabic, the layout direction switches to right-to-left, and no untranslated English strings remain visible in primary site chrome or content sections.
4. **Given** a visitor who previously selected Arabic, **When** they close the browser and return to the site later on the same device, **Then** the site loads directly in Arabic without requiring them to re-select.
5. **Given** a visitor on any page of the site, **When** they switch language, **Then** they remain on the same page (not redirected to the home page) and their scroll position and any open menus remain coherent.

---

### User Story 2 - Switch Between Light and Dark Theme (Priority: P2)

A visitor wants to view the site in a color scheme that matches their environment or personal preference. They use a clearly visible theme toggle in the site navigation to switch between a light theme (bright background, dark text) and a dark theme (dark background, light text). The change applies instantly to every visible surface — backgrounds, cards, navigation, form inputs, hero sections, icons, and any decorative imagery — without flicker or partially-themed elements. Their choice is remembered for future visits on the same device.

**Why this priority**: Theme preference is a comfort and accessibility enhancement that improves long-session readability and reduces eye strain in low-light conditions. It is independent of language and can ship after the language toggle without blocking it. It is high enough to belong in this feature but not gating, because the site is fully usable in a single default theme.

**Independent Test**: Load the site in the default theme; verify all surfaces are styled consistently. Activate the theme toggle; verify every visible surface — including hero backgrounds, navigation, cards, body, and form controls — switches to the alternate theme without leftover light/dark patches and without visible flicker. Reload the page; verify the chosen theme persists.

**Acceptance Scenarios**:

1. **Given** a first-time visitor whose operating system is set to a light color scheme, **When** the page finishes loading, **Then** the site is shown in the light theme.
2. **Given** a first-time visitor whose operating system is set to a dark color scheme, **When** the page finishes loading, **Then** the site is shown in the dark theme.
3. **Given** a visitor viewing the site in the light theme, **When** they activate the theme toggle, **Then** the entire visible interface — including navigation, page background, content cards, buttons, and form fields — switches to the dark theme in a single coordinated transition.
4. **Given** a visitor who previously selected the dark theme, **When** they close the browser and return to the site later on the same device, **Then** the site loads directly in the dark theme without a flash of the opposite theme during initial paint.
5. **Given** a visitor with a manually selected theme, **When** their operating system changes its color scheme later, **Then** the site retains the user's manual selection and does not silently override it.

---

### User Story 3 - Combined Language and Theme Preferences Work Together (Priority: P3)

A visitor sets both their preferred language and preferred theme. Both preferences coexist without interfering with each other: switching the language never resets the theme, switching the theme never resets the language, and both preferences survive a page reload independently. Each toggle is reachable on every page of the site.

**Why this priority**: This story is an integration guarantee that becomes meaningful only after both Story 1 and Story 2 exist. It ensures the two features are designed as orthogonal preferences rather than coupled state, which prevents subtle regressions later.

**Independent Test**: Set the site to Arabic + dark theme; reload and verify both persist. Switch the theme to light; verify the language remains Arabic. Switch the language to English; verify the theme remains light. Repeat across multiple pages of the site to confirm the toggles are reachable and behave identically everywhere.

**Acceptance Scenarios**:

1. **Given** a visitor with Arabic + dark theme selected, **When** they reload the page, **Then** the site loads in Arabic with the dark theme applied from the first paint.
2. **Given** a visitor on any page, **When** they switch theme, **Then** the active language is unchanged.
3. **Given** a visitor on any page, **When** they switch language, **Then** the active theme is unchanged.
4. **Given** a visitor navigating between pages, **When** they move from one page to another via internal links, **Then** both language and theme remain consistent across the navigation without re-prompting or visible reset.

---

### Edge Cases

- **Mixed-direction content**: Numbers, English brand names, URLs, and phone numbers embedded inside Arabic text must remain readable and not be reversed character-by-character.
- **First-paint flicker**: When a returning visitor has selected dark theme, the site must not briefly show the light theme during initial load before applying the saved preference (and the same principle applies to language).
- **Untranslated content**: If a translated string is missing for the active language, the system should fall back to the other language rather than show a blank space, an error, or a translation key.
- **Toggle on long pages**: Switching language or theme while scrolled deep into a page should not jump the user back to the top.
- **Form fields mid-input**: Switching language while the visitor is typing in a form should not erase what they have typed.
- **Browser without persistent storage** (private/incognito mode): Preferences may not persist across sessions; the toggle must still work within the current session and degrade gracefully.
- **Right-to-left affordances**: Directional icons (e.g., "back" arrows, breadcrumb separators, carousel controls) should mirror appropriately under Arabic so they continue to imply the correct direction.
- **Print or shared link**: A visitor who shares the URL with someone else should see the recipient's own language/theme preferences applied (not the sender's) — preferences are per-device, not encoded in the URL.

## Requirements *(mandatory)*

### Functional Requirements

**Language**

- **FR-001**: The site MUST support two languages — English and Arabic — across all user-facing text in navigation, page content, buttons, form labels, hero sections, footer, and any inline messages.
- **FR-002**: The site MUST display a language toggle control rendered as a dedicated icon button (globe icon) in the site header, always visible on every page in both desktop and mobile viewports without being placed inside a hamburger or overflow menu, indicating the language the visitor will switch to and changing the active language with a single interaction.
- **FR-003**: When Arabic is the active language, the site MUST present the page in a right-to-left reading direction with text alignment, component order, and directional icons mirrored to suit RTL reading.
- **FR-004**: When English is the active language, the site MUST present the page in a left-to-right reading direction.
- **FR-005**: On a visitor's first visit, the site MUST select an initial language by checking the browser's preferred language, choosing Arabic if Arabic is preferred, and otherwise defaulting to English.
- **FR-006**: The site MUST persist the visitor's chosen language on their device so that subsequent visits load directly in that language without re-selection.
- **FR-007**: Switching language MUST NOT navigate the visitor away from their current page and MUST NOT discard in-progress form input.
- **FR-008**: When a translation for the active language is missing for a given string, the site MUST fall back to displaying the string in the other supported language rather than displaying nothing or a raw key.
- **FR-008a**: All numeric content (prices, statistics, phone numbers, dates) MUST be rendered using Western Arabic digits (0–9) in both English and Arabic; Arabic-Indic digits (٠–٩) MUST NOT be used.
- **FR-008b**: The site MUST bundle a dedicated Arabic webfont (e.g., Cairo, Tajawal, or IBM Plex Sans Arabic) and apply it to all Arabic text rendering, ensuring correct shaping, ligatures, and visual consistency across devices regardless of system fonts.

**Theme**

- **FR-009**: The site MUST support two visual themes — light and dark — applied consistently to all surfaces including page background, navigation, hero sections, cards, buttons, form fields, links, icons, and any imagery overlays.
- **FR-010**: The site MUST display a theme toggle control rendered as a dedicated icon button (sun/moon icon) in the site header, always visible on every page in both desktop and mobile viewports without being placed inside a hamburger or overflow menu, distinct from the language toggle, indicating the theme the visitor will switch to and changing the active theme with a single interaction.
- **FR-011**: On a visitor's first visit, the site MUST select an initial theme by checking the operating system's color scheme preference, applying dark when the OS preference is dark, and otherwise applying light.
- **FR-012**: The site MUST persist the visitor's chosen theme on their device so that subsequent visits load directly in that theme without re-selection.
- **FR-013**: Once a visitor has manually chosen a theme, the site MUST NOT silently override that choice in response to later changes in the operating system's color scheme.
- **FR-014**: Returning visitors with a saved theme preference MUST NOT see a visible flash of the opposite theme during initial page load.
- **FR-015**: Both themes MUST meet WCAG 2.1 Level AA contrast ratios — at minimum 4.5:1 for normal-size body text and 3:1 for large text, icons, and interactive UI components — across all surfaces.
- **FR-015a**: Switching themes MUST apply via a smooth color transition lasting between 150ms and 250ms across background, surface, and text colors so the change feels coordinated rather than jarring; the transition MUST NOT delay the visitor's ability to interact with the page.

**Combined**

- **FR-016**: Language and theme preferences MUST be stored and applied independently; changing one MUST NOT reset the other.
- **FR-017**: Both toggles MUST behave identically on every page of the site.

### Key Entities *(include if feature involves data)*

- **Language Preference**: Represents the visitor's selected display language. Possible values: English, Arabic. Stored per-device. Drives both content text and reading direction.
- **Theme Preference**: Represents the visitor's selected color scheme. Possible values: Light, Dark. Stored per-device. Drives the visual styling of all site surfaces.
- **Translation Catalog**: The collection of all user-facing strings on the site, with each string available in both English and Arabic. New site copy must be added to the catalog in both languages before being shown.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of user-facing text on the site (navigation, page sections, buttons, form labels, footer) is rendered in the active language with no untranslated strings visible in either language.
- **SC-002**: A visitor can switch language or theme and see the change fully applied in under 1 second from a single interaction.
- **SC-003**: A returning visitor with a previously saved language and theme sees both applied from the first visible paint, with no visible flash of the wrong language or wrong theme.
- **SC-004**: When viewed in Arabic, the site reads naturally right-to-left across at least 95% of layout elements (text alignment, menu order, directional icons), as judged by a native Arabic reader review.
- **SC-005**: Both light and dark themes pass an automated WCAG 2.1 Level AA contrast audit (≥4.5:1 for body text, ≥3:1 for large text and interactive UI components) with zero failing elements on the site's primary pages.
- **SC-006**: Language and theme preferences persist across at least 30 days of returning visits on the same device under default browser storage conditions.
- **SC-007**: Switching language or theme on any page does not cause the visitor to lose scroll position or in-progress form input, verified across the site's primary pages.

## Assumptions

- The site is a single-page web application served from a modern browser; visitors with JavaScript disabled are out of scope.
- The two supported languages are exactly English and Arabic; no other languages (e.g., French, Spanish) are in scope for this feature.
- Translation copy will be authored or supplied alongside implementation; this spec does not produce the Arabic translation content itself, only the mechanism to display and switch it.
- Per-device persistence using standard browser storage is acceptable; no server-side user account or cross-device sync is required.
- The default language fallback when the browser preference is neither English nor Arabic is English.
- The default theme fallback when no operating system color scheme can be determined is the light theme.
- Existing site imagery and icons can be reused across both themes; if any image is unreadable on one theme, an alternate variant or styling treatment will be supplied during implementation.
- Mobile and desktop browsers are both in scope; the toggles must be reachable on both.
- Search engine optimization considerations for serving language-specific URLs (e.g., `/ar/` paths) are out of scope for this feature; language switching is a client-side preference.
