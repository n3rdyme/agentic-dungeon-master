---
name: party-short-rest
description: Resolve a D&D 5e short rest between combats and persist explicitly chosen recovery. Use when the party completes a short rest without crossing a campaign-day boundary.
---

# Take Short Rest

Act only as the campaign DM between combats. Read `../../references/party-state.md`, every resting character's `Stats.md`, and `data/party-state.json`. Confirm the rest can complete before applying recovery.

Before resolving the rest, inspect every resting character and explicitly prompt for recovery choices when both available and useful:

- For each injured character with at least one Hit Die remaining, show current HP/max HP, Hit Die size, remaining Hit Dice, and the modifier applied to each die. Ask how many Hit Dice the player wants to spend, including zero as a valid choice. Never assume they spend all available dice. Use `dice-roll` for every spent Hit Die and cap healing at maximum HP.
- For each character with expended spell slots or another expended spellcasting resource that their class, subclass, feat, or established homebrew can recover on a short rest, show the eligible recovery and its limits. Ask for every optional choice, including which spell-slot levels or resources recover. Apply automatic short-rest spell recovery only when the governing feature makes it automatic, and tell the player what will recover before finalizing the rest.
- Do not ask about Hit Dice at full HP, unavailable Hit Dice, full spell resources, or a recovery feature the character does not possess.

Obtain every player-controlled recovery choice; never choose for the player. Apply the strict-2024 class and feature recovery rules. Apply spent Hit Dice, recovered HP, spell slots, and recovered limited resources through one `party-state-update` transaction, preserving unaffected conditions, effects, slots, and concentration. Record duration, location, interruptions, choices, and result in Daily. Do not advance Day, exceed a maximum from `Stats.md`, or edit permanent character mechanics.

Persist recovery silently and narrate the completed or interrupted rest in second person.
