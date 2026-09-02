---
name: debt-create
description: Record an accepted party financial obligation in data/status.json without paying it. Use when the party accepts credit, deferred purchase terms, rent, a loan, a fine, wages, installments, or another exact future payment outside combat; never use for a quote, proposal, estimate, or rejected offer.
---

# Create Debt

Act only as the story DM outside combat. Read `../../references/debts.md`, `data/status.json`, the current Daily, and the established agreement. Treat a missing `debts` field as `[]`.

Require an exact creditor, purpose, amount per payment, next due day, recurrence, remaining occurrence count, and any condition. Do not invent terms. Confirm ambiguous or merely proposed terms before writing. Create a unique stable id and validate the complete record against the shared debt schema. Calculate the resulting uncommitted funds. Before voluntarily accepting terms that make it negative, require the player's explicit acknowledgment; do not block a conclusively imposed obligation on that gate.

Append the active record and log the agreement in the current Daily. Do not deduct currency. When called by `item-buy`, participate in its atomic purchase transaction and do not emit a second announcement. Otherwise announce only `[debt-create obligation added]` and continue the fiction in second person.
