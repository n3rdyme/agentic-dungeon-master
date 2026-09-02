---
name: party-member-create
description: Build, validate, and add a complete party character using the campaign's character-creation rules. Use from campaign-start for the initial player character, from party-member-adopt for an established or retired NPC, or on explicit player request to create a new party member directly; offer guided choices or a generated draft for approval and never add a member without player consent.
---

# Create Party Member

Build one character at a time outside unresolved combat. Treat character construction and membership as a transaction: stage the complete character, obtain approval, validate it, then commit it. Never silently fill consequential choices or write a partial character into the active party.

## Establish the creation context

Accept one of three contexts:

- **Initial character:** `campaign-start` supplies the player name, level 1, strict 2024 Player's Handbook baseline, and new-campaign scaffold.
- **Adoption:** `party-member-adopt` supplies the established NPC canon, membership consent, current party level, and current condition. Preserve that canon as constraints and return control to adoption for its NPC transition.
- **Direct creation:** require explicit player authorization to create and add a new character at the current party level. Build narrative identity as well as mechanics; no prior NPC meeting is required.

Reject duplicate active names and resolve aliases before building. For a retired member, restore through `party-member-adopt`; do not create a duplicate. Never use this skill to restore a dead member.

In story mode announce `[party-member-create building <Name>]`. During campaign setup or explicit OOC administration, do not emit a gameplay announcement.

## Choose interaction depth

Ask before making build choices:

1. **Guided creation** — resolve each meaningful choice with the player.
2. **Generated draft** — generate a competent, concept-appropriate complete build, show the important choices and derived combat profile, and wait for approval or requested changes.

Treat an explicit request to move quickly, guess, or choose for the player as Generated draft. Even then, never commit before approval. In Guided creation, ask focused questions progressively rather than presenting one long form.

## Resolve the build

Read `homebrew.md`, `data/status.json`, the `party-member-update` templates, and the complete established character record when one exists.

Use the campaign's established rules baseline. For a new campaign, use strict 2024 Player's Handbook rules. State that baseline before choices begin and ask whether the player wants an exception or additional source. Treat every nonbaseline mechanic as homebrew until the player explicitly approves it and its exact rule is recorded in `homebrew.md`.

Resolve every applicable choice through the target level, including:

- name, identity, concept, alignment, appearance, personality, history, and
  relationships;

- class, subclass when available, species and species choices;
- background, its ability adjustments, Origin feat, proficiencies, tools, and languages;
- ability scores and every later ability-score or feat decision;
- class features, fighting style, Expertise, weapon masteries, invocations, or equivalent selections;
- armor, primary melee and ranged options, other carried equipment, and any granted currency;
- cantrips, learned spells, prepared spells, and every other spell choice.

For every context, write exactly one `**Party Association:**` line in `Personality.md`. Use one sentence describing the character's established ongoing association with the party. For Adoption, derive it from the NPC's authentically agreed alliance. The line records association only. Do not infer broader commitments from membership, but do not add disclaimers that turn an unestablished commitment into a permanent limitation. Record established broad commitments or genuinely unresolved current scope in the appropriate narrative owner, and allow later choices to replace that current state.

For ability scores, present several complete, useful standard-array assignments suited to the character's class, role, equipment, and concept. Show resulting scores and modifiers, explain the important tradeoffs briefly, and let the player choose in Guided mode. Do not scatter high scores across irrelevant abilities or waste background adjustments. In Generated mode, optimize a coherent assignment and expose it for approval.

For equipment, compare plausible effective packages. Never choose a weapon solely from aesthetic stereotypes; calculate its attack modifier, damage, mastery interaction, armor compatibility, range coverage, and relationship to the build. Surface materially weaker choices and offer alternatives while respecting an established character concept.

Set level-1 HP to the maximum class Hit Die plus Constitution modifier. For higher-level direct creation, apply the campaign's approved advancement rules and resolve every level choice. Match `data/status.json` Level exactly.

## Stage, approve, and validate

Stage the hub and applicable canonical files owned by `party-member-update`: `Bio.md`, `Appearance.md`, `Personality.md`, `Knowledge.md`, `Stats.md`, `Equipment.md`, and `Custom Spells.md` only for applicable homebrew spells. Keep all currency in `data/status.json` and unused shared property in `data/inventory.json`.

For Initial and Direct creation, add currency actually granted by the approved starting package to party-wide status when the character is committed. For Adoption, preserve established possessions and do not grant a second starting package or create new currency merely because NPC mechanics are being rebuilt.

Before committing, show a concise approval summary containing the rules baseline, level, species, class and subclass, background and feat, full ability scores, HP, AC, primary attacks, major features, spell selections, and equipment. Wait for explicit approval. Apply revisions to the staged build only.

Invoke `party-member-update` in staged mode, then invoke `party-member-validate` with the staged path and target level. Remediate every error with the player and rerun validation until it passes. Require explicit acceptance of any remaining warnings.

## Commit membership

For Initial or Direct creation, commit the approved files, add the hub exactly once to `party.md`, and initialize the exact `data/party-state.json` entry through `party-state-update`. Initial characters begin fully recovered. For a directly created member, ask whether their entrance establishes a different current condition; otherwise initialize them fully recovered.

For Direct creation, create a compact `npcs/<Name>.md` active-party index linking to `../party/<Name>.md`. For Initial creation, leave the new campaign's NPC directory empty. For Adoption, let `party-member-adopt` commit the staged record, state, restored archive, and NPC conversion as one adoption boundary.

Verify exact party-level equality, one active hub and directory, one roster entry, one valid transient-state entry, valid links, and a passing character audit. Record direct creation in the current Daily; use a Milestone only when it meets the normal threshold. Persist silently and continue in second person.
