#!/usr/bin/env python3
"""
Every IT Euro — static build helper (development only; not needed on GitHub Pages).

What it does
  1. Injects the shared header (with the language switcher) and footer into every page.
  2. Pre-renders data/companies.json into alternatives.html and data/sources.json into sources.html,
     in every language, so the content is readable without JavaScript. JavaScript only adds filtering.
  3. Rewrites canonical / Open Graph / hreflang URLs, sitemap.xml and robots.txt from site.config.json.
  4. Validates: JSON structure, internal links and anchors, asset paths and citation ids (errors),
     and translation completeness (warnings).

Languages
  English pages live in the repository root. Each translation lives in its own folder (de/, fr/, ...)
  with the same file names. Interface strings: i18n/<lang>/ui.json; JavaScript strings:
  assets/js/i18n/<lang>.js. A language is built when its folder exists.
  The company database, watchlist and source summaries are maintained in English only and shown in
  English on every language version (marked lang="en", so browsers can offer to translate them).
  Missing translations never block a build: they fall back to English and are reported as warnings.

Usage
  python tools/build.py           # build and validate
  python tools/build.py --check   # validate only; fail if any generated file is out of date (used in CI)
"""
from __future__ import annotations

import hashlib
import html
import json
import math
import posixpath
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = [
    # file, sitemap priority
    ("index.html", "1.0"),
    ("why-europe.html", "0.9"),
    ("cybersecurity.html", "0.9"),
    ("alternatives.html", "0.9"),
    ("procurement.html", "0.9"),
    ("sovereignty.html", "0.8"),
    ("sources.html", "0.6"),
    ("about.html", "0.5"),
]
EXTRA_PAGES = ["404.html"]  # English only: GitHub Pages serves the root 404.html for every missing URL.

# Code, native name, HTML lang / hreflang, Open Graph locale. English must stay first (the default).
LANGUAGES = [
    ("en", "English", "en", "en_GB"),
    ("de", "Deutsch", "de", "de_DE"),
    ("fr", "Français", "fr", "fr_FR"),
    ("es", "Español", "es", "es_ES"),
    ("it", "Italiano", "it", "it_IT"),
    ("pl", "Polski", "pl", "pl_PL"),
]
DEFAULT_LANG = "en"

CATEGORIES = [
    "Cybersecurity", "Network Security", "OT Security", "SIEM", "Endpoint Security", "Identity", "PAM",
    "Encryption", "Cloud", "Hosting", "Collaboration", "Email", "Operating Systems", "Infrastructure",
    "Monitoring", "Backup", "Open Source",
]
CLASSIFICATIONS = ["eu-hq", "european-hq", "european-subsidiary", "european-open-source", "mixed"]
TRISTATE = {"openSource": {"Yes", "No", "Partly"}, "onPremises": {"Yes", "No", "Optional"}, "cloud": {"Yes", "No", "Optional"}}
COMPANY_KEYS = [
    "id", "name", "country", "countryCode", "headquarters", "parentCompany", "ownership", "classification",
    "classificationNote", "categories", "description", "products", "deployment", "openSource", "onPremises",
    "cloud", "website", "evaluating", "sources", "lastVerified",
]

LOGO = (
    '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" focusable="false">'
    '<rect width="40" height="40" rx="9" fill="#003399"/>'
    + "".join(
        f'<circle cx="{20 + 12.5 * math.cos(i * 3.14159265 / 6):.2f}" '
        f'cy="{20 + 12.5 * math.sin(i * 3.14159265 / 6):.2f}" r="1.9" fill="#FFCC00"/>'
        for i in range(12)
    )
    + '<path d="M20 12.5l6 2.4v4.6c0 4-2.6 6.9-6 8-3.4-1.1-6-4-6-8v-4.6z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>'
    "</svg>"
)
GLOBE = (
    '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false" class="lang-icon"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>'
    '<path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'
)

errors: list[str] = []
warnings: list[str] = []  # reported, but never block a build


def esc(s) -> str:
    return html.escape(str(s), quote=True)


def fmt(template: str, **values) -> str:
    return re.sub(r"\{(\w+)\}", lambda m: str(values.get(m.group(1), m.group(0))), template)


def page_path(lang: str, file: str) -> str:
    """Repository-relative path of a page in a language."""
    return file if lang == DEFAULT_LANG else f"{lang}/{file}"


