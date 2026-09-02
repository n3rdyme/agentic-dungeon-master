# Character audit checklist

Apply every section relevant to the character's current level and build.

## Files and authority

- Require the character hub plus `Bio.md`, `Appearance.md`, `Personality.md`,
  `Stats.md`, and `Equipment.md`; `Custom Spells.md` is optional and permitted
  only for homebrew spells.

- Require Stats and Personality to match the exact `party-member-update`
  templates: titles, fields, required sections, heading levels, and section
  order. Reject missing, duplicate, unexpected, misleveled, or out-of-order
  sections. Validate optional Custom Spells with its template.

- Require exactly one nonempty, single-line `**Party Association:**` field in
  Personality. Verify that it records an established ongoing alliance without
  inferring unestablished broader commitments or turning their absence into a
  permanent limitation or scene-by-scene confirmation rule. Accept established
  broad commitments as current state elsewhere in the character record.

- Verify hub links resolve and character identity is consistent across files.
- Treat `data/status.json` as authority for party level, XP, XP threshold, and
  currency. A canonical character's level must exactly match the party level;
  homebrew cannot waive this invariant. In the explicit staged level-up mode,
  the noncanonical candidate must instead exactly match the supplied target
  level.

- Require all gold, silver, and copper to appear only in `data/status.json`.
- Treat `data/inventory.json` as shared party property, including loot a
  character merely picks up, pockets, packs, or transports. Treat
  `Equipment.md` as property explicitly assigned for that character's ongoing
  personal use or ready combat access. An item must not simultaneously exist there and in character
  equipment unless quantities clearly represent separate physical items.

- Require an exact character key in `data/party-state.json`. Verify transient
  values do not exceed maxima in `Stats.md`, no maxima or recovery rules are
  duplicated there, and every expendable class resource or spell-slot category
  is represented.

## Origin and identity

- Verify species is a 2024 PHB option or approved homebrew.
- Verify every species choice, trait, size choice, speed, creature type, and
  limited-use resource is recorded correctly.

- Verify background, its permitted ability increases, Origin feat, two skill
  proficiencies, tool proficiency, and selected equipment option.

- Verify Common plus two chosen standard languages, along with any additional
  languages granted by a feature.

- Verify age, appearance, personality, and biography do not contradict species
  rules or one another. Allow narrative details to remain explicitly
  unestablished; they are not mechanical errors.

- Require Alignment immediately after Origin in `Stats.md`. For a legacy
  character that predates the field, remediation defaults it to `Neutral`
  unless established canon supplies another value.

- Verify any custom background, species, language, or altered origin package is
  approved and fully defined in `homebrew.md`.

## Ability scores

- Identify and verify the generation method. For standard array, require one
  use each of 15, 14, 13, 12, 10, and 8 before permitted increases.

- Reconstruct every background, feat, species, level, magic-item, and homebrew
  adjustment. Check caps and ensure no increase is counted twice.

- Recalculate every ability modifier.
- If base scores or increase provenance are missing, flag derived values as not
  fully auditable even when totals appear plausible.

## Class and level

- Verify class and subclass are 2024 PHB options or approved homebrew.
- Verify subclass appears at the class's correct level and not earlier.
- Verify Hit Die, primary ability, armor training, weapon proficiencies, saving
  throws, skill choices, tool choices, and starting equipment.

- Enumerate every class and subclass feature earned through the current level.
  Verify required choices, uses, die sizes, save DCs, recovery rules, and scaling.

- Flag omitted features, premature features, obsolete 2014 versions, incorrect
  scaling, and extra benefits without an approved source.

- For multiclass characters, verify prerequisites, gained proficiencies,
  feature progression, spell-slot progression, and total character level.

## Feats

- Verify every feat's category, source, prerequisites, repeatability, choices,
  ability increases, and benefits.

- Require the background's specified Origin feat.
- Check additional feats only when granted by species, class, level, or approved
  homebrew. In particular, verify a Human's additional Origin feat and a
  Fighter's level-1 Fighting Style feat independently.

