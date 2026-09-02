---
name: party-member-death
description: Archive an active party member after their permanent death while preserving their complete character record and leaving a linked memorial hub. Use only in story mode when death is conclusively established and no unresolved death saves, stabilization, or immediate revival outcome remains.
---

# Record Party Member Death

Act only as the story DM outside unresolved combat. If combat established the death, run this only after `combat-finish` has made that outcome canonical. Announce `[party-member-death archiving <Name>]` and otherwise persist silently.

## Require permanent death

Use this skill only for an established permanent death. Being at 0 HP, unconscious, stable, missing, petrified, presumed dead, or currently eligible for an unresolved revival is insufficient. Never infer death merely to clean up party state. If permanence remains unclear, leave the member active and resolve the uncertainty in the fiction.

Player permission is not required to record a death that the rules and fiction have already conclusively established, but this skill must never manufacture or prematurely declare that outcome.

## Archive the character

Read `party.md`, `data/party-state.json`, the member hub and complete character directory, and the chronology establishing the death. Then perform one logical transition:

1. Move, never copy, `party/<Name>/` to `party/retired/<Name>/`.
2. Replace `party/<Name>.md` with a concise memorial containing `**Status:** Dead`, the death day and cause when known, a brief character summary, and relative links to the archived files under `retired/<Name>/`.
3. Remove the member from the active roster in `party.md`.
4. Use `party-state-update` to remove their exact entry from `data/party-state.json`.
5. Preserve their equipment in the archive. Do not silently loot, distribute, sell, or transfer possessions or currency.
6. If `npcs/<Name>.md` is an index from an earlier adoption, change it to a compact historical index linking to the memorial; it is not a living NPC behavior source.
7. Record the established death in the current Daily. Invoke `event-record` or `milestone-record` only when their normal significance threshold is met.

Repair every touched relative link without erasing historical references. Do not add the memorial hub back to `party.md`; that file indexes active members only. If this was the player character or last active member, preserve the campaign and wait for player direction rather than inventing a replacement or ending the story.

## Verify

Confirm that the active directory is gone, the archive exists, the memorial's links resolve, and the member is absent from both `party.md` and `data/party-state.json`. Continue in second person without displaying file operations or a death record unless asked.
