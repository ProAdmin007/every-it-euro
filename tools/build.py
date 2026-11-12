#!/usr/bin/env python3
"""
Every IT Euro — static build helper (development only; not needed on GitHub Pages).

What it does
  1. Injects the shared header and footer into every page (between <!-- BEGIN:header --> markers).
  2. Pre-renders data/companies.json into alternatives.html and data/sources.json into sources.html,
     so the content is readable without JavaScript. JavaScript only adds filtering.
  3. Rewrites canonical / Open Graph URLs, sitemap.xml and robots.txt from site.config.json.
  4. Validates: JSON structure, internal links and anchors, asset paths, and citation ids.

Usage
  python tools/build.py           # build and validate
  python tools/build.py --check   # validate only; fail if any generated file is out of date (used in CI)
"""
from __future__ import annotations

import html
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = [
    # file, nav label, sitemap priority
    ("index.html", "Home", "1.0"),
    ("why-europe.html", "Why Europe", "0.9"),
    ("cybersecurity.html", "Cybersecurity", "0.9"),
    ("alternatives.html", "European Alternatives", "0.9"),
    ("procurement.html", "Procurement", "0.9"),
    ("sovereignty.html", "Sovereignty Assessment", "0.8"),
    ("sources.html", "Sources", "0.6"),
    ("about.html", "About", "0.5"),
]
EXTRA_PAGES = ["404.html"]

CATEGORIES = [
    "Cybersecurity", "Network Security", "OT Security", "SIEM", "Endpoint Security", "Identity", "PAM",
    "Encryption", "Cloud", "Hosting", "Collaboration", "Email", "Operating Systems", "Infrastructure",
    "Monitoring", "Backup", "Open Source",
]
CLASSIFICATIONS = {
    "eu-hq": "EU/EEA headquartered",
    "european-hq": "European headquartered (non-EU)",
    "european-subsidiary": "Part of a European group",
    "european-open-source": "European open-source project",
    "mixed": "Mixed / international ownership",
}
TRISTATE = {"openSource": {"Yes", "No", "Partly"}, "onPremises": {"Yes", "No", "Optional"}, "cloud": {"Yes", "No", "Optional"}}
COMPANY_KEYS = [
    "id", "name", "country", "countryCode", "headquarters", "parentCompany", "ownership", "classification",
    "classificationNote", "categories", "description", "products", "deployment", "openSource", "onPremises",
    "cloud", "website", "evaluating", "sources", "lastVerified",
]

LOGO = (
    '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">'
    '<rect width="40" height="40" rx="9" fill="#003399"/>'
    + "".join(
        f'<circle cx="{20 + 12.5 * __import__("math").cos(i * 3.14159265 / 6):.2f}" '
        f'cy="{20 + 12.5 * __import__("math").sin(i * 3.14159265 / 6):.2f}" r="1.9" fill="#FFCC00"/>'
        for i in range(12)
    )
    + '<path d="M20 12.5l6 2.4v4.6c0 4-2.6 6.9-6 8-3.4-1.1-6-4-6-8v-4.6z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>'
    "</svg>"
)

errors: list[str] = []


def esc(s) -> str:
    return html.escape(str(s), quote=True)


# --------------------------------------------------------------------------- partials
def header(current: str) -> str:
    items = []
    for f, label, _ in PAGES:
        cur = ' aria-current="page"' if f == current else ""
        items.append(f'<li><a href="{f}"{cur}>{label}</a></li>')
    return f"""<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html">{LOGO}<span>Every IT Euro<small>European technology choices</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-icon" aria-hidden="true"></span>Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        {chr(10).join('        ' + i for i in items).strip()}
      </ul>
    </nav>
  </div>
</header>"""


def footer() -> str:
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <p class="footer-brand">{LOGO}Every IT Euro</p>
        <p>An independent, non-commercial information resource on European IT and cybersecurity procurement and digital sovereignty.</p>
        <p>Not affiliated with the European Union institutions or with any company listed.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="why-europe.html">Why Europe</a></li>
          <li><a href="cybersecurity.html">Cybersecurity</a></li>
          <li><a href="cybersecurity.html#critical-infrastructure">OT &amp; critical infrastructure</a></li>
          <li><a href="alternatives.html">European alternatives</a></li>
        </ul>
      </div>
      <div>
        <h2>Tools</h2>
        <ul>
          <li><a href="procurement.html#checklist">Procurement checklist</a></li>
          <li><a href="sovereignty.html">Sovereignty assessment</a></li>
          <li><a href="why-europe.html#myths">Common arguments</a></li>
          <li><a href="procurement.html#regulation">Policy &amp; regulation</a></li>
        </ul>
      </div>
      <div>
        <h2>This website</h2>
        <ul>
          <li><a href="about.html">About &amp; methodology</a></li>
          <li><a href="sources.html">Sources</a></li>
          <li><a href="about.html#corrections">Report a correction</a></li>
          <li><a href="about.html#privacy">Privacy: no cookies, no tracking</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Text licensed under CC BY 4.0 · Code under the MIT License</p>
      <p>Information only — not legal or procurement advice.</p>
    </div>
  </div>
