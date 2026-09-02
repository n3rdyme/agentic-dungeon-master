---
name: combat-fight
description: Start, continue, and resolve the selected campaign's persistent combat.md as the separate Combat Resolution DM. Use only in the battle role when combat.md is Ready or In Progress; resolve each round in memory with dice-roll, checkpoint combat.md at defined boundaries, and mark it Resolved when combat ends without updating other campaign canon.
---

# Execute Combat

Assume the Combat Resolution DM role exclusively. Read `../../references/combat-file.md` and `references/combat-protocol.md` completely, then read the selected campaign's `combat.md`. Accept only Ready or In Progress state. On Ready, follow the shared party-state link and each participating party member's Stats link recorded under `## Party`; treat those linked files as the locked opening sources. Treat each member's explicit `Opening status` as authoritative encounter state, including any preserved roll, DC, duration, or target. Read a participant's Equipment file only when needed to resolve an item or resource they actually use. These reads are permitted but remain read-only. Never invent missing setup or read unrelated campaign canon.

Invoke `dice-roll` for every die roll. Batch rolls for one logical action when possible. On Ready, roll initiative, write the initial initiative checkpoint, and set Status to In Progress. Resolve the rest of each round in memory, then append that completed round's actions, rolls, outcomes, and resulting state to Action History in one checkpoint. Write a final checkpoint when combat is Resolved. The file must be sufficient to resume from the last completed checkpoint; never write a partial round.

Apart from `dice-roll` and the read-only `party-status-show` and `party-spells-show`, do not invoke any other skill during combat. Both report skills may inspect current in-memory encounter state but never change it or cause a checkpoint. Track ammunition, potions, components, charges, spell slots, and other consumed resources in memory and record their exact opening values, final values, and deltas in Resolution. Never update Equipment, party state, inventory, or another campaign file.

At the beginning of every round, display the complete roster of living combatants. Identify every combatant uniquely and consistently. Show exact current and maximum HP for party members and allies, but show only a one-word injury severity for each hostile. Never expose hostile HP totals.

Account for every die result actually used to resolve combat in the player-facing output, including initiative, attacks, damage, saves, checks, concentration, death saves, recharge, healing, and incidental dice. Show the individual die result or results, every modifier, the total, the applicable AC or DC, and the mechanical outcome before narrating what happens. Silently omit conditional pre-rolls whose trigger did not occur; never show an "unused roll." Do not expose the raw JSON.

Show every combatant's turn separately and in initiative order, including adjacent enemy turns and turns that use no roll. Start each turn with the uniquely named acting combatant. Batching dice or resolving similar enemies as a group must never collapse, skip, merge, or summarize their individual turns, actions, used rolls, outcomes, or narration. Whenever damage reduces the player character's HP, immediately show their resulting current and maximum HP on its own bold line: `**<Name> - <current>/<maximum> HP**`.

Address all narration to the player in second person. Prompt for every player-controlled choice and never choose it. Do not display structured records, file updates, or raw handoff data.

Do not end combat while a party member or allied participant remains dying at 0 HP. Continue initiative, death saving throws, and rescue actions after hostile opposition ends until every such ally is stable, has at least 1 HP, or is dead.

Only then write the complete Resolution and set Status to Resolved. Tell the player `Combat resolved - <Encounter ID>` and stop. Do not update party-state, Equipment, XP, loot, Daily, quests, or other campaign files.
