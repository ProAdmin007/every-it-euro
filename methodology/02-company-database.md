# 02 — The company database

The database (`data/companies.json`) lists **European options to consider when evaluating** IT and cybersecurity products. It is a starting point for your own evaluation, not a buyer's guide.

## Inclusion criteria

A company or project is included when **all** of the following apply:

1. It is European by the rules in [01 — What makes a company European](01-european-company.md), or `mixed` with European roots or operations worth making transparent.
2. It currently offers a product or service in one of the site's categories (cybersecurity, network and OT security, SIEM, endpoint, identity, PAM, encryption, cloud, hosting, collaboration, email, operating systems, infrastructure, monitoring, backup, open source).
3. It is an active company or a maintained project. Defunct companies are excluded.
4. Headquarters and ownership can be verified from at least one official source.

## Removal and the watchlist

- A company that comes under **non-European control** (rule 1 in document 01) is removed from the database and added to `watchlist` with: name, origin country, what happened (with date and buyer's country), year, new owner's country, a source and the verification date.
- A company that becomes **defunct** or stops offering relevant products is removed. If the end was caused by an acquisition, it goes on the watchlist.
- A pending acquisition is noted in the ownership text and classification note ("re-check the closing status"); the entry changes when the deal closes.

## Required fields

Every entry has: `id`, `name`, `country`, `countryCode`, `headquarters`, `parentCompany`, `ownership`, `classification`, `classificationNote`, `categories`, `description`, `products`, `deployment`, `openSource`, `onPremises`, `cloud`, `website`, `evaluating`, `sources`, `lastVerified`. The build script (`tools/build.py`) rejects entries with missing or invalid fields.

## Verification

- **Minimum sources:** the company's own website (imprint, about or investor pages) for headquarters and products; the commercial register, annual report or a press release for ownership; reputable reporting only for events such as acquisitions. All URLs used go into `sources`.
- **Checked every time:** headquarters, parent company, ownership, current existence, product relevance, and the classification.
- **`lastVerified`** is the date of the last full check. Entries older than 12 months appear on the review work list (`python tools/review.py`).
- **Signals for an early re-check:** the website redirects to another company's domain, an acquisition is announced, or a correction is submitted.

## Wording

- **Neutral and factual.** One or two sentences describing what the company offers. No marketing claims, superlatives or quality judgements.
- **"Relevant when evaluating …"**, never "replacement for …" or "alternative to [brand]". The `evaluating` field names product categories, optionally with well-known examples ("hyperscale public cloud such as AWS, Microsoft Azure or Google Cloud").
- **Hedges are kept.** "Reportedly", "about", "not disclosed" stay in the text when the source is not definitive.

## Independence

- **Inclusion is not an endorsement**, and the site has no commercial relationship with any company listed.
- **Suppliers may submit corrections** about themselves, with sources, through the issue templates. They cannot pay for, or influence, inclusion, wording or position.

## Open questions

1. Should there be a minimum company size or maturity for inclusion (e.g. at least one public reference customer)? Currently there is none.
2. The `mixed` category is included "for transparency". Should `mixed` entries be visually separated or filterable out by default?
