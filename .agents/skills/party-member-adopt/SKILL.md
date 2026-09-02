---
name: party-member-adopt
description: Promote an established NPC who has authentically agreed to an ongoing alliance with the campaign party while preserving their identity, history, personality, knowledge, relationships, equipment, and current mechanical state. Use only in story mode after the player chooses the NPC and the NPC accepts that durable association; do not use for temporary allies, hirelings, escorts, guests, or an invitation the NPC has not accepted.
---

# Adopt Party Member

Act only as the story DM outside unresolved combat. Announce the transition as `[party-member-adopt adding <Name>]` and otherwise persist it silently.

## Establish adoption

Resolve the NPC from canonical storage by name and alias. Require both:

1. The player character has explicitly invited, accepted, or otherwise chosen the NPC as a continuing active party member.
2. The NPC has authentically agreed to an ongoing alliance or association with the party based on their established motives, knowledge, relationships, and circumstances.

That alliance is sufficient for adoption. Do not infer an unestablished change to the NPC's home, vocation, duties, travel, adventuring, quest, or combat commitments merely from adoption. Treat broader commitments that have not been established as unresolved current state, not as refusals or a permanent rule requiring scene-by-scene permission.

An NPC may authentically make a broad or ongoing commitment now or later, such as choosing to travel or adventure with the party. Record that as the NPC's current standing choice and do not demand repetitive confirmation. Like any character commitment, it may change when the NPC's motives, relationships, or circumstances change. Active party membership records durable association and full mechanical support; it never transfers control of the NPC's decisions to the player.

Never manufacture consent, reinterpret temporary cooperation as an ongoing alliance, or adopt an NPC merely because they accompany the party for a scene or objective. If permanence is ambiguous, ask a brief in-world clarification before changing files.

## Prepare the party member

Read `party.md`, `data/status.json`, `data/party-state.json`, `homebrew.md`, the NPC's complete canonical record, and relevant relationship files. Search for an existing active or retired party record before creating anything. Adoption always requires explicit player consent, including readoption of a previously retired member.

### Restore a retired member

When `party/retired/<Name>/` exists and the redirect identifies the character as `Retired`, undo retirement rather than creating a new character:

1. Move the archived directory back to `party/<Name>/`.
2. Reconcile the current NPC source of truth into the restored party files, preserving all intervening behavior, personality, knowledge, relationships, inside jokes, euphemisms, equipment changes, and history.
3. Invoke `party-member-create` in Adoption context to reconcile permanent mechanics at exactly the current party level and resolve every missing or newly required choice.
4. Replace the retired redirect with the active party hub and convert the NPC page to the compact active-party index described below.
5. Initialize transient state from the character's established current condition; readoption grants no automatic recovery.

Never restore a character whose redirect says `Dead`. A return from permanent death must first be established and reconciled as a distinct story event; do not treat it as ordinary adoption.

When no retired record exists, invoke `party-member-create` in Adoption context with the NPC's complete established canon and current condition. It must first ask whether the player wants Guided creation or a Generated draft, resolve the complete build, obtain approval, and return a passing staged character. Never silently translate an NPC stat block into player-character mechanics.

## Validate and commit

1. Require `party-member-create` to return an explicitly approved staged record with a passing `party-member-validate` result.
2. Require exactly one `**Party Association:**` line in the staged `Personality.md`. Summarize the NPC's authentically agreed ongoing alliance in one sentence. Do not append disclaimers about unestablished travel, adventuring, or scene participation; track their current scope elsewhere only when it is relevant and established.
3. Derive transient mechanics from the NPC's established current condition. Do not grant healing, recovery, spell slots, Hit Dice, or resources merely because the NPC joins.
4. Stage an exact new-character entry for `data/party-state.json` and validate it through `party-state-update`.
5. Add the member to `party.md`, commit the staged hub and directory, and apply the party-state transaction as one adoption boundary.
6. Migrate the original NPC page into a compact index that identifies the character as an active party member and links to `../party/<Name>.md`. Preserve all migrated canon in the party files; never maintain competing current-state copies.
7. Repair relevant links and record the adoption in the current Daily. Invoke `milestone-record` only when the relationship transformation meets its normal campaign-defining threshold.

After committing, verify that the member appears exactly once in `party.md`, has exactly one active party directory and hub, remains absent from `party/retired/`, has a valid party-state entry, matches the party level, passes `party-member-validate`, and is reachable from the NPC index without broken links.

Continue the scene in second person. Do not display a file summary, character ledger, or validation report unless the player asks.