# --------------------------------------------------------------------------- strings
def load_json(rel: str, required: bool = True):
    p = ROOT / rel
    if not p.exists():
        if required:
            errors.append(f"{rel}: file missing")
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        errors.append(f"{rel}: invalid JSON ({e})")
        return None


def check_same_keys(ref, other, where: str, path: str = "") -> None:
    """Every key of the English strings must exist in a translation (and vice versa)."""
    if isinstance(ref, dict):
        if not isinstance(other, dict):
            errors.append(f"{where}: '{path}' should be an object")
            return
        for k in ref:
            if k not in other:
                warnings.append(f"{where}: missing '{path}{k}' (English used)")
            else:
                check_same_keys(ref[k], other[k], where, f"{path}{k}.")
        for k in other:
            if k not in ref:
                warnings.append(f"{where}: unknown key '{path}{k}' (ignored)")
    elif isinstance(ref, str) and not isinstance(other, str):
        errors.append(f"{where}: '{path.rstrip('.')}' should be a string")
    elif isinstance(ref, str):
        if set(re.findall(r"\{\w+\}", ref)) != set(re.findall(r"\{\w+\}", other)):
            errors.append(f"{where}: placeholders differ in '{path.rstrip('.')}'")


def merge(ref, other):
    """English strings, overridden by every translated string that exists."""
    if isinstance(ref, dict):
        other = other if isinstance(other, dict) else {}
        return {k: merge(v, other.get(k)) for k, v in ref.items()}
    return other if isinstance(other, str) and isinstance(ref, str) else ref


def load_ui(lang: str, ref: dict | None) -> dict:
    if ref is None:
        return load_json(f"i18n/{lang}/ui.json") or {}
    data = load_json(f"i18n/{lang}/ui.json", required=False)
    if data is None:
        warnings.append(f"i18n/{lang}/ui.json: missing (English interface strings used)")
        return ref
    check_same_keys(ref, data, f"i18n/{lang}/ui.json")
    return merge(ref, data)


# --------------------------------------------------------------------------- partials
def exists(lang: str, file: str) -> bool:
    return (ROOT / page_path(lang, file)).exists()


def lang_switch(file: str, lang: str, prefix: str, langs: list[tuple]) -> str:
    items = []
    for code, name, hl, _ in langs:
        if file == "404.html":
            href = "index.html" if code == DEFAULT_LANG else f"{code}/index.html"
        else:
            # A page that is not translated (yet) links to the English version.
            href = prefix + page_path(code if exists(code, file) else DEFAULT_LANG, file)
        cur = ' aria-current="true"' if code == lang else ""
        items.append(
            f'<li><a href="{href}" hreflang="{hl}" lang="{hl}" data-lang="{code}"{cur}>'
            f'<span class="lang-code" aria-hidden="true">{code.upper()}</span><span class="lang-name">{esc(name)}</span></a></li>'
        )
    return "".join(items)


def header(file: str, lang: str, prefix: str, ui: dict, langs: list[tuple]) -> str:
    items = []
    for f, _ in PAGES:
        cur = ' aria-current="page"' if f == file else ""
        items.append(f'<li><a href="{f}"{cur}>{esc(ui["nav"][f])}</a></li>')
    switch = ""
    if len(langs) > 1:
        switch = f"""<div class="lang-bar">
  <div class="container">
    <nav class="lang-switch" aria-label="{esc(ui['languageSwitchLabel'])}">{GLOBE}<ul>{lang_switch(file, lang, prefix, langs)}</ul></nav>
  </div>
</div>
"""
    return f"""<a class="skip-link" href="#main">{esc(ui['skipLink'])}</a>
{switch}<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html">{LOGO}<span>Every IT Euro<small>{esc(ui['tagline'])}</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-icon" aria-hidden="true"></span>{esc(ui['menu'])}</button>
    <nav id="site-nav" class="site-nav" aria-label="{esc(ui['mainNavLabel'])}">
      <ul>
        {chr(10).join('        ' + i for i in items).strip()}
      </ul>
    </nav>
  </div>
</header>"""


