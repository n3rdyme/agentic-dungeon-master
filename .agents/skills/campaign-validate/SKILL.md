---
name: campaign-validate
description: Repair unambiguous stale Markdown links, deterministically normalize Markdown spacing, then audit an entire filesystem-backed campaign, including required folders and files, JSON, active-party membership and templates, per-character legality, quests, unique items, campaign information, resume structure, and cross-file state. Use for validate campaign, audit campaign, checking every party member, or verifying a campaign before play, import completion, or commit.
---

# Validate Campaign

Repair broken Markdown links only through the evidence-bound workflow in `references/link-repair.md`, normalize Markdown spacing only through `../../tools/markdown-format.mjs`, then audit without any other modification or repair. Read `references/link-repair.md`, `../campaign-start/references/scaffold.md`, `references/campaign-checklist.md`, `../../references/debts.md`, and `../../references/calendar.md` completely. Also read the shared `../../references/campaign-info.md` contract before validating its structure.

Run from the repository root:

    node .agents/tools/validate-markdown-links.cjs "campaigns/<Player>"
    node .agents/skills/campaign-validate/scripts/validateCampaign.mjs "campaigns/<Player>"

The Markdown-link validator recursively checks local `.md` destinations and groups missing destinations by source file. For each failure, follow `references/link-repair.md`: repair only a uniquely established stale destination, rerun the link validator, and retain every unresolved source/destination pair. Continue with the full campaign validator so the final report includes all findings. If unresolved links remain, display their JSON report and prompt the user for the missing resolution evidence instead of guessing.

The validator invokes the formatter once for the campaign directory. The tool recursively processes every `.md` file and the validator prints `FORMATTED: <path>` for each changed file. Treat those deterministic updates as successful normalization, not as warnings or LLM-authored repairs.

Treat every structural error as **FAIL**. Then derive active members only from `party.md` and invoke `party-member-validate` for each one, continuing after failures. Retired members require valid storage and links but not ordinary active-character legality.

Return **PASS** only when structure and every active character pass, **PASS WITH WARNINGS** when no error remains but warnings do, and **FAIL** when structure or any character fails. Group findings by Campaign Structure, Active Characters, Cross-file State, and Warnings. Cite paths. Apart from deterministic formatting and the narrow stale-link repairs authorized above, remain read-only.
