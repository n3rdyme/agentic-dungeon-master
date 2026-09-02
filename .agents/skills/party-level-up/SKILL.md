---
name: party-level-up
description: Advance a filesystem-backed campaign party by exactly one level while resolving and validating each active character sequentially. Use when party XP reaches its level threshold, the player asks to level up, or explicitly invokes `$party-level-up`; stage one character at a time under the strict 2024 Player's Handbook plus approved homebrew, then commit every active character and the party level together.
---

# Level Up Party

Level the active party one character at a time without ever treating a partly leveled party as valid. Character creation and character repair remain separate workflows.

## Establish the level-up

1. Resolve the active campaign.
2. Read `../../references/party-state.md`, `data/status.json`, `homebrew.md`, the required `data/party-state.json`, and every active character's files. Ignore `party/retired/`.
3. Set the target to exactly `status.json` Level + 1. Never skip a level.
4. Before proceeding, require every active character's `Stats.md` Level to exactly equal the current party Level. Use `party-member-validate` to diagnose any mismatch and remediate it with the player before leveling.
5. Require current XP to meet `XpLevelUp`. An explicitly approved milestone or other leveling exception in `homebrew.md` may replace this gate. Never spend or subtract cumulative XP.
6. Do not begin or commit a level-up during unresolved combat.

Read `references/level-up-checklist.md` completely before resolving choices.

## Stage one character at a time

Let the player choose which active character to handle next. Work through only that character until complete, then move to the next.

- Keep canonical files unchanged while characters are being processed. Build each candidate in a unique noncanonical temporary staging directory outside `party/`.
- Resolve every feature and choice granted at the target level: hit points, subclass or class choices, feats or ability-score changes, proficiencies, masteries, expertise, spells, replacements, and other class-specific options.
- Ask the player for every actual choice. Suggestions are welcome, but never silently choose on the player's behalf.
- For an ordinary post-level-1 HP increase, offer the legal fixed value or a Hit Die roll. Use the `dice-roll` skill for a roll, then apply Constitution and feature modifiers. Level 1's maximum-Hit-Die rule does not apply again.
- Treat the strict 2024 Player's Handbook as the baseline. When the player requests a deviation, identify it and ask for explicit homebrew approval. Record an approved mechanical exception in `homebrew.md` before relying on it.
- Invoke `party-member-update` in staged mode and recalculate all dependent values in the staged `Stats.md`, preserving its strict template. Stage changes to `Equipment.md` only when a level feature or explicit player choice changes used, worn, or carried equipment.
- Stage corresponding `data/party-state.json` changes. Permanent maxima belong in `Stats.md`; current HP, spent Hit Dice, spell slots, limited resources, conditions, exhaustion, concentration, and temporary effects remain transient party state. A level-up does not restore an already-spent resource unless the applicable rule explicitly says it does.

Invoke `party-member-validate` in its staged level-up mode with the candidate path and explicit target level. Remediate every error with the player. A character is ready only after that staged audit passes; a warning must be shown and accepted.

## Commit the party atomically

Do not write any staged character into `party/` until every active character is ready at the same target level.

1. Confirm that the staged set contains every active character exactly once and that all staged `Stats.md` files declare the target level.
2. Determine the next strict-2024 XP threshold, or the approved homebrew threshold. Preserve cumulative XP.
3. Keep a recoverable temporary copy of every canonical file to be changed.
4. Apply all staged character files and transient-state changes, then update `data/status.json` Level and `XpLevelUp` as one uninterrupted canonical transaction.
5. Run normal `party-member-validate` against every active canonical character. The final invariant is absolute: every active character Level must exactly equal the party Level. If any validation fails or a write is interrupted, restore the complete precommit set; never leave a mixed-level party.
6. Record one party-level advancement in the current Daily log and use `milestone-record` for the party's new level. Do not create redundant per-character milestone records.
7. Remove temporary staging only after the canonical validation succeeds.

After validation succeeds, persist the advancement silently and narrate the characters' new capabilities naturally in second person. Do not display a level-up record, validation ledger, or changed-file list unless the player asks.
