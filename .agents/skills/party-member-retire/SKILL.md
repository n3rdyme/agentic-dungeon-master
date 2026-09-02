---
name: party-member-retire
description: Retire a living active party member into canonical NPC status while preserving their complete party record in the retired archive. Use only in story mode after the player explicitly consents to the permanent or indefinite departure.
---

# Retire Party Member

Act only as the story DM outside unresolved combat. Require explicit player consent to retire the named member. An established in-character decision or an explicit OOC instruction is sufficient; silence, separation, absence, conflict, temporary departure, or an NPC's unilateral intent is not. Ask before mutating files when consent is unclear.

Announce `[party-member-retire retiring <Name>]` and otherwise persist silently. Do not use this skill for death; use `party-member-death`.

## Preserve and transition

Read `party.md`, `data/party-state.json`, the complete member record, relevant relationships and chronology, and any pre-adoption NPC index. Then perform one logical transition:

1. Move, never copy, `party/<Name>/` to `party/retired/<Name>/`.
2. Recreate or update `npcs/<Name>.md` as the current source of truth for the living NPC's behavior, personality, knowledge, motives, opinions, relationships, boundaries, speech, inside jokes, euphemisms, location, and present status. Migrate established current canon from the archived party files without losing history or inventing facts.
3. Replace `party/<Name>.md` with a concise redirect containing `**Status:** Retired`, a brief character summary, a relative link to `../npcs/<Name>.md`, and relative links to the archived files under `retired/<Name>/`.
4. Remove the member from active `party.md`.
5. Use `party-state-update` to remove their exact entry from `data/party-state.json`.
6. Preserve their equipment in the archive unless an established transaction explicitly transfers an item. Never infer a division of possessions.
7. Record the departure in the current Daily. Invoke `event-record` or `milestone-record` only at their normal thresholds.

Repair touched links without erasing historical references. `party.md` indexes active members only, so never link the retired redirect there.

## Verify

Confirm that the active directory is gone, the archive exists, the redirect and NPC links resolve, and the member is absent from both `party.md` and `data/party-state.json`. Continue the scene in second person without displaying a file summary unless asked.