def footer(ui: dict) -> str:
    t = ui["footer"]
    note = f"\n      <p>{esc(t['translationNote'])}</p>" if t.get("translationNote") else ""
    return f"""<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <p class="footer-brand">{LOGO}Every IT Euro</p>
        <p>{esc(t['intro'])}</p>
        <p>{esc(t['notAffiliated'])}</p>
      </div>
      <div>
        <h2>{esc(t['explore'])}</h2>
        <ul>
          <li><a href="why-europe.html">{esc(t['whyEurope'])}</a></li>
          <li><a href="cybersecurity.html">{esc(t['cybersecurity'])}</a></li>
          <li><a href="cybersecurity.html#critical-infrastructure">{esc(t['ot'])}</a></li>
          <li><a href="alternatives.html">{esc(t['alternatives'])}</a></li>
        </ul>
      </div>
      <div>
        <h2>{esc(t['tools'])}</h2>
        <ul>
          <li><a href="procurement.html#checklist">{esc(t['checklist'])}</a></li>
          <li><a href="sovereignty.html">{esc(t['assessment'])}</a></li>
          <li><a href="why-europe.html#myths">{esc(t['myths'])}</a></li>
          <li><a href="procurement.html#regulation">{esc(t['regulation'])}</a></li>
        </ul>
      </div>
      <div>
        <h2>{esc(t['website'])}</h2>
        <ul>
          <li><a href="about.html">{esc(t['about'])}</a></li>
          <li><a href="sources.html">{esc(t['sources'])}</a></li>
          <li><a href="about.html#corrections">{esc(t['corrections'])}</a></li>
          <li><a href="about.html#privacy">{esc(t['privacy'])}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>{esc(t['licence'])}</p>
      <p>{esc(t['disclaimer'])}</p>{note}
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


def check_vocabulary(ui: dict, companies, watchlist, sources) -> None:
    """Every value used in the data must have a label in the English interface strings."""
    for c in companies:
        if c.get("country") not in ui["countries"]:
            errors.append(f"i18n/en/ui.json: no label for country '{c.get('country')}'")
        for d in c.get("deployment", []):
            if d not in ui["deployment"]:
                errors.append(f"i18n/en/ui.json: no label for deployment '{d}'")
    for w in watchlist:
        for k in ("origin", "newOwnerCountry"):
            if w.get(k) not in ui["countries"]:
                errors.append(f"i18n/en/ui.json: no label for country '{w.get(k)}'")
    for s in sources:
        if (s.get("type") or "Other") not in ui["sources"]["types"]:
            errors.append(f"i18n/en/ui.json: no label for source type '{s.get('type')}'")
        for t in s.get("topics", []):
            if t not in ui["sources"]["topicNames"]:
                errors.append(f"i18n/en/ui.json: no label for topic '{t}'")


# --------------------------------------------------------------------------- renderers
def render_company(c: dict, ui: dict, lang: str) -> str:
    T = ui["companies"]
    en = ' lang="en"' if lang != DEFAULT_LANG else ""  # data text is English on every language version
    cats = c.get("categories", [])
    country = ui["countries"].get(c.get("country", ""), c.get("country", ""))
    # Search matches the translated text and the English original, so both work in every language.
    parts = [c.get("name", ""), country, c.get("country", ""), c.get("headquarters", ""), c.get("description", ""),
             c.get("parentCompany", ""), " ".join(ui["categories"].get(x, x) for x in cats), " ".join(cats),
             " ".join(c.get("products", [])), " ".join(c.get("evaluating", []))]
    search = " ".join(dict.fromkeys(" ".join(parts).lower().split()))
    cls = c.get("classification", "mixed")
    products = ", ".join(c.get("products", []))
    srcs = "".join(
        f'<li><a href="{esc(u)}" rel="noopener noreferrer">{esc(re.sub(r"^https?://(www\.)?", "", u)[:70])}</a></li>'
        for u in c.get("sources", [])
    )
    evaluating = "".join(f"<li>{esc(e)}</li>" for e in c.get("evaluating", []))
    V = ui["values"]
    return f"""<article class="card company" id="c-{esc(c['id'])}" data-categories="{esc('|'.join(cats))}" data-country="{esc(c.get('country', ''))}" data-class="{esc(cls)}" data-opensource="{esc(c.get('openSource'))}" data-onprem="{esc(c.get('onPremises'))}" data-search="{esc(search)}">
  <div class="company-head">
    <div>
      <h3>{esc(c['name'])}</h3>
      <p class="hq"{en}>{esc(c.get('headquarters', ''))}</p>
    </div>
    <span class="class-badge class-{esc(cls)}" title="{esc(c.get('classificationNote', ''))}"{en}>{esc(ui['classifications'][cls])}</span>
  </div>
  <ul class="tags" aria-label="{esc(T['categoriesLabel'])}">{''.join(f'<li>{esc(ui["categories"][x])}</li>' for x in cats)}</ul>
  <p class="desc"{en}>{esc(c.get('description', ''))}</p>
  <dl class="facts">
    <dt>{esc(T['country'])}</dt><dd>{esc(country)}</dd>
    <dt>{esc(T['parent'])}</dt><dd{en}>{esc(c.get('parentCompany', ''))}</dd>
    <dt>{esc(T['products'])}</dt><dd>{esc(products)}</dd>
    <dt>{esc(T['deployment'])}</dt><dd>{esc(', '.join(ui['deployment'].get(d, d) for d in c.get('deployment', [])))}</dd>
    <dt>{esc(T['openSource'])}</dt><dd>{esc(V[c.get('openSource')])}</dd>
    <dt>{esc(T['onPremises'])}</dt><dd>{esc(V[c.get('onPremises')])}</dd>
    <dt>{esc(T['cloud'])}</dt><dd>{esc(V[c.get('cloud')])}</dd>
  </dl>
  <details>
    <summary>{esc(T['detailsSummary'])}</summary>
    <p><strong>{esc(T['ownership'])}</strong> <span{en}>{esc(c.get('ownership', ''))}</span></p>
    <p><strong>{esc(T['classification'])}</strong> <span{en}>{esc(c.get('classificationNote', ''))}</span></p>
    <p><strong>{esc(T['evaluating'])}</strong></p>
    <ul{en}>{evaluating}</ul>
    <p><strong>{esc(T['verifiedAgainst'])}</strong></p>
    <ul>{srcs}</ul>
  </details>
  <div class="company-foot">
    <span>{esc(T['lastVerified'])} <time datetime="{esc(c.get('lastVerified'))}">{esc(c.get('lastVerified'))}</time></span>
    <a href="{esc(c.get('website'))}" rel="noopener noreferrer" aria-label="{esc(fmt(T['websiteOf'], name=c['name']))}">{esc(T['website'])} ↗</a>
  </div>