</footer>"""


def replace_block(text: str, name: str, content: str, file: str) -> str:
    pattern = re.compile(rf"(<!-- BEGIN:{name} -->)(.*?)(<!-- END:{name} -->)", re.S)
    if not pattern.search(text):
        errors.append(f"{file}: missing <!-- BEGIN:{name} --> marker")
        return text
    return pattern.sub(lambda m: m.group(1) + "\n" + content + "\n" + m.group(3), text, count=1)


# --------------------------------------------------------------------------- data validation
def load_json(rel: str):
    p = ROOT / rel
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        errors.append(f"{rel}: invalid JSON ({e})")
        return None


def validate_companies(data) -> list[dict]:
    if not data:
        return []
    companies = data.get("companies", [])
    seen = set()
    for c in companies:
        cid = c.get("id", "?")
        for k in COMPANY_KEYS:
            if k not in c:
                errors.append(f"companies.json: '{cid}' missing key '{k}'")
        if cid in seen:
            errors.append(f"companies.json: duplicate id '{cid}'")
        seen.add(cid)
        if c.get("classification") not in CLASSIFICATIONS:
            errors.append(f"companies.json: '{cid}' unknown classification '{c.get('classification')}'")
        for cat in c.get("categories", []):
            if cat not in CATEGORIES:
                errors.append(f"companies.json: '{cid}' unknown category '{cat}'")
        for k, allowed in TRISTATE.items():
            if c.get(k) not in allowed:
                errors.append(f"companies.json: '{cid}' invalid {k} '{c.get(k)}'")
        if not str(c.get("website", "")).startswith("https://"):
            errors.append(f"companies.json: '{cid}' website must use https://")
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(c.get("lastVerified", ""))):
            errors.append(f"companies.json: '{cid}' lastVerified must be YYYY-MM-DD")
    return sorted(companies, key=lambda c: c.get("name", "").lower())


def validate_sources(data) -> list[dict]:
    if not data:
        return []
    sources = data.get("sources", [])
    seen = set()
    for s in sources:
        sid = s.get("id", "?")
        for k in ("id", "title", "organisation", "url", "accessed", "topics"):
            if k not in s:
                errors.append(f"sources.json: '{sid}' missing key '{k}'")
        if sid in seen:
            errors.append(f"sources.json: duplicate id '{sid}'")
        seen.add(sid)
        if not str(s.get("url", "")).startswith("https://"):
            errors.append(f"sources.json: '{sid}' url must use https://")
    return sources


# --------------------------------------------------------------------------- renderers
def render_company(c: dict) -> str:
    cats = c.get("categories", [])
    search = " ".join(
        [c.get("name", ""), c.get("country", ""), c.get("headquarters", ""), c.get("description", ""),
         c.get("parentCompany", ""), " ".join(cats), " ".join(c.get("products", [])), " ".join(c.get("evaluating", []))]
    ).lower()
    cls = c.get("classification", "mixed")
    products = ", ".join(c.get("products", []))
    srcs = "".join(
        f'<li><a href="{esc(u)}" rel="noopener noreferrer">{esc(re.sub(r"^https?://(www\.)?", "", u)[:70])}</a></li>'
        for u in c.get("sources", [])
    )
    evaluating = "".join(f"<li>{esc(e)}</li>" for e in c.get("evaluating", []))
    return f"""<article class="card company" id="c-{esc(c['id'])}" data-categories="{esc('|'.join(cats))}" data-country="{esc(c.get('country', ''))}" data-class="{esc(cls)}" data-opensource="{esc(c.get('openSource'))}" data-onprem="{esc(c.get('onPremises'))}" data-search="{esc(search)}">
  <div class="company-head">
    <div>
      <h3>{esc(c['name'])}</h3>
      <p class="hq">{esc(c.get('headquarters', ''))}</p>
    </div>
    <span class="class-badge class-{esc(cls)}" title="{esc(c.get('classificationNote', ''))}">{esc(CLASSIFICATIONS.get(cls, cls))}</span>
  </div>
  <ul class="tags" aria-label="Categories">{''.join(f'<li>{esc(x)}</li>' for x in cats)}</ul>
  <p class="desc">{esc(c.get('description', ''))}</p>
  <dl class="facts">
    <dt>Country</dt><dd>{esc(c.get('country', ''))}</dd>
    <dt>Parent</dt><dd>{esc(c.get('parentCompany', ''))}</dd>
    <dt>Products</dt><dd>{esc(products)}</dd>
    <dt>Deployment</dt><dd>{esc(', '.join(c.get('deployment', [])))}</dd>
    <dt>Open source</dt><dd>{esc(c.get('openSource'))}</dd>
    <dt>On-premises</dt><dd>{esc(c.get('onPremises'))}</dd>
    <dt>Cloud</dt><dd>{esc(c.get('cloud'))}</dd>
  </dl>
  <details>
    <summary>Ownership, relevance and sources</summary>
    <p><strong>Ownership:</strong> {esc(c.get('ownership', ''))}</p>
    <p><strong>Classification:</strong> {esc(c.get('classificationNote', ''))}</p>
    <p><strong>European options to consider when evaluating:</strong></p>
    <ul>{evaluating}</ul>
    <p><strong>Verified against:</strong></p>
    <ul>{srcs}</ul>
  </details>
  <div class="company-foot">
    <span>Last verified: <time datetime="{esc(c.get('lastVerified'))}">{esc(c.get('lastVerified'))}</time></span>
    <a href="{esc(c.get('website'))}" rel="noopener noreferrer">Website<span class="visually-hidden"> of {esc(c['name'])}</span> ↗</a>
  </div>
