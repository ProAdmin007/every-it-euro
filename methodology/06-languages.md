# 06 — Languages

## Languages offered

English (default, in the repository root) plus German, French, Spanish, Italian and Polish — the five largest native languages in the EU — each in its own folder (`de/`, `fr/`, `es/`, `it/`, `pl/`).

## What is translated

| Translated | English only |
|---|---|
| Page text (`<lang>/*.html`) | Company database: descriptions, ownership, notes, "relevant when evaluating" |
| Interface: menu, footer, labels, categories, countries, classifications (`i18n/<lang>/ui.json`) | Ownership watchlist events |
| Texts of the interactive tools (`assets/js/i18n/<lang>.js`) | Source summaries; source titles stay in their original language |

The database is English only because it changes often and must be equally current everywhere. Translated pages show a note above it, and the text is marked `lang="en"` so browsers can offer to translate it.

## Rules

- **English prevails.** Translated pages say so in the footer.
- **Translate meaning, not words.** Idiomatic, professional, formal register; official names of EU laws in the target language with the common abbreviation.
- **Never change facts in translation.** No added, dropped or altered facts, numbers, dates or hedges. The build compares ids, form values and citations with the English page and warns about differences.
- **Missing translations fall back to English** and never break the site; `python tools/build.py` lists them as warnings.
- **Language choice:** the site follows the visitor's device language; an explicit choice in the language switcher is remembered in local storage only.
- **New content is translated only after the English version has been approved** (see [05](05-tools-and-calculations.md), rule 8).
