---
name: debt-show
description: Display the selected campaign's active debts, due and overdue payments, finite outstanding total, indefinite recurring commitments, currency on hand, and uncommitted funds without changing state. Use for /debts, debts, what do we owe, who do we owe, payment schedule, obligations, or similar financial-ledger requests in Story or Campaign Information roles.
---

# Show Debts

Read `../../references/debts.md` and `data/status.json`. Treat a missing `debts` field as `[]`. Never modify files or infer obligations from prose when absent from canonical status.

Return one fenced `markdown` block. Show currency on hand, finite outstanding total, indefinite recurring count when nonzero, reserved obligations, uncommitted funds, and active debt count. Then list debts ordered by overdue first, due today second, and future `next_due_day` ascending. For each show creditor, purpose, amount per payment, due day, due state, recurrence and remaining count, and condition when present. State `No active obligations` when empty. Do not emit a skill announcement.