</article>"""


def render_filters(companies: list[dict]) -> str:
    countries = sorted({c.get("country", "") for c in companies if c.get("country")})
    used = {cat for c in companies for cat in c.get("categories", [])}
    chips = ['<button type="button" class="chip" data-category="All" aria-pressed="true">All</button>']
    for cat in CATEGORIES:
        if cat in used:
            chips.append(f'<button type="button" class="chip" data-category="{esc(cat)}" aria-pressed="false">{esc(cat)}</button>')
    country_opts = "".join(f'<option value="{esc(x)}">{esc(x)}</option>' for x in countries)
    class_opts = "".join(f'<option value="{k}">{esc(v)}</option>' for k, v in CLASSIFICATIONS.items())
    return f"""<form id="filter-form" class="filters" role="search" aria-label="Filter European technology alternatives" data-js-only hidden>
  <div class="field">
    <label for="f-search">Search</label>
    <input id="f-search" type="search" placeholder="Company, product, country or capability" autocomplete="off">
  </div>
  <div class="field">
    <label for="f-country">Country</label>
    <select id="f-country"><option value="">All countries</option>{country_opts}</select>
  </div>
  <div class="field">
    <label for="f-class">Classification</label>
    <select id="f-class"><option value="">All classifications</option>{class_opts}</select>
  </div>
  <div class="field">
    <span class="field-label">Reset</span>
    <button type="button" id="f-reset" class="btn btn-ghost btn-sm">Clear all filters</button>
  </div>
  <div class="filter-toggles">
    <label class="checkbox"><input type="checkbox" id="f-opensource"> Open source (fully or partly)</label>
    <label class="checkbox"><input type="checkbox" id="f-onprem"> Can run on-premises</label>
  </div>
</form>
<div class="chip-row" role="group" aria-label="Filter by category" data-js-only hidden>
  {''.join(chips)}
</div>
<div class="results-bar">
  <p class="results-count" id="results-count" role="status" aria-live="polite">Showing all {len(companies)} entries</p>
</div>"""


def render_companies(companies: list[dict]) -> str:
    cards = "\n".join(render_company(c) for c in companies)
    return f"""<div class="company-grid">
{cards}
</div>
<div class="empty-state" id="results-empty" hidden>
  <p><strong>No entries match these filters.</strong></p>
  <p>Try a broader search, or <a href="about.html#corrections">suggest a company</a> that should be listed.</p>
</div>"""


def render_watchlist(items: list[dict]) -> str:
    rows = []
    for w in sorted(items, key=lambda x: (-int(x.get("year") or 0), x.get("name", ""))):
        rows.append(
            f"<tr><th scope=\"row\">{esc(w.get('name'))}</th><td>{esc(w.get('origin'))}</td>"
            f"<td>{esc(w.get('event'))}</td><td>{esc(w.get('year'))}</td>"
            f"<td>{esc(w.get('newOwnerCountry'))}</td>"
            f"<td><a href=\"{esc(w.get('source'))}\" rel=\"noopener noreferrer\">Source<span class=\"visually-hidden\"> for {esc(w.get('name'))}</span></a></td></tr>"
        )
    return f"""<div class="table-wrap">
