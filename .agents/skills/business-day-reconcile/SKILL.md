---
name: business-day-reconcile
description: Reconcile one campaign day for every active business, rolling its earning opportunity, applying income and daily expenses, updating capital, and creating immutable per-day ledgers. Use automatically at every day boundary and for each day of a multi-day time advance.
---

# Reconcile Business Day

Read `../../references/businesses.md`, `data/status.json`, the current Daily, and every active business's complete files. When invoked directly, announce `[business-day-reconcile closing books]`; when nested inside a day-boundary workflow, do not announce separately.

Reconcile the current campaign day before chronology advances. Process all active businesses in stable ID order. Require `setup_complete: true`, `last_reconciled_day == Day - 1`, and no existing `daily/<Day>.json`. Stop the boundary and identify the exact setup gap or sequence conflict rather than guessing or skipping it.

For each open earning opportunity, invoke `dice-roll` once for `1d20`. Apply only established current modifiers, honor natural 1/20 overrides, select the tier, and use its total income and variable expense from the same profile. Do not roll again for expenses. For a closed day, record the established closure reason and do not roll.

Apply explicit established exceptional income or expense adjustments, then all required expenses, allocations, funding priorities, due-date advancement, rounding, and totals exactly as defined in the shared reference. Do not let capital become negative. Create `daily/<Day>.json`, update `business.json` and `debts.json` atomically, and add a compact business result link to the campaign Daily. A cash shortfall is recorded, not silently funded from party currency.

Never overwrite a daily file, reconcile a future day, or advance campaign time. Existing errors are corrected only through a later identified adjustment.

## Player-facing result

After a successful reconciliation, print one concise line per business in stable business-ID order:

`<business name> <signed net> (<gross>-<expenses>)`

Use `totals.net_income_cp` for the signed net, `totals.total_income_cp` for gross, and `totals.total_required_expenses_cp` for expenses. Format each amount as compact `gp`, `sp`, and `cp` denominations, omitting zero denominations unless the complete amount is zero. Prefix a positive net with `+`, a negative net with `-`, and render zero as `+0gp`. Put no spaces around the subtraction hyphen inside the parentheses.

Example:

`Sample Business +12gp (40gp-28gp)`

When invoked inside `party-long-rest` or `time-advance`, return these lines to the parent workflow and require it to include them in the player-facing day-end or waking response. The result lines are required even though the nested skill announcement is suppressed.
