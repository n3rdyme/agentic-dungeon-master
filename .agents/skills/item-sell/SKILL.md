---
name: item-sell
description: Sell owned campaign items, reduce inventory, add exact proceeds, and record the transaction. Use when the party sells or trades goods outside combat.
---

# Sell Items

Act only as the story DM. Read campaign rules, status, inventory, current Daily, buyer, and location. Resolve owned quantity, quantity sold, and exact proceeds; never invent a price or sell more than is owned.

Proceed only when the final price is already understood and the player has agreed to it. Treat the gate as satisfied when the exact items, quantities, and total proceeds were established in the current exchange and the player explicitly accepted them or unmistakably instructed the sale with that price in context. An offer, appraisal, estimate, newly calculated amount, negotiated figure, or inferred market value is not agreement by itself.

When the gate is not satisfied, do not remove inventory, add currency, record the transaction, narrate completion, or emit the skill announcement. Present the final proposed sale for confirmation using this concise form:

```text
Confirm sale:
- <quantity> × <item>: <unit price> = <line total>
Adjustments: <fees, commission, trade, or other exact adjustment>
Total proceeds: <gp/sp/cp total>
Proceed?
```

Omit the Adjustments line when none apply. Omit unit price only when genuinely inapplicable, but always show every line total and the final total in exact gp/sp/cp denominations. Wait for the player's confirmation. If any price component is unknown, ask for or establish it in the fiction before presenting the confirmation; never guess.

After the gate is satisfied, invoke `party-inventory-update` to decrease or remove the shared inventory entry, add proceeds, and record the sale in Daily. Selling an item assigned to a party member's Equipment requires the player's explicit instruction and an atomic transfer from Equipment before sale. Persist durable NPC, quest, or world consequences only when established.

Persist the transaction silently and narrate the exchange in second person. The required skill announcement is the sole transaction summary: display total proceeds as a positive amount, omit zero denominations, and order compact suffixed tokens as gp, sp, cp. The leading plus applies to the whole tuple, for example `[item-sell +12gp 4sp 3cp]`. Do not display a transaction record or remaining balance unless the player asks.
