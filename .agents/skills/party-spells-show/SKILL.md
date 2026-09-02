---
name: party-spells-show
description: Display a compact read-only spell report for one named active party member or every active party caster, including spell attack, save DC, cantrips, current spell slots, prepared or known spells, concentration markers, and brief mechanical summaries. Use in both Story and Combat roles for `/spells`, `/spells NAME`, "spells," "show spells," a named character's spells, or requests to inspect available party magic; never mutate campaign or combat state.
---

# Show Party Spells

Read `party.md`, the requested active member's `Stats.md`, applicable `Custom Spells.md` and linked spell definitions, and `data/party-state.json`. Read `../../references/party-state.md` for state ownership. Resolve names and aliases without reading retired members. If no member is named, show every active character with prepared, known, innate, or otherwise available spells in `party.md` order. Omit noncasters.

Use `Stats.md` for spellcasting sources, attack bonuses, save DCs, spell lists, and slot maxima. Use transient state for remaining slots. Include class, subclass, species, feat, item, and other always-available spells without duplicating the same spell. Preserve the character's established rules basis and homebrew definitions. Do not invent an unavailable spell or silently repair a conflict.

In Combat role, use current in-memory slot and spell-resource values for every change since the latest checkpoint. Fall back to `combat.md` for the latest completed checkpoint and canonical party state only for unchanged opening values. Never write a checkpoint or mutate any state to answer the request.

## Format

Return the entire response as one fenced `markdown` code block with no text before or after it. Format each caster as:

```markdown
# <Name> Spells
Spell Attack: <signed bonus> / DC <save DC>
Cantrips: <comma-separated list>

## 1st Level: <remaining>/<maximum>
- <Spell Name>: <brief one-line mechanical summary>
```

If distinct spellcasting sources have different attacks or DCs, show one clearly labeled Spell Attack line per source. Omit Spell Attack when none of the character's spells use attacks or saving throws. Omit Cantrips when none are available.

List spell levels in ascending order. Use current and maximum slots from the active state, even when the current value is zero. Include every currently prepared, known, always-prepared, innate, or otherwise available leveled spell under its spell level. Do not repeat a spell because multiple sources grant it.

Prefix every spell requiring Concentration with `+`, including a Concentration cantrip in the CSV list and the spell name in a bullet:

```markdown
Cantrips: Guidance, +Resistance
- +Invisibility: Become invisible until attacking, casting a spell, or losing Concentration.
```

Write each description as one brief mechanical sentence. Prioritize action type when unusual, range or area, attack or save, damage or primary effect, and important duration or termination. Do not add flavor, tactical advice, full rules text, source citations, spell components, or upcasting text unless needed to distinguish the spell. For a custom spell, summarize only its canonical definition; report an absent definition rather than inventing one.

Do not emit a skill-use announcement. If the requested member has no spells, return `# <Name> Spells` followed immediately by `No spells available.` inside the same code block.
