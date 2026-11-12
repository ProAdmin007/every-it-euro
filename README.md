# Every IT Euro — Why buying European IT and cybersecurity products strengthens Europe

[![Validate site](https://github.com/ProAdmin007/every-it-euro/actions/workflows/validate.yml/badge.svg)](https://github.com/ProAdmin007/every-it-euro/actions/workflows/validate.yml)
![Static site](https://img.shields.io/badge/site-static%20HTML%2FCSS%2FJS-003399)
![No tracking](https://img.shields.io/badge/tracking-none-FFCC00)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-lightgrey)](https://creativecommons.org/licenses/by/4.0/)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Buy%20me%20a%20coffee-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/proadmin007)

> **Every IT euro is also a strategic choice.**

A static, evidence-based website that explains how European organisations, governments, critical infrastructure operators and consumers can strengthen Europe's technological sovereignty by considering European alternatives when they buy cybersecurity, cloud, infrastructure, networking and software products. It is written for CISOs, CTOs, security architects, OT security professionals, procurement teams and policymakers.

The editorial position is **European preference where it makes strategic, economic, security and technical sense**. It is not protectionism, and it is not anti-American. The site separates **regulatory requirements** from **strategic procurement choices**, and contains **no fabricated statistics**.

## Contents

| Page | What it contains |
|---|---|
| `index.html` | Hero, the "Where does your IT euro go?" flow, the interactive €100 explorer, editorial position |
| `why-europe.html` | Four types of sovereignty, why EU hosting ≠ sovereignty, the European technology stack, jurisdiction, myths |
| `cybersecurity.html` | Why security tooling is special, layers of dependency, 19 technology areas, **OT & critical infrastructure** |
| `alternatives.html` | Filterable database of European companies, classification criteria, ownership changes to watch |
| `procurement.html` | What public buyers can and cannot require, printable 25-question checklist, **regulation vs. strategic choice** |
| `sovereignty.html` | Rule-based Technology Sovereignty Assessment with an explained outcome, Markdown export and a shareable link |
| `sources.html` | All sources with organisation, publication date, access date and topic |
| `about.html` | Purpose, methodology, corrections, privacy, accessibility, licence |

## Project structure

```
/
├── index.html, why-europe.html, cybersecurity.html, alternatives.html,
│   procurement.html, sovereignty.html, sources.html, about.html, 404.html
├── robots.txt, sitemap.xml, site.config.json, .nojekyll
├── assets/
│   ├── css/style.css
│   ├── js/main.js, alternatives.js, sovereignty.js
│   └── img/favicon.svg, og-image.png
├── data/
│   ├── companies.json      ← single source of truth for the alternatives database
│   └── sources.json        ← single source of truth for the sources page
├── tools/build.py          ← development-only helper (Python 3.12+, no dependencies)
└── .github/                ← CI validation, issue templates, FUNDING.yml
```

### How the data works

`data/companies.json` and `data/sources.json` are the sources of truth. `tools/build.py` renders them into `alternatives.html` and `sources.html`, so **all content is readable without JavaScript**. JavaScript only adds search and filtering. The build script also:

- injects the shared header and footer into every page;
- sets canonical URLs, Open Graph URLs, `sitemap.xml`, `robots.txt` and the 404 `<base>` from `site.config.json`;
- validates the JSON schema, every internal link and anchor, every asset path and every citation (`sources.html#src-…`).

```bash
python tools/build.py           # rebuild after editing data or pages
python tools/build.py --check   # validate only (this also runs in GitHub Actions)
```

GitHub Pages does **not** need Python. The build output is committed to the repository.

### Previewing locally

Open `index.html` directly in a browser, or run a small local server:

```bash
python -m http.server 8000
# then visit http://localhost:8000/
```

## Publishing on GitHub Pages

All paths are relative, so the site works both at `https://USERNAME.github.io/` and at `https://USERNAME.github.io/REPOSITORY/`.

### 1. Create a GitHub repository

1. Sign in to GitHub and click **New repository** (or go to <https://github.com/new>).
2. Enter a name, for example `every-it-euro`.
3. Choose **Public**. GitHub Pages on private repositories requires a paid plan.
4. Do **not** add a README, .gitignore or licence; this project already contains them.
5. Click **Create repository**.

### 2. Configure your URL (recommended)

Edit `site.config.json`:

```json
{
  "siteUrl": "https://YOUR-USERNAME.github.io/every-it-euro/",
  "repositoryUrl": "https://github.com/YOUR-USERNAME/every-it-euro"
}
```

Then run `python tools/build.py`. This updates canonical URLs, Open Graph tags, the sitemap, robots.txt, the 404 page and the "report a correction" link. Also replace `USERNAME/REPOSITORY` in the badges at the top of this README.

### 3. Push the files

```bash
cd path/to/this/folder
git init
git add .
git commit -m "Initial commit: Every IT Euro website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/every-it-euro.git
git push -u origin main
```

### 4. Enable GitHub Pages

1. In your repository, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.

### 5. Select the main branch

3. Under **Branch**, select **`main`**.

### 6. Publish from the repository root

4. In the folder drop-down next to the branch, select **`/ (root)`** and click **Save**.
5. After a minute or two, the site is live at `https://YOUR-USERNAME.github.io/every-it-euro/`. The URL is shown at the top of the Pages settings.

### 7. Use a custom domain later (optional)

1. In **Settings → Pages → Custom domain**, enter your domain (for example `everyiteuro.eu`) and click **Save**. GitHub then adds a `CNAME` file to the repository.
2. At your DNS provider:
   - for an apex domain (`example.eu`), create `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153` (and optionally the matching `AAAA` records listed in GitHub's documentation);
   - for a subdomain (`www.example.eu`), create a `CNAME` record pointing to `YOUR-USERNAME.github.io`.
3. When the certificate is ready, tick **Enforce HTTPS**.
4. Set `"siteUrl": "https://example.eu/"` in `site.config.json` and run `python tools/build.py`.
5. We recommend [verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) to prevent domain takeover.

## Maintaining the company database

Each entry in `data/companies.json` has this shape:

```json
{
  "id": "example",
  "name": "Example GmbH",
  "country": "Germany",
  "countryCode": "DE",
  "headquarters": "Berlin, Germany",
  "parentCompany": "None (independent)",
  "ownership": "Privately held by founders",
  "classification": "eu-hq",
  "classificationNote": "Headquartered and controlled in the EU.",
  "categories": ["Cybersecurity", "Endpoint Security"],
  "description": "One or two neutral, factual sentences.",
  "products": ["Product A"],
  "deployment": ["On-premises", "Public cloud / SaaS"],
  "openSource": "No",
  "onPremises": "Yes",
  "cloud": "Optional",
  "website": "https://example.eu",
  "evaluating": ["EDR/XDR platforms"],
  "sources": ["https://example.eu/imprint"],
  "lastVerified": "2026-11-12"
}
```

- `classification` must be one of `eu-hq`, `european-hq`, `european-subsidiary`, `european-open-source` or `mixed` (criteria on `alternatives.html#classification`).
- `categories` must use the fixed category list in `tools/build.py`.
- Always update `lastVerified` and `sources` when you re-check an entry.
- Use the wording *"relevant when evaluating…"*, never *"replacement for…"*.

Corrections and suggestions are welcome via the issue templates.

## Privacy and security

No cookies, analytics, tracking pixels, advertising, external fonts or third-party scripts. Every page has a strict Content Security Policy (`default-src 'self'`). The interactive tools run entirely in the browser and do not store answers.

## Licence

- Code: [MIT](LICENSE)
- Text and data: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

This website provides general information and is not legal, procurement or security advice.

## ☕ Support

If you find this project useful, you can support its maintenance:

<a href="https://ko-fi.com/proadmin007"><img alt="Buy me a coffee on Ko-fi" src="https://ko-fi.com/img/githubbutton_sm.svg"></a>
