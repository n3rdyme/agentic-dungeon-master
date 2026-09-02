---
name: party-member-update
description: Persist established changes to a party member's biography, personality, relationships, knowledge, permanent mechanics, equipment, or optional homebrew spells while preserving strict character-file templates. Use during play, import reconciliation, adoption staging, advancement, or explicit OOC correction; not for transient party-state values.
---

# Update Party Member

Resolve the member from party.md. When explicitly invoked by `party-member-create`, `party-member-adopt`, or `party-level-up` with a noncanonical staged path, use that staged member directory while reading shared context from the canonical campaign. Otherwise read their hub, all files in party/<Name>/, status, party state, and only relevant evidence. Search aliases. Use established fiction or explicit OOC statements; preserve unresolved conflicts.

## Canonical owners

- Bio.md: identity, origin, background, history.
- Appearance.md: durable physical appearance.
- Personality.md: one-line party association, roleplay identity, behavior, speech, ideals, relationships, blind spots, and defining moments. Party association records the agreed ongoing alliance without permanent disclaimers about unestablished commitments. Record broader commitments as current state: do not infer them from membership, require repetitive confirmation after a broad commitment is established, or prevent later development.
- Knowledge.md: applicable learned lore.
- Stats.md: permanent mechanics, maxima, features, spells, attacks, languages. In the required ability table, preserve inherent values in Base Score; show replacement values and their origin in Effective Score, and calculate Effective Modifier from the currently effective score. Require Alignment immediately after Origin. When migrating a Stats.md that predates Alignment, set it to `Neutral` unless established canon supplies another value.
- Equipment.md: items explicitly assigned for this character's ongoing personal use, wearing, wielding, preparation, attunement, or ready combat access. Merely picking up, pocketing, packing, or physically transporting party loot does not assign it; keep such property in `data/inventory.json`. Equipment.md is the sole owner of carried ammunition quantities; Stats.md records weapon ammunition properties but never duplicates arrow, bolt, shell, cartridge, or other ammunition counts.
- Custom Spells.md: optional definitions of this character's homebrew spells.
- `party-state-update`: transient mechanics in `data/party-state.json`.

Do not duplicate facts across owners. Full chronology remains in logs.

## Strict templates

Read references/stats-template.md and references/personality-template.md; read references/custom-spells-template.md when homebrew spells apply. Preserve every required heading, level, spelling, and order. Include conditional sections only when applicable and in their specified position. When updating a legacy file, migrate all established facts into the template.

Approve non-PHB mechanics in homebrew.md first. Define each custom spell in Custom Spells.md and link it from the applicable Stats.md spell source.

Run:

    node .agents/skills/party-member-update/scripts/validatePartyMember.mjs "campaigns/<Player>" "<Name>"

In staged mode, pass the staged member root to the validator and require the explicit target level. Any missing, duplicate, misleveled, or out-of-order required section fails. Also invoke party-member-validate after mechanical, equipment, or spell changes. Record durable narrative change in the current Daily; use Events or Milestones only at their normal thresholds. Persist silently during player-facing play.
