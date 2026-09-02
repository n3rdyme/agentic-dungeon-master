# Canonical party debts

`data/status.json` is the sole authority for party currency and active financial obligations. New campaigns write a top-level `"debts": []` array. The field is optional for backward compatibility; every reader must treat a missing field as an empty array and must not require a migration merely to read the campaign.

## Active record

Store only accepted obligations with money still payable:

```json
{
  "id": "sample-deferred-balance",
  "name": "Sample Creditor",
  "purpose": "Sample deferred balance",
  "created_day": 10,
  "next_due_day": 20,
  "recurrence_days": null,
  "payments_remaining": 1,
  "amount": { "gp": 15, "sp": 0, "cp": 0 },
  "condition": "Sample delivery accepted",
  "status": "active"
}
```

Rules:

- Give every debt a stable, unique lowercase-hyphenated `id`. One creditor may hold several obligations.
- Require nonempty `name` and `purpose`, integer `created_day` and `next_due_day`, and `next_due_day >= created_day` when created.
- Require `amount.gp`, `amount.sp`, and `amount.cp` as nonnegative integers with at least one positive component. Normalize through copper for calculations, but display ordinary gp/sp/cp.
- Use `recurrence_days: null` and `payments_remaining: 1` for one payment.
- Use a positive integer recurrence and positive integer remaining count for a finite recurring schedule. The count includes the next payment.
- Use a positive integer recurrence and `payments_remaining: null` for an indefinite schedule.
- Use a concise string or `null` for `condition`. Reaching the day never satisfies a condition or authorizes payment by itself.
- Active records use `status: "active"`. Remove a terminal record after recording its outcome in the current Daily.
- A quote, proposal, estimate, or rejected price is not a debt. Create one only after the player accepts exact deferred terms or the fiction otherwise conclusively establishes the party's obligation.

## Financial summaries

Convert currency to copper only while calculating:

- **Currency on hand:** the `Gold`, `Silver`, and `Copper` fields.
- **Outstanding obligations:** sum `amount * payments_remaining` for every finite debt. Report indefinite recurring debts separately.
- **Reserved obligations:** all finite outstanding obligations plus the next payment of every indefinite recurring debt.
- **Uncommitted funds:** currency on hand minus reserved obligations. This may be negative and does not change currency on hand.
- **Due:** `next_due_day == Day`.
- **Overdue:** `next_due_day < Day`. A debt may validly remain overdue.

Due and overdue are calendar states only. They do not establish breach, default, or satisfaction of a recorded condition.

Existing obligations do not make physically held currency unavailable. A purchase may proceed when its immediate payment is covered, but require clear player acknowledgment before accepting terms that make uncommitted funds negative.

## Lifecycle

- Creating a debt appends one validated active record.
- Paying one scheduled occurrence deducts its exact amount. For a recurring debt, advance `next_due_day` by `recurrence_days`; decrement a finite `payments_remaining`, but never decrement `null`.
- Remove the record when its final finite payment is made. Paying all remaining finite occurrences early is allowed only when established terms permit it.
- Do not represent partial scheduled payments by silently changing a recurring amount. First establish revised terms and use `debt-update`.
- Use `debt-update` for an agreed change to creditor, purpose, due day, recurrence, remaining count, amount, or condition.
- Use `debt-resolve` for cancellation, forgiveness, a resolved dispute, write-off after default, or another terminal outcome without ordinary final payment. A missed or disputed payment that remains collectible stays active.
- Record every creation, payment, revision, and resolution in the current Daily. Daily chronology is durable history; status contains only active state.

Parse and validate the complete JSON before and after every write. A workflow that changes currency and debt must commit both changes as one transaction.
