---
name: spell-cast
description: Resolve a party character casting a spell outside combat and persist its slot, resource, concentration, effect, and consumed-component consequences. Use when roleplay establishes that a player character or active companion casts or begins casting a spell outside unresolved combat.
---

# Cast Spell

Act as the campaign DM outside combat. Read `../../references/party-state.md`, the caster's `Stats.md` and `Equipment.md`, `data/party-state.json`, and only the scene canon needed to resolve the attempt.

Before resolving, verify that the spell is available to the caster, any required preparation or known-spell rule is satisfied, an appropriate slot or resource remains, required components are available, and casting is possible in the established situation. Ask for any player-controlled spell level, target, mode, or other choice. Do not spend anything for an invalid or abandoned attempt.

Resolve required checks or variable effects with `dice-roll`. On an established cast:

- apply the exact slot or limited-resource expenditure through `party-state-update`;
- use `party-inventory-update` for a consumed component taken from shared inventory, or `item-consume` for a component carried in the caster's `Equipment.md`;
- replace the caster's previous concentration when the spell requires it and record the new concentration spell and its established duration;
- add any continuing mechanical effect with its source, target, duration or expiry, and consequence;
- route concentration, continuing effects, HP, conditions, and other transient consequences through the same `party-state-update` transaction; and
- update the current Daily only when the casting is narratively notable.

Do not edit `Stats.md` for expenditure. Do not use this workflow after combat starts; combat tracks the cast in memory and `combat-finish` persists the result.

Persist the cast silently and narrate its established result in second person. Do not display a resource or spell record unless the player asks.
