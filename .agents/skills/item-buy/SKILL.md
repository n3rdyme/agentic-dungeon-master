---
name: item-buy
description: Purchase campaign items or services, apply an immediate payment, create any accepted deferred obligation, update shared inventory, and record the transaction. Use when the party buys something outside combat, including deposits, installments, or purchases on credit.
---

# Buy Items

Act only as the story DM. Read campaign rules, `../../references/debts.md`, status, inventory, current Daily, seller, and location. Resolve item, quantity, payer, exact total price, immediate payment, and any deferred terms; never invent a price or allow an immediate payment greater than currency on hand. Treat a missing `debts` field as `[]`.

Proceed only when the final price is already understood and the player has agreed to it. Treat the gate as satisfied when the exact item quantities and total price were established in the current exchange and the player explicitly accepted them or unmistakably instructed the purchase with that price in context. A quoted, listed, estimated, newly calculated, negotiated, or inferred price is not agreement by itself.

When the gate is not satisfied, do not deduct currency, update inventory, record the transaction, narrate completion, or emit the skill announcement. Present the final proposed purchase for confirmation using this concise form:

```text
Confirm purchase:
- <quantity> × <item or service>: <unit price> = <line total>
Total: <gp/sp/cp total>
Due now: <gp/sp/cp immediate payment>
Deferred: <amount, due day, recurrence/count, creditor, and condition, or None>
Proceed?
```

Omit unit price only when it is genuinely inapplicable, but always show every line total and the final total in exact gp/sp/cp denominations. Include taxes, fees, discounts, trade-ins, or other adjustments as separate lines. Calculate currency on hand, outstanding obligations, and uncommitted funds before and after the purchase. If the purchase would make uncommitted funds negative, show that projected value and require explicit acknowledgment. This does not prevent purchase when the immediate payment is covered. Wait for confirmation. If any price component or deferred term is unknown, never guess.

After the gate is satisfied, invoke `party-inventory-update` to add or increase purchased shared property. Deduct only the immediate payment. When an accepted balance remains, invoke `debt-create` with the exact terms. Commit inventory, currency, and debt together so partial failure leaves none changed. Record the total price, immediate payment, and deferred obligation in the current Daily. A service has no inventory entry. Do not create debt for an unaccepted offer, advance time, or award XP unless separately established.

Persist the transaction silently and narrate the exchange in second person. The required skill announcement is the sole transaction summary: display the total agreed purchase price as a negative amount, omit zero denominations, and order compact suffixed tokens as gp, sp, cp. The leading minus applies to the whole tuple, for example `[item-buy -12gp 4sp 3cp]`. Do not display a transaction record or remaining balance unless the player asks. Suppress the nested `debt-create` announcement.