</article>"""


def render_filters(companies: list[dict], ui: dict) -> str:
    F = ui["filters"]
    countries = sorted({c.get("country", "") for c in companies if c.get("country")}, key=lambda x: ui["countries"][x].casefold())
    used = {cat for c in companies for cat in c.get("categories", [])}
    chips = [f'<button type="button" class="chip" data-category="All" aria-pressed="true">{esc(F["all"])}</button>']
    for cat in CATEGORIES:
        if cat in used:
            chips.append(f'<button type="button" class="chip" data-category="{esc(cat)}" aria-pressed="false">{esc(ui["categories"][cat])}</button>')
    country_opts = "".join(f'<option value="{esc(x)}">{esc(ui["countries"][x])}</option>' for x in countries)
    class_opts = "".join(f'<option value="{k}">{esc(ui["classifications"][k])}</option>' for k in CLASSIFICATIONS)
    return f"""<form id="filter-form" class="filters" role="search" aria-label="{esc(F['formLabel'])}" data-js-only hidden>
  <div class="field">
    <label for="f-search">{esc(F['search'])}</label>
    <input id="f-search" type="search" placeholder="{esc(F['searchPlaceholder'])}" autocomplete="off">
  </div>
  <div class="field">
    <label for="f-country">{esc(F['country'])}</label>
    <select id="f-country"><option value="">{esc(F['allCountries'])}</option>{country_opts}</select>
  </div>
  <div class="field">
    <label for="f-class">{esc(F['classification'])}</label>
    <select id="f-class"><option value="">{esc(F['allClassifications'])}</option>{class_opts}</select>
  </div>
  <div class="field">
    <span class="field-label">{esc(F['reset'])}</span>
    <button type="button" id="f-reset" class="btn btn-ghost btn-sm">{esc(F['clearAll'])}</button>
  </div>
  <div class="filter-toggles">
    <label class="checkbox"><input type="checkbox" id="f-opensource"> {esc(F['openSource'])}</label>
    <label class="checkbox"><input type="checkbox" id="f-onprem"> {esc(F['onPrem'])}</label>
  </div>
