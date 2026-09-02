---
name: item-loot
description: Record loot whose possession is established, merging inventory and linking the source occurrence. Use after discovery, transfer, or completed combat; never during unresolved combat.
---

# Loot Items

Act only as the story DM. Read inventory, status, current Daily, and source Event. Invoke `party-inventory-update` for every established noncurrency acquisition, merging matching identities and preserving provenance in Notes. Add currency to status. Add magic-item lore only when known. Record one source occurrence rather than one log per item. Do not identify unknown properties or award XP.

Treat acquisition and physical transport as shared party possession. Statements such as `I take it`, `I pocket it`, `I carry it`, or naming who physically holds the loot do not assign it as personal equipment. Keep it in `data/inventory.json` unless the player explicitly assigns, equips, wears, wields, prepares, attunes, or reserves it for a named character's ongoing personal use or ready combat access. When intent remains ambiguous, keep the item in shared inventory and do not ask merely because a carrier was named.

Persist acquisitions silently and describe what you recover in second person. Do not display an inventory ledger unless the player asks.
