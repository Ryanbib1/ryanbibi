# Bilingual Content Guide

The site renders English and Simplified Chinese directly through React. It no longer scans or rewrites text in the DOM after a page appears.

## Content files

- `src/i18n/translations.js`: reviewed English-to-Chinese interface copy.
- `src/i18n/foodTerms.js`: cuisine, tag, and restaurant-taxonomy translations.
- `src/i18n/runtime.js`: language state and exact-copy lookup.
- `src/i18n/jsx-runtime.js`: translates React text and supported text props while elements are created.

## Editing rules

1. Write interface source copy in clear English.
2. Add the reviewed Chinese version to `translations.js`.
3. Add restaurant categories or tags to `foodTerms.js`, keeping the stored data value unchanged.
4. Keep names, ticker symbols, restaurant names, addresses, IDs, and personal memory notes in their original language.
5. Use explicit `language === 'zh'` branches for sentences containing dynamic values such as city names or counts.

This keeps filters and imports stable while allowing the visible terminology to change by language.
