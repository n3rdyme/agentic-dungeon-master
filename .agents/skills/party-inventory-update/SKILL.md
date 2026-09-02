---
name: party-inventory-update
description: Apply an established add, removal, quantity change, rename, identification, provenance update, or link change to canonical shared party inventory in data/inventory.json. Use as the sole shared-inventory mutation workflow for item-buy, item-sell, item-loot, item-identify, consumed shared components, explicit inventory corrections, and other changes outside unresolved combat; never use for property explicitly assigned to a party member's Equipment.md.
---

# Party Inventory Update

Act as the story DM or an explicit engine-maintenance workflow outside unresolved combat. Mutate only the selected campaign's `data/inventory.json`. Currency belongs in `data/status.json`. Physical possession or transport does not determine canonical ownership: loot remains shared inventory when a character picks it up, pockets it, packs it, or carries it for the party. Property belongs in a character's `Equipment.md` only when the player explicitly assigns it for that character's ongoing personal use, wearing, wielding, preparation, attunement, or ready combat access. Resolve ambiguity in favor of shared inventory.

Require an established operation, item identity, quantity when applicable, and source workflow or explicit correction. Parse the complete inventory before editing, search names, aliases, descriptions, provenance, and links, and update an existing matching entry instead of duplicating it.

Support only the requested operation:

- add or increase an established quantity;
- decrease a quantity or remove an entry when none remains;
- rename an entry after identification without losing quantity or provenance;
- add or repair established notes, provenance, state, or a `items` link; or
- transfer an item out only when the destination and ownership are explicitly established and updated in the same workflow.

Never permit a negative quantity, invent an item or property, silently identify an unknown item, merge distinct physical items, or leave the same physical item in both shared inventory and character equipment. Preserve unmodified fields and unknown facts. Parse the complete JSON after writing.

The calling skill owns currency, narration, Daily/Event records, and other consequences. Make no separate player-facing announcement or inventory ledger.