<table>
  <caption class="visually-hidden">European-origin technology companies that came under non-European ownership</caption>
  <thead><tr><th scope="col">Company</th><th scope="col">Origin</th><th scope="col">What happened</th><th scope="col">Year</th><th scope="col">New owner based in</th><th scope="col">Reference</th></tr></thead>
  <tbody>
{chr(10).join(rows)}
  </tbody>
</table>
</div>"""


TOPIC_ORDER = ["Regulation", "Cybersecurity", "Critical infrastructure", "Cloud", "Jurisdiction", "Procurement", "Sovereignty", "Economy"]


def render_sources(sources: list[dict]) -> str:
    groups: dict[str, list[dict]] = {}
    for s in sources:
        groups.setdefault(s.get("type") or "Other", []).append(s)
    order = ["Legislation", "Court ruling", "Official policy", "Official guidance", "Report", "News", "Company", "Other"]
    out = []
    for g in sorted(groups, key=lambda x: order.index(x) if x in order else 99):
        items = []
        for s in sorted(groups[g], key=lambda x: x.get("title", "").lower()):
            pub = s.get("published") or "not stated"
            items.append(f"""<li class="source" id="src-{esc(s['id'])}">
  <h3><a href="{esc(s['url'])}" rel="noopener noreferrer">{esc(s['title'])}</a></h3>
  <p class="meta">{esc(s.get('organisation', ''))} · Published: {esc(pub)} · Accessed: {esc(s.get('accessed', ''))} · Topics: {esc(', '.join(s.get('topics', [])))}</p>
  {f"<p>{esc(s['summary'])}</p>" if s.get('summary') else ''}
  <p class="src-url">{esc(s['url'])}</p>