</form>
<div class="chip-row" role="group" aria-label="{esc(F['categoryGroupLabel'])}" data-js-only hidden>
  {''.join(chips)}
</div>
{f'<p class="note data-language-note">{esc(ui["companies"]["englishNote"])}</p>' if ui["companies"]["englishNote"] else ""}
<div class="results-bar">
  <p class="results-count" id="results-count" role="status" aria-live="polite">{esc(fmt(ui['companies']['showingAll'], total=len(companies)))}</p>
</div>"""


def render_companies(companies: list[dict], ui: dict, lang: str) -> str:
    cards = "\n".join(render_company(c, ui, lang) for c in companies)
    return f"""<div class="company-grid">
{cards}
</div>
<div class="empty-state" id="results-empty" hidden>
  <p><strong>{esc(ui['companies']['emptyTitle'])}</strong></p>
  <p>{ui['companies']['emptyText']}</p>
</div>"""


def render_watchlist(items: list[dict], ui: dict, lang: str) -> str:
    W = ui["watchlist"]
    C = ui["countries"]
    rows = []
    for w in sorted(items, key=lambda x: (-int(x.get("year") or 0), x.get("name", ""))):
        event = w.get("event")
        en = ' lang="en"' if lang != DEFAULT_LANG else ""
        rows.append(
            f"<tr><th scope=\"row\">{esc(w.get('name'))}</th><td>{esc(C.get(w.get('origin'), w.get('origin')))}</td>"
            f"<td{en}>{esc(event)}</td><td>{esc(w.get('year'))}</td>"
            f"<td>{esc(C.get(w.get('newOwnerCountry'), w.get('newOwnerCountry')))}</td>"
            f"<td><a href=\"{esc(w.get('source'))}\" rel=\"noopener noreferrer\" aria-label=\"{esc(fmt(W['sourceFor'], name=w.get('name')))}\">{esc(W['source'])}</a></td></tr>"
        )
    return f"""<div class="table-wrap">
<table>
  <caption class="visually-hidden">{esc(W['caption'])}</caption>
  <thead><tr><th scope="col">{esc(W['company'])}</th><th scope="col">{esc(W['origin'])}</th><th scope="col">{esc(W['event'])}</th><th scope="col">{esc(W['year'])}</th><th scope="col">{esc(W['newOwner'])}</th><th scope="col">{esc(W['reference'])}</th></tr></thead>
  <tbody>
{chr(10).join(rows)}
  </tbody>
</table>
</div>"""


SOURCE_TYPE_ORDER = ["Legislation", "Court ruling", "Official policy", "Official guidance", "Report", "News", "Company", "Other"]


def render_sources(sources: list[dict], ui: dict, lang: str) -> str:
    S = ui["sources"]
    en = ' lang="en"' if lang != DEFAULT_LANG else ""
    groups: dict[str, list[dict]] = {}
    for s in sources:
        groups.setdefault(s.get("type") or "Other", []).append(s)
    out = []
    for g in sorted(groups, key=lambda x: SOURCE_TYPE_ORDER.index(x) if x in SOURCE_TYPE_ORDER else 99):
        items = []
        for s in sorted(groups[g], key=lambda x: x.get("title", "").lower()):
            pub = s.get("published") or S["notStated"]
            summary = s.get("summary")
            topics = ", ".join(S["topicNames"].get(t, t) for t in s.get("topics", []))
            items.append(f"""<li class="source" id="src-{esc(s['id'])}">
  <h3><a href="{esc(s['url'])}" rel="noopener noreferrer">{esc(s['title'])}</a></h3>
  <p class="meta">{esc(s.get('organisation', ''))} · {esc(S['published'])}: {esc(pub)} · {esc(S['accessed'])}: {esc(s.get('accessed', ''))} · {esc(S['topics'])}: {esc(topics)}</p>
  {f"<p{en}>{esc(summary)}</p>" if summary else ''}
  <p class="src-url">{esc(s['url'])}</p>
