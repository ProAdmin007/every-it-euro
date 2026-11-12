# 01 — What makes a company European

> An office in Europe is not enough. We look at **who controls the company** and **where its capability sits**.

## Criteria

For every company we consider:

| Criterion | Question | Verified? |
|---|---|---|
| **Headquarters** | Where is the operating company registered and managed? | Always (imprint, commercial register) |
| **Ultimate parent company** | Who is at the top of the ownership chain? | Always |
| **Ownership and control** | Founders, listed shareholders, private equity, state? Does a non-European party control it? | Always, as far as public |
| **R&D location** | Where is the product primarily engineered? | Where public |
| **Intellectual property** | Which entity owns the code and patents? | Where public |
| **Operational control** | Who runs the services, update channels and support? | Where public |
| **Infrastructure** | Whose data centres and cloud platforms are used? | Where public |
| **Jurisdiction** | Which laws can ultimately compel the company? | Derived from the above |

Headquarters, parent and ownership decide the classification. The other criteria are recorded in the description or ownership note when information is available. They are often not disclosed; buyers should ask suppliers directly (see the procurement checklist).

**"Europe"** means the geographical continent of Europe, not only the EU. The classification makes the difference between EU/EEA and non-EU European countries (such as Switzerland, the United Kingdom and Norway) visible, because the legal framework differs.

## The five classifications

| Code | Label | Definition |
|---|---|---|
| `eu-hq` | EU/EEA headquartered | Headquarters **and** ultimate control in an EU or EEA country. Includes companies listed on European exchanges whose control is not concentrated outside Europe. |
| `european-hq` | European headquartered (non-EU) | Headquarters and control in a European country outside the EU/EEA (e.g. Switzerland, United Kingdom). European, but under a different legal framework from the EU. |
| `european-subsidiary` | Part of a European group | The operating company belongs to a larger European group (e.g. a cloud provider owned by a European retailer or telecom group; Stormshield within Airbus). |
| `european-open-source` | European open-source project | Primarily developed in Europe under an open-source licence, often by a foundation, a public-sector initiative or a small European company. Usable and forkable by anyone. |
| `mixed` | Mixed / international ownership | European roots or operations, but meaningful non-European ownership, control or headquarters. Listed for transparency, because ownership matters. |

## Decision rules (current practice)

Apply from top to bottom; the first rule that fits decides.

1. **Acquired by a non-European company** (a strategic buyer such as a US or Asian technology group), or the European product line was absorbed or shut down → **not in the database**; add the event to the **watchlist** (ownership changes to watch). *Examples: Hornetsecurity (Proofpoint), Sentryo (Cisco), Nozomi Networks (Mitsubishi Electric).*
2. **Open-source project primarily developed in Europe**, where the project (code, governance) is the relevant unit rather than a company → `european-open-source`. *Examples: LibreOffice (The Document Foundation), openDesk (ZenDiS), VeraCrypt (IDRIX).*
3. **A non-European party controls the company or holds a significant stake whose size cannot be verified**, while headquarters, development or roots remain European → `mixed`. This covers:
   - non-European private-equity or growth investors with majority or reportedly majority control (*Sophos, Darktrace, Checkmk, Paessler*);
   - a European vehicle whose lead investor is non-European (*Securepoint, Rhebo*);
   - a non-European ultimate parent of a European group (*Exoscale: ultimate shareholder América Movil, Mexico*);
   - European roots and development, but headquarters moved outside Europe (*Safetica, Wazuh, Grafana Labs, Stamus Networks*);
   - European-incorporated but listed outside Europe with a largely non-European investor base and operations (*Elastic*);
   - significant non-European stakes of undisclosed size, so that European control cannot be verified (*AnyDesk*).
4. **Operating company belongs to a European group** (the parent is European by these same rules) → `european-subsidiary`.
5. **Headquarters and control in a European country outside the EU/EEA** → `european-hq`. European owners from another country do not change this (*Threema: Swiss HQ, German investment firm*).
6. **Headquarters and control in an EU/EEA country** → `eu-hq`. Minority stakes by non-European investors do not change this, as long as control is not concentrated outside Europe.

**What is never enough on its own:** a European office, European data centres, a European sales subsidiary, European customers or a European founder. A European subsidiary of a non-European group (for example Fortinet's French subsidiary) is not listed.

## What the classification does not say

- **Control is not independence.** A European company may build on non-European cloud platforms, chips, operating systems or open-source libraries, and may have international investors. The classification describes control, not complete technological independence — which almost no company anywhere has.
- **Not a quality or security rating.** European ownership does not make a product better or more secure.
- **Not an endorsement.** See [02 — The company database](02-company-database.md).

## Open questions

These cases are not yet treated consistently and need a decision:

1. **Private-equity takeover by a non-European investor: watchlist or `mixed`?** Veeam (bought by Insight Partners, US, and later US-headquartered) is on the watchlist, while Sophos and Darktrace (controlled by Thoma Bravo, US) are listed as `mixed`. A possible rule: *`mixed` while headquarters and core development remain in Europe; watchlist once headquarters or core development move outside Europe.* Veeam would then stay on the watchlist; Sophos and Darktrace stay `mixed`.
2. **European group with a non-European ultimate parent.** Exoscale is `mixed` because of América Movil at the top of the chain. Should the same apply to every group where the top holding is non-European, however indirect? (Current practice: yes.)
3. **Listed companies with dispersed shareholders.** When does a large share of non-European institutional investors count as "control concentrated outside Europe"? Current practice: only when a single non-European party controls, or the listing and investor base are outside Europe (Elastic).
4. **"Significant stake of undisclosed size".** AnyDesk is `mixed` because control could not be verified. Should unverifiable cases default to `mixed` (current practice) or to the headquarters-based class with a note?
