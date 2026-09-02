---
name: campaign-start
description: Create and initialize a resumable filesystem-backed tabletop campaign with a complete strict-2024-PHB level-1 player character, approved homebrew ledger, and contextually generated starting world. Use when the user says Start Campaign, Start a New Campaign, Create Campaign, or explicitly invokes `$campaign-start`; scaffold the campaign, remediate `party-member-validate` findings, then create an `session-end` checkpoint before play.
---

# Start Campaign

Operate at the repository root and remain campaign-agnostic. Never copy an existing campaign or infer defaults from one.

## Collect campaign inputs

Ask for any missing inputs before creating files:

1. The player character's name. This names both the character and the `campaigns/<Player>` directory.
2. The character's class or broad archetype. Resolve a plain-language concept to rules options through `party-member-create`.
3. A short description of the desired world. Explain that this is optional but helps make the setting distinct; accept an explicit request to surprise the player.

Trim surrounding whitespace from the character name but do not otherwise rewrite it without permission.

1. Reject empty names, names beginning with `.`, `.` or `..`, path separators, Windows-invalid filename characters, trailing periods or spaces, and reserved device names.
2. Use the exact path `campaigns/<Player>` without adding a suffix.
3. Search direct child directories of `campaigns/` case-insensitively. If the name already exists, stop and offer `campaign-open`; never overwrite it.

## Build the campaign

Read `references/scaffold.md` and `../../references/campaign-info.md` completely. The scaffold delegates character-file creation to `party-member-update` templates and world-building contract creation to the shared campaign-information template. Follow its exact directory, initial state, world-generation, randomness, and verification rules.

Keep generation campaign-agnostic. Never copy or reuse an existing campaign's setting or treat any existing campaign as a template. Existing campaign names and top-level location filenames may be checked only to avoid accidentally reusing names.

After creating the empty scaffold, invoke `party-member-create` in Initial character context. Use Guided creation unless the player explicitly asks for a generated draft. Do not independently choose or write character mechanics; `party-member-create` owns the complete character conversation, staged build, approval, and validation.

## Validate and remediate

After `party-member-create` drafts the level-1 character, require its `party-member-validate` result for the new player character.

- For a missing player choice, explain what is required, offer concise legal options or recommendations, wait for the player's selection, and update the draft.
- For a calculation, transcription, link, or cross-file error that follows unambiguously from approved choices, explain the correction and apply it.
- For a requested non-PHB rule, explain the strict 2024 PHB conflict and ask the player to either choose a legal alternative or explicitly approve it as homebrew. Record approved mechanics completely in `homebrew.md` before using them.
- For an unverified rule, obtain authoritative support or ask the player; never silently guess.

Rerun `party-member-validate` after every remediation pass. Do not declare initialization complete or present the role menu while the verdict is **FAIL**. A **PASS WITH WARNINGS** verdict requires the user to accept any unresolved warnings. A **PASS** may proceed immediately.

## Create the resume checkpoint

After successful initialization and validation, make the new campaign active only in this chat and invoke `session-end` as the final filesystem operation. This is an initialization checkpoint, not an elapsed play session: do not advance Day 1000 from Sunday or invent events.

Require the end-session reconciliation to leave the current Daily record with only the historical initialization summary. Require it to create `resume.md` with the starting location, player character present, immediate opening situation, open or pending decisions, relevant quests and canon links, recent chronology, shared inventory, currency, XP, and all other state needed by `session-resume`.

Do not complete initialization unless `resume.md` and all linked canonical state pass the end-session verification. Remediate any checkpoint problem and rerun `session-end` until it is ready.

After the checkpoint succeeds, present the standard role menu:

1. Continue the Story
2. Let's Do Battle!
3. Campaign Information

Wait for the user's role selection. Never write a repository-wide current-campaign marker.
