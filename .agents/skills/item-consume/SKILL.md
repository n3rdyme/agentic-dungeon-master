---
name: item-consume
description: Consume, expend, destroy, discharge, or remove a potion, ammunition, component, charge, or other item carried in a party member's Equipment.md. Use only in story mode when an established action or resolved combat consequence consumes personal equipment; update Equipment.md exactly once.
---

# Item Consume

Resolve the party member, exact carried item, available quantity or charges, amount consumed, and established action. Reject an item absent from that character's `Equipment.md`, an insufficient quantity, or an abandoned or invalid action. Never consume shared `data/inventory.json` property; route that through `party-inventory-update`.

Outside unresolved combat, decrease the exact quantity or charges in `party/<Name>/Equipment.md`. Remove the entry when nothing remains unless the fiction establishes a reusable container or discharged item that still exists. Apply the item's established effect through its owning mechanical workflow and record the occurrence in the current Daily only when narratively useful.

During Ready or In Progress combat, do nothing and direct control back to the combat role. Combat tracks consumption in memory and records exact opening values, final values, and deltas in `combat.md`. After resolution, `combat-finish` invokes this skill once for each established Equipment delta.

Before applying a resolved-combat delta, verify the Encounter ID, item owner, opening value, amount, and expected final value against canonical Equipment. If canonical Equipment already equals the expected final value, treat the delta as already applied. If it equals the opening value, apply it once. Otherwise stop and report a conflict without guessing.

Persist silently. Narrate only the established use and effect in second person; do not display an inventory record unless the player asks.