</li>""")
        out.append(f'<section aria-labelledby="g-{esc(g.lower().replace(" ", "-"))}">\n<h2 id="g-{esc(g.lower().replace(" ", "-"))}">{esc(g)}</h2>\n<ul class="source-list">\n' + "\n".join(items) + "\n</ul>\n</section>")
    return "\n".join(out)


# --------------------------------------------------------------------------- citations
def number_citations(text: str) -> str:
    """Expand [[source-id]] shorthand and number citations per page in order of first appearance."""
    text = re.sub(r"\[\[([a-z0-9-]+)\]\]", lambda m: f'<a class="cite" href="sources.html#src-{m.group(1)}">0</a>', text)
    order: dict[str, int] = {}

    def num(m):
        sid = m.group(1)
        order.setdefault(sid, len(order) + 1)
        return f'<a class="cite" href="sources.html#src-{sid}" aria-label="Source {order[sid]}">{order[sid]}</a>'

    return re.sub(r'<a class="cite" href="sources\.html#src-([a-z0-9-]+)"[^>]*>\d+</a>', num, text)


# --------------------------------------------------------------------------- site URL
def apply_site_url(text: str, file: str, site_url: str) -> str:
    page_url = site_url + ("" if file == "index.html" else file)
    text = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + page_url + m.group(2), text)
    text = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + page_url + m.group(2), text)
    text = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + site_url + "assets/img/og-image.png" + m.group(2), text)
    return text


def sitemap(site_url: str) -> str:
    today = date.today().isoformat()
    urls = "\n".join(
        f"  <url><loc>{site_url + ('' if f == 'index.html' else f)}</loc><lastmod>{today}</lastmod><priority>{p}</priority></url>"
        for f, _, p in PAGES
    )
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}\n</urlset>\n'


def robots(site_url: str) -> str:
    return f"User-agent: *\nAllow: /\n\nSitemap: {site_url}sitemap.xml\n"


# --------------------------------------------------------------------------- link checking
def check_links(files: dict[str, str], source_ids: set[str]) -> None:
    ids_per_file = {f: set(re.findall(r'\sid="([^"]+)"', t)) for f, t in files.items()}
    ids_per_file["sources.html"] |= {f"src-{i}" for i in source_ids}
    for f, text in files.items():
        for attr, url in re.findall(r'\s(href|src)="([^"]+)"', re.sub(r"<base [^>]*>", "", text)):
            if re.match(r"^(https?:|mailto:|tel:|data:)", url):
                if url.startswith("http:"):
                    errors.append(f"{f}: insecure http:// link {url}")
                continue
            if url.startswith("/"):
                errors.append(f"{f}: root-relative path breaks project-site hosting: {url}")
                continue
            path, _, anchor = url.partition("#")
            path = path.split("?")[0]
            target = f if not path else path
            if path and not (ROOT / path).exists():
                errors.append(f"{f}: broken {attr} -> {url}")
                continue
            if anchor and target.endswith(".html"):
                if target not in ids_per_file:
                    ids_per_file[target] = set(re.findall(r'\sid="([^"]+)"', (ROOT / target).read_text(encoding="utf-8")))
                if anchor not in ids_per_file[target]:
                    errors.append(f"{f}: missing anchor #{anchor} in {target}")


# --------------------------------------------------------------------------- main
def main() -> int:
    check_only = "--check" in sys.argv
    config = load_json("site.config.json") or {}
    site_url = config.get("siteUrl", "https://USERNAME.github.io/REPOSITORY/")
    if not site_url.endswith("/"):
        site_url += "/"
    repo_url = config.get("repositoryUrl", "https://github.com/")

    cdata = load_json("data/companies.json")
    companies = validate_companies(cdata)
    watchlist = (cdata or {}).get("watchlist", [])
    sources = validate_sources(load_json("data/sources.json"))
    source_ids = {s["id"] for s in sources if "id" in s}

    outputs: dict[str, str] = {}
    for f in [p[0] for p in PAGES] + EXTRA_PAGES:
        path = ROOT / f
        if not path.exists():
            errors.append(f"missing page {f}")
            continue
        text = path.read_text(encoding="utf-8")
        text = replace_block(text, "header", header(f), f)
        text = replace_block(text, "footer", footer(), f)
        text = number_citations(text)
        if f == "alternatives.html":
            text = replace_block(text, "filters", render_filters(companies), f)
            text = replace_block(text, "companies", render_companies(companies), f)
            text = replace_block(text, "watchlist", render_watchlist(watchlist), f)
        if f == "sources.html":
            text = replace_block(text, "sources", render_sources(sources), f)
        text = re.sub(r"<!-- COUNT:companies -->\d*<!-- /COUNT -->", f"<!-- COUNT:companies -->{len(companies)}<!-- /COUNT -->", text)
        text = re.sub(r"<!-- COUNT:sources -->\d*<!-- /COUNT -->", f"<!-- COUNT:sources -->{len(sources)}<!-- /COUNT -->", text)
        if f == "404.html":
            base_path = "/" + site_url.split("://", 1)[-1].split("/", 1)[-1] if "/" in site_url.split("://", 1)[-1] else "/"
            text = re.sub(r'<base href="[^"]*">', f'<base href="{base_path}">', text)
        else:
            text = apply_site_url(text, f, site_url)
        text = re.sub(r'(<a class="repo-link" href=")[^"]*(")', lambda m: m.group(1) + repo_url + m.group(2), text)
        outputs[f] = text
        for cid in re.findall(r'sources\.html#src-([a-z0-9-]+)', text):
            if cid not in source_ids:
                errors.append(f"{f}: citation to unknown source id '{cid}'")

    check_links(outputs, source_ids)

    stale = []
    for f, text in outputs.items():
        if (ROOT / f).read_text(encoding="utf-8") != text:
            stale.append(f)
    gen = {"sitemap.xml": sitemap(site_url), "robots.txt": robots(site_url)}
    for f, text in gen.items():
        existing = (ROOT / f).read_text(encoding="utf-8") if (ROOT / f).exists() else ""
        # lastmod dates change daily; only compare the URLs for staleness.
        if re.sub(r"<lastmod>.*?</lastmod>", "", existing) != re.sub(r"<lastmod>.*?</lastmod>", "", text):
            stale.append(f)

    if errors:
        print("ERRORS:")
        for e in errors:
            print("  -", e)
        return 1
    if check_only:
        if stale:
            print("Generated files are out of date. Run: python tools/build.py")
            for f in stale:
                print("  -", f)
            return 1
        print(f"OK — {len(companies)} companies, {len(watchlist)} watchlist entries, {len(sources)} sources, all links valid.")
        return 0

    for f, text in outputs.items():
        (ROOT / f).write_text(text, encoding="utf-8", newline="\n")
    for f, text in gen.items():
        if f in stale:
            (ROOT / f).write_text(text, encoding="utf-8", newline="\n")
    print(f"Built {len(outputs)} pages — {len(companies)} companies, {len(watchlist)} watchlist entries, {len(sources)} sources. All links valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
