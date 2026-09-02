---
name: campaign-validate
description: Deterministically normalize Markdown spacing, then audit an entire filesystem-backed campaign, including required folders and files, JSON, Markdown links, active-party membership and templates, per-character legality, quests, unique items, campaign information, resume structure, and cross-file state. Use for validate campaign, audit campaign, checking every party member, or verifying a campaign before play, import completion, or commit.
---

# Validate Campaign

Normalize Markdown spacing only through `../../tools/markdown-format.mjs`, then audit without performing any other modification or repair. Read `../campaign-start/references/scaffold.md` and `references/campaign-checklist.md`, `../../references/debts.md`, and `../../references/calendar.md` completely. Also read the shared `../../references/campaign-info.md` contract before validating its structure.

Run from the repository root:

    node .agents/skills/campaign-validate/scripts/validateCampaign.mjs "campaigns/<Player>"

The validator invokes the formatter once for the campaign directory. The tool recursively processes every `.md` file and the validator prints `FORMATTED: <path>` for each changed file. Treat those deterministic updates as successful normalization, not as warnings or LLM-authored repairs.

Treat every structural error as **FAIL**. Then derive active members only from `party.md` and invoke `party-member-validate` for each one, continuing after failures. Retired members require valid storage and links but not ordinary active-character legality.

Return **PASS** only when structure and every active character pass, **PASS WITH WARNINGS** when no error remains but warnings do, and **FAIL** when structure or any character fails. Group findings by Campaign Structure, Active Characters, Cross-file State, and Warnings. Cite paths and remain read-only.
