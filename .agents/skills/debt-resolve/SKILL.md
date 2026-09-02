---
name: debt-resolve
description: Remove an active party financial obligation after an established nonpayment terminal outcome. Use when a debt is cancelled, forgiven, written off after default, resolved through a dispute, replaced, or otherwise settled without its ordinary final payment outside combat; use debt-pay for payment.
---

# Resolve Debt

Act only as the story DM outside combat. Read `../../references/debts.md`, `data/status.json`, the current Daily, and the established terminal outcome. Treat a missing `debts` field as `[]`.

Identify exactly one active debt and require an explicit disposition and cause. Do not infer forgiveness, cancellation, write-off, or dispute resolution merely because the debt is old, conditional, missed, disputed, or overdue. Leave a collectible missed or disputed obligation active. Apply any separate established currency transaction through its owning workflow before removing the debt.

Remove the active record and preserve creditor, purpose, unpaid amount, disposition, cause, and any related transaction in the current Daily. Announce only `[debt-resolve obligation closed]`, persist silently, and continue in second person.
