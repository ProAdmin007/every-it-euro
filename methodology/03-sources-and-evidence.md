# 03 — Sources and evidence

## Source hierarchy

Use the highest available level:

1. **Primary legal and official sources:** EUR-Lex, the European Commission, the European Parliament and Council, ENISA, national cybersecurity authorities (e.g. ANSSI, BSI), courts, official registers (commercial registers, SEC filings).
2. **Official company sources:** imprint, annual reports, investor relations, press releases from the company or the buyer in an acquisition.
3. **Reputable news reporting:** only for events (acquisitions, incidents, statements), never as the only source for law or ownership if a primary source exists.

Not accepted as the only source: blogs, vendor comparison sites, marketing material from competitors, AI-generated summaries, Wikipedia.

## Citing

- Every factual claim that is not common knowledge has a citation. In page source, write `[[source-id]]`; the build turns it into a numbered link to `sources.html`.
- Every source in `data/sources.json` has: `id`, `title` (in the original language), `organisation`, `url`, `published` (or `null` if unknown), `accessed`, `type`, `topics` and, where useful, a `summary` that states exactly what the source supports.
- The `accessed` date is the date the content was actually read.

## Figures

- **No fabricated statistics.** Every number comes from a cited source, or is clearly marked as an assumption or illustration.
- **Report figures as published.** State the period (e.g. "financial year 2025") and the currency. Do not convert currencies unless the conversion and its rate are stated.
- **Derived figures** (percentages, ratios) must be reproducible from the cited figures.
- **Where reliable figures do not exist**, use a conceptual explanation and say that it is conceptual (as in the €100 explorer).

## Quotes

- Quote exactly and in the original language where the source is not English (for example the French Senate hearing), with a translation or gloss.
- In translations of the site, quotes from EU legislation use the official wording in that language when it is certain; otherwise a faithful translation.

## Disputed and uncertain claims

- Present disputed claims as disputed, with both positions and sources (for example the ICC e-mail case, with Microsoft's denial).
- Distinguish law in force, adopted law not yet applicable, and proposals. A proposal is always called a proposal.

## Open questions

1. Should sources older than a certain age (e.g. five years) be re-checked automatically for newer versions? Currently only broken links are detected.
