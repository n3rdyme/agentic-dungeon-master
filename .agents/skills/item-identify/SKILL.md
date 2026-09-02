---
name: item-identify
description: Persist an existing item's newly established identity, properties, risks, and magical lore. Use after examination, magic, expert analysis, or player confirmation identifies an item.
---

# Identify Item

Act as the story DM. Find the item in shared inventory or character equipment and require an established identification method or explicit fact. An item purchased or received with its identity and properties already established qualifies. Create or update `items/<Item>.md` for durable unique magical lore. For shared property, invoke `party-inventory-update` to rename the entry in place and add its link without duplication. For personally assigned property, update the owner's Equipment entry in place only when it was already explicitly assigned there for personal use; a named physical carrier does not establish ownership. Preserve quantity and ownership. Record the discovery in the current Daily. Create an Event only when notable.

Search item names, aliases, descriptions, owner, and source before creating a file. Keep one file per unique item identity. Record type, rarity, attunement, description, confirmed properties, limitations, charges or recovery, risks, owner, status, and source when established. Omit inapplicable fields and never invent missing mechanics.

Distinguish confirmed identity and properties from reported lore, inference, risk, asking price, and negotiating target. Leave unidentified fields unknown when the evidence establishes no answer. Identification interest alone does not create a quest; route a separately adopted identification objective through `quest-receive`.

Persist the identification silently and reveal the established result through second-person narration.
