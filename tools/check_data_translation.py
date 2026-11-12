#!/usr/bin/env python3
"""Check that the data translations for one language are complete (helper for translators).

Usage: python tools/check_data_translation.py de
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIELDS = ["headquarters", "parentCompany", "ownership", "classificationNote", "description", "evaluating"]


def main() -> int:
    lang = sys.argv[1]
    folder = ROOT / "i18n" / lang
    cdata = json.loads((ROOT / "data/companies.json").read_text(encoding="utf-8"))
    sdata = json.loads((ROOT / "data/sources.json").read_text(encoding="utf-8"))
    problems = []
    translated = {}
    for p in sorted(folder.glob("companies*.json")):
        try:
            part = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            problems.append(f"{p.name}: invalid JSON ({e})")
            continue
        for k, v in part.items():
            if k in translated:
                problems.append(f"company '{k}' appears twice")
            translated[k] = v
    ids = {c["id"] for c in cdata["companies"]}
    for c in cdata["companies"]:
        t = translated.get(c["id"])
        if t is None:
            problems.append(f"company '{c['id']}' not translated")
            continue
        for f in FIELDS:
            if f not in t:
                problems.append(f"company '{c['id']}' missing '{f}'")
        if len(t.get("evaluating", [])) != len(c["evaluating"]):
            problems.append(f"company '{c['id']}' evaluating has {len(t.get('evaluating', []))} items, expected {len(c['evaluating'])}")
    problems += [f"unknown company id '{k}'" for k in translated if k not in ids]
    for name, f, check in (("watchlist.json", "event", [w["name"] for w in cdata["watchlist"]]),
                           ("sources.json", "summary", [s["id"] for s in sdata["sources"] if s.get("summary")])):
        p = folder / name
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            problems.append(f"{name}: {e}")
            continue
        problems += [f"{name}: '{k}' missing '{f}'" for k in check if f not in d.get(k, {})]
    print("\n".join(problems) if problems else f"OK - {len(translated)} companies, watchlist and sources complete for '{lang}'.")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
