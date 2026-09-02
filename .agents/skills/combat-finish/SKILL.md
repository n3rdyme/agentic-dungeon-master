---
name: combat-finish
description: Archive a resolved campaign combat.md and apply its final mechanical and narrative consequences. Use only when the selected campaign's persistent combat file is marked Resolved; move it to log/Combat, update party state, XP, loot, chronology, and affected canon, then resume second-person story narration.
---

# Finish Combat

Act as the story DM, not the combat resolver. Read `../../references/combat-file.md`, `../../references/party-state.md`, and the selected campaign's `combat.md`. Require Status Resolved and a complete final state, matching Encounter ID, rounds, XP, loot, hostile dispositions, and consequences. If incomplete, leave it in place and ask the combat role to finish it; never reroll or repair combat mechanics.

Before changing any canonical file, preflight the entire resolution. Verify all expected before values and final values for party state and Equipment, confirm XP and loot have not already been applied, and validate the archive target. If any part is incomplete or contradictory, leave `combat.md` in place and stop without applying any consequence.

After the complete preflight passes, apply the resolution exactly once:

1. For each permanently dead party member, invoke `party-member-death`. Apply the remaining complete final transient-state delta through `party-state-update`, preserving nonparticipants. Never retain a dead member in active party state or treat merely stable or unconscious allies as dead.
2. Add combat XP once and offer `party-level-up` when its threshold is met.
3. Apply every resolved carried-item consumption through `item-consume`, using its verified owner, item, opening value, amount, and expected final value.
4. Apply established shared loot through `item-loot`, whose inventory writes route through `party-inventory-update`, and add established currency once.
5. Update the current Daily, quests, and entities where the resolved encounter established a consequence. The archived combat file is the primary detailed encounter log; do not create a redundant Event for the same combat.
6. Ensure `log/Combat/` exists, then move—not copy—`combat.md` to `log/Combat/<Encounter ID> - <Encounter Name>.md`. Ensure the archive name is filesystem-safe and unique; do not leave a live `combat.md` behind.

Resume at the immediate aftermath in second person. Do not display a completion record, file list, XP ledger, or loot ledger unless the player explicitly asks.
