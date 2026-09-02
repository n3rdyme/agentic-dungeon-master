---
name: business-update
description: Persist an established and authorized change to a business's description, condition, reputation, earnings model, employees, wages, expenses, capital, or debt terms. Require explicit user approval before changing business income or expenses; do not use it to reconcile a day or infer unknown operations.
---

# Update Business

Announce `[business-update updating business]`. Read `../../references/businesses.md` and the target's complete `Business.md`, `business.json`, and `debts.json`. Read only the additional canon required for the established change.

Update stable records in place. Preserve immutable daily files. Never invent a wage, cost, traffic, income tier, variable-expense tier, modifier, deadline, or financing term. Keep each completed tier's traffic, total income, and total variable expense together. Keep employee names and `[Vacant]` entries in the Markdown roster; keep only aggregate positions and full-staff cost in JSON. When all `setup_gaps` are conclusively resolved, remove them and set `setup_complete` true; otherwise keep reconciliation blocked.

## Financial authorization

Before changing any business income or expense value, require the user to have explicitly approved the exact financial change. This includes prices, wages, staffing costs, income profiles, variable or recurring expenses, discretionary expenses, modifiers with a defined financial effect, and any derived aggregate or forecast changed by those inputs.

Agreement to an operational idea, employee benefit, staffing concept, service, or other nonfinancial policy is not approval to invent or persist its financial effect. First calculate or identify the proposed amounts, show the user every financial field and material downstream total that would change, and ask for approval. Do not write any of those financial changes until the user explicitly accepts them. If the required amount is unknown, stop and prompt for the missing decision rather than estimating it.

An explicit user correction or instruction that supplies the exact financial amount and scope is approval for that stated change. `business-day-reconcile` may apply an already established financial model without renewed approval; this skill may not create or revise that model by implication.

Record owner contributions and distributions as exact two-sided transfers between party currency and business capital, including the current Daily. Current capital may not become negative. Update `Business.md` when condition, reputation, cadence, thresholds, influences, ownership, or other durable operating facts change. Format changed campaign Markdown.