- Flag a feat recorded twice or applied to calculations more than once unless
  its rules explicitly permit repetition.

## Hit points and defenses

- At level 1, require maximum class Hit Die plus Constitution modifier and all
  applicable level-1 features; never accept a rolled class Hit Die.

- Above level 1, verify the recorded advancement method when available and
  recalculate Constitution and per-level feature effects. If individual rolls
  are not recorded, validate deterministic portions and flag the rolled portion
  as unverifiable rather than guessing.

- Recalculate Armor Class for each claimed loadout from worn armor, shield,
  Dexterity limits, class/species features, magic items, and approved homebrew.

- Verify speed, initiative, Passive Perception, saving throws, resistances,
  immunities, senses, and defensive reactions.

## Skills and proficiencies

- Recalculate proficiency bonus from total level.
- Trace every skill proficiency and Expertise-like benefit to exactly one legal
  source and verify all skill modifiers.

- Detect duplicate proficiency selections that should have been replaced or
  reselected under the applicable rule.

- Verify tool, armor, weapon, and saving-throw proficiencies.

## Equipment and attacks

- Require items explicitly assigned for a character's ongoing personal use,
  wearing, wielding, preparation, attunement, or ready combat access in
  `Equipment.md`; require all other party property in `data/inventory.json`.
  Do not treat a named physical carrier as personal assignment.

- For a newly created level-1 character, require PHB starting equipment or a
  documented legal alternative. For an established character, allow equipment
  to have changed through play. Put all currency in `data/status.json`, never
  `Equipment.md`.

- Recalculate every attack bonus, damage expression, range, weapon property,
  and Weapon Mastery from the actual equipment and features. Require carried
  ammunition quantities only in Equipment.md; Stats.md may identify the
  ammunition property but must not duplicate arrow, bolt, shell, cartridge, or
  other ammunition counts.

- Verify armor and shield requirements, hands used, ammunition, focuses,
  components, attunement, carrying constraints, and incompatible loadouts.

- Cross-check unique magical equipment against its `items/<Item>.md`
  definition and ensure its effects are applied exactly once in `Stats.md`.

## Spellcasting

- Verify the spellcasting ability, spell save DC, spell attack modifier,
  cantrip count, spell-slot table, prepared or known spell capacity, and ritual
  behavior.

- Verify every selected spell is legal for the character's class, subclass,
  feat, species, level, and approved sources.

- Require one list item per populated spell level in every Stats spell list and
  require `+` before every concentration spell. Flag a missing marker or a
  marker on a spell that does not require concentration.

- Require every available learned, known, or prepared selection to be filled.
  Separate always-prepared spells from selections that count against capacity.

- Reject empty `Always Prepared` and `Custom Spells` fields; omit those fields
  entirely when they have no entries.

- Verify spellbook contents, pact choices, invocations, prepared lists, and
  replacement choices when relevant.

- Verify material-component and spellcasting-focus requirements against
  `Equipment.md`.

- Flag too many selections, too few selections, wrong spell levels, duplicate
  grants, and spells inherited from obsolete rules.

## Homebrew compliance

- Compare every non-PHB mechanic to `homebrew.md` by exact behavior, not merely
  by matching name.

- Require each approved exception or addition to define its baseline rule,
  replacement or addition, scope, and mechanical consequences clearly enough
  to audit.

- Flag undocumented differences as unapproved homebrew.
- Flag character mechanics that exceed, contradict, or omit restrictions from
  their approved homebrew entry.

- Report contradictions between multiple homebrew entries rather than choosing
  one silently.

## Cross-file consistency

- Verify names, class, species, background, level, origin, location, equipment,
  and current status agree wherever repeated.

- Verify `Stats.md` reflects every mechanically relevant equipped item and no
  item absent from `Equipment.md`.

- Verify links touched by the character files resolve.
- Treat stale narrative history as history, but flag current-state claims that
  conflict with authoritative live data.
