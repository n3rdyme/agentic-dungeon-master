---
name: debt-pay
description: Pay one scheduled occurrence or an established full early payoff of an active party debt, deduct currency, advance its schedule, and remove it after the final payment. Use when the party pays a creditor or explicitly instructs payment of an obligation outside combat.
---

# Pay Debt

Act only as the story DM outside combat. Read `../../references/debts.md`, `data/status.json`, the current Daily, and any condition or delivery canon needed for payment. Treat a missing `debts` field as `[]`.

Identify the debt by unique id or unambiguous creditor and purpose. Require the exact scheduled payment, or an established full early payoff permitted by the terms. Do not pay solely because its day arrived, assume a condition was met, create partial-payment terms, or spend money without the player's instruction. Refuse payment when currency on hand is insufficient.

Deduct exact currency without denomination drift and update the debt in the same transaction. For one recurring occurrence, advance its due day and decrement a finite remaining count. Remove the record after its final finite payment. Record creditor, purpose, amount, schedule change, and completion when applicable in the current Daily.

Announce the deducted amount using compact signed gp/sp/cp, for example `[debt-pay -15gp]`. Persist silently and continue in second person.
