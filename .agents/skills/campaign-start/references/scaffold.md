# New campaign scaffold

## Initial structure

Create only this structure. Empty content directories contain `.gitkeep` so the scaffold survives version control.

```text
campaigns/<Player>/
|-- campaign-info.md
|-- homebrew.md
|-- resume.md
|-- data/
|   |-- status.json
|   |-- inventory.json
|   `-- party-state.json
|-- party.md
|-- party/
|   |-- <Player>.md
|   |-- <Player>/
|   |   |-- Bio.md
|   |   |-- Appearance.md
|   |   |-- Personality.md
|   |   |-- Stats.md
|   |   |-- Equipment.md
|   |   `-- Custom Spells.md (optional; homebrew only)
|   `-- retired/.gitkeep
|-- npcs/.gitkeep
|-- factions/.gitkeep
|-- items/.gitkeep
|-- world.md
|-- world/<Starting Location>.md
|-- quests/
|   |-- active/.gitkeep
|   `-- resolved/.gitkeep
|-- log/
|   |-- Daily/1000 - <Starting Location>.md
|   |-- Events/.gitkeep
|   |-- Combat/.gitkeep
|   `-- Milestones/.gitkeep
```

Do not create empty `npcs.md`, `factions.md`, or `log.md` parent pages. Create navigation pages later only when they contain useful links or overview prose.

## Initial live data

Write `data/inventory.json` as an empty JSON array.

Read `../../../references/party-state.md` and initialize `data/party-state.json` for the completed level-1 character. Set current HP to the validated Hit Point Maximum, temporary HP to zero, every Hit Die, spell slot, and limited resource remaining to its level-1 maximum, death saves to zero, conditions and effects to empty arrays, exhaustion to zero, and concentration to null. Omit inapplicable slot levels and resources.

Write `data/status.json` with this shape:

```json
{
  "Player": "<Player>",
  "Day": 1000,
  "day_of_week": "Sunday",
  "Level": 1,
  "Xp": 0,
  "XpLevelUp": 300,
  "Gold": 0,
  "Silver": 0,
  "Copper": 0,
  "Location": "<Starting Location>",
  "debts": []
}
```

Keep XP, level, and all currency party-wide in `data/status.json`. Resolve the character's PHB starting equipment before completion: put worn, wielded, carried, prepared, or personally used equipment in the character's `Equipment.md`, and add all granted starting currency to `status.json`. Never record currency in `Equipment.md`.

Write `debts: []` for every new campaign. The field remains optional when reading older campaigns and a missing field is equivalent to an empty array.

Set `day_of_week` to `Sunday` for every new campaign.

Create an empty `data/businesses/` directory. Businesses are added only through `business-create`; do not seed an example business.

Do not grant shared inventory, magic items, companions, quests, known NPCs, or factions during initialization. `data/inventory.json` remains empty because it holds party property no character actively uses or carries.

## Build the level-1 character

Invoke `party-member-create` in Initial character context. It owns the guided or generated build, rules baseline, every required choice, approval checkpoint, strict templates, and validation. Do not implement a second character builder inside this scaffold.

Initialize `homebrew.md` with a heading and a statement that no exceptions or additions are approved until the player approves one. Record any exception approved through `party-member-create` with its baseline rule, exact replacement or addition, scope, and mechanical consequences. Cosmetic changes without mechanical effect are not homebrew.

## Generate the world and starting location

Use the player's world description as the primary setting constraint. If the player asks to be surprised, invent a compact premise with a distinct tone, geography, and central tension. Avoid names already used as top-level locations in other campaigns, but do not read their canon.

Generate one original starting location directly from the player's world description and the completed character's class, origin, background, abilities, and established biography. Treat those inputs as creative direction, not as a small lookup table or fixed candidate count. Make the location plausible for that specific character without predetermining the character's actions.

Persist the generated location as canon:

- `world.md`: the short world premise plus a link to the starting location.
- `world/<Starting Location>.md`: region, settlement or site type, atmosphere, why the character is plausibly there, and two or three immediate tensions or opportunities. Do not predetermine the character's choices.

- `party.md`: a link to the player character.
- `party/<Player>.md`: navigation hub linking all five character detail files.
- `party/<Player>/Bio.md`: approved identity, origin, background, and history; mark unspecified narrative details as unestablished.

- `party/<Player>/Appearance.md`: approved description or explicitly unestablished details.

- `party/<Player>/Personality.md`: use the exact `party-member-update` personality template; never predetermine the player's choices.

- `party/<Player>/Stats.md`: use the exact `party-member-update` Stats template with every required and applicable conditional section.

- `party/<Player>/Equipment.md`: all starting equipment assigned to the character for personal use or ready access, with no currency. In later play, merely carrying or transporting newly acquired party loot does not move it out of shared inventory.

- `log/Daily/1000 - <Starting Location>.md`: a concise historical summary that the campaign and character were initialized on Day 1000 at this location. Do not store the live situation or pending decisions in the Daily record.

- `resume.md`: the mutable operational checkpoint created by `session-end`, containing the immediate opening situation, pending player decision, present character, relevant state, and links to the Day 1000 Daily, location, character, status, inventory, and other active canon.

- `campaign-info.md`: use `../../../references/campaign-info.md`; establish only the immutable world-building permissions and prohibitions from the player's description, plus the optional player name. Never store party composition, relationships, current state, plot direction, or inferred preferences there. Never change it later without an explicit OOC request.

- `items/.gitkeep`: retain the empty directory until a unique item is established; thereafter store one item per `items/<Item>.md` file.

## Transaction and verification

Validate the target name and all generated filenames before writing. Create no files outside the new campaign directory. If creation fails, report exactly what exists and do not pretend initialization completed.

Before presenting the role menu, verify:

1. All three JSON files parse.

2. Day is exactly 1000 and `day_of_week` is `Sunday`; level is 1; XP is zero; currency equals the total granted by the approved starting packages.

3. Shared inventory is empty.

4. Party state contains exactly the active character, stays within validated maxima in `Stats.md`, and starts fully recovered with no conditions, effects, concentration, temporary HP, or death-save marks.

5. All required directories and files exist; `Stats.md`, `Personality.md`, and the world-building-only `campaign-info.md` pass their strict template checks.

6. The status location, world filename, world index link, party file, and Daily record agree exactly.

7. `party-member-validate` returns **PASS**, or the player explicitly accepts every warning in **PASS WITH WARNINGS**.

8. All non-PHB mechanics are explicitly approved and defined in `homebrew.md`.

9. `session-end` creates a complete, internally consistent `resume.md` and does not advance Day 1000.

10. A dry read using the `session-resume` inputs can determine the day, location, present character, immediate situation, open decisions, active work, and relevant recent chronology without reading unrelated canon.

11. No existing campaign file changed.
