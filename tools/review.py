#!/usr/bin/env python3
"""
Every IT Euro — periodic review of the company database (development only, no dependencies).

Produces a work list:
  1. companies and watchlist entries whose "lastVerified" date is older than N months;
  2. company websites and source links that no longer work;
  3. websites that now redirect to a different domain — often a sign of an acquisition or rebrand.

Usage
  python tools/review.py                      # full review (checks ~400 links, takes a minute or two)
  python tools/review.py --no-links           # only the "last verified" dates
  python tools/review.py --months 6           # stricter age limit (default: 12)
  python tools/review.py --markdown review.md # also write the work list as Markdown (e.g. to paste into an issue)
  python tools/review.py --mark-verified ID [ID ...]
                                              # set lastVerified to today for companies you re-checked

The script never changes data unless you use --mark-verified.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
import ssl
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
COMPANIES = ROOT / "data" / "companies.json"
SOURCES = ROOT / "data" / "sources.json"
# A generic, non-identifying client name. Some sites still block automated requests (403/429);
# those are reported separately as "check by hand", not as broken.
USER_AGENT = "Mozilla/5.0 (compatible; EveryITEuro-LinkCheck/1.0)"
TIMEOUT = 20


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def save_companies(data: dict) -> None:
    COMPANIES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def months_between(earlier: date, later: date) -> int:
    return (later.year - earlier.year) * 12 + later.month - earlier.month - (1 if later.day < earlier.day else 0)


# --------------------------------------------------------------------------- age check
def stale_entries(cdata: dict, months: int) -> list[tuple[str, str, str, int]]:
    today = date.today()
    out = []
    for kind, items, key in (("company", cdata["companies"], "id"), ("watchlist", cdata["watchlist"], "name")):
        for item in items:
            raw = str(item.get("lastVerified", ""))
            try:
                verified = date.fromisoformat(raw)
            except ValueError:
                out.append((kind, item.get(key, "?"), raw or "missing", 999))
                continue
            age = months_between(verified, today)
            if age >= months:
                out.append((kind, item.get(key, "?"), raw, age))
    return sorted(out, key=lambda x: -x[3])


# --------------------------------------------------------------------------- link check
def domain(url: str) -> str:
    host = (urlparse(url).hostname or "").lower()
    return host[4:] if host.startswith("www.") else host


def base_domain(host: str) -> str:
    parts = host.split(".")
    # Good enough for a hint: example.co.uk -> example.co.uk, sub.example.com -> example.com
    return ".".join(parts[-3:]) if len(parts) > 2 and len(parts[-2]) <= 3 else ".".join(parts[-2:])


def check_url(url: str) -> tuple[str, int | None, str]:
    """Return (status, http_code, final_url). status: ok | broken | blocked | error."""
    ctx = ssl.create_default_context()
    last_error = ""
    for method in ("HEAD", "GET"):
        req = urllib.request.Request(url, method=method, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as resp:
                return "ok", resp.status, resp.geturl()
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (400, 403, 405, 406, 429, 500, 501, 503):
                continue  # many servers reject HEAD; retry with GET
            if e.code in (401, 403, 429, 451, 503):
                return "blocked", e.code, url
            return "broken", e.code, url
        except (urllib.error.URLError, TimeoutError, ssl.SSLError, ConnectionError, OSError) as e:
            last_error = str(getattr(e, "reason", e))
            if "CERTIFICATE_VERIFY_FAILED" in last_error or isinstance(getattr(e, "reason", None), ssl.SSLError):
                # Usually a missing intermediate certificate in Python's trust store, not a dead site.
                return "unverified", None, "certificate could not be verified"
            if method == "HEAD":
                continue
    return "error", None, last_error


def collect_links(cdata: dict, sdata: dict) -> dict[str, list[str]]:
    """url -> list of places where it is used."""
    links: dict[str, list[str]] = {}
    for c in cdata["companies"]:
        links.setdefault(c["website"], []).append(f"website of {c['id']}")
        for u in c.get("sources", []):
            links.setdefault(u, []).append(f"source of {c['id']}")
    for w in cdata["watchlist"]:
        links.setdefault(w["source"], []).append(f"watchlist: {w['name']}")
    for s in sdata["sources"]:
        links.setdefault(s["url"], []).append(f"sources.json: {s['id']}")
    return links


def run_link_check(cdata: dict, sdata: dict, workers: int) -> dict[str, list]:
    links = collect_links(cdata, sdata)
    websites = {c["website"] for c in cdata["companies"]}
    result = {"broken": [], "blocked": [], "moved": []}  # "blocked" also holds unverifiable certificates
    print(f"Checking {len(links)} links…", file=sys.stderr)
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(check_url, u): u for u in links}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            url = futures[fut]
            status, code, final = fut.result()
            where = ", ".join(links[url])
            if status in ("broken", "error"):
                result["broken"].append((url, code or final, where))
            elif status == "blocked":
                result["blocked"].append((url, f"HTTP {code}", where))
            elif status == "unverified":
                result["blocked"].append((url, final, where))
            elif url in websites and base_domain(domain(final)) != base_domain(domain(url)):
                result["moved"].append((url, final, where))
            if i % 50 == 0:
                print(f"  {i}/{len(links)}", file=sys.stderr)
    for k in result:
        result[k].sort()
    return result


# --------------------------------------------------------------------------- report
def report(stale, links, months: int) -> str:
    lines = [f"# Every IT Euro — review work list ({date.today().isoformat()})", ""]
    lines.append(f"## Not verified in the last {months} months ({len(stale)})")
    lines.append("")
    if stale:
        lines.append("Re-check ownership, headquarters, products and links; then update the entry and run "
                     "`python tools/review.py --mark-verified <id>`.")
        lines.append("")
        lines += [f"- [ ] {kind} `{name}` — last verified {when} ({age} months ago)" if age != 999
                  else f"- [ ] {kind} `{name}` — invalid lastVerified: {when}" for kind, name, when, age in stale]
    else:
        lines.append("Nothing to do.")
    lines.append("")
    if links is not None:
        lines.append(f"## Website now redirects to another domain ({len(links['moved'])})")
        lines.append("")
        lines.append("Often a sign of an acquisition, merger or rebrand. Check the ownership.")
        lines.append("")
        lines += [f"- [ ] {where}: {url} → {final}" for url, final, where in links["moved"]] or ["Nothing to do."]
        lines.append("")
        lines.append(f"## Broken links ({len(links['broken'])})")
        lines.append("")
        lines += [f"- [ ] {where}: {url} ({code})" for url, code, where in links["broken"]] or ["Nothing to do."]
        lines.append("")
        lines.append(f"## Blocked automated check — open by hand ({len(links['blocked'])})")
        lines.append("")
        lines.append("These sites refuse automated requests, or their certificate could not be verified by Python. "
                     "They usually work fine in a browser.")
        lines.append("")
        lines += [f"- [ ] {where}: {url} ({code})" for url, code, where in links["blocked"]] or ["None."]
        lines.append("")
    return "\n".join(lines)


def mark_verified(ids: list[str]) -> int:
    data = load(COMPANIES)
    today = date.today().isoformat()
    known = {c["id"]: c for c in data["companies"]}
    names = {w["name"]: w for w in data["watchlist"]}
    unknown = []
    for i in ids:
        target = known.get(i) or names.get(i)
        if target is None:
            unknown.append(i)
            continue
        target["lastVerified"] = today
        print(f"{i}: lastVerified = {today}")
    if unknown:
        print("Unknown id(s), nothing changed for: " + ", ".join(unknown), file=sys.stderr)
    data["meta"]["lastUpdated"] = today
    save_companies(data)
    print("Now run: python tools/build.py")
    return 1 if unknown else 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Review the Every IT Euro company database.")
    ap.add_argument("--months", type=int, default=12, help="age limit for lastVerified (default 12)")
    ap.add_argument("--no-links", action="store_true", help="skip the link check")
    ap.add_argument("--markdown", metavar="FILE", help="also write the work list to this Markdown file")
    ap.add_argument("--workers", type=int, default=12, help="parallel link checks (default 12)")
    ap.add_argument("--mark-verified", nargs="+", metavar="ID", help="set lastVerified to today for these company ids or watchlist names")
    args = ap.parse_args()

    if args.mark_verified:
        return mark_verified(args.mark_verified)

    cdata, sdata = load(COMPANIES), load(SOURCES)
    stale = stale_entries(cdata, args.months)
    links = None if args.no_links else run_link_check(cdata, sdata, args.workers)
    text = report(stale, links, args.months)
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    print(text)
    if args.markdown:
        Path(args.markdown).write_text(text + "\n", encoding="utf-8")
        print(f"Written to {args.markdown}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
