---
name: business-day-reconcile
description: Reconcile one completed campaign day or one authorized compressed multi-day interval for every active business, applying income and expenses, updating capital, and creating immutable ledgers. Use at an ordinary day boundary or once for a multi-day time advance.
---

# Reconcile Business Day

Read `../../references/businesses.md`, `data/status.json`, the current Daily, and every active business's complete files. When invoked directly, announce `[business-day-reconcile closing books]`; when nested inside a day-boundary workflow, do not announce separately.

Treat reconciliation as a state-mutating day-boundary operation, never as link repair or consistency repair. Invoke it only when one of these conditions establishes that the identified campaign day has actually ended:

- `party-long-rest` invokes it after the rest and any interruption are fully resolved.
- `time-advance` invokes it once for the exact player-authorized elapsed interval.
- The user explicitly gives an administrative instruction to reconcile a specifically identified day that canon already establishes as complete.

Before writing, verify that the owning workflow or explicit administrative instruction establishes the completed day. A missing ledger, stale `last_reconciled_day`, broken Markdown link, resume conflict, validation failure, or apparent sequence gap does not authorize reconciliation. Do not ask for confirmation merely to convert a non-boundary situation into a boundary. Outside an authorized boundary, make no changes and report that reconciliation remains pending.

For an ordinary boundary, reconcile the current campaign day before chronology advances. Process all active businesses in stable ID order. Require `setup_complete: true`, `last_reconciled_day == Day - 1`, and no existing `daily/<Day>.json`. Write `day_count: 1` in the ledger.

For a multi-day `time-advance` from `startDay` to `endDay`, require `endDay > startDay`, `day_count = endDay - startDay`, `last_reconciled_day == startDay - 1`, and no ledger overlapping any covered day. Reconcile the half-open interval covering `startDay` through `endDay - 1` exactly once. Do not roll. Apply the `average` earnings profile on each covered day, aggregate the interval amounts, and create only `daily/<startDay>-<endDay>.json` with `day: startDay` and `day_count`. Process scheduled accruals, funding, and due dates sequentially in memory for every covered day before committing their aggregate results. Set `last_reconciled_day` to `endDay - 1`.

Stop the boundary or interval and identify the exact setup gap, overlap, or sequence conflict rather than guessing or skipping it.

For each ordinary open earning opportunity, invoke `dice-roll` once for `1d20`. Apply only established current modifiers, honor natural 1/20 overrides, select the tier, and use its total income and variable expense from the same profile. Do not roll again for expenses. For a closed day, record the established closure reason and do not roll.

Apply explicit established exceptional income or expense adjustments, then all required expenses, allocations, funding priorities, due-date advancement, rounding, and totals exactly as defined in the shared reference. Do not let capital become negative. Create the one required ledger, update `business.json` and `debts.json` atomically, and add a compact business result link to the campaign Daily. A cash shortfall is recorded, not silently funded from party currency.

Never overwrite a ledger, cover the same campaign day twice, reconcile beyond an authorized boundary or interval, or advance campaign time. Existing errors are corrected only through a later identified adjustment.

## Player-facing result

After a successful reconciliation, print one concise line per business in stable business-ID order:

`<business name> <signed net> (<gross>-<expenses>)`

Use `totals.net_income_cp` for the signed net, `totals.total_income_cp` for gross, and `totals.total_required_expenses_cp` for expenses. Format each amount as compact `gp`, `sp`, and `cp` denominations, omitting zero denominations unless the complete amount is zero. Prefix a positive net with `+`, a negative net with `-`, and render zero as `+0gp`. Put no spaces around the subtraction hyphen inside the parentheses.

Example:

`Sample Business +12gp (40gp-28gp)`

For a compressed interval, the amounts in this line are the aggregate range totals, not per-day averages.

When invoked inside `party-long-rest` or `time-advance`, return these lines to the parent workflow and require it to include them in the player-facing day-end, waking, or time-advance response. The result lines are required even though the nested skill announcement is suppressed.
