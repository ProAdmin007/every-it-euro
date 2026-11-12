# 05 — Tools and calculations

## The €100 explorer (home page)

- **Qualitative by design.** It shows where value *tends* to accumulate for five supplier profiles across eight dimensions (sales and services, R&D, IP, infrastructure, profits, tax base, jurisdiction, ecosystem), with four levels: largely in Europe, mixed, largely outside Europe, depends on the set-up.
- **No percentages and no calculations**, because reliable, general figures do not exist. The page says so.
- The profiles and levels are in `assets/js/main.js`; the explanations in `assets/js/i18n/<lang>.js`.

## Technology Sovereignty Assessment

- **Published rules, not a weighted score**, so every outcome can be explained and challenged.
- Each answer counts as an importance factor, a dependency factor or a mitigating factor. "Not sure" counts cautiously (as importance or dependency) and is listed as an open question.
- Rules, applied from top to bottom:

| Outcome | Rule |
|---|---|
| Strategic technology | Critical infrastructure or OT, **and** business-critical or outage-sensitive, **and** ≥ 3 dependency factors — **or** ≥ 5 importance and ≥ 5 dependency factors |
| High | ≥ 3 importance with ≥ 2 dependency factors — **or** critical infrastructure/OT with ≥ 1 dependency factor — **or** a security control with ≥ 3 dependency factors |
| Medium | ≥ 1 importance with ≥ 1 dependency factor — **or** ≥ 3 importance factors — **or** ≥ 4 dependency factors |
| Low | None of the above |

- The thresholds are editorial judgements, chosen to be simple and explainable, not statistically validated. The tool does not assess technical security, quality or cost.
- Answers are never stored or sent; a shareable link keeps them in the URL fragment only.
- Implementation: `sovereignty.html` (questions, answer effects in `data-effect`) and `assets/js/sovereignty.js` (rules).

## Worked examples with numbers

Worked examples (such as `firewall-example.html`) are the only place where the site calculates with money. They follow these rules:

1. **Only published figures.** Every ratio comes from a cited primary source (annual report, register filing). The period and the scope (whole company, subsidiary) are stated.
2. **Assumptions are explicit and adjustable.** Anything not published (for example channel margins) is labelled as an assumption, can be changed by the reader, and is never presented as a market figure.
3. **The method is stated.** For example: company-wide ratios applied proportionally to the vendor's share of the budget.
4. **Like for like, or say why not.** If the figures for two vendors are not comparable (operating profit versus net profit, full income statement versus revenue and result only), the page says so next to the numbers.
5. **Limits are explicit.** Every example states what it does not show — at least security quality, capacity for the money, total cost of ownership.
6. **Rounding is visible** and the parts add up to the total.
7. **Symmetric treatment.** Both vendors get the same questions and the same standard of evidence; facts that favour the non-European vendor (such as large European operations) are included.
8. **Approval before publication.** A new worked example is reviewed locally and approved by the maintainer before it is translated or published.

## Open questions

1. **Is the firewall example strong enough?** Company-wide ratios say little about one specific purchase, and Stormshield publishes only revenue and net result, so the comparison is unbalanced in detail. Options under consideration: a multi-year total-cost-of-ownership view (hardware plus subscription renewals), a focus on control and dependency rather than money flow, or a different pair of vendors with comparable disclosure.
