#!/usr/bin/env python3
"""
Every IT Euro — add a company to data/companies.json by answering a few questions.

Usage
  python tools/add_company.py

Every answer is checked straight away (classification, categories, URLs, …). Nothing is written until
you confirm at the end. The entry is inserted in alphabetical order and lastVerified is set to today.
Company data is English only, so the new entry appears on every language version straight away.
"""
from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402  (re-use the official lists, so this script never drifts from the validator)

COMPANIES = ROOT / "data" / "companies.json"
CLASS_HELP = {
    "eu-hq": "headquartered and controlled in the EU/EEA",
    "european-hq": "headquartered in Europe outside the EU (e.g. Switzerland, UK, Norway)",
    "european-subsidiary": "operating company belongs to a European group",
    "european-open-source": "open-source project primarily maintained in Europe",
    "mixed": "European roots or operations, but significant non-European ownership",
}
DEPLOYMENT = ["On-premises", "Public cloud / SaaS", "Private cloud", "Hybrid", "Appliance"]


def ask(prompt: str, default: str | None = None, required: bool = True, check=None) -> str:
    while True:
        suffix = f" [{default}]" if default else ""
        value = input(f"{prompt}{suffix}: ").strip() or (default or "")
        if not value and required:
            print("  Required.")
            continue
        if value and check:
            problem = check(value)
            if problem:
                print(f"  {problem}")
                continue
        return value


def ask_list(prompt: str, check=None, min_items: int = 1) -> list[str]:
    print(f"{prompt} (one per line, empty line to finish)")
    items: list[str] = []
    while True:
        value = input(f"  {len(items) + 1}. ").strip()
        if not value:
            if len(items) >= min_items:
                return items
            print(f"  At least {min_items} needed.")
            continue
        problem = check(value) if check else None
        if problem:
            print(f"  {problem}")
            continue
        items.append(value)


def choose(prompt: str, options: list[str], multi: bool = False, labels: dict | None = None) -> list[str] | str:
    for i, o in enumerate(options, 1):
        extra = f" — {labels[o]}" if labels and o in labels else ""
        print(f"  {i:>2}. {o}{extra}")
    while True:
        raw = input(f"{prompt} ({'numbers separated by commas' if multi else 'number'}): ").strip()
        by_text = {o.lower(): o for o in options}
        picks = []
        for x in [p.strip() for p in raw.split(",") if p.strip()]:
            if x.lower() in by_text:
                picks.append(by_text[x.lower()])
            elif x.isdigit() and 1 <= int(x) <= len(options):
                picks.append(options[int(x) - 1])
            else:
                picks = []
                break
        if picks and (multi or len(picks) == 1):
            return list(dict.fromkeys(picks)) if multi else picks[0]
        print("  Please choose from the list.")


def https_url(value: str) -> str | None:
    return None if re.match(r"^https://[^\s/]+\.[^\s]+$", value) else "Must be a full https:// URL."


def main() -> int:
    data = json.loads(COMPANIES.read_text(encoding="utf-8"))
    ui = json.loads((ROOT / "i18n/en/ui.json").read_text(encoding="utf-8"))
    ids = {c["id"] for c in data["companies"]}

    print("Add a company to Every IT Euro. Use neutral, factual wording and official sources.\n")
    name = ask("Company name (as on its own website)")
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    cid = ask("Id (lowercase, hyphens)", slug,
              check=lambda v: "Use lowercase letters, digits and hyphens." if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", v)
              else ("This id already exists." if v in ids else None))

    countries = sorted(ui["countries"])
    print("\nCountry of the headquarters. Known countries:", ", ".join(countries))
    country = ask("Country (English name)")
    new_country = country not in ui["countries"]
    if new_country:
        print(f"  '{country}' is new: it will be added to i18n/en/ui.json (other languages show the English name until translated).")
    code = ask("ISO country code (2 letters)", check=lambda v: None if re.fullmatch(r"[A-Za-z]{2}", v) else "Two letters, e.g. DE.").upper()
    hq = ask("Headquarters (city, country)", f", {country}")
    parent = ask("Parent company", "None (independent)")
    ownership = ask("Ownership (who owns or controls it, with source in mind)")
    print("\nClassification (criteria: alternatives.html#classification):")
    cls = choose("Classification", build.CLASSIFICATIONS, labels=CLASS_HELP)
    cls_note = ask("One sentence explaining the classification")
    print("\nCategories:")
    cats = choose("Categories", build.CATEGORIES, multi=True)
    description = ask("Description (one or two neutral, factual sentences)")
    products = [p.strip() for p in ask("Products (comma-separated)").split(",") if p.strip()]
    print("\nDeployment options:")
    deployment = choose("Deployment", DEPLOYMENT, multi=True)
    open_source = choose("Open source?", ["Yes", "No", "Partly"])
    on_prem = choose("Can it run on-premises?", ["Yes", "No", "Optional"])
    cloud = choose("Is it offered as cloud/SaaS?", ["Yes", "No", "Optional"])
    website = ask("Website", check=https_url)
    evaluating = ask_list("\nRelevant when evaluating… (product categories, e.g. 'EDR/XDR platforms')")
    sources = ask_list("Sources that verify ownership and headquarters (https URLs; imprint, annual report, press release)", check=https_url)

    entry = {
        "id": cid, "name": name, "country": country, "countryCode": code, "headquarters": hq,
        "parentCompany": parent, "ownership": ownership, "classification": cls, "classificationNote": cls_note,
        "categories": cats, "description": description, "products": products, "deployment": deployment,
        "openSource": open_source, "onPremises": on_prem, "cloud": cloud, "website": website,
        "evaluating": evaluating, "sources": sources, "lastVerified": date.today().isoformat(),
    }
    print("\n" + json.dumps(entry, ensure_ascii=False, indent=2))
    if input("\nSave this entry? [y/N] ").strip().lower() not in ("y", "yes", "j", "ja"):
        print("Nothing saved.")
        return 1

    data["companies"].append(entry)
    data["companies"].sort(key=lambda c: c["id"])
    data["meta"]["lastUpdated"] = date.today().isoformat()
    COMPANIES.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    if new_country:
        for p in [ROOT / "i18n/en/ui.json"]:  # translations fall back to English until translated
            d = json.loads(p.read_text(encoding="utf-8"))
            d["countries"][country] = country
            d["countries"] = dict(sorted(d["countries"].items()))
            p.write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")

    print(f"\nSaved '{cid}' to data/companies.json. Company data is English only, so no translation is needed.")
    print("Next steps:")
    if new_country:
        print(f"  - Optional: translate the country name '{country}' in i18n/<lang>/ui.json (English is shown until then).")
    print("  - Run: python tools/build.py")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (KeyboardInterrupt, EOFError):
        print("\nCancelled. Nothing saved.")
        sys.exit(1)