</li>""")
        gid = esc(g.lower().replace(" ", "-"))
        out.append(f'<section aria-labelledby="g-{gid}">\n<h2 id="g-{gid}">{esc(S["types"].get(g, g))}</h2>\n<ul class="source-list">\n' + "\n".join(items) + "\n</ul>\n</section>")
    note = f'<p class="note data-language-note">{esc(S["englishNote"])}</p>\n' if S["englishNote"] else ""
    return note + "\n".join(out)


# --------------------------------------------------------------------------- citations
def number_citations(text: str, label: str) -> str:
    """Expand [[source-id]] shorthand and number citations per page in order of first appearance."""
    text = re.sub(r"\[\[([a-z0-9-]+)\]\]", lambda m: f'<a class="cite" href="sources.html#src-{m.group(1)}">0</a>', text)
    order: dict[str, int] = {}

    def num(m):
        sid = m.group(1)
        order.setdefault(sid, len(order) + 1)
        return f'<a class="cite" href="sources.html#src-{sid}" aria-label="{esc(fmt(label, n=order[sid]))}">{order[sid]}</a>'

    return re.sub(r'<a class="cite" href="sources\.html#src-([a-z0-9-]+)"[^>]*>\d+</a>', num, text)


# --------------------------------------------------------------------------- cache busting
_asset_versions: dict[str, str] = {}


def asset_version(rel: str) -> str:
    """Short content hash of an asset, so browsers never combine new HTML with a cached old CSS/JS file."""
    if rel not in _asset_versions:
        p = ROOT / rel
        _asset_versions[rel] = hashlib.sha256(p.read_bytes()).hexdigest()[:10] if p.exists() else ""
    return _asset_versions[rel]


def strip_versions(text: str) -> str:
    return re.sub(r'((?:\.\./)*assets/(?:css|js)/[^"?]+)\?v=[0-9a-f]+', r"\1", text)


def add_versions(text: str) -> str:
    def repl(m):
        rel = m.group(2)
        v = asset_version(rel)
        return f'{m.group(1)}{rel}?v={v}"' if v else m.group(0)
    return re.sub(r'(\s(?:href|src)="(?:\.\./)*)(assets/(?:css|js)/[^"?]+)"', repl, text)


# --------------------------------------------------------------------------- language plumbing
def localise_paths(text: str, lang: str, prefix: str) -> str:
    """Set <html lang>, make asset paths work from a language folder and load the right string file."""
    hl = next(h for c, _, h, _ in LANGUAGES if c == lang)
    text = re.sub(r"<html lang=\"[^\"]*\"", f'<html lang="{hl}"', text, count=1)
    if prefix:
        text = re.sub(r'(\s(?:href|src)=")(?:\.\./)*(assets|data)/', rf"\1{prefix}\2/", text)
    text = re.sub(r'<script src="[^"]*assets/js/i18n/[a-z]+\.js"></script>\n', "", text)
    main = f'<script src="{prefix}assets/js/main.js"></script>'
    if main not in text:
        errors.append(f"{page_path(lang, 'page')}: main.js script tag not found")
    # English strings first; a translation file (if any) overrides them key by key in main.js.
    scripts = f'<script src="{prefix}assets/js/i18n/en.js"></script>\n'
    if lang != DEFAULT_LANG and (ROOT / "assets/js/i18n" / f"{lang}.js").exists():
        scripts += f'<script src="{prefix}assets/js/i18n/{lang}.js"></script>\n'
    return text.replace(main, scripts + main, 1)


def page_url(site_url: str, lang: str, file: str) -> str:
    return site_url + ("" if lang == DEFAULT_LANG else f"{lang}/") + ("" if file == "index.html" else file)


def apply_site_url(text: str, file: str, lang: str, site_url: str, langs: list[tuple]) -> str:
    url = page_url(site_url, lang, file)
    text = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), text)
    text = re.sub(r'(<meta property="og:url" content=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), text)
    text = re.sub(r'(<meta property="og:image" content=")[^"]*(")', lambda m: m.group(1) + site_url + "assets/img/og-image.png" + m.group(2), text)
    # hreflang alternates and og:locale, regenerated after the canonical link.
    text = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', "", text)
    text = re.sub(r'<meta property="og:locale(?::alternate)?" content="[^"]*">\n', "", text)
    alts = "".join(f'<link rel="alternate" hreflang="{h}" href="{page_url(site_url, c, file)}">\n' for c, _, h, _ in langs if exists(c, file))
    alts += f'<link rel="alternate" hreflang="x-default" href="{page_url(site_url, DEFAULT_LANG, file)}">\n'
    text = re.sub(r'(<link rel="canonical" href="[^"]*">\n)', lambda m: m.group(1) + alts, text, count=1)
    locale = next(o for c, _, _, o in LANGUAGES if c == lang)
    text = re.sub(r'(<meta property="og:type" content="[^"]*">\n)', lambda m: m.group(1) + f'<meta property="og:locale" content="{locale}">\n', text, count=1)
    return text


def sitemap(site_url: str, langs: list[tuple]) -> str:
    today = date.today().isoformat()
    urls = []
    for f, prio in PAGES:
        alts = "".join(
            f'\n    <xhtml:link rel="alternate" hreflang="{h}" href="{page_url(site_url, c, f)}"/>' for c, _, h, _ in langs if exists(c, f)
        ) if len(langs) > 1 else ""
        for code, *_ in langs:
            if not exists(code, f):
                continue
            urls.append(f"  <url>\n    <loc>{page_url(site_url, code, f)}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>{prio}</priority>{alts}\n  </url>")
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
            + "\n".join(urls) + "\n</urlset>\n")


def robots(site_url: str) -> str:
    return f"User-agent: *\nAllow: /\n\nSitemap: {site_url}sitemap.xml\n"


# --------------------------------------------------------------------------- link checking
def check_links(files: dict[str, str], source_ids: set[str]) -> None:
    ids_per_file = {f: set(re.findall(r'\sid="([^"]+)"', t)) for f, t in files.items()}
    for f in ids_per_file:
        if f.endswith("sources.html"):
            ids_per_file[f] |= {f"src-{i}" for i in source_ids}
    for f, text in files.items():
        base_dir = "" if f == "404.html" else posixpath.dirname(f)  # 404.html resolves against <base>
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
            target = posixpath.normpath(posixpath.join(base_dir, path)) if path else f
            if target.startswith(".."):
                errors.append(f"{f}: link leaves the site: {url}")
                continue
            if path and not (ROOT / target).exists():
                errors.append(f"{f}: broken {attr} -> {url}")
                continue
            if anchor and target.endswith(".html"):
                if target not in ids_per_file:
                    ids_per_file[target] = set(re.findall(r'\sid="([^"]+)"', (ROOT / target).read_text(encoding="utf-8")))
                if anchor not in ids_per_file[target]:
                    errors.append(f"{f}: missing anchor #{anchor} in {target}")


def check_structure(lang: str, file: str, text: str, english: str) -> None:
    """A translated page must keep the ids, form values and citations of the English page."""
    def ids(t):
        return set(re.findall(r'\sid="([^"]+)"', t))

    def values(t):
        return sorted(re.findall(r'<input[^>]*\svalue="([^"]+)"', t))

    def cites(t):
        return sorted(set(re.findall(r'sources\.html#src-([a-z0-9-]+)', t)))

    rel = page_path(lang, file)
    missing = ids(english) - ids(text)
    if missing:
        warnings.append(f"{rel}: outdated? ids missing compared to English: {', '.join(sorted(missing)[:8])}")
    if values(english) != values(text):
        warnings.append(f"{rel}: outdated? form input values differ from English")
    if cites(english) != cites(text):
        warnings.append(f"{rel}: outdated? cited sources differ from English: {sorted(set(cites(english)) ^ set(cites(text)))}")


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

    ui_en = load_ui(DEFAULT_LANG, None)
    if not ui_en:
        print("ERRORS:\n  - i18n/en/ui.json is required")
        return 1
    check_vocabulary(ui_en, companies, watchlist, sources)
    langs = [l for l in LANGUAGES if l[0] == DEFAULT_LANG or (ROOT / l[0]).is_dir()]

    outputs: dict[str, str] = {}
    for lang, *_ in langs:
        ui = ui_en if lang == DEFAULT_LANG else load_ui(lang, ui_en)
        if not ui:
            continue
        if not (ROOT / "assets/js/i18n" / f"{lang}.js").exists():
            warnings.append(f"assets/js/i18n/{lang}.js: missing (English tool texts used)")
        prefix = "" if lang == DEFAULT_LANG else "../"
        files = [p[0] for p in PAGES] + (EXTRA_PAGES if lang == DEFAULT_LANG else [])
        for f in files:
            rel = page_path(lang, f)
            path = ROOT / rel
            if not path.exists():
                if lang == DEFAULT_LANG:
                    errors.append(f"missing page {rel}")
                else:
                    warnings.append(f"{rel}: not translated yet (the language switcher links to the English page)")
                continue
            text = strip_versions(path.read_text(encoding="utf-8"))
            text = localise_paths(text, lang, prefix)
            text = replace_block(text, "header", header(f, lang, prefix, ui, langs), rel)
            text = replace_block(text, "footer", footer(ui), rel)
            text = number_citations(text, ui["citeLabel"])
            if f == "alternatives.html":
                text = replace_block(text, "filters", render_filters(companies, ui), rel)
                text = replace_block(text, "companies", render_companies(companies, ui, lang), rel)
                text = replace_block(text, "watchlist", render_watchlist(watchlist, ui, lang), rel)
            if f == "sources.html":
                text = replace_block(text, "sources", render_sources(sources, ui, lang), rel)
            text = re.sub(r"<!-- COUNT:companies -->\d*<!-- /COUNT -->", f"<!-- COUNT:companies -->{len(companies)}<!-- /COUNT -->", text)
            text = re.sub(r"<!-- COUNT:sources -->\d*<!-- /COUNT -->", f"<!-- COUNT:sources -->{len(sources)}<!-- /COUNT -->", text)
            if f == "404.html":
                base_path = "/" + site_url.split("://", 1)[-1].split("/", 1)[-1] if "/" in site_url.split("://", 1)[-1] else "/"
                text = re.sub(r'<base href="[^"]*">', f'<base href="{base_path}">', text)
            else:
                text = apply_site_url(text, f, lang, site_url, langs)
            text = re.sub(r'(<a class="repo-link" href=")[^"]*(")', lambda m: m.group(1) + repo_url + m.group(2), text)
            if lang != DEFAULT_LANG:
                # Links to pages that are not translated (yet) go to the English page.
                for other, _ in PAGES:
                    if not exists(lang, other):
                        text = re.sub(rf'(\shref="){re.escape(other)}(?=["#?])', rf"\g<1>{prefix}{other}", text)
            outputs[rel] = add_versions(text)
            for cid in re.findall(r'sources\.html#src-([a-z0-9-]+)', text):
                if cid not in source_ids:
                    errors.append(f"{rel}: citation to unknown source id '{cid}'")

    for lang, *_ in langs:
        if lang == DEFAULT_LANG:
            continue
        for f, _ in PAGES:
            rel = page_path(lang, f)
            if rel in outputs and f in outputs:
                check_structure(lang, f, outputs[rel], outputs[f])

    check_links(outputs, source_ids)

    stale = []
    for f, text in outputs.items():
        if (ROOT / f).read_text(encoding="utf-8") != text:
            stale.append(f)
    gen = {"sitemap.xml": sitemap(site_url, langs), "robots.txt": robots(site_url)}
    for f, text in gen.items():
        existing = (ROOT / f).read_text(encoding="utf-8") if (ROOT / f).exists() else ""
        # lastmod dates change daily; only compare the URLs for staleness.
        if re.sub(r"<lastmod>.*?</lastmod>", "", existing) != re.sub(r"<lastmod>.*?</lastmod>", "", text):
            stale.append(f)

    summary = (f"{len(langs)} languages ({', '.join(l[0] for l in langs)}), {len(companies)} companies, "
               f"{len(watchlist)} watchlist entries, {len(sources)} sources")
    if warnings:
        print(f"WARNINGS ({len(warnings)}) — the build still works; English is used where a translation is missing:")
        for w in warnings:
            print("  -", w)
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
        print(f"OK — {summary}, all links valid.")
        return 0

    for f, text in outputs.items():
        (ROOT / f).write_text(text, encoding="utf-8", newline="\n")
    for f, text in gen.items():
        if f in stale:
            (ROOT / f).write_text(text, encoding="utf-8", newline="\n")
    print(f"Built {len(outputs)} pages — {summary}. All links valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
