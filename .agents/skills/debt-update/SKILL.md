---
name: debt-update
description: Revise the exact terms of an existing active party financial obligation without paying it. Use when creditor, purpose, amount, due day, recurrence, remaining occurrences, or a payment condition is renegotiated, corrected, or otherwise conclusively changed outside combat.
---

# Update Debt

Act only as the story DM outside combat. Read `../../references/debts.md`, `data/status.json`, the current Daily, and the established revised terms. Treat a missing `debts` field as `[]`.

Identify exactly one active debt. Change only fields conclusively revised by the fiction, preserve its stable id and all other fields, and validate the resulting complete record. Never use this workflow to infer a partial-payment plan, pay currency, or close an obligation.

Calculate the revised uncommitted funds. Require explicit player acknowledgment before voluntarily accepting revised terms that make it negative.

Record the old and new material terms in the current Daily. Announce only `[debt-update terms revised]`, persist silently, and continue in second person.
