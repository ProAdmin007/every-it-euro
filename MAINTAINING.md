# Maintaining Every IT Euro

A short guide to keeping the site correct and current. Every task ends with the same two commands:

```bash
python tools/build.py          # rebuild all pages and languages
python tools/build.py --check  # must print "OK" before you commit
```

All tools are plain Python 3.12+ without dependencies.

## Quarterly review (about an hour)

```bash
python tools/review.py --markdown review.md
```

The work list has four parts:

| Part | What to do |
|---|---|
| **Not verified in the last 12 months** | Open the company's imprint/annual report/press page. Check ownership, parent company, headquarters, products and website. Update the entry, then mark it as checked: `python tools/review.py --mark-verified <id>` |
| **Website now redirects to another domain** | Often an acquisition, merger or rebrand. Find out what happened; see *Processing an acquisition* below. |
| **Broken links** | Replace the link with a working official source (search the site, or use the Wayback Machine at `web.archive.org` for the same document). Remove the link if the fact is still covered by another source. |
| **Blocked automated check** | These sites refuse scripts. Open them in a browser; usually nothing is wrong. |

Tip: paste `review.md` into a GitHub issue so the checkboxes become a to-do list.

## Adding a company

```bash
python tools/add_company.py
```

The script asks every field, validates the answers and inserts the entry alphabetically with today's date. Before adding, check the inclusion criteria on `alternatives.html#classification`:

- use official sources for ownership and headquarters (imprint, commercial register, annual report, press release);
- describe neutrally; write *"relevant when evaluating…"*, never *"replacement for…"*;
- inclusion is not an endorsement.

Then add the translations (see *Translations*) and rebuild.

## Processing an acquisition or ownership change

1. Confirm the change with an official source (press release of buyer or seller, regulator, register).
2. Update the company in `data/companies.json`: `parentCompany`, `ownership`, `classificationNote`, `sources`, `lastVerified`, and — if control moved outside Europe — `classification` (usually `mixed`, or remove the entry if it no longer meets the criteria).
3. Add the event to `watchlist` in the same file: `name`, `origin`, `event` (what happened, with date and buyer's country), `year`, `newOwnerCountry`, `source`, `lastVerified`.
4. Update the same fields in the translations (`i18n/<lang>/companies-*.json` and `i18n/<lang>/watchlist.json`).
5. Rebuild and check.

## Changing page text

- Edit the English page in the repository root (`why-europe.html`, …). Text between `<!-- BEGIN:… -->` and `<!-- END:… -->` is generated: change the data or `tools/build.py` instead.
- Cite sources with `[[source-id]]`; the build turns it into a numbered link. New sources go in `data/sources.json`.
- Make the same change in `de/`, `fr/`, `es/`, `it/` and `pl/`. The build checks that ids, form values and citations still match the English page.

## Translations

| Changed in English | Update in each language |
|---|---|
| A page | `<lang>/<page>.html` |
| A company, watchlist entry or source summary | `i18n/<lang>/companies-*.json`, `watchlist.json`, `sources.json` |
| Header, footer, labels, countries, categories | `i18n/<lang>/ui.json` |
| Texts in the interactive tools | `assets/js/i18n/<lang>.js` |

`python tools/check_data_translation.py <lang>` lists missing data translations. An AI assistant such as Claude can do this in one request, for example: *"Translate company `example-id` into de, fr, es, it and pl"* or *"I changed procurement.html; update the translated pages to match"*. Always keep the English version authoritative.

## Corrections from others

Issue templates for corrections and new companies are in `.github/ISSUE_TEMPLATE/`. Ask for an official source with every correction.

## Publishing

Commit and push to `main`; GitHub Pages publishes within a minute or two. CSS and JavaScript links carry a content hash (`?v=…`) that the build updates, so visitors never get a mix of old and new files.
